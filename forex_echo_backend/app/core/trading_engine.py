import threading
import time
from typing import Dict, List, Optional, Callable
from app.models.trading_models import TradingTask as TradingTaskModel, MarketData
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from app.utilities.forex_logger import forex_logger
from app.core.session_manager import SessionManager
from app.utilities.connection_decorator import require_mt5_connection, handle_mt5_errors
import MetaTrader5 as mt5

logger = forex_logger.get_logger(__name__)

# Import persistence service (lazy import to avoid circular dependency)
def get_persistence_service():
    from app.services.session_persistence_service import session_persistence
    return session_persistence

# Use business model
TradingTask = TradingTaskModel

class TradingEngine:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.session_manager = SessionManager()
            self.active_tasks: Dict[str, TradingTask] = {}
            self.thread_pool = ThreadPoolExecutor(max_workers=50)
            self.task_futures: Dict[str, object] = {}
            self.task_lock = threading.RLock()
            self.strategies_registry = {}
            self.initialized = True
            logger.info("TradingEngine initialized")
    
    def register_strategy(self, name: str, strategy_class):
        """Register strategy class"""
        self.strategies_registry[name] = strategy_class
        logger.info(f"Registered strategy: {name}")
    
    def create_task_id(self, session_id: str, pair: str, timeframe: str, strategy: str) -> str:
        """Generate unique task ID"""
        return f"{session_id}_{pair}_{timeframe}_{strategy}"
    
    def start_trading_task(self, session_id: str, pair: str, timeframe: str, 
                          strategy_name: str, config: dict) -> bool:
        """Start new trading task"""
        task_id = self.create_task_id(session_id, pair, timeframe, strategy_name)
        
        with self.task_lock:
            if task_id in self.active_tasks:
                logger.warning(f"Task {task_id} already exists - stopping existing task")
                # Stop existing task first
                existing_task = self.active_tasks[task_id]
                updated_task = existing_task.model_copy(update={'is_active': False})
                self.active_tasks[task_id] = updated_task
                # Remove from futures
                if task_id in self.task_futures:
                    del self.task_futures[task_id]
            
            task = TradingTask(
                task_id=task_id,
                session_id=session_id,
                pair=pair,
                timeframe=timeframe,
                strategy_name=strategy_name,
                config=config,
                is_active=True
            )
            
            self.active_tasks[task_id] = task
            future = self.thread_pool.submit(self._run_trading_task, task_id)
            self.task_futures[task_id] = future
            
            # Save to database
            try:
                persistence = get_persistence_service()
                persistence.save_trading_task(task_id, session_id, pair, timeframe, strategy_name, config)
            except Exception as e:
                logger.error(f"Error saving trading task to database: {e}")
            
            logger.info(f"Started trading task: {task_id}")
            return True
    
    def stop_trading_task(self, session_id: str, pair: str, timeframe: str, strategy_name: str) -> bool:
        """Stop trading task"""
        task_id = self.create_task_id(session_id, pair, timeframe, strategy_name)
        
        with self.task_lock:
            task = self.active_tasks.get(task_id)
            if not task:
                return False
            
            # Update task to inactive (Pydantic models are immutable)
            updated_task = task.model_copy(update={'is_active': False})
            self.active_tasks[task_id] = updated_task
            
            # Deactivate in database
            try:
                persistence = get_persistence_service()
                persistence.deactivate_trading_task(task_id)
            except Exception as e:
                logger.error(f"Error deactivating task in database: {e}")
            
            logger.info(f"Stopped trading task: {task_id}")
            return True
    
    def get_active_tasks_for_session(self, session_id: str) -> List[TradingTask]:
        """Get all active tasks for session"""
        with self.task_lock:
            return [task for task in self.active_tasks.values() 
                   if task.session_id == session_id and task.is_active]
    
    def _run_trading_task(self, task_id: str):
        """Main trading task loop"""
        try:
            task = self.active_tasks.get(task_id)
            if not task:
                return
            
            logger.info(f"Running trading task: {task_id}")
            
            # Initialize strategy with database session
            strategy_class = self.strategies_registry.get(task.strategy_name)
            if not strategy_class:
                logger.error(f"Strategy {task.strategy_name} not found")
                return
            
            # Initialize strategy with proper error handling
            try:
                # Initialize strategy (most strategies only need config and timeframe)
                strategy = strategy_class(task.config, task.pair, task.timeframe)
                logger.info(f"Strategy {task.strategy_name} initialized successfully")
            except Exception as e:
                logger.error(f"Strategy initialization failed: {e}")
                return
            
            while task.is_active:
                try:
                    # Check if task is still active (refresh from active_tasks)
                    current_task = self.active_tasks.get(task_id)
                    if not current_task or not current_task.is_active:
                        break
                    
                    # Get market data - skip if MT5 not connected
                    if not mt5.terminal_info():
                        time.sleep(10)
                        continue
                    
                    # Get latest candle
                    rates = mt5.copy_rates_from_pos(task.pair, self._get_mt5_timeframe(task.timeframe), 0, 1)
                    if rates is None or len(rates) == 0:
                        time.sleep(1)
                        continue
                    
                    # Process with strategy
                    candle = MarketData(
                        timestamp=rates[0]['time'],
                        open=rates[0]['open'],
                        high=rates[0]['high'],
                        low=rates[0]['low'],
                        close=rates[0]['close'],
                        volume=rates[0]['tick_volume']
                    )
                    
                    # Get current account equity for drawdown calculation
                    account_info = mt5.account_info()
                    current_equity = account_info.equity if account_info else 100000  # Default fallback
                    
                    signal = strategy.process_tick(candle, current_equity)
                    
                    # Console logging for candles and signals
                    print(f"[{task.pair} {task.timeframe}] Price: {candle.close:.2f} | Time: {candle.timestamp}")
                    
                    if signal:
                        print(f"🚨 SIGNAL: {task.pair} {task.timeframe} - {signal.action} {signal.lot_size} lots")
                        print(f"   Reason: {signal.reason}")
                        print(f"   Price: {candle.close:.2f}")
                        logger.info(f"Signal generated for {task_id}: {signal.action}")
                        
                        # Execute trade via MT5
                        result = self._execute_signal(task.pair, signal, task_id)
                        
                        # Log trade execution
                        candle_dict = {
                            'open': candle.open,
                            'high': candle.high, 
                            'low': candle.low,
                            'close': candle.close,
                            'timestamp': candle.timestamp
                        }
                        signal_dict = {
                            'action': signal.action,
                            'lot_size': signal.lot_size,
                            'reason': signal.reason,
                            'take_profit': signal.take_profit
                        }
                        forex_logger.log_trade(task.pair, task.timeframe, signal_dict, candle_dict, result)
                    
                    time.sleep(10)  # 10 second interval when MT5 connected
                    
                except Exception as e:
                    logger.error(f"Error in trading task {task_id}: {e}")
                    time.sleep(30)
            
        except Exception as e:
            logger.error(f"Fatal error in trading task {task_id}: {e}")
        finally:
            # Cleanup task resources
            pass
            
            with self.task_lock:
                if task_id in self.active_tasks:
                    del self.active_tasks[task_id]
                if task_id in self.task_futures:
                    del self.task_futures[task_id]
            logger.info(f"Trading task {task_id} completed")
    
    def _get_mt5_timeframe(self, timeframe: str):
        """Convert timeframe string to MT5 constant"""
        timeframe_map = {
            "1M": mt5.TIMEFRAME_M1,
            "5M": mt5.TIMEFRAME_M5,
            "15M": mt5.TIMEFRAME_M15,
            "1H": mt5.TIMEFRAME_H1,
            "4H": mt5.TIMEFRAME_H4,
            "1D": mt5.TIMEFRAME_D1
        }
        return timeframe_map.get(timeframe, mt5.TIMEFRAME_M15)
    
    @require_mt5_connection
    @handle_mt5_errors
    def _execute_signal(self, pair: str, signal, task_id: str = None) -> Optional[dict]:
        """Execute trading signal"""
        # Connection decorator will block execution if MT5 is not connected
        # This code will not run when MT5 is disabled
        try:
            from app.services.mt5_trader import MT5Trader
            trader = MT5Trader()
            trader.symbol = pair
            
            if signal.action in ["BUY", "SELL"]:
                result = trader.place_order(signal.action, signal.lot_size, signal.take_profit)
                if result:
                    print(f"\n🎯 TRADE EXECUTED:")
                    print(f"   Pair: {pair}")
                    print(f"   Action: {signal.action}")
                    print(f"   Lot Size: {signal.lot_size}")
                    print(f"   Price: {result.get('price', 'N/A')}")
                    print(f"   MT5 Ticket: {result.get('ticket', 'N/A')}")
                    print(f"   Take Profit: {signal.take_profit}")
                    print(f"   Reason: {signal.reason}")
                    print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                    logger.info(f"Order executed: {result}")
                    return result
                else:
                    print(f"\n❌ TRADE FAILED: {pair} {signal.action} {signal.lot_size} lots")
                    print(f"   Reason: Order execution failed")
                    print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                    return None
                    
                    # Log trade to database (will be blocked if MT5 not connected)
                    if task_id:
                        try:
                            task = self.active_tasks.get(task_id)
                            if task:
                                persistence = get_persistence_service()
                                log_result = persistence.log_trade(
                                    session_id=task.session_id,
                                    task_id=task_id,
                                    pair=pair,
                                    action=signal.action,
                                    lot_size=signal.lot_size,
                                    price=result.get('price'),
                                    take_profit=signal.take_profit,
                                    reason=signal.reason,
                                    mt5_ticket=str(result.get('ticket')),
                                    status='EXECUTED'
                                )
                                if log_result is None:
                                    logger.warning("Trade logging blocked - MT5 not connected")
                        except Exception as e:
                            logger.error(f"Error logging trade: {e}")
                            
            elif signal.action == "CLOSE_ALL":
                print(f"\n🔴 CLOSING ALL POSITIONS:")
                print(f"   Pair: {pair}")
                print(f"   Reason: {signal.reason}")
                print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                trader.close_all_positions()
                return {'action': 'CLOSE_ALL', 'status': 'executed'}
                
                # Log close all action (will be blocked if MT5 not connected)
                if task_id:
                    try:
                        task = self.active_tasks.get(task_id)
                        if task:
                            persistence = get_persistence_service()
                            log_result = persistence.log_trade(
                                session_id=task.session_id,
                                task_id=task_id,
                                pair=pair,
                                action="CLOSE_ALL",
                                lot_size=0,
                                reason=signal.reason,
                                status='EXECUTED'
                            )
                            if log_result is None:
                                logger.warning("Close all logging blocked - MT5 not connected")
                    except Exception as e:
                        logger.error(f"Error logging close all: {e}")
                
        except Exception as e:
            logger.error(f"Error executing signal: {e}")
            
            # Log failed trade (will be blocked if MT5 not connected)
            if task_id:
                try:
                    task = self.active_tasks.get(task_id)
                    if task:
                        persistence = get_persistence_service()
                        log_result = persistence.log_trade(
                            session_id=task.session_id,
                            task_id=task_id,
                            pair=pair,
                            action=signal.action,
                            lot_size=signal.lot_size,
                            reason=f"Error: {str(e)}",
                            status='FAILED'
                        )
                        if log_result is None:
                            logger.warning("Failed trade logging blocked - MT5 not connected")
                except Exception as log_error:
                    logger.error(f"Error logging failed trade: {log_error}")
            
            return None
    
    def shutdown(self):
        """Shutdown trading engine"""
        logger.info("Shutting down trading engine")
        with self.task_lock:
            for task_id, task in list(self.active_tasks.items()):
                updated_task = task.model_copy(update={'is_active': False})
                self.active_tasks[task_id] = updated_task
        
        self.thread_pool.shutdown(wait=True)
        logger.info("Trading engine shutdown complete")