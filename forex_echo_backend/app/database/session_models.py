from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import json

Base = declarative_base()

class TradingSessionDB(Base):
    __tablename__ = 'trading_sessions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(255), unique=True, nullable=False, index=True)
    user_id = Column(String(255), nullable=False, index=True)
    active_pairs = Column(Text)  # JSON string
    active_timeframes = Column(Text)  # JSON string
    active_strategies = Column(Text)  # JSON string
    session_data = Column(Text)  # JSON string for additional data
    is_active = Column(Boolean, default=True)
    mt5_connected = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    last_activity = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        return {
            'session_id': self.session_id,
            'user_id': self.user_id,
            'active_pairs': json.loads(self.active_pairs) if self.active_pairs else [],
            'active_timeframes': json.loads(self.active_timeframes) if self.active_timeframes else [],
            'active_strategies': json.loads(self.active_strategies) if self.active_strategies else {},
            'session_data': json.loads(self.session_data) if self.session_data else {},
            'is_active': self.is_active,
            'mt5_connected': self.mt5_connected,
            'created_at': self.created_at,
            'last_activity': self.last_activity
        }

class TradingTaskDB(Base):
    __tablename__ = 'trading_tasks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String(255), unique=True, nullable=False, index=True)
    session_id = Column(String(255), nullable=False, index=True)
    pair = Column(String(50), nullable=False)
    timeframe = Column(String(10), nullable=False)
    strategy_name = Column(String(100), nullable=False)
    config = Column(Text)  # JSON string
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    last_activity = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        return {
            'task_id': self.task_id,
            'session_id': self.session_id,
            'pair': self.pair,
            'timeframe': self.timeframe,
            'strategy_name': self.strategy_name,
            'config': json.loads(self.config) if self.config else {},
            'is_active': self.is_active,
            'created_at': self.created_at,
            'last_activity': self.last_activity
        }

class TradeLogDB(Base):
    __tablename__ = 'trade_logs'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(255), nullable=False, index=True)
    task_id = Column(String(255), nullable=False, index=True)
    pair = Column(String(50), nullable=False)
    action = Column(String(20), nullable=False)  # BUY, SELL, CLOSE_ALL
    lot_size = Column(Float, nullable=False)
    price = Column(Float)
    take_profit = Column(Float)
    stop_loss = Column(Float)
    reason = Column(Text)
    mt5_ticket = Column(String(50))
    status = Column(String(20), default='PENDING')  # PENDING, EXECUTED, FAILED
    created_at = Column(DateTime, server_default=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'task_id': self.task_id,
            'pair': self.pair,
            'action': self.action,
            'lot_size': self.lot_size,
            'price': self.price,
            'take_profit': self.take_profit,
            'stop_loss': self.stop_loss,
            'reason': self.reason,
            'mt5_ticket': self.mt5_ticket,
            'status': self.status,
            'created_at': self.created_at
        }