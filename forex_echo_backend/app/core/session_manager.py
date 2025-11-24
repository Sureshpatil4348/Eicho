import json
import threading
from typing import Dict, Optional, Any
from datetime import datetime, timedelta
from app.models.trading_models import TradingSession as TradingSessionModel
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

# Import persistence service (lazy import to avoid circular dependency)
def get_persistence_service():
    from app.services.session_persistence_service import session_persistence
    return session_persistence

# Use business model instead of dataclass
TradingSession = TradingSessionModel

class SessionManager:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.sessions: Dict[str, TradingSession] = {}
            self.session_lock = threading.RLock()
            self.initialized = True
            logger.info("SessionManager initialized")
    
    def create_session(self, session_id: str, user_id: str) -> TradingSession:
        """Create new trading session"""
        with self.session_lock:
            session = TradingSession(
                session_id=session_id,
                user_id=user_id,
                active_pairs=[],
                active_timeframes=[],
                active_strategies={},
                created_at=datetime.now(),
                last_activity=datetime.now(),
                is_active=True,
                mt5_connected=False,
                session_data={}
            )
            self.sessions[session_id] = session
            
            # Save to database
            try:
                persistence = get_persistence_service()
                persistence.save_session(session)
            except Exception as e:
                logger.error(f"Error saving session to database: {e}")
            
            logger.info(f"Created session {session_id} for user {user_id}")
            return session
    
    def get_session(self, session_id: str) -> Optional[TradingSession]:
        """Get existing session"""
        with self.session_lock:
            session = self.sessions.get(session_id)
            if session:
                # Create new instance with updated last_activity
                updated_session = session.model_copy(update={'last_activity': datetime.now()})
                self.sessions[session_id] = updated_session
                return updated_session
            return session
    
    def update_session(self, session_id: str, **kwargs) -> bool:
        """Update session data"""
        with self.session_lock:
            session = self.sessions.get(session_id)
            if not session:
                return False
            
            # Update with new values and last_activity
            kwargs['last_activity'] = datetime.now()
            updated_session = session.model_copy(update=kwargs)
            self.sessions[session_id] = updated_session
            
            # Save to database
            try:
                persistence = get_persistence_service()
                persistence.save_session(updated_session)
            except Exception as e:
                logger.error(f"Error updating session in database: {e}")
            
            logger.info(f"Updated session {session_id}: {kwargs}")
            return True
    
    def add_pair_to_session(self, session_id: str, pair: str) -> bool:
        """Add trading pair to session with validation"""
        with self.session_lock:
            session = self.sessions.get(session_id)
            if not session:
                return False
            
            # Validate pair format and availability
            if not self._is_valid_pair(pair):
                logger.warning(f"Invalid pair {pair} rejected for session {session_id}")
                raise ValueError(f"Invalid trading pair: {pair}. Only valid forex pairs allowed.")
            
            if pair not in session.active_pairs:
                new_pairs = session.active_pairs + [pair]
                updated_session = session.model_copy(update={
                    'active_pairs': new_pairs,
                    'last_activity': datetime.now()
                })
                self.sessions[session_id] = updated_session
                
                # Save to database
                try:
                    persistence = get_persistence_service()
                    persistence.save_session(updated_session)
                except Exception as e:
                    logger.error(f"Error saving session to database: {e}")
                
                logger.info(f"Added pair {pair} to session {session_id}")
            return True
    
    def remove_pair_from_session(self, session_id: str, pair: str) -> bool:
        """Remove trading pair from session"""
        with self.session_lock:
            session = self.sessions.get(session_id)
            if not session:
                return False
            
            if pair in session.active_pairs:
                new_pairs = [p for p in session.active_pairs if p != pair]
                updated_session = session.model_copy(update={
                    'active_pairs': new_pairs,
                    'last_activity': datetime.now()
                })
                self.sessions[session_id] = updated_session
                
                # Save to database
                try:
                    persistence = get_persistence_service()
                    persistence.save_session(updated_session)
                except Exception as e:
                    logger.error(f"Error saving session to database: {e}")
                
                logger.info(f"Removed pair {pair} from session {session_id}")
            return True
    
    def _is_valid_pair(self, pair: str) -> bool:
        """Validate trading pair"""
        # List of valid pairs
        valid_pairs = [
            "XAUUSD", "XAGUSD", "EURUSD", "GBPUSD", "USDJPY", "USDCHF", 
            "AUDUSD", "NZDUSD", "USDCAD", "EURGBP", "EURJPY", "GBPJPY",
            "EURCHF", "GBPCHF", "AUDCAD", "AUDCHF", "AUDJPY", "AUDNZD",
            "CADCHF", "CADJPY", "CHFJPY", "EURAUD", "EURCAD", "EURNZD",
            "GBPAUD", "GBPCAD", "GBPNZD", "NZDCAD", "NZDCHF", "NZDJPY"
        ]
        return pair.upper() in valid_pairs
    
    def add_timeframe_to_session(self, session_id: str, timeframe: str) -> bool:
        """Add timeframe to session"""
        with self.session_lock:
            session = self.sessions.get(session_id)
            if not session:
                return False
            
            if timeframe not in session.active_timeframes:
                new_timeframes = session.active_timeframes + [timeframe]
                updated_session = session.model_copy(update={
                    'active_timeframes': new_timeframes,
                    'last_activity': datetime.now()
                })
                self.sessions[session_id] = updated_session
                
                # Save to database
                try:
                    persistence = get_persistence_service()
                    persistence.save_session(updated_session)
                except Exception as e:
                    logger.error(f"Error saving session to database: {e}")
                
                logger.info(f"Added timeframe {timeframe} to session {session_id}")
            return True
    
    def set_strategy_config(self, session_id: str, strategy_name: str, config: dict) -> bool:
        """Set strategy configuration for session"""
        with self.session_lock:
            session = self.sessions.get(session_id)
            if not session:
                return False
            
            new_strategies = session.active_strategies.copy()
            new_strategies[strategy_name] = config
            updated_session = session.model_copy(update={
                'active_strategies': new_strategies,
                'last_activity': datetime.now()
            })
            self.sessions[session_id] = updated_session
            
            # Save to database
            try:
                persistence = get_persistence_service()
                persistence.save_session(updated_session)
            except Exception as e:
                logger.error(f"Error saving session to database: {e}")
            
            logger.info(f"Set strategy {strategy_name} config for session {session_id}")
            return True
    
    def cleanup_expired_sessions(self, expiry_hours: int = 24):
        """Clean up expired sessions"""
        with self.session_lock:
            current_time = datetime.now()
            expired_sessions = []
            
            for session_id, session in self.sessions.items():
                if current_time - session.last_activity > timedelta(hours=expiry_hours):
                    expired_sessions.append(session_id)
            
            for session_id in expired_sessions:
                del self.sessions[session_id]
                logger.info(f"Cleaned up expired session {session_id}")
    
    def get_all_active_sessions(self) -> Dict[str, TradingSession]:
        """Get all active sessions"""
        with self.session_lock:
            return {k: v for k, v in self.sessions.items() if v.is_active}