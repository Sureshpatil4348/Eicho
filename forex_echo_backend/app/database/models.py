"""Main models file - imports from entities (Professional forex architecture)"""

# Import database entities
from .entities.auth_entity import AuthEntity, PasswordResetTokenEntity
from .entities.trading_entity import TradingSessionEntity, TradingTaskEntity, TradeEntity
from .entities.strategy_entity import CustomStrategyEntity

# Backward compatibility aliases
Auth = AuthEntity
PasswordResetToken = PasswordResetTokenEntity
TradingSession = TradingSessionEntity
TradingTask = TradingTaskEntity
Trade = TradeEntity
CustomStrategy = CustomStrategyEntity

# Export all entities
__all__ = [
    'AuthEntity', 'PasswordResetTokenEntity', 'TradingSessionEntity', 
    'TradingTaskEntity', 'TradeEntity', 'CustomStrategyEntity',
    'Auth', 'PasswordResetToken', 'TradingSession', 'TradingTask', 'Trade', 'CustomStrategy'
]