"""Strategy-specific models for trading strategies"""

from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from datetime import datetime
from app.models.trading_models import TradeDirection, SetupState

class GoldBuyDipConfig(BaseModel):
    """Configuration for Gold Buy Dip Strategy"""
    lot_size: float = 0.01
    percentage_threshold: float = 2.0
    zscore_threshold_buy: float = -3.0
    zscore_threshold_sell: float = 3.0
    zscore_period: int = 20
    lookback_candles: int = 50
    use_grid_trading: bool = True
    max_grid_trades: int = 5
    grid_percent: float = 0.5
    use_grid_percent: bool = True
    grid_atr_multiplier: float = 1.0
    atr_period: int = 14
    grid_lot_multiplier: float = 1.0
    use_progressive_lots: bool = False
    lot_progression_factor: float = 1.2
    take_profit_percent: float = 1.0
    use_take_profit_percent: bool = True
    take_profit: float = 100
    max_drawdown_percent: float = 50.0
    zscore_wait_candles: int = 5

class GoldBuyDipState:
    """State management for Gold Buy Dip Strategy"""
    def __init__(self):
        self.setup_state: SetupState = SetupState.WAITING_FOR_TRIGGER
        self.trigger_direction: Optional[TradeDirection] = None
        self.trigger_candle: int = 0
        self.wait_candles_count: int = 0
        self.grid_trades: List[dict] = []
        self.initial_balance: float = 0.0

class RSIPairsConfig(BaseModel):
    """Configuration for RSI Pairs Trading Strategy"""
    mode: str = "negative"  # "positive" or "negative"
    symbol1: str  # No default - user must specify
    symbol2: str  # No default - user must specify
    rsi_period: int = 14
    atr_period: int = 5
    rsi_overbought: float = 75.0
    rsi_oversold: float = 25.0
    profit_target_usd: float = 500.0
    stop_loss_usd: float = -15000.0
    max_trade_hours: float = 2400.0
    base_lot_size: float = 1.0

class RSIPairsState:
    """State management for RSI Pairs Strategy"""
    def __init__(self):
        self.in_trade: bool = False
        self.entry_time: Optional[datetime] = None
        self.entry_price_s1: float = 0.0
        self.entry_price_s2: float = 0.0
        self.lot_size_s1: float = 0.0
        self.lot_size_s2: float = 0.0
        self.trade_direction: str = ""  # "long" or "short"
        self.s1_candles: List[dict] = []
        self.s2_candles: List[dict] = []