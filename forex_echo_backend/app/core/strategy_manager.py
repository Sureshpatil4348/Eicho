from typing import Dict, List, Optional, Type
from abc import ABC, abstractmethod
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

class BaseStrategy(ABC):
    """Base class for all trading strategies"""
    
    def __init__(self, config: dict, timeframe: str):
        self.config = config
        self.timeframe = timeframe
        self.name = self.__class__.__name__
    
    @abstractmethod
    def process_tick(self, candle, current_equity: float = 0):
        """Process market tick and return signal if any"""
        pass
    
    @abstractmethod
    def reset_strategy(self):
        """Reset strategy state"""
        pass
    
    @abstractmethod
    def get_status(self) -> dict:
        """Get current strategy status"""
        pass

class StrategyManager:
    """Manages all available trading strategies"""
    
    def __init__(self):
        self.strategies: Dict[str, Type[BaseStrategy]] = {}
        self.strategy_configs: Dict[str, dict] = {}
        logger.info("StrategyManager initialized")
    
    def register_strategy(self, name: str, strategy_class: Type[BaseStrategy], default_config: dict = None):
        """Register a new strategy"""
        self.strategies[name] = strategy_class
        if default_config:
            self.strategy_configs[name] = default_config
        logger.info(f"Registered strategy: {name}")
    
    def get_available_strategies(self) -> List[str]:
        """Get list of available strategies"""
        return list(self.strategies.keys())
    
    def get_strategy_config(self, name: str) -> Optional[dict]:
        """Get default configuration for strategy"""
        return self.strategy_configs.get(name)
    
    def create_strategy_instance(self, name: str, config: dict, pair: str, timeframe: str) -> Optional[BaseStrategy]:
        """Create strategy instance with config"""
        strategy_class = self.strategies.get(name)
        if not strategy_class:
            logger.error(f"Strategy {name} not found")
            return None
        
        try:
            return strategy_class(config, pair, timeframe)
        except Exception as e:
            logger.error(f"Error creating strategy {name}: {e}")
            return None
    
    def validate_strategy_config(self, name: str, config: dict) -> tuple[bool, str]:
        """Validate strategy configuration"""
        if name not in self.strategies:
            return False, f"Strategy {name} not found"
        
        # Basic validation - can be extended per strategy
        required_fields = ['lot_size']
        for field in required_fields:
            if field not in config:
                return False, f"Missing required field: {field}"
        
        return True, "Configuration valid"

# Global strategy manager instance
strategy_manager = StrategyManager()