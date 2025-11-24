"""Base Strategy Class with integrated Risk Control"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.trading_models import MarketData, TradeSignal
from app.services.risk_control_manager import RiskControlManager
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

class BaseStrategy(ABC):
    """Base class for all trading strategies with integrated risk control"""
    
    def __init__(self, pair: str, timeframe: str, strategy_name: str, db: Session = None):
        self.pair = pair
        self.timeframe = timeframe
        self.strategy_name = strategy_name
        self.db = db
        self.risk_manager = RiskControlManager(db) if db else None
        self.current_floating_pnl = Decimal('0.00')
        self.current_realized_pnl = Decimal('0.00')
    
    @abstractmethod
    def _process_market_data(self, candle: MarketData) -> Optional[TradeSignal]:
        """Strategy-specific market data processing - to be implemented by each strategy"""
        pass
    
    def process_tick(self, candle: MarketData, floating_pnl: Decimal = Decimal('0.00'), 
                    realized_pnl: Decimal = Decimal('0.00')) -> Optional[TradeSignal]:
        """Main entry point - processes market data with risk control"""
        
        # Update current P&L
        self.current_floating_pnl = floating_pnl
        self.current_realized_pnl = realized_pnl
        
        # Update P&L in risk system and check for risk events (if risk manager available)
        if self.risk_manager:
            risk_event = self.risk_manager.update_pnl(
                self.pair, self.strategy_name, floating_pnl, realized_pnl
            )
            
            # If risk control triggered, override any strategy signal
            if risk_event:
                return TradeSignal(
                    action="CLOSE_ALL",
                    lot_size=0,
                    reason=f"Risk control: {risk_event.event_type.value}"
                )
        
        # Get strategy signal
        strategy_signal = self._process_market_data(candle)
        
        # If no signal from strategy, return None
        if not strategy_signal:
            return None
        
        # Validate signal through risk control (if risk manager available)
        if self.risk_manager:
            validated_signal = self.risk_manager.validate_trade_signal(
                self.pair, self.strategy_name, strategy_signal, 
                self.current_floating_pnl, self.current_realized_pnl
            )
            return validated_signal
        
        # Return strategy signal directly if no risk manager
        return strategy_signal
    
    def can_trade(self) -> bool:
        """Check if strategy can trade for this pair"""
        if not self.risk_manager:
            return True  # Allow trading if no risk manager (no database)
        return self.risk_manager.check_trade_permission(self.pair, self.strategy_name)
    
    def get_risk_status(self) -> Dict[str, Any]:
        """Get current risk status for this strategy/pair"""
        if not self.risk_manager:
            return {"error": "Risk manager not available (no database)"}
            
        risk_status = self.risk_manager.capital_service.get_risk_status(self.pair, self.strategy_name)
        if not risk_status:
            return {"error": "No risk allocation found"}
        
        return {
            "pair": risk_status.pair,
            "strategy": risk_status.strategy_name,
            "allocated_capital": float(risk_status.allocated_capital),
            "realized_pnl": float(risk_status.realized_pnl),
            "floating_pnl": float(risk_status.floating_pnl),
            "cumulative_loss": float(risk_status.cumulative_loss),
            "floating_loss_pct": float(risk_status.floating_loss_pct),
            "capital_exhaustion_pct": float(risk_status.capital_exhaustion_pct),
            "risk_breached": risk_status.risk_breached,
            "can_trade": risk_status.can_trade
        }
    
    @abstractmethod
    def reset_strategy(self):
        """Reset strategy-specific state - to be implemented by each strategy"""
        pass