"""Strategy Adapter for Capital Allocation Integration"""

from typing import Optional
from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.trading_models import MarketData, TradeSignal
from app.services.base_strategy import BaseStrategy
from app.services.gold_buy_dip_strategy import GoldBuyDipStrategy
from app.models.strategy_models import GoldBuyDipConfig
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

class CapitalAllocatedGoldStrategy(BaseStrategy):
    """Gold strategy with full capital allocation integration"""
    
    def __init__(self, config: dict, pair: str, timeframe: str, db: Session):
        super().__init__(pair, timeframe, "gold_buy_dip", db)
        
        # Convert dict config to GoldBuyDipConfig
        self.gold_config = GoldBuyDipConfig(**config)
        
        # Create the actual strategy instance
        self.strategy = GoldBuyDipStrategy(self.gold_config, pair, timeframe, db)
        
        logger.info(f"Capital allocated gold strategy initialized for {pair} {timeframe}")
    
    def _process_market_data(self, candle: MarketData) -> Optional[TradeSignal]:
        """Process market data through the gold strategy"""
        return self.strategy._process_market_data(candle)
    
    def reset_strategy(self):
        """Reset strategy state"""
        self.strategy.reset_strategy()
    
    def get_strategy_status(self) -> dict:
        """Get strategy status including grid info"""
        return {
            "grid_status": self.strategy.get_grid_status(),
            "risk_status": self.get_risk_status(),
            "candles_loaded": len(self.strategy.candles),
            "setup_state": self.strategy.state.setup_state.value if self.strategy.state.setup_state else "UNKNOWN"
        }

def create_strategy(strategy_name: str, config: dict, pair: str, timeframe: str, db: Session) -> BaseStrategy:
    """Factory function to create strategies with capital allocation"""
    
    if strategy_name == "gold_buy_dip":
        return CapitalAllocatedGoldStrategy(config, pair, timeframe, db)
    
    # Add more strategies here as needed
    # elif strategy_name == "simple_ma":
    #     return CapitalAllocatedMAStrategy(config, pair, timeframe, db)
    
    else:
        raise ValueError(f"Unknown strategy: {strategy_name}")