"""Database entities for capital allocation and risk control - SQLAlchemy ORM"""

from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
from datetime import datetime, timezone

class PortfolioEntity(Base):
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=False)
    total_capital = Column(DECIMAL(15, 2), nullable=False)
    available_capital = Column(DECIMAL(15, 2), nullable=False)
    allocated_capital = Column(DECIMAL(15, 2), default=0.00)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    strategy_allocations = relationship("StrategyAllocationEntity", back_populates="portfolio")

class StrategyAllocationEntity(Base):
    __tablename__ = "strategy_allocations"
    
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    strategy_name = Column(String(100), nullable=False)
    allocation_percentage = Column(DECIMAL(5, 2), nullable=False)  # e.g., 20.00 for 20%
    allocated_capital = Column(DECIMAL(15, 2), nullable=False)
    used_capital = Column(DECIMAL(15, 2), default=0.00)
    realized_pnl = Column(DECIMAL(15, 2), default=0.00)
    floating_pnl = Column(DECIMAL(15, 2), default=0.00)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    portfolio = relationship("PortfolioEntity", back_populates="strategy_allocations")
    pair_allocations = relationship("PairAllocationEntity", back_populates="strategy_allocation")

class PairAllocationEntity(Base):
    __tablename__ = "pair_allocations"
    
    id = Column(Integer, primary_key=True, index=True)
    strategy_allocation_id = Column(Integer, ForeignKey("strategy_allocations.id"))
    pair = Column(String(50), nullable=False)
    allocated_capital = Column(DECIMAL(15, 2), nullable=False)
    used_capital = Column(DECIMAL(15, 2), default=0.00)
    realized_pnl = Column(DECIMAL(15, 2), default=0.00)
    floating_pnl = Column(DECIMAL(15, 2), default=0.00)
    floating_loss_threshold_pct = Column(DECIMAL(5, 2), default=20.00)  # 20% default
    is_active = Column(Boolean, default=True)
    risk_breached = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    strategy_allocation = relationship("StrategyAllocationEntity", back_populates="pair_allocations")

class RiskEventEntity(Base):
    __tablename__ = "risk_events"
    
    id = Column(Integer, primary_key=True, index=True)
    pair_allocation_id = Column(Integer, ForeignKey("pair_allocations.id"))
    event_type = Column(String(50), nullable=False)  # FLOATING_LOSS_BREACH, CAPITAL_EXHAUSTION
    trigger_value = Column(DECIMAL(15, 2), nullable=False)
    threshold_value = Column(DECIMAL(15, 2), nullable=False)
    action_taken = Column(String(100), nullable=False)  # CLOSE_ALL_TRADES
    trades_closed = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))