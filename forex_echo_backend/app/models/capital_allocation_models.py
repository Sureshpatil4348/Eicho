"""Business models for capital allocation and risk control - Pydantic"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
from decimal import Decimal
from enum import Enum

class RiskEventType(str, Enum):
    FLOATING_LOSS_BREACH = "FLOATING_LOSS_BREACH"
    CAPITAL_EXHAUSTION = "CAPITAL_EXHAUSTION"

class Portfolio(BaseModel):
    """Portfolio business model"""
    id: Optional[int] = None
    user_id: str
    total_capital: Decimal
    available_capital: Decimal
    allocated_capital: Decimal = Decimal('0.00')
    is_active: bool = True

class StrategyAllocation(BaseModel):
    """Strategy allocation business model"""
    id: Optional[int] = None
    portfolio_id: int
    strategy_name: str
    allocation_percentage: Decimal = Field(..., ge=0, le=100)
    allocated_capital: Decimal
    used_capital: Decimal = Decimal('0.00')
    realized_pnl: Decimal = Decimal('0.00')
    floating_pnl: Decimal = Decimal('0.00')
    is_active: bool = True

class PairAllocation(BaseModel):
    """Pair allocation business model"""
    id: Optional[int] = None
    strategy_allocation_id: int
    pair: str
    allocated_capital: Decimal
    used_capital: Decimal = Decimal('0.00')
    realized_pnl: Decimal = Decimal('0.00')
    floating_pnl: Decimal = Decimal('0.00')
    floating_loss_threshold_pct: Decimal = Decimal('20.00')
    is_active: bool = True
    risk_breached: bool = False

class RiskEvent(BaseModel):
    """Risk event business model"""
    id: Optional[int] = None
    pair_allocation_id: int
    event_type: RiskEventType
    trigger_value: Decimal
    threshold_value: Decimal
    action_taken: str
    trades_closed: int = 0

class CapitalAllocationConfig(BaseModel):
    """Configuration for capital allocation"""
    total_capital: Decimal
    strategy_allocations: Dict[str, Decimal]  # strategy_name -> percentage
    floating_loss_threshold_pct: Decimal = Decimal('20.00')
    
class RiskControlStatus(BaseModel):
    """Risk control status for monitoring"""
    pair: str
    strategy_name: str
    allocated_capital: Decimal
    used_capital: Decimal
    realized_pnl: Decimal
    floating_pnl: Decimal
    cumulative_loss: Decimal
    floating_loss_pct: Decimal
    capital_exhaustion_pct: Decimal
    risk_breached: bool
    can_trade: bool