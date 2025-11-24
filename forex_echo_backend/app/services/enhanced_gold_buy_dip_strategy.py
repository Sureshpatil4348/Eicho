from app.services.gold_buy_dip_strategy import GoldBuyDipStrategy
from app.core.strategy_manager import BaseStrategy
from app.models.strategy_models import GoldBuyDipConfig
from app.models.trading_models import MarketData
from app.utilities.forex_logger import forex_logger
from app.database.database import SessionLocal
from app.services.capital_allocation_service import CapitalAllocationService

logger = forex_logger.get_logger(__name__)

class EnhancedGoldBuyDipStrategy(BaseStrategy):
    """Enhanced Gold Buy Dip Strategy with BaseStrategy interface"""
    
    def __init__(self, config: dict, pair: str, timeframe: str, session_id: str = None):
        super().__init__(config, timeframe)
        self.pair = pair
        self.session_id = session_id
        
        # Convert dict config to GoldBuyDipConfig
        gold_config = GoldBuyDipConfig(
            lot_size=config.get('lot_size', 0.01),
            percentage_threshold=config.get('percentage_threshold', 2.0),
            zscore_threshold_buy=config.get('zscore_threshold_buy', -3.0),
            zscore_threshold_sell=config.get('zscore_threshold_sell', 3.0),
            zscore_period=config.get('zscore_period', 20),
            lookback_candles=config.get('lookback_candles', 50),
            use_grid_trading=config.get('use_grid_trading', True),
            max_grid_trades=config.get('max_grid_trades', 5),
            grid_percent=config.get('grid_percent', 0.5),
            use_grid_percent=config.get('use_grid_percent', True),
            grid_atr_multiplier=config.get('grid_atr_multiplier', 1.0),
            atr_period=config.get('atr_period', 14),
            grid_lot_multiplier=config.get('grid_lot_multiplier', 1.0),
            use_progressive_lots=config.get('use_progressive_lots', False),
            lot_progression_factor=config.get('lot_progression_factor', 1.2),
            take_profit_percent=config.get('take_profit_percent', 1.0),
            use_take_profit_percent=config.get('use_take_profit_percent', True),
            take_profit=config.get('take_profit', 100),
            max_drawdown_percent=config.get('max_drawdown_percent', 50.0),
            zscore_wait_candles=config.get('zscore_wait_candles', 5)
        )
        
        # Get database session for strategy
        try:
            self.db_session = SessionLocal()
            self.capital_service = CapitalAllocationService(self.db_session) if self.db_session else None
        except Exception as e:
            logger.warning(f"Could not get database session: {e}")
            self.db_session = None
            self.capital_service = None
        
        # Check for capital allocation and adjust lot size
        if self.session_id and self.capital_service:
            try:
                allocation_info = self.capital_service.get_capital_allocation_for_trading(
                    self.session_id, pair, "gold_buy_dip"
                )
                if allocation_info and allocation_info.get('suggested_lot_size'):
                    gold_config.lot_size = allocation_info['suggested_lot_size']
                    logger.info(f"Using capital-allocated lot size: {gold_config.lot_size}")
            except Exception as e:
                logger.warning(f"Could not get capital allocation: {e}")
        
        self.strategy = GoldBuyDipStrategy(gold_config, pair, timeframe, self.db_session)
        logger.info(f"Enhanced Gold Buy Dip Strategy initialized for {timeframe} with lot size {gold_config.lot_size}")
    
    def process_tick(self, candle, current_equity: float = 0):
        """Process market tick using underlying strategy with capital allocation checks"""
        from decimal import Decimal
        
        # Check capital allocation risk before trading
        if self.session_id and self.capital_service:
            try:
                allocation_info = self.capital_service.get_capital_allocation_for_trading(
                    self.session_id, self.pair, "gold_buy_dip"
                )
                if allocation_info and not allocation_info.get('can_trade', True):
                    logger.warning(f"Trading blocked due to risk breach for {self.pair}")
                    return None
            except Exception as e:
                logger.warning(f"Could not check capital allocation: {e}")
        
        return self.strategy.process_tick(candle, Decimal('0.00'), Decimal('0.00'))
    
    def reset_strategy(self):
        """Reset strategy state"""
        self.strategy.reset_strategy()
    
    def get_status(self) -> dict:
        """Get current strategy status"""
        return {
            'name': self.name,
            'timeframe': self.timeframe,
            'setup_state': self.strategy.state.setup_state.value if self.strategy.state.setup_state else 'WAITING',
            'grid_status': self.strategy.get_grid_status(),
            'candles_loaded': len(self.strategy.candles),
            'trigger_direction': self.strategy.state.trigger_direction.value if self.strategy.state.trigger_direction else None,
            'initial_balance': self.strategy.state.initial_balance
        }