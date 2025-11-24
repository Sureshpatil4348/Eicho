"""Risk Control Manager - Integrates with all trading strategies"""

from typing import Optional, Dict, Any
from decimal import Decimal
from sqlalchemy.orm import Session
from app.services.capital_allocation_service import CapitalAllocationService
from app.models.trading_models import TradeSignal
from app.models.capital_allocation_models import RiskEvent
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

class RiskControlManager:
    """Manages risk control across all strategies and pairs"""
    
    def __init__(self, db: Session = None):
        self.db = db
        self.capital_service = CapitalAllocationService(db) if db else None
    
    def check_trade_permission(self, pair: str, strategy_name: str) -> bool:
        """Check if trading is allowed for a pair/strategy combination"""
        if not self.capital_service:
            return True  # Allow trading if no capital service
            
        risk_status = self.capital_service.get_risk_status(pair, strategy_name)
        if not risk_status:
            logger.warning(f"No risk allocation found for {pair} in strategy {strategy_name}")
            return False
        
        return risk_status.can_trade
    
    def validate_trade_signal(self, pair: str, strategy_name: str, signal: TradeSignal, 
                            current_floating_pnl: Decimal = Decimal('0.00'),
                            current_realized_pnl: Decimal = Decimal('0.00')) -> Optional[TradeSignal]:
        """Validate trade signal against risk controls"""
        
        if not self.capital_service:
            return signal  # Return signal as-is if no capital service
        
        # Check if trading is allowed
        if not self.check_trade_permission(pair, strategy_name):
            logger.warning(f"Trade blocked for {pair} - Risk breach active")
            return TradeSignal(
                action="BLOCKED",
                lot_size=0,
                reason=f"Risk control: Trading blocked for {pair}"
            )
        
        # Check risk control before allowing new trades
        risk_triggered, risk_event = self.capital_service.check_risk_control(
            pair, strategy_name, current_floating_pnl, current_realized_pnl
        )
        
        if risk_triggered:
            logger.critical(f"Risk control triggered for {pair} - Overriding signal to CLOSE_ALL")
            return TradeSignal(
                action="CLOSE_ALL",
                lot_size=0,
                reason=f"Risk control triggered: {risk_event.event_type.value}"
            )
        
        # Signal is valid
        return signal
    
    def update_pnl(self, pair: str, strategy_name: str, floating_pnl: Decimal, realized_pnl: Decimal):
        """Update P&L and check risk controls"""
        if not self.capital_service:
            return None  # No risk control if no capital service
            
        risk_triggered, risk_event = self.capital_service.check_risk_control(
            pair, strategy_name, floating_pnl, realized_pnl
        )
        
        if risk_triggered:
            logger.critical(f"Risk control triggered during P&L update for {pair}: {risk_event.event_type.value}")
            return risk_event
        
        return None
    
    def get_risk_dashboard(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive risk dashboard"""
        portfolio_summary = self.capital_service.get_portfolio_summary(user_id)
        
        if not portfolio_summary:
            return {"error": "No portfolio found"}
        
        # Calculate overall risk metrics
        total_allocated = portfolio_summary["allocated_capital"]
        total_realized_pnl = 0
        total_floating_pnl = 0
        risk_breached_pairs = []
        
        for strategy_name, strategy_data in portfolio_summary["strategies"].items():
            total_realized_pnl += strategy_data["realized_pnl"]
            total_floating_pnl += strategy_data["floating_pnl"]
            
            for pair, pair_data in strategy_data["pairs"].items():
                if pair_data["risk_breached"]:
                    risk_breached_pairs.append(f"{pair} ({strategy_name})")
        
        total_pnl = total_realized_pnl + total_floating_pnl
        portfolio_pnl_pct = (total_pnl / total_allocated * 100) if total_allocated > 0 else 0
        
        return {
            "portfolio_summary": portfolio_summary,
            "risk_metrics": {
                "total_pnl": total_pnl,
                "portfolio_pnl_percentage": portfolio_pnl_pct,
                "realized_pnl": total_realized_pnl,
                "floating_pnl": total_floating_pnl,
                "risk_breached_pairs": risk_breached_pairs,
                "total_risk_breaches": len(risk_breached_pairs)
            }
        }
    
    def reset_all_risks(self, user_id: str) -> Dict[str, Any]:
        """Reset all risk breaches for a user (admin function)"""
        portfolio_summary = self.capital_service.get_portfolio_summary(user_id)
        reset_count = 0
        
        for strategy_name, strategy_data in portfolio_summary["strategies"].items():
            for pair in strategy_data["pairs"].keys():
                if self.capital_service.reset_pair_risk(pair, strategy_name):
                    reset_count += 1
        
        logger.info(f"Reset {reset_count} risk breaches for user {user_id}")
        return {"reset_count": reset_count, "message": f"Reset {reset_count} risk breaches"}