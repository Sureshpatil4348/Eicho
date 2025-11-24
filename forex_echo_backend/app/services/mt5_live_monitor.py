try:
    import MetaTrader5 as mt5
except ImportError:
    mt5 = None
import pandas as pd
from datetime import datetime, timedelta
import time
import threading
from typing import Dict, List, Optional, Callable
from decimal import Decimal
from app.models.trading_models import MarketData, TradeSignal
from app.services.base_strategy import BaseStrategy
from app.services.risk_control_manager import RiskControlManager
from app.database.database import get_db
from app.utilities.forex_logger import forex_logger
from app.utilities.connection_decorator import require_mt5_connection, handle_mt5_errors

logger = forex_logger.get_logger(__name__)

class MT5LiveMonitor:
    
    def __init__(self):
        from decouple import config
        self.ACCOUNT = config("MT5_ACCOUNT", default=10007176246, cast=int)
        self.PASSWORD = config("MT5_PASSWORD", default="-6TiNhUm")
        self.SERVER = config("MT5_SERVER", default="MetaQuotes-Demo")
        
        self.TIMEFRAMES = {
            "1M": (mt5.TIMEFRAME_M1 if mt5 else 1, 15),
            "5M": (mt5.TIMEFRAME_M5 if mt5 else 5, 30),
            "15M": (mt5.TIMEFRAME_M15 if mt5 else 15, 60),
            "1H": (mt5.TIMEFRAME_H1 if mt5 else 60, 300),
            "4H": (mt5.TIMEFRAME_H4 if mt5 else 240, 900),
            "1D": (mt5.TIMEFRAME_D1 if mt5 else 1440, 1800),
        }
        
        self.connected = False
        self.monitoring = False
        self.monitor_thread = None
        self.callbacks: Dict[str, List[Callable]] = {}
        self.active_timeframes = ["1M", "5M", "15M"]
        self.last_updates = {}
        self.cached_data = {}
        
        # Trading components
        self.strategies = {}  # pair_timeframe -> strategy instance
        self.risk_manager = None
        self.trading_enabled = False
        
    def connect(self) -> bool:
        try:
            if mt5 is None:
                logger.error("MT5 initialization failed: MetaTrader5 package not installed")
                self.connected = True  # Simulation mode
                return True
            
            # Check if already initialized
            if mt5.terminal_info() is None:
                if not mt5.initialize():
                    error_code = mt5.last_error()
                    logger.error(f"MT5 initialization failed: Error code {error_code[0]} - {error_code[1]}")
                    return False
            
            # Check if login is needed
            account_info = mt5.account_info()
            if account_info is None or account_info.login != self.ACCOUNT:
                if not mt5.login(self.ACCOUNT, password=self.PASSWORD, server=self.SERVER):
                    error_code = mt5.last_error()
                    logger.error(f"MT5 login failed: Error code {error_code[0]} - {error_code[1]} | Account: {self.ACCOUNT} | Server: {self.SERVER}")
                    return False
            
            # Select symbols
            symbols = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY"]
            for symbol in symbols:
                if not mt5.symbol_select(symbol, True):
                    logger.warning(f"Failed to select {symbol} symbol")
            
            # Test data retrieval
            test_rates = mt5.copy_rates_from_pos("XAUUSD", mt5.TIMEFRAME_M1, 0, 1)
            if test_rates is None:
                logger.error(f"Cannot retrieve test data: {mt5.last_error()}")
                return False
                
            self.connected = True
            logger.info(f"Connected to MT5 successfully - Account: {account_info.login if account_info else 'Unknown'}")
            return True
            
        except Exception as e:
            logger.error(f"MT5 connection error: {e}")
            return False
        
        # TEMPORARY: Simulate connection for testing
        # try:
        #     self.connected = True
        #     logger.info("MT5 connection simulated (MT5 disabled)")
        #     return True
        # except Exception as e:
        #     logger.error(f"Simulated connection error: {e}")
        #     return False
    
    def disconnect(self):
        if self.connected:
            mt5.shutdown()
            self.connected = False
            logger.info("Disconnected from MT5 (simulated)")
    
    def set_active_timeframes(self, timeframes: List[str]):
        valid_timeframes = [tf for tf in timeframes if tf in self.TIMEFRAMES]
        if not valid_timeframes:
            logger.warning(f"No valid timeframes provided: {timeframes}")
            return False
            
        self.active_timeframes = valid_timeframes
        self.last_updates = {tf: 0 for tf in self.active_timeframes}
        logger.info(f"Active timeframes set to: {self.active_timeframes}")
        return True
    
    def get_price_data(self, timeframe_key: str, bars: int = 10, symbol: str = "XAUUSD") -> Optional[List[MarketData]]:
        if not self.connected or timeframe_key not in self.TIMEFRAMES:
            logger.warning(f"Not connected or invalid timeframe: {timeframe_key}")
            return None
            
        # TODO: Uncomment when MT5 is enabled
        try:
            # Check MT5 connection
            if mt5.terminal_info() is None:
                logger.warning("MT5 terminal not connected, attempting reconnect...")
                if not self.connect():
                    return None
            
            tf_constant, _ = self.TIMEFRAMES[timeframe_key]
            
            # Try multiple times to get data
            for attempt in range(3):
                rates = mt5.copy_rates_from_pos(symbol, tf_constant, 0, bars)
                
                if rates is not None and len(rates) > 0:
                    market_data = []
                    for rate in rates:
                        market_data.append(MarketData(
                            open=float(rate[1]),
                            high=float(rate[2]),
                            low=float(rate[3]),
                            close=float(rate[4]),
                            timestamp=int(rate[0])
                        ))
                    
                    # Cache successful data
                    self.cached_data[f"{symbol}_{timeframe_key}"] = market_data
                    return market_data
                
                if attempt < 2:
                    time.sleep(1)  # Wait before retry
            
            # If no new data, return cached data if available
            cache_key = f"{symbol}_{timeframe_key}"
            if cache_key in self.cached_data:
                logger.info(f"Using cached data for {timeframe_key}")
                return self.cached_data[cache_key]
            
            error = mt5.last_error()
            logger.warning(f"No data received for {timeframe_key} after 3 attempts. MT5 Error: {error}")
            return None
            
        except Exception as e:
            logger.error(f"Error getting price data for {timeframe_key}: {e}")
            return None
        
        # # TEMPORARY: Generate simulated market data for testing
        # try:
        #     import random
        #     current_time = int(time.time())
        #     base_price = 2000.0  # Base gold price
            
        #     market_data = []
        #     for i in range(bars):
        #         # Generate realistic OHLC data
        #         open_price = base_price + random.uniform(-50, 50)
        #         high_price = open_price + random.uniform(0, 10)
        #         low_price = open_price - random.uniform(0, 10)
        #         close_price = open_price + random.uniform(-5, 5)
                
        #         market_data.append(MarketData(
        #             open=open_price,
        #             high=high_price,
        #             low=low_price,
        #             close=close_price,
        #             timestamp=current_time - (bars - i - 1) * 60  # 1 minute intervals
        #         ))
            
        #     # Cache simulated data
        #     self.cached_data[f"{symbol}_{timeframe_key}"] = market_data
        #     return market_data
            
        # except Exception as e:
        #     logger.error(f"Error generating simulated data: {e}")
        #     return None
    
    def get_current_tick(self) -> Optional[MarketData]:
        if not self.connected:
            return None
            
        try:
            tick = mt5.symbol_info_tick("XAUUSD")
            if tick is None:
                return None
            
            return MarketData(
                open=tick.bid,
                high=tick.ask,
                low=tick.bid,
                close=tick.bid,
                timestamp=int(tick.time)
            )
            
        except Exception as e:
            logger.error(f"Error getting current tick: {e}")
            return None
    
    def register_callback(self, timeframe: str, callback: Callable):
        if timeframe not in self.callbacks:
            self.callbacks[timeframe] = []
        self.callbacks[timeframe].append(callback)
        logger.info(f"Callback registered for {timeframe}")
    
    def get_market_analysis(self, timeframe_key: str) -> Optional[Dict]:
        data = self.get_price_data(timeframe_key, 5)
        if not data or len(data) < 2:
            return None
            
        latest = data[-1]
        previous = data[-2]
        
        price_change = latest.close - previous.close
        change_pct = (price_change / previous.close * 100) if previous.close > 0 else 0
        hl_range = latest.high - latest.low
        status = "BULLISH" if price_change > 0 else "BEARISH" if price_change < 0 else "NEUTRAL"
        
        return {
            "timeframe": timeframe_key,
            "timestamp": datetime.fromtimestamp(latest.timestamp).strftime("%H:%M:%S"),
            "ohlc": {
                "open": latest.open,
                "high": latest.high,
                "low": latest.low,
                "close": latest.close
            },
            "analysis": {
                "price_change": price_change,
                "change_percent": change_pct,
                "hl_range": hl_range,
                "status": status,
                "trend": "▲" if price_change > 0 else "▼" if price_change < 0 else "-"
            }
        }
    
    def start_monitoring(self):
        if self.monitoring:
            logger.warning("Monitoring already active")
            return False
            
        if not self.connected:
            logger.info("Connecting to MT5 for monitoring...")
            if not self.connect():
                logger.error("Failed to connect to MT5")
                return False
        
        # Initialize last update times
        self.last_updates = {tf: 0 for tf in self.active_timeframes}
        
        self.monitoring = True
        self.monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self.monitor_thread.start()
        
        # Test initial data retrieval
        test_data = self.get_price_data("1M", 1)
        if test_data:
            logger.info(f"Live monitoring started successfully - Current XAUUSD: {test_data[-1].close:.2f}")
        else:
            logger.warning("Live monitoring started but no initial data received")
        
        return True
    
    def stop_monitoring(self):
        self.monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join(timeout=5)
        logger.info("Live monitoring stopped")
    
    def _monitor_loop(self):
        consecutive_failures = 0
        max_failures = 10
        
        while self.monitoring:
            try:
                current_time = time.time()
                success_count = 0
                
                
                # Check MT5 connection health
                if mt5.terminal_info() is None:
                    logger.warning("MT5 terminal disconnected, attempting reconnect...")
                    if not self.connect():
                        consecutive_failures += 1
                        if consecutive_failures >= max_failures:
                            logger.error("Too many connection failures, stopping monitor")
                            break
                        time.sleep(30)  # Wait longer on connection failure
                        continue
                
                # TEMPORARY: Skip MT5 connection check when disabled
                # if not self.connected:
                #     time.sleep(10)
                #     continue
                
                for tf_name in self.active_timeframes:
                    if tf_name not in self.TIMEFRAMES:
                        continue
                        
                    _, update_freq = self.TIMEFRAMES[tf_name]
                    time_since_update = current_time - self.last_updates.get(tf_name, 0)
                    
                    if time_since_update >= update_freq:
                        data = self.get_price_data(tf_name, 5)
                        if data:
                            self.cached_data[tf_name] = data
                            self.last_updates[tf_name] = current_time
                            success_count += 1
                            
                            # Log successful data retrieval (less frequent)
                            if int(current_time) % 60 == 0:  # Every minute
                                logger.info(f"Data updated: {tf_name} - Price: {data[-1].close:.2f}")
                            
                            if tf_name in self.callbacks:
                                for callback in self.callbacks[tf_name]:
                                    try:
                                        callback(tf_name, data[-1])
                                    except Exception as e:
                                        logger.error(f"Callback error for {tf_name}: {e}")
                
                # Reset failure counter on success
                if success_count > 0:
                    consecutive_failures = 0
                else:
                    consecutive_failures += 1
                
                # Adaptive sleep based on market hours
                current_hour = datetime.now().hour
                if 22 <= current_hour or current_hour <= 6:  # Market closed hours
                    time.sleep(30)  # Sleep longer during off-hours
                else:
                    time.sleep(5)   # Normal monitoring
                
            except Exception as e:
                consecutive_failures += 1
                logger.error(f"Monitor loop error: {e}")
                
                if consecutive_failures >= max_failures:
                    logger.error("Too many consecutive failures, stopping monitor")
                    break
                    
                time.sleep(10)
    
    def get_entry_exit_conditions(self, timeframe: str = "15M") -> Dict:
        data = self.get_price_data(timeframe, 50)
        if not data or len(data) < 50:
            return {"error": "Insufficient data for analysis"}
        
        closes = [candle.close for candle in data]
        current_price = closes[-1]
        
        recent_highs = [candle.high for candle in data[-50:]]
        recent_lows = [candle.low for candle in data[-50:]]
        highest_high = max(recent_highs)
        lowest_low = min(recent_lows)
        
        pct_from_high = ((highest_high - current_price) / highest_high) * 100
        pct_from_low = ((current_price - lowest_low) / lowest_low) * 100
        
        recent_closes = closes[-20:]
        mean_price = sum(recent_closes) / len(recent_closes)
        variance = sum((x - mean_price) ** 2 for x in recent_closes) / len(recent_closes)
        std_dev = variance ** 0.5
        zscore = (current_price - mean_price) / std_dev if std_dev > 0 else 0
        
        return {
            "timeframe": timeframe,
            "current_price": current_price,
            "highest_high": highest_high,
            "lowest_low": lowest_low,
            "pct_from_high": pct_from_high,
            "pct_from_low": pct_from_low,
            "zscore": zscore,
            "conditions": {
                "buy_trigger": pct_from_high >= 2.0,
                "sell_trigger": pct_from_low >= 2.0,
                "buy_zscore_confirm": zscore <= -3.0,
                "sell_zscore_confirm": zscore >= 3.0,
            },
            "signals": {
                "buy_setup": pct_from_high >= 2.0 and zscore <= -3.0,
                "sell_setup": pct_from_low >= 2.0 and zscore >= 3.0,
                "neutral": abs(pct_from_high) < 2.0 and abs(pct_from_low) < 2.0
            },
            "risk_management": {
                "suggested_lot_size": 0.01,
                "stop_loss_pct": 1.0,
                "take_profit_pct": 1.0,
            }
        }
    
    def __enter__(self):
        """Context manager entry."""
        self.connect()
        return self
    
    def enable_trading(self, user_id: str):
        """Enable real-time trading with risk control"""
        try:
            db = next(get_db())
            self.risk_manager = RiskControlManager(db)
            self.trading_enabled = True
            logger.info(f"Trading enabled for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to enable trading: {e}")
            return False
    
    def add_strategy(self, pair: str, timeframe: str, strategy: BaseStrategy):
        """Add strategy for real-time trading"""
        key = f"{pair}_{timeframe}"
        self.strategies[key] = strategy
        logger.info(f"Strategy added: {key}")
    
    @require_mt5_connection
    @handle_mt5_errors
    def execute_trade(self, pair: str, signal: TradeSignal) -> Optional[int]:
        """Execute trade on MT5"""
        if not self.connected or not self.trading_enabled:
            return None
        
        # TODO: Uncomment when MT5 is enabled
        try:
            if signal.action == "CLOSE_ALL":
                return self._close_all_positions(pair)
            
            # Prepare trade request
            action = mt5.TRADE_ACTION_DEAL
            order_type = mt5.ORDER_TYPE_BUY if signal.action == "BUY" else mt5.ORDER_TYPE_SELL
            price = mt5.symbol_info_tick(pair).ask if signal.action == "BUY" else mt5.symbol_info_tick(pair).bid
            
            request = {
                "action": action,
                "symbol": pair,
                "volume": signal.lot_size,
                "type": order_type,
                "price": price,
                "deviation": 20,
                "magic": 234000,
                "comment": f"Auto: {signal.reason}",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }
            
            if signal.take_profit:
                request["tp"] = signal.take_profit
            
            result = mt5.order_send(request)
            
            if result.retcode != mt5.TRADE_RETCODE_DONE:
                logger.error(f"Trade failed: {result.comment}")
                return None
            
            logger.info(f"Trade executed: {signal.action} {signal.lot_size} {pair} at {price}")
            return result.order
            
        except Exception as e:
            logger.error(f"Trade execution error: {e}")
            return None
        
        # TEMPORARY: MT5 disabled - return None to prevent trade execution
        # logger.error(f"MT5 disabled - cannot execute {signal.action} trade for {pair}")
        # return None
    
    @require_mt5_connection
    @handle_mt5_errors
    def _close_all_positions(self, pair: str) -> int:
        """Close all positions for a pair"""
        # TODO: Uncomment when MT5 is enabled
        positions = mt5.positions_get(symbol=pair)
        if not positions:
            return 0
        
        closed_count = 0
        for position in positions:
            close_request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": pair,
                "volume": position.volume,
                "type": mt5.ORDER_TYPE_SELL if position.type == mt5.ORDER_TYPE_BUY else mt5.ORDER_TYPE_BUY,
                "position": position.ticket,
                "price": mt5.symbol_info_tick(pair).bid if position.type == mt5.ORDER_TYPE_BUY else mt5.symbol_info_tick(pair).ask,
                "deviation": 20,
                "magic": 234000,
                "comment": "Risk Control: Close All",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }
            
            result = mt5.order_send(close_request)
            if result.retcode == mt5.TRADE_RETCODE_DONE:
                closed_count += 1
                logger.info(f"Position closed: {position.ticket}")
        
        return closed_count
        
        # TEMPORARY: MT5 disabled - return 0 to indicate no positions closed
        # logger.error(f"MT5 disabled - cannot close positions for {pair}")
        # return 0
    
    def get_current_pnl(self, pair: str) -> Dict[str, Decimal]:
        """Get current P&L for a pair"""
        # TODO: Uncomment when MT5 is enabled
        positions = mt5.positions_get(symbol=pair)
        if not positions:
            return {"floating_pnl": Decimal('0.00'), "realized_pnl": Decimal('0.00')}
        
        floating_pnl = sum(pos.profit for pos in positions)
        
        # Get realized P&L from history (simplified)
        history = mt5.history_deals_get(symbol=pair)
        realized_pnl = sum(deal.profit for deal in history[-10:]) if history else 0
        
        return {
            "floating_pnl": Decimal(str(floating_pnl)),
            "realized_pnl": Decimal(str(realized_pnl))
        }
        
        # TEMPORARY: Return simulated P&L for testing
        # return {
        #     "floating_pnl": Decimal('0.00'),
        #     "realized_pnl": Decimal('0.00')
        # }
    
    def start_live_trading(self, user_id: str):
        """Start live trading with strategies"""
        if not self.enable_trading(user_id):
            return False
        
        # Register trading callback
        for timeframe in self.active_timeframes:
            self.register_callback(timeframe, self._trading_callback)
        
        return self.start_monitoring()
    
    def _trading_callback(self, timeframe: str, candle: MarketData):
        """Process trading signals from strategies"""
        if not self.trading_enabled:
            return
        
        for key, strategy in self.strategies.items():
            pair, tf = key.split('_')
            if tf != timeframe:
                continue
            
            try:
                # Get current P&L
                pnl_data = self.get_current_pnl(pair)
                
                # Process strategy with risk control
                signal = strategy.process_tick(
                    candle, 
                    pnl_data["floating_pnl"], 
                    pnl_data["realized_pnl"]
                )
                
                if signal and signal.action != "BLOCKED":
                    # Execute trade
                    order_id = self.execute_trade(pair, signal)
                    if order_id:
                        logger.info(f"Trade executed: {pair} {signal.action} - Order: {order_id}")
                
            except Exception as e:
                logger.error(f"Trading callback error for {key}: {e}")
    
    def get_trading_status(self) -> Dict:
        """Get current trading status"""
        status = {
            "connected": self.connected,
            "trading_enabled": self.trading_enabled,
            "monitoring": self.monitoring,
            "active_strategies": len(self.strategies),
            "active_positions": {}
        }
        
        if self.connected:
            for key in self.strategies.keys():
                pair = key.split('_')[0]
                # TODO: Uncomment when MT5 is enabled
                positions = mt5.positions_get(symbol=pair)
                status["active_positions"][pair] = len(positions) if positions else 0
                
                # TEMPORARY: Simulated positions count
                # status["active_positions"][pair] = 0
        
        return status
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.stop_monitoring()
        self.disconnect()

class LiveTradingManager:
    """Simplified interface for live trading"""
    
    def __init__(self):
        self.monitor = MT5LiveMonitor()
        self.user_id = None
    
    def connect(self) -> bool:
        """Connect to MT5"""
        return self.monitor.connect()
    
    def setup_trading(self, user_id: str) -> bool:
        """Setup live trading"""
        self.user_id = user_id
        return True
    
    def start_trading(self) -> bool:
        """Start live trading"""
        if self.user_id:
            return self.monitor.start_live_trading(self.user_id)
        return False
    
    def stop_trading(self):
        """Stop live trading"""
        self.monitor.stop_monitoring()
        self.monitor.disconnect()
    
    def get_status(self) -> Dict:
        """Get trading status"""
        return self.monitor.get_trading_status()