from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Optional, List, Dict
import json
from datetime import datetime
from app.database.entities.trading_entity import TradingSessionEntity, TradingTaskEntity, TradeEntity
from app.models.trading_models import TradingSession
from app.utilities.forex_logger import forex_logger
from app.utilities.connection_decorator import prevent_db_entry_without_connection
from app.database.database import Base
import config

logger = forex_logger.get_logger(__name__)

class SessionPersistenceService:
    """Service for persisting trading sessions to database"""
    
    def __init__(self):
        # Force SSL connection for Azure MySQL
        db_url = f"mysql+pymysql://{config.MYSQL_USER}:{config.MYSQL_PASSWORD}@{config.MYSQL_HOST}:{config.MYSQL_PORT}/{config.MYSQL_DB}"
        connect_args = {
            "ssl": {
                "ssl_disabled": False,
                "check_hostname": False,
                "verify_mode": 0
            }
        }
        self.engine = create_engine(db_url, echo=False, connect_args=connect_args)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        
        # Create tables if they don't exist
        try:
            Base.metadata.create_all(bind=self.engine)
            logger.info("Database tables created/verified")
        except Exception as e:
            logger.error(f"Error creating database tables: {e}")
    
    def save_session(self, session: TradingSession) -> bool:
        """Save or update trading session to database"""
        try:
            with self.SessionLocal() as db:
                # Check if session exists
                existing = db.query(TradingSessionEntity).filter(
                    TradingSessionEntity.session_id == session.session_id
                ).first()
                
                if existing:
                    # Update existing session
                    existing.active_pairs = json.dumps(session.active_pairs)
                    existing.active_timeframes = json.dumps(session.active_timeframes)
                    existing.active_strategies = json.dumps(session.active_strategies)
                    existing.session_data = json.dumps(session.session_data)
                    existing.is_active = session.is_active
                    existing.mt5_connected = session.mt5_connected
                    existing.last_activity = session.last_activity
                else:
                    # Create new session
                    db_session = TradingSessionEntity(
                        session_id=session.session_id,
                        user_id=session.user_id,
                        active_pairs=json.dumps(session.active_pairs),
                        active_timeframes=json.dumps(session.active_timeframes),
                        active_strategies=json.dumps(session.active_strategies),
                        session_data=json.dumps(session.session_data),
                        is_active=session.is_active,
                        mt5_connected=session.mt5_connected,
                        created_at=session.created_at,
                        last_activity=session.last_activity
                    )
                    db.add(db_session)
                
                db.commit()
                logger.info(f"Session {session.session_id} saved to database")
                return True
                
        except Exception as e:
            logger.error(f"Error saving session to database: {e}")
            return False
    
    def load_session(self, session_id: str) -> Optional[TradingSession]:
        """Load trading session from database"""
        try:
            with self.SessionLocal() as db:
                db_session = db.query(TradingSessionEntity).filter(
                    TradingSessionEntity.session_id == session_id
                ).first()
                
                if not db_session:
                    return None
                
                # Convert to TradingSession object
                session = TradingSession(
                    session_id=db_session.session_id,
                    user_id=db_session.user_id,
                    active_pairs=json.loads(db_session.active_pairs) if db_session.active_pairs else [],
                    active_timeframes=json.loads(db_session.active_timeframes) if db_session.active_timeframes else [],
                    active_strategies=json.loads(db_session.active_strategies) if db_session.active_strategies else {},
                    created_at=db_session.created_at,
                    last_activity=db_session.last_activity,
                    is_active=db_session.is_active,
                    mt5_connected=db_session.mt5_connected,
                    session_data=json.loads(db_session.session_data) if db_session.session_data else {}
                )
                
                logger.info(f"Session {session_id} loaded from database")
                return session
                
        except Exception as e:
            logger.error(f"Error loading session from database: {e}")
            return None
    
    def get_user_sessions(self, user_id: str, active_only: bool = True) -> List[TradingSession]:
        """Get all sessions for a user"""
        try:
            with self.SessionLocal() as db:
                query = db.query(TradingSessionEntity).filter(TradingSessionEntity.user_id == user_id)
                
                if active_only:
                    query = query.filter(TradingSessionEntity.is_active == True)
                
                db_sessions = query.all()
                
                sessions = []
                for db_session in db_sessions:
                    session = TradingSession(
                        session_id=db_session.session_id,
                        user_id=db_session.user_id,
                        active_pairs=json.loads(db_session.active_pairs) if db_session.active_pairs else [],
                        active_timeframes=json.loads(db_session.active_timeframes) if db_session.active_timeframes else [],
                        active_strategies=json.loads(db_session.active_strategies) if db_session.active_strategies else {},
                        created_at=db_session.created_at,
                        last_activity=db_session.last_activity,
                        is_active=db_session.is_active,
                        mt5_connected=db_session.mt5_connected,
                        session_data=json.loads(db_session.session_data) if db_session.session_data else {}
                    )
                    sessions.append(session)
                
                return sessions
                
        except Exception as e:
            logger.error(f"Error getting user sessions: {e}")
            return []
    
    def save_trading_task(self, task_id: str, session_id: str, pair: str, 
                         timeframe: str, strategy_name: str, config: dict) -> bool:
        """Save trading task to database"""
        try:
            with self.SessionLocal() as db:
                # Check if task exists
                existing = db.query(TradingTaskEntity).filter(
                    TradingTaskEntity.task_id == task_id
                ).first()
                
                if existing:
                    # Update existing task
                    existing.config = json.dumps(config)
                    existing.is_active = True
                    existing.updated_at = datetime.now()
                else:
                    # Create new task
                    db_task = TradingTaskEntity(
                        task_id=task_id,
                        session_id=session_id,
                        pair=pair,
                        timeframe=timeframe,
                        strategy_name=strategy_name,
                        config=json.dumps(config),
                        is_active=True
                    )
                    db.add(db_task)
                
                db.commit()
                logger.info(f"Trading task {task_id} saved to database")
                return True
                
        except Exception as e:
            logger.error(f"Error saving trading task: {e}")
            return False
    
    def deactivate_trading_task(self, task_id: str) -> bool:
        """Deactivate trading task"""
        try:
            with self.SessionLocal() as db:
                task = db.query(TradingTaskEntity).filter(
                    TradingTaskEntity.task_id == task_id
                ).first()
                
                if task:
                    task.is_active = False
                    task.updated_at = datetime.now()
                    db.commit()
                    logger.info(f"Trading task {task_id} deactivated")
                    return True
                
                return False
                
        except Exception as e:
            logger.error(f"Error deactivating trading task: {e}")
            return False
    
    def get_active_tasks_for_session(self, session_id: str) -> List[Dict]:
        """Get active trading tasks for session"""
        try:
            with self.SessionLocal() as db:
                tasks = db.query(TradingTaskEntity).filter(
                    TradingTaskEntity.session_id == session_id,
                    TradingTaskEntity.is_active == True
                ).all()
                
                return [task.to_dict() for task in tasks]
                
        except Exception as e:
            logger.error(f"Error getting active tasks: {e}")
            return []
    
    @prevent_db_entry_without_connection
    def log_trade(self, session_id: str, task_id: str, pair: str, action: str,
                  lot_size: float, price: float = None, take_profit: float = None,
                  stop_loss: float = None, reason: str = None, mt5_ticket: str = None,
                  status: str = 'PENDING') -> bool:
        """Log trade to database"""
        try:
            with self.SessionLocal() as db:
                trade_log = TradeEntity(
                    session_id=session_id,
                    task_id=task_id,
                    pair=pair,
                    action=action,
                    lot_size=lot_size,
                    price=price,
                    take_profit=take_profit,
                    stop_loss=stop_loss,
                    reason=reason,
                    mt5_ticket=mt5_ticket,
                    status=status
                )
                
                db.add(trade_log)
                db.commit()
                logger.info(f"Trade logged: {action} {lot_size} {pair}")
                return True
                
        except Exception as e:
            logger.error(f"Error logging trade: {e}")
            return False

# Global instance
session_persistence = SessionPersistenceService()