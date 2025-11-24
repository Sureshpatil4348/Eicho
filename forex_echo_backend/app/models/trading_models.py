"""Business models for trading domain - Pydantic"""

from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum

class TradeDirection(str, Enum):
    BUY = "BUY"
    SELL = "SELL"

class SetupState(str, Enum):
    WAITING_FOR_TRIGGER = "WAITING_FOR_TRIGGER"
    WAITING_FOR_ZSCORE = "WAITING_FOR_ZSCORE"
    TRADE_EXECUTED = "TRADE_EXECUTED"

class TradingConfig(BaseModel):
    """Dynamic trading configuration"""
    lot_size: float = 0.01
    percentage_threshold: float = 2.0
    zscore_threshold_buy: float = -3.0
    zscore_threshold_sell: float = 3.0
    max_grid_trades: int = 5
    take_profit_percent: float = 1.0

class TradingSession(BaseModel):
    """Trading session business model"""
    session_id: str
    user_id: str
    active_pairs: List[str] = []
    active_timeframes: List[str] = []
    active_strategies: Dict[str, Any] = {}
    is_active: bool = True
    mt5_connected: bool = False
    created_at: datetime
    last_activity: datetime
    session_data: Dict[str, Any] = {}

class TradingTask(BaseModel):
    """Trading task business model"""
    task_id: str
    session_id: str
    pair: str
    timeframe: str
    strategy_name: str
    config: Dict[str, Any]
    is_active: bool = True

class TradeSignal(BaseModel):
    """Trade signal business model"""
    action: str
    lot_size: float
    take_profit: Optional[float] = None
    reason: str = ""

class MarketData(BaseModel):
    """Market candle data"""
    timestamp: int
    open: float
    high: float
    low: float
    close: float
    volume: int = 0