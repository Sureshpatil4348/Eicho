"""RSI Pairs Trading Strategy Implementation"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.trading_models import MarketData, TradeSignal, TradeDirection
from app.models.strategy_models import RSIPairsConfig, RSIPairsState
from app.indicators.rsi import calculate_rsi
from app.indicators.atr import calculate_atr
from app.utilities.forex_logger import forex_logger
from app.services.base_strategy import BaseStrategy

logger = forex_logger.get_logger(__name__)

class RSIPairsStrategy(BaseStrategy):
    """RSI Pairs Trading Strategy with positive/negative correlation modes"""
    
    def __init__(self, config: RSIPairsConfig, pair: str, timeframe: str = "5M", db: Session = None):
        super().__init__(pair, timeframe, "rsi_pairs", db)
        self.config = config
        self.state = RSIPairsState()
        
        # Store both symbols for pairs trading
        self.symbol1 = config.symbol1
        self.symbol2 = config.symbol2
        
        # Capital allocation integration
        self.allocated_capital = Decimal('0.00')
        self.risk_threshold_pct = Decimal('20.00')
        self._initialize_capital_allocation()
        
        logger.info(f"RSI Pairs Strategy initialized: {self.symbol1}/{self.symbol2} ({config.mode} correlation)")
    
    def add_candle_data(self, symbol: str, candle: MarketData):
        """Add candle data for specific symbol"""
        candle_dict = {
            'timestamp': candle.timestamp,
            'open': candle.open,
            'high': candle.high,
            'low': candle.low,
            'close': candle.close
        }
        
        if symbol == self.symbol1:
            self.state.s1_candles.append(candle_dict)
            # Keep only necessary candles
            max_needed = max(self.config.rsi_period, self.config.atr_period) + 10
            if len(self.state.s1_candles) > max_needed:
                self.state.s1_candles = self.state.s1_candles[-max_needed:]
        elif symbol == self.symbol2:
            self.state.s2_candles.append(candle_dict)
            if len(self.state.s2_candles) > max_needed:
                self.state.s2_candles = self.state.s2_candles[-max_needed:]
    
    def calculate_indicators(self) -> Dict[str, float]:
        """Calculate RSI and ATR for both symbols"""
        indicators = {
            's1_rsi': 50.0, 's2_rsi': 50.0,
            's1_atr': 0.0, 's2_atr': 0.0
        }
        
        # Calculate RSI for symbol1
        if len(self.state.s1_candles) >= self.config.rsi_period + 1:
            s1_closes = [c['close'] for c in self.state.s1_candles]
            indicators['s1_rsi'] = calculate_rsi(s1_closes, self.config.rsi_period)
        
        # Calculate RSI for symbol2
        if len(self.state.s2_candles) >= self.config.rsi_period + 1:
            s2_closes = [c['close'] for c in self.state.s2_candles]
            indicators['s2_rsi'] = calculate_rsi(s2_closes, self.config.rsi_period)
        
        # Calculate ATR for symbol1
        if len(self.state.s1_candles) >= self.config.atr_period:
            s1_market_data = [MarketData(
                timestamp=c['timestamp'], open=c['open'], high=c['high'],
                low=c['low'], close=c['close']
            ) for c in self.state.s1_candles]
            indicators['s1_atr'] = calculate_atr(s1_market_data, self.config.atr_period)
        
        # Calculate ATR for symbol2
        if len(self.state.s2_candles) >= self.config.atr_period:
            s2_market_data = [MarketData(
                timestamp=c['timestamp'], open=c['open'], high=c['high'],
                low=c['low'], close=c['close']
            ) for c in self.state.s2_candles]
            indicators['s2_atr'] = calculate_atr(s2_market_data, self.config.atr_period)
        
        return indicators
    
    def get_pip_size(self, symbol: str) -> float:
        """Get pip size for symbol - dynamic calculation"""
        symbol = symbol.upper()
        
        # JPY pairs have different pip size
        if 'JPY' in symbol:
            return 0.01
        # Metals typically use 2 decimal places
        elif symbol.startswith('XAU') or symbol.startswith('XAG') or 'GOLD' in symbol or 'SILVER' in symbol:
            return 0.01
        # Crypto pairs (if supported)
        elif 'BTC' in symbol or 'ETH' in symbol:
            return 1.0
        # Standard forex pairs use 4 decimal places
        else:
            return 0.0001
    
    def calculate_hedge_ratio(self, s1_atr: float, s2_atr: float) -> float:
        """Calculate hedge ratio based on ATR"""
        if s2_atr <= 0:
            return 1.0
        
        s1_pip_size = self.get_pip_size(self.symbol1)
        s2_pip_size = self.get_pip_size(self.symbol2)
        
        s1_atr_pips = s1_atr / s1_pip_size
        s2_atr_pips = s2_atr / s2_pip_size
        
        if s2_atr_pips <= 0:
            return 1.0
        
        hedge_ratio = s1_atr_pips / s2_atr_pips
        
        # Apply safety bounds [0.2, 5.0]
        return max(0.2, min(5.0, hedge_ratio))
    
    def calculate_lot_sizes(self, s1_atr: float, s2_atr: float) -> tuple[float, float]:
        """Calculate lot sizes for both symbols with capital allocation"""
        # Apply capital allocation to base lot size
        base_lots = self.calculate_position_size("BUY")  # Direction doesn't matter for sizing
        
        hedge_ratio = self.calculate_hedge_ratio(s1_atr, s2_atr)
        s2_lots = base_lots * hedge_ratio
        
        # Normalize lot sizes (simplified - in production would use broker constraints)
        s1_lots = max(0.01, min(10.0, base_lots))
        s2_lots = max(0.01, min(10.0, s2_lots))
        
        return s1_lots, s2_lots
    
    def check_entry_conditions(self, indicators: Dict[str, float]) -> Optional[str]:
        """Check entry conditions based on correlation mode"""
        s1_rsi = indicators['s1_rsi']
        s2_rsi = indicators['s2_rsi']
        s1_atr = indicators['s1_atr']
        s2_atr = indicators['s2_atr']
        
        # Ensure ATR values are valid
        if s1_atr <= 0 or s2_atr <= 0:
            return None
        
        if self.config.mode == "negative":
            # Negative correlation: both overbought -> short both, both oversold -> long both
            if s1_rsi > self.config.rsi_overbought and s2_rsi > self.config.rsi_overbought:
                return "short"
            elif s1_rsi < self.config.rsi_oversold and s2_rsi < self.config.rsi_oversold:
                return "long"
        elif self.config.mode == "positive":
            # Positive correlation: divergence signals (placeholder - needs specific implementation)
            # TODO: Implement positive correlation logic when requirements are defined
            pass
        
        return None
    
    def check_exit_conditions(self) -> Optional[str]:
        """Check exit conditions"""
        if not self.state.in_trade or not self.state.entry_time:
            return None
        
        # Check time limit
        current_time = datetime.now()
        trade_duration = current_time - self.state.entry_time
        if trade_duration.total_seconds() / 3600 >= self.config.max_trade_hours:
            return "TIME_LIMIT"
        
        # TODO: Implement P&L calculation using MT5 order_calc_profit
        # For now, using simplified exit logic
        
        return None
    
    def _process_market_data(self, candle: MarketData) -> Optional[TradeSignal]:
        """Process market data for pairs trading"""
        # This method processes data for the primary symbol (pair)
        # In a full implementation, we'd need data from both symbols
        
        # For now, assume this is symbol1 data
        self.add_candle_data(self.symbol1, candle)
        
        # Check if we have sufficient data
        if (len(self.state.s1_candles) < self.config.rsi_period + 1 or 
            len(self.state.s2_candles) < self.config.rsi_period + 1):
            return None
        
        indicators = self.calculate_indicators()
        
        # Check exit conditions first
        if self.state.in_trade:
            exit_reason = self.check_exit_conditions()
            if exit_reason:
                self.state.in_trade = False
                self.state.entry_time = None
                
                return TradeSignal(
                    action="CLOSE_ALL",
                    lot_size=0,
                    reason=f"Exit: {exit_reason}"
                )
        
        # Check entry conditions
        if not self.state.in_trade:
            trade_type = self.check_entry_conditions(indicators)
            if trade_type:
                # Check capital allocation risk before trading
                if self.check_capital_allocation_risk():
                    return None
                
                # Calculate lot sizes with capital allocation
                s1_lots, s2_lots = self.calculate_lot_sizes(
                    indicators['s1_atr'], indicators['s2_atr']
                )
                
                # Store trade state
                self.state.in_trade = True
                self.state.entry_time = datetime.now()
                self.state.entry_price_s1 = candle.close
                self.state.entry_price_s2 = self.state.s2_candles[-1]['close'] if self.state.s2_candles else candle.close
                self.state.lot_size_s1 = s1_lots
                self.state.lot_size_s2 = s2_lots
                self.state.trade_direction = trade_type
                
                logger.info(f"RSI Pairs Entry: {trade_type} {self.symbol1}({s1_lots}) + {self.symbol2}({s2_lots})")
                
                # Return signal for symbol1 (in full implementation, would handle both symbols)
                action = "BUY" if trade_type == "long" else "SELL"
                return TradeSignal(
                    action=action,
                    lot_size=s1_lots,
                    reason=f"RSI Pairs {trade_type}: RSI1={indicators['s1_rsi']:.1f}, RSI2={indicators['s2_rsi']:.1f}"
                )
        
        return None
    
    def process_symbol_data(self, symbol: str, candle: MarketData) -> Optional[TradeSignal]:
        """Process data for specific symbol in pairs trading"""
        self.add_candle_data(symbol, candle)
        
        # Only process signals when we have data from both symbols
        if symbol == self.symbol1:
            return self._process_market_data(candle)
        
        return None
    
    def get_strategy_status(self) -> Dict[str, Any]:
        """Get current strategy status with capital allocation"""
        indicators = self.calculate_indicators()
        
        # Get capital allocation status
        risk_status = self.get_risk_status()
        capital_info = {
            'allocated_capital': float(self.allocated_capital),
            'can_trade': self.can_trade(),
            'risk_status': risk_status if risk_status and 'error' not in risk_status else None
        }
        
        return {
            'mode': self.config.mode,
            'symbols': f"{self.symbol1}/{self.symbol2}",
            'in_trade': self.state.in_trade,
            'trade_direction': self.state.trade_direction,
            'entry_time': self.state.entry_time.isoformat() if self.state.entry_time else None,
            'indicators': indicators,
            's1_candles': len(self.state.s1_candles),
            's2_candles': len(self.state.s2_candles),
            'lot_sizes': {
                's1': self.state.lot_size_s1,
                's2': self.state.lot_size_s2
            },
            'capital_allocation': capital_info
        }
    
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
            return self.config.base_lot_size
        
        # Use 1% of allocated capital per trade as base
        risk_per_trade = float(self.allocated_capital) * 0.01
        
        # Adjust lot size based on risk (simplified)
        # In production, this would consider stop loss distance
        adjusted_lot_size = max(0.01, min(risk_per_trade / 1000, self.config.base_lot_size * 2))
        
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
        """Reset strategy state"""
        logger.info("Resetting RSI Pairs strategy state")
        self.state = RSIPairsState()
        self._initialize_capital_allocation()