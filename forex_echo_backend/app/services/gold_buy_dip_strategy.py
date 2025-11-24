from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.trading_models import MarketData, TradeSignal, TradeDirection, SetupState
from app.models.strategy_models import GoldBuyDipConfig, GoldBuyDipState
from app.indicators.zscore import calculate_zscore
from app.indicators.atr import calculate_atr
from app.utilities.forex_logger import forex_logger
from app.services.strategy_performance_tracker import StrategyPerformanceTracker
from app.services.base_strategy import BaseStrategy

logger = forex_logger.get_logger(__name__)

class GoldBuyDipStrategy(BaseStrategy):
    def __init__(self, config: GoldBuyDipConfig, pair: str, timeframe: str = "15M", db: Session = None):
        super().__init__(pair, timeframe, "gold_buy_dip", db)
        self.config = config
        self.state = GoldBuyDipState()
        self.candles: List[MarketData] = []
        self.performance_tracker = StrategyPerformanceTracker(timeframe)
        
        # Capital allocation integration
        self.allocated_capital = Decimal('0.00')
        self.risk_threshold_pct = Decimal('20.00')
        self._initialize_capital_allocation()
    
    def add_candle(self, candle: MarketData):
        self.candles.append(candle)
        max_needed = max(self.config.lookback_candles, self.config.zscore_period, self.config.atr_period) + 10
        if len(self.candles) > max_needed:
            self.candles = self.candles[-max_needed:]
    
    def check_percentage_trigger(self) -> Optional[TradeDirection]:
        # Fully dynamic: Use exactly what user configured
        if len(self.candles) < self.config.lookback_candles:
            return None
        
        # Use exact user-configured lookback period
        lookback_count = self.config.lookback_candles
        
        recent_candles = self.candles[-lookback_count:]
        highest_high = max(c.close for c in recent_candles)
        lowest_low = min(c.close for c in recent_candles)
        current_price = self.candles[-1].close
        
        pct_from_low = ((current_price - lowest_low) / lowest_low) * 100
        if pct_from_low >= self.config.percentage_threshold:
            return TradeDirection.SELL
        
        pct_from_high = ((highest_high - current_price) / highest_high) * 100
        if pct_from_high >= self.config.percentage_threshold:
            return TradeDirection.BUY
        
        return None
    
    def check_zscore_confirmation(self) -> bool:
        if len(self.candles) < self.config.zscore_period:
            return False
        
        closes = [c.close for c in self.candles]
        zscore = calculate_zscore(closes, self.config.zscore_period)
        
        if self.state.trigger_direction == TradeDirection.SELL:
            return zscore >= self.config.zscore_threshold_sell
        elif self.state.trigger_direction == TradeDirection.BUY:
            return zscore <= self.config.zscore_threshold_buy
        
        return False
    
    def calculate_grid_spacing(self) -> float:
        if self.config.use_grid_percent:
            last_price = self.candles[-1].close
            return last_price * (self.config.grid_percent / 100)
        else:
            atr = calculate_atr(self.candles, self.config.atr_period)
            return atr * self.config.grid_atr_multiplier
    
    def calculate_grid_lot_size(self, grid_level: int) -> float:
        if self.config.use_progressive_lots:
            return self.config.lot_size * (self.config.lot_progression_factor ** grid_level)
        else:
            return self.config.lot_size * self.config.grid_lot_multiplier
    
    def calculate_average_take_profit(self) -> Optional[float]:
        if not self.state.grid_trades:
            return None
        
        total_lots = sum(trade["lot_size"] for trade in self.state.grid_trades)
        weighted_price = sum(trade["price"] * trade["lot_size"] for trade in self.state.grid_trades)
        
        if total_lots == 0:
            return None
        
        average_price = weighted_price / total_lots
        first_trade = self.state.grid_trades[0]
        
        if first_trade["direction"] == "BUY":
            if self.config.use_take_profit_percent:
                return average_price * (1 + self.config.take_profit_percent / 100)
            else:
                return average_price + (self.config.take_profit / 10000)
        else:
            if self.config.use_take_profit_percent:
                return average_price * (1 - self.config.take_profit_percent / 100)
            else:
                return average_price - (self.config.take_profit / 10000)
    
    def check_grid_exit_conditions(self, current_price: float) -> bool:
        """Check if grid should be closed."""
        if not self.state.grid_trades:
            return False
        
        # Check if max grid trades reached
        if len(self.state.grid_trades) >= self.config.max_grid_trades:
            logger.info(f"Max grid trades reached: {len(self.state.grid_trades)}/{self.config.max_grid_trades}")
            return True
        
        # Check average take profit
        avg_tp = self.calculate_average_take_profit()
        if avg_tp is None:
            return False
        
        first_trade = self.state.grid_trades[0]
        if first_trade["direction"] == "BUY" and current_price >= avg_tp:
            logger.info(f"BUY grid profit target reached: {current_price:.2f} >= {avg_tp:.2f}")
            return True
        elif first_trade["direction"] == "SELL" and current_price <= avg_tp:
            logger.info(f"SELL grid profit target reached: {current_price:.2f} <= {avg_tp:.2f}")
            return True
        
        return False
    
    def _check_strategy_drawdown(self) -> bool:
        """Check if strategy-specific maximum drawdown is exceeded."""
        if self.state.initial_balance == 0:
            # Get allocated capital as initial balance
            risk_status = self.get_risk_status()
            if risk_status and 'allocated_capital' in risk_status:
                self.state.initial_balance = float(risk_status['allocated_capital'])
                logger.info(f"Initial balance set from allocation: ${self.state.initial_balance}")
            return False
        
        current_equity = self.state.initial_balance + float(self.current_realized_pnl + self.current_floating_pnl)
        drawdown_pct = ((self.state.initial_balance - current_equity) / self.state.initial_balance) * 100
        
        if drawdown_pct >= self.config.max_drawdown_percent:
            logger.critical(f"STRATEGY DRAWDOWN LIMIT EXCEEDED: {drawdown_pct:.2f}% >= {self.config.max_drawdown_percent}%")
            return True
        
        if drawdown_pct > 0:
            logger.warning(f"Current strategy drawdown: {drawdown_pct:.2f}%")
        
        return False
    
    def _process_market_data(self, candle: MarketData) -> Optional[TradeSignal]:
        """Strategy-specific market data processing."""
        self.add_candle(candle)
        
        # Calculate indicators for logging
        zscore = 0
        atr = 0
        price_movement_score = 0
        
        if len(self.candles) >= self.config.zscore_period:
            closes = [c.close for c in self.candles]
            zscore = calculate_zscore(closes, self.config.zscore_period)
        
        if len(self.candles) >= self.config.atr_period:
            atr = calculate_atr(self.candles, self.config.atr_period)
        
        # Use configured candles for price movement calculation
        if len(self.candles) >= self.config.lookback_candles:
            recent_candles = self.candles[-self.config.lookback_candles:]
            highest_high = max(c.close for c in recent_candles)
            lowest_low = min(c.close for c in recent_candles)
            price_range = highest_high - lowest_low
            if price_range > 0:
                price_movement_score = ((candle.close - lowest_low) / price_range) * 100
        
        # Check for maximum drawdown using current P&L
        signal = None
        drawdown_pct = 0
        if self._check_strategy_drawdown():
            self.state.setup_state = SetupState.WAITING_FOR_TRIGGER
            self.state.grid_trades.clear()
            signal = TradeSignal(
                action="CLOSE_ALL",
                lot_size=0,
                reason="Strategy maximum drawdown exceeded"
            )
        
        # Forex standard: Log only when signals are generated
        if signal is not None:
            self._log_market_data_with_signals(signal, zscore, atr, price_movement_score, drawdown_pct)
        
        if signal:
            return signal
        
        if self.state.setup_state == SetupState.WAITING_FOR_TRIGGER:
            trigger = self.check_percentage_trigger()
            if trigger:
                self.state.setup_state = SetupState.WAITING_FOR_ZSCORE
                self.state.trigger_direction = trigger
                self.state.trigger_candle = len(self.candles) - 1
                self.state.wait_candles_count = 0
        
        elif self.state.setup_state == SetupState.WAITING_FOR_ZSCORE:
            self.state.wait_candles_count += 1
            
            if self.check_zscore_confirmation():
                # Check capital allocation risk before trading
                if self.check_capital_allocation_risk():
                    self.state.setup_state = SetupState.WAITING_FOR_TRIGGER
                    return None
                
                # Execute initial trade
                self.state.setup_state = SetupState.TRADE_EXECUTED
                
                # Calculate position size based on capital allocation
                position_size = self.calculate_position_size(self.state.trigger_direction.value)
                
                take_profit = None
                if self.config.use_take_profit_percent:
                    take_profit = candle.close * (1 + self.config.take_profit_percent / 100)
                else:
                    take_profit = candle.close + (self.config.take_profit / 10000)  # Convert points to price
                
                self.state.grid_trades.append({
                    "price": candle.close,
                    "direction": self.state.trigger_direction.value,
                    "lot_size": position_size,
                    "grid_level": 0
                })
                
                logger.info(f"Initial grid trade: Price: {candle.close:.2f}, Direction: {self.state.trigger_direction.value}, Lot: {position_size}")
                
                signal = TradeSignal(
                    action=self.state.trigger_direction.value,
                    lot_size=position_size,
                    take_profit=take_profit,
                    reason="Initial trade - Z-score confirmed"
                )
                
                # Log the signal before returning
                self._log_market_data_with_signals(signal, zscore, atr, price_movement_score, 0)
                return signal
            
            elif self.state.wait_candles_count >= self.config.zscore_wait_candles:
                # Timeout - reset to waiting for trigger
                self.state.setup_state = SetupState.WAITING_FOR_TRIGGER
                self.state.trigger_direction = None
        
        elif self.state.setup_state == SetupState.TRADE_EXECUTED:
            # Check grid exit conditions first
            if self.config.use_grid_trading and self.check_grid_exit_conditions(candle.close):
                # Close all grid trades
                self.state.setup_state = SetupState.WAITING_FOR_TRIGGER
                total_trades = len(self.state.grid_trades)
                self.state.grid_trades.clear()
                
                signal = TradeSignal(
                    action="CLOSE_ALL",
                    lot_size=0,
                    reason=f"Grid exit: {total_trades} trades closed"
                )
                return signal
            
            # Handle adding new grid trades
            if self.config.use_grid_trading and len(self.state.grid_trades) < self.config.max_grid_trades:
                # Check if price moved against position enough to add grid trade
                last_trade = self.state.grid_trades[-1]
                grid_spacing = self.calculate_grid_spacing()
                
                should_add_grid = False
                if last_trade["direction"] == "BUY" and candle.close <= last_trade["price"] - grid_spacing:
                    should_add_grid = True
                elif last_trade["direction"] == "SELL" and candle.close >= last_trade["price"] + grid_spacing:
                    should_add_grid = True
                
                if should_add_grid:
                    # Check capital allocation risk before adding grid trade
                    if self.check_capital_allocation_risk():
                        return None
                    
                    grid_level = len(self.state.grid_trades)
                    base_lot_size = self.calculate_grid_lot_size(grid_level)
                    
                    # Apply capital allocation to grid lot size
                    adjusted_lot_size = self.calculate_position_size(last_trade["direction"])
                    lot_size = min(base_lot_size, adjusted_lot_size)
                    
                    self.state.grid_trades.append({
                        "price": candle.close,
                        "direction": last_trade["direction"],
                        "lot_size": lot_size,
                        "grid_level": grid_level
                    })
                    
                    logger.info(f"Grid trade added: Level {grid_level + 1}, Price: {candle.close:.2f}, Lot: {lot_size:.2f}")
                    
                    signal = TradeSignal(
                        action=last_trade["direction"],
                        lot_size=lot_size,
                        take_profit=self.calculate_average_take_profit(),
                        reason=f"Grid trade level {grid_level + 1}"
                    )
                    return signal
        
        return None
    
    def get_grid_status(self) -> dict:
        """Get current grid trading status."""
        if not self.state.grid_trades:
            return {"active": False, "trades": 0}
        
        total_lots = sum(trade["lot_size"] for trade in self.state.grid_trades)
        avg_price = sum(trade["price"] * trade["lot_size"] for trade in self.state.grid_trades) / total_lots if total_lots > 0 else 0
        avg_tp = self.calculate_average_take_profit()
        
        return {
            "active": True,
            "trades": len(self.state.grid_trades),
            "total_lots": total_lots,
            "average_price": avg_price,
            "average_take_profit": avg_tp,
            "direction": self.state.grid_trades[0]["direction"] if self.state.grid_trades else None,
            "grid_levels": [trade["grid_level"] for trade in self.state.grid_trades]
        }
    
    def _log_market_data_with_signals(self, signal: Optional[TradeSignal], zscore: float, atr: float, 
                                    price_movement_score: float, drawdown_pct: float):
        """Log market data following forex standards - trade from available data."""
        # Forex standard: Use available candles (minimum 20 for Z-score)
        if len(self.candles) < self.config.zscore_period:
            return
            
        # Log 50 candles with signal (show all candles like before)
        recent_candles = self.candles[-50:] if len(self.candles) >= 50 else self.candles
        
        # Use simple CSV logger for signal logging
        candle_data = {
            'timestamp': recent_candles[-1].timestamp,
            'open': recent_candles[-1].open,
            'high': recent_candles[-1].high,
            'low': recent_candles[-1].low,
            'close': recent_candles[-1].close
        }
        
        indicators = {
            'zscore': zscore,
            'atr': atr,
            'price_movement_score': price_movement_score,
            'strategy_state': f"Grid:{len(self.state.grid_trades)} Drawdown:{drawdown_pct:.1f}%"
        }
        
        forex_logger.log_signal(self.timeframe, candle_data, signal, indicators)
         
    def _initialize_capital_allocation(self):
        """Initialize capital allocation from risk system"""
        if self.db:
            try:
                risk_status = self.get_risk_status()
                if risk_status and 'allocated_capital' in risk_status:
                    self.allocated_capital = Decimal(str(risk_status['allocated_capital']))
                    logger.info(f"Capital allocation initialized: ${self.allocated_capital}")
            except Exception as e:
                logger.warning(f"Could not initialize capital allocation: {e}")
    
    def calculate_position_size(self, signal_type: str) -> float:
        """Calculate position size based on capital allocation"""
        if self.allocated_capital <= 0:
            return self.config.lot_size
        
        # Use 1% of allocated capital per trade as base
        risk_per_trade = float(self.allocated_capital) * 0.01
        
        # Adjust lot size based on risk (simplified)
        # In production, this would consider stop loss distance
        adjusted_lot_size = max(0.01, min(risk_per_trade / 1000, self.config.lot_size * 2))
        
        logger.info(f"Position size calculated: {adjusted_lot_size} (Capital: ${self.allocated_capital})")
        return adjusted_lot_size
    
    def check_capital_allocation_risk(self) -> bool:
        """Check if strategy should stop due to capital allocation risk"""
        if not self.can_trade():
            logger.warning(f"Trading blocked by capital allocation for {self.pair}")
            return True
        
        risk_status = self.get_risk_status()
        if risk_status and risk_status.get('risk_breached', False):
            logger.critical(f"Risk breached for {self.pair} - stopping strategy")
            return True
        
        return False
    
    def reset_strategy(self):
        """Reset strategy state."""
        logger.info("Resetting strategy state")
        self.state = GoldBuyDipState()
        self.candles.clear()
        self._initialize_capital_allocation()