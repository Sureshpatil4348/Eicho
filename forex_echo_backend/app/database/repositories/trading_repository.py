"""Trading repository - Data access layer"""

from sqlalchemy.orm import Session
from typing import List, Optional
from ..entities.trading_entity import TradingSessionEntity, TradingTaskEntity, TradeEntity
from ...models.trading_models import TradingSession, TradingTask

class TradingRepository:
    """Professional data access layer for trading operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def save_session(self, session: TradingSession) -> TradingSessionEntity:
        """Save trading session to database"""
        entity = TradingSessionEntity(
            session_id=session.session_id,
            user_id=session.user_id,
            active_pairs=session.active_pairs,
            active_timeframes=session.active_timeframes,
            active_strategies=session.active_strategies,
            is_active=session.is_active,
            mt5_connected=session.mt5_connected,
            created_at=session.created_at,
            last_activity=session.last_activity
        )
        self.db.add(entity)
        self.db.commit()
        return entity
    
    def get_session(self, session_id: str) -> Optional[TradingSessionEntity]:
        """Get session by ID"""
        return self.db.query(TradingSessionEntity).filter(
            TradingSessionEntity.session_id == session_id
        ).first()
    
    def save_task(self, task: TradingTask) -> TradingTaskEntity:
        """Save trading task to database"""
        entity = TradingTaskEntity(
            task_id=task.task_id,
            session_id=task.session_id,
            pair=task.pair,
            timeframe=task.timeframe,
            strategy_name=task.strategy_name,
            config=task.config,
            is_active=task.is_active
        )
        self.db.add(entity)
        self.db.commit()
        return entity
    
    def get_active_tasks(self, session_id: str) -> List[TradingTaskEntity]:
        """Get active tasks for session"""
        return self.db.query(TradingTaskEntity).filter(
            TradingTaskEntity.session_id == session_id,
            TradingTaskEntity.is_active == True
        ).all()
    
    def deactivate_task(self, task_id: str) -> bool:
        """Deactivate trading task"""
        task = self.db.query(TradingTaskEntity).filter(
            TradingTaskEntity.task_id == task_id
        ).first()
        
        if task:
            task.is_active = False
            self.db.commit()
            return True
        return False