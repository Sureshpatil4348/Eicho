"""Database entities for trading - SQLAlchemy ORM"""

from sqlalchemy import Column, Integer, String, Text, DECIMAL, DateTime, Boolean, JSON
from ..database import Base
from datetime import datetime, timezone

class TradingSessionEntity(Base):
    __tablename__ = "trading_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, nullable=False)
    user_id = Column(String(255), nullable=False)
    active_pairs = Column(JSON)
    active_timeframes = Column(JSON)
    active_strategies = Column(JSON)
    is_active = Column(Boolean, default=True)
    mt5_connected = Column(Boolean, default=False)
    session_data = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_activity = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class TradingTaskEntity(Base):
    __tablename__ = "trading_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String(255), unique=True, nullable=False)
    session_id = Column(String(255), nullable=False)
    pair = Column(String(50), nullable=False)
    timeframe = Column(String(10), nullable=False)
    strategy_name = Column(String(100), nullable=False)
    config = Column(JSON)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class TradeEntity(Base):
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), nullable=False)
    task_id = Column(String(255), nullable=False)
    pair = Column(String(50), nullable=False)
    action = Column(String(20), nullable=False)
    lot_size = Column(DECIMAL(10, 4))
    price = Column(DECIMAL(15, 5))
    take_profit = Column(DECIMAL(15, 5))
    reason = Column(Text)
    mt5_ticket = Column(String(100))
    status = Column(String(20))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))