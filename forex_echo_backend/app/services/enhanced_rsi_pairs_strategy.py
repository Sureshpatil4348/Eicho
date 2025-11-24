"""Enhanced RSI Pairs Strategy with BaseStrategy interface"""

from app.services.rsi_pairs_strategy import RSIPairsStrategy
from app.core.strategy_manager import BaseStrategy
from app.models.strategy_models import RSIPairsConfig
from app.models.trading_models import MarketData
from app.utilities.forex_logger import forex_logger
from app.database.database import SessionLocal

logger = forex_logger.get_logger(__name__)

class EnhancedRSIPairsStrategy(BaseStrategy):
    """Enhanced RSI Pairs Strategy with BaseStrategy interface"""
    
    def __init__(self, config: dict, pair: str, timeframe: str):
        super().__init__(config, timeframe)
        self.pair = pair
        
        # Convert dict config to RSIPairsConfig
        rsi_config = RSIPairsConfig(
            mode=config.get('mode', 'negative'),
            symbol1=config.get('symbol1', pair),
            symbol2=config.get('symbol2', pair),  # Use same pair as default, user must specify symbol2
            rsi_period=config.get('rsi_period', 14),
            atr_period=config.get('atr_period', 5),
            rsi_overbought=config.get('rsi_overbought', 75.0),
            rsi_oversold=config.get('rsi_oversold', 25.0),
            profit_target_usd=config.get('profit_target_usd', 500.0),
            stop_loss_usd=config.get('stop_loss_usd', -15000.0),
            max_trade_hours=config.get('max_trade_hours', 2400.0),
            base_lot_size=config.get('base_lot_size', 1.0)
        )
        
        # Get database session for strategy
        try:
            db_session = SessionLocal()
        except Exception as e:
            logger.warning(f"Could not get database session: {e}")
            db_session = None
        
        self.strategy = RSIPairsStrategy(rsi_config, pair, timeframe, db_session)
        logger.info(f"Enhanced RSI Pairs Strategy initialized for {timeframe}")
    
    def process_tick(self, candle, current_equity: float = 0):
        """Process market tick using underlying strategy"""
        from decimal import Decimal
        return self.strategy.process_tick(candle, Decimal('0.00'), Decimal('0.00'))
    
    def reset_strategy(self):
        """Reset strategy state"""
        self.strategy.reset_strategy()
    
    def get_status(self) -> dict:
        """Get current strategy status"""
        status = self.strategy.get_strategy_status()
        return {
            'name': self.name,
            'timeframe': self.timeframe,
            'pair': self.pair,
            **status
        }