"""Enhanced Capital Allocation and Risk Control Service with MT5 Integration"""

from typing import Dict, List, Optional, Tuple
from decimal import Decimal
from sqlalchemy.orm import Session
from app.database.entities.capital_allocation_entity import (
    PortfolioEntity, StrategyAllocationEntity, PairAllocationEntity, RiskEventEntity
)
from app.models.capital_allocation_models import (
    Portfolio, StrategyAllocation, PairAllocation, RiskEvent, 
    CapitalAllocationConfig, RiskControlStatus, RiskEventType
)
from app.utilities.forex_logger import forex_logger
from app.services.mt5_connection_manager import mt5_connection_manager
try:
    import MetaTrader5 as mt5
except ImportError:
    mt5 = None

logger = forex_logger.get_logger(__name__)

class CapitalAllocationService:
    def __init__(self, db: Session = None):
        self.db = db
        self.mt5_manager = mt5_connection_manager
    
    def get_mt5_account_balance(self) -> Optional[Decimal]:
        """Fetch real account balance from MT5"""
        try:
            if self.mt5_manager.is_terminal_connected():
                import MetaTrader5 as mt5
                account_info = mt5.account_info()
                if account_info:
                    balance = Decimal(str(account_info.balance))
                    logger.info(f"MT5 Account Balance: ${balance}")
                    return balance
            # Fallback for user_6 when MT5 not connected
            logger.info("MT5 not connected, using fallback balance")
            return Decimal('100000.00')
        except Exception as e:
            logger.error(f"Error fetching MT5 balance: {e}")
            return Decimal('100000.00')
    
    def get_or_create_user_portfolio(self, user_id: str) -> Portfolio:
        """Get existing portfolio or create new one for user (Professional Standard)"""
        # Check if user already has a portfolio
        existing_portfolio = self.db.query(PortfolioEntity).filter(
            PortfolioEntity.user_id == user_id
        ).first()
        
        if existing_portfolio:
            # Update with current MT5 balance
            mt5_balance = self.get_mt5_account_balance()
            if mt5_balance and abs(existing_portfolio.total_capital - mt5_balance) > Decimal('0.01'):
                old_total = existing_portfolio.total_capital
                existing_portfolio.total_capital = mt5_balance
                existing_portfolio.available_capital = mt5_balance - existing_portfolio.allocated_capital
                self.db.commit()
                logger.info(f"Updated portfolio balance: ${old_total} → ${mt5_balance}")
            
            return self._entity_to_portfolio(existing_portfolio)
        
        # Create new portfolio with MT5 balance
        mt5_balance = self.get_mt5_account_balance()
        if not mt5_balance:
            mt5_balance = Decimal('10000.00')  # Fallback for testing
        
        portfolio_entity = PortfolioEntity(
            user_id=user_id,
            total_capital=mt5_balance,
            available_capital=mt5_balance
        )
        self.db.add(portfolio_entity)
        self.db.commit()
        self.db.refresh(portfolio_entity)
        
        logger.info(f"Created new portfolio for user {user_id} with ${mt5_balance}")
        return self._entity_to_portfolio(portfolio_entity)
    
    def add_strategy_capital(self, user_id: str, strategy_name: str, amount: Decimal) -> Dict:
        """Add capital to strategy (creates strategy if not exists)"""
        portfolio = self.get_or_create_user_portfolio(user_id)
        
        if amount > portfolio.available_capital:
            raise ValueError(f"Insufficient funds: Need ${amount}, Available ${portfolio.available_capital}")
        
        # Find existing strategy or create new
        strategy_allocation = self.db.query(StrategyAllocationEntity).filter(
            StrategyAllocationEntity.portfolio_id == portfolio.id,
            StrategyAllocationEntity.strategy_name == strategy_name
        ).first()
        
        if strategy_allocation:
            # Add to existing strategy
            old_amount = strategy_allocation.allocated_capital
            strategy_allocation.allocated_capital += amount
            strategy_allocation.allocation_percentage = (strategy_allocation.allocated_capital / portfolio.total_capital) * 100
            logger.info(f"Updated {strategy_name}: ${old_amount} + ${amount} = ${strategy_allocation.allocated_capital}")
        else:
            # Create new strategy
            allocation_percentage = (amount / portfolio.total_capital) * 100
            strategy_allocation = StrategyAllocationEntity(
                portfolio_id=portfolio.id,
                strategy_name=strategy_name,
                allocation_percentage=allocation_percentage,
                allocated_capital=amount
            )
            self.db.add(strategy_allocation)
            logger.info(f"Created {strategy_name} with ${amount}")
        
        # Update portfolio
        portfolio_entity = self.db.query(PortfolioEntity).filter(PortfolioEntity.id == portfolio.id).first()
        portfolio_entity.allocated_capital += amount
        portfolio_entity.available_capital -= amount
        
        self.db.commit()
        self.db.refresh(strategy_allocation)
        
        return {
            "success": True,
            "strategy_name": strategy_name,
            "allocated_capital": float(strategy_allocation.allocated_capital),
            "added_amount": float(amount),
            "portfolio_available": float(portfolio_entity.available_capital)
        }
    
    def remove_strategy_capital(self, user_id: str, strategy_name: str, amount: Decimal) -> Dict:
        """Remove capital from strategy"""
        portfolio = self.get_or_create_user_portfolio(user_id)
        
        strategy_allocation = self.db.query(StrategyAllocationEntity).filter(
            StrategyAllocationEntity.portfolio_id == portfolio.id,
            StrategyAllocationEntity.strategy_name == strategy_name
        ).first()
        
        if not strategy_allocation:
            raise ValueError(f"Strategy '{strategy_name}' not found")
        
        if amount > strategy_allocation.allocated_capital:
            raise ValueError(f"Cannot remove ${amount}, strategy only has ${strategy_allocation.allocated_capital}")
        
        # Update strategy
        old_amount = strategy_allocation.allocated_capital
        strategy_allocation.allocated_capital -= amount
        strategy_allocation.allocation_percentage = (strategy_allocation.allocated_capital / portfolio.total_capital) * 100
        
        # Update portfolio
        portfolio_entity = self.db.query(PortfolioEntity).filter(PortfolioEntity.id == portfolio.id).first()
        portfolio_entity.allocated_capital -= amount
        portfolio_entity.available_capital += amount
        
        # Remove strategy if no capital left
        if strategy_allocation.allocated_capital <= 0:
            self.db.delete(strategy_allocation)
            logger.info(f"Removed strategy '{strategy_name}' (no capital remaining)")
        
        self.db.commit()
        
        return {
            "success": True,
            "strategy_name": strategy_name,
            "removed_amount": float(amount),
            "remaining_capital": float(strategy_allocation.allocated_capital) if strategy_allocation.allocated_capital > 0 else 0,
            "portfolio_available": float(portfolio_entity.available_capital)
        }
    
    def allocate_pair_to_strategy(self, user_id: str, strategy_name: str, 
                                pair: str, allocation_amount: Decimal, 
                                floating_loss_threshold_pct: Decimal = Decimal('20.00')) -> Dict:
        """Allocate capital from strategy to specific pair"""
        portfolio = self.get_or_create_user_portfolio(user_id)
        
        # Get strategy allocation
        strategy_allocation = self.db.query(StrategyAllocationEntity).filter(
            StrategyAllocationEntity.portfolio_id == portfolio.id,
            StrategyAllocationEntity.strategy_name == strategy_name
        ).first()
        
        if not strategy_allocation:
            raise ValueError(f"Strategy '{strategy_name}' not found. Add capital to strategy first.")
        
        # Check if strategy has enough capital
        used_capital = self.db.query(PairAllocationEntity).filter(
            PairAllocationEntity.strategy_allocation_id == strategy_allocation.id
        ).with_entities(PairAllocationEntity.allocated_capital).all()
        
        total_used = sum([Decimal(str(cap[0])) for cap in used_capital])
        available_in_strategy = strategy_allocation.allocated_capital - total_used
        
        if allocation_amount > available_in_strategy:
            raise ValueError(f"Strategy has insufficient capital: Need ${allocation_amount}, Available ${available_in_strategy}")
        
        # Check if pair already exists in strategy
        existing_pair = self.db.query(PairAllocationEntity).filter(
            PairAllocationEntity.strategy_allocation_id == strategy_allocation.id,
            PairAllocationEntity.pair == pair
        ).first()
        
        if existing_pair:
            # Add to existing pair allocation
            old_amount = existing_pair.allocated_capital
            existing_pair.allocated_capital += allocation_amount
            self.db.commit()
            logger.info(f"Updated {pair} in {strategy_name}: ${old_amount} + ${allocation_amount} = ${existing_pair.allocated_capital}")
        else:
            # Create new pair allocation
            pair_allocation = PairAllocationEntity(
                strategy_allocation_id=strategy_allocation.id,
                pair=pair,
                allocated_capital=allocation_amount,
                floating_loss_threshold_pct=floating_loss_threshold_pct
            )
            self.db.add(pair_allocation)
            self.db.commit()
            logger.info(f"Allocated ${allocation_amount} to {pair} in {strategy_name}")
        
        return {
            "success": True,
            "pair": pair,
            "strategy": strategy_name,
            "allocated_capital": float(allocation_amount),
            "strategy_remaining": float(available_in_strategy - allocation_amount),
            "pair_available": float(allocation_amount)  # All allocated capital is available for trading initially
        }
    
    def allocate_risk_based(self, portfolio_id: int, strategy_name: str, 
                          max_risk_amount: Decimal, risk_per_trade: Decimal) -> StrategyAllocation:
        """Allocate based on risk tolerance (Professional Standard)"""
        portfolio = self.db.query(PortfolioEntity).filter(PortfolioEntity.id == portfolio_id).first()
        if not portfolio:
            raise ValueError(f"Portfolio {portfolio_id} not found")
        
        # Calculate capital needed based on risk (Risk * 20 for safety margin)
        allocated_capital = max_risk_amount * 20  # Conservative 5% risk per trade
        
        return self.allocate_fixed_amount(portfolio_id, strategy_name, allocated_capital)
    
    def get_strategy_allocation(self, user_id: str, strategy_name: str) -> Optional[Dict]:
        """Get allocation details for a specific strategy with remaining amounts"""
        try:
            portfolio = self.db.query(PortfolioEntity).filter(PortfolioEntity.user_id == user_id).first()
            if not portfolio:
                return None
            
            strategy_allocation = self.db.query(StrategyAllocationEntity).filter(
                StrategyAllocationEntity.portfolio_id == portfolio.id,
                StrategyAllocationEntity.strategy_name == strategy_name
            ).first()
            
            if not strategy_allocation:
                return None
            
            # Calculate used and remaining capital in strategy
            pair_allocations = self.db.query(PairAllocationEntity).filter(
                PairAllocationEntity.strategy_allocation_id == strategy_allocation.id
            ).all()
            
            total_allocated_to_pairs = sum([Decimal(str(pa.allocated_capital)) for pa in pair_allocations])
            total_used_by_pairs = sum([Decimal(str(pa.used_capital)) for pa in pair_allocations])
            remaining_in_strategy = strategy_allocation.allocated_capital - total_allocated_to_pairs
            
            pairs_info = {}
            for pa in pair_allocations:
                pairs_info[pa.pair] = {
                    "allocated_capital": float(pa.allocated_capital),
                    "used_capital": float(pa.used_capital),
                    "available_capital": float(pa.allocated_capital - pa.used_capital),
                    "realized_pnl": float(pa.realized_pnl),
                    "floating_pnl": float(pa.floating_pnl),
                    "risk_breached": pa.risk_breached
                }
            
            return {
                "strategy_name": strategy_allocation.strategy_name,
                "allocated_capital": float(strategy_allocation.allocated_capital),
                "allocated_to_pairs": float(total_allocated_to_pairs),
                "used_by_pairs": float(total_used_by_pairs),
                "remaining_in_strategy": float(remaining_in_strategy),
                "allocation_percentage": float(strategy_allocation.allocation_percentage),
                "realized_pnl": float(strategy_allocation.realized_pnl),
                "floating_pnl": float(strategy_allocation.floating_pnl),
                "is_active": strategy_allocation.is_active,
                "pairs": pairs_info
            }
        except Exception as e:
            logger.error(f"Error getting strategy allocation: {e}")
            return None
    
    def allocate_pair_capital(self, strategy_allocation_id: int, pair_allocations: List[Dict], 
                            floating_loss_threshold_pct: Decimal = Decimal('20.00')) -> List[PairAllocation]:
        """Allocate strategy capital to pairs with user-defined amounts or percentages"""
        strategy_allocation = self.db.query(StrategyAllocationEntity).filter(
            StrategyAllocationEntity.id == strategy_allocation_id
        ).first()
        
        if not strategy_allocation:
            raise ValueError(f"Strategy allocation {strategy_allocation_id} not found")
        
        # Process allocations (amount or percentage)
        processed_allocations = []
        total_requested = Decimal('0')
        
        for pair_alloc in pair_allocations:
            try:
                pair = pair_alloc['pair']
                
                # Handle amount-based allocation
                if 'amount' in pair_alloc:
                    amount = Decimal(str(pair_alloc['amount']))
                    processed_allocations.append({
                        'pair': pair, 
                        'amount': amount,
                        'floating_loss_threshold_pct': pair_alloc.get('floating_loss_threshold_pct', floating_loss_threshold_pct)
                    })
                    total_requested += amount
                
                # Handle percentage-based allocation
                elif 'percentage' in pair_alloc:
                    percentage = Decimal(str(pair_alloc['percentage']))
                    amount = strategy_allocation.allocated_capital * (percentage / 100)
                    processed_allocations.append({
                        'pair': pair, 
                        'amount': amount,
                        'floating_loss_threshold_pct': pair_alloc.get('floating_loss_threshold_pct', floating_loss_threshold_pct)
                    })
                    total_requested += amount
                
                else:
                    raise ValueError(f"Pair {pair} must have either 'amount' or 'percentage'")
            except KeyError as e:
                raise ValueError(f"Missing required field {str(e)} in pair allocation")
            except Exception as e:
                raise ValueError(f"Error processing pair allocation: {str(e)}")
        
        # Validate total allocation doesn't exceed strategy capital
        if total_requested > strategy_allocation.allocated_capital:
            raise ValueError(f"Total allocation ${total_requested} exceeds strategy capital ${strategy_allocation.allocated_capital}")
        
        pair_allocation_entities = []
        for alloc in processed_allocations:
            pair_allocation = PairAllocationEntity(
                strategy_allocation_id=strategy_allocation_id,
                pair=alloc['pair'],
                allocated_capital=alloc['amount'],
                floating_loss_threshold_pct=Decimal(str(alloc['floating_loss_threshold_pct']))
            )
            self.db.add(pair_allocation)
            pair_allocation_entities.append(pair_allocation)
        
        self.db.commit()
        
        logger.info(f"Allocated ${total_requested} across {len(pair_allocations)} pairs in strategy {strategy_allocation.strategy_name}")
        return [self._entity_to_pair_allocation(pa) for pa in pair_allocation_entities]
    
    def allocate_pair_with_capital(self, session_id: str, strategy_name: str, 
                                 pair: str, allocation_amount: Decimal, 
                                 floating_loss_threshold_pct: Decimal = Decimal('20.00')) -> Dict:
        """User-based pair allocation with persistent strategy updates"""
        try:
            # Get MT5 account info for user-based portfolio
            mt5_balance = self.get_mt5_account_balance()
            if not mt5_balance:
                mt5_balance = Decimal('10000.00')  # Fallback
            
            # Use MT5 account as user_id for persistence
            account_info = None
            if self.mt5_manager.is_terminal_connected():
                try:
                    import MetaTrader5 as mt5
                    account_info = mt5.account_info()
                except:
                    pass
            
            user_id = f"mt5_account_{account_info.login}" if account_info else session_id
            
            # Find or create portfolio for user (not session)
            portfolio = self.db.query(PortfolioEntity).filter(
                PortfolioEntity.user_id == user_id
            ).first()
            
            if not portfolio:
                # Create user-based portfolio with current MT5 balance
                portfolio = PortfolioEntity(
                    user_id=user_id,
                    total_capital=mt5_balance,
                    available_capital=mt5_balance
                )
                self.db.add(portfolio)
                self.db.commit()
                self.db.refresh(portfolio)
                logger.info(f"Created new portfolio for user {user_id} with ${mt5_balance}")
            else:
                # Update existing portfolio with current MT5 balance
                if abs(portfolio.total_capital - mt5_balance) > Decimal('0.01'):
                    old_total = portfolio.total_capital
                    portfolio.total_capital = mt5_balance
                    portfolio.available_capital = mt5_balance - portfolio.allocated_capital
                    self.db.commit()
                    logger.info(f"Updated portfolio balance: ${old_total} → ${mt5_balance}")
            
            # Find or create strategy allocation
            strategy_allocation = self.db.query(StrategyAllocationEntity).filter(
                StrategyAllocationEntity.portfolio_id == portfolio.id,
                StrategyAllocationEntity.strategy_name == strategy_name
            ).first()
            
            if not strategy_allocation:
                # Check if sufficient funds available
                if allocation_amount > portfolio.available_capital:
                    raise ValueError(f"Insufficient funds: Need ${allocation_amount}, Available ${portfolio.available_capital}")
                
                # Create new strategy allocation
                allocation_percentage = (allocation_amount / portfolio.total_capital) * 100
                strategy_allocation = StrategyAllocationEntity(
                    portfolio_id=portfolio.id,
                    strategy_name=strategy_name,
                    allocation_percentage=allocation_percentage,
                    allocated_capital=allocation_amount
                )
                self.db.add(strategy_allocation)
                portfolio.allocated_capital += allocation_amount
                portfolio.available_capital -= allocation_amount
                logger.info(f"New allocation: ${allocation_amount} to {strategy_name}")
            else:
                # Add to existing strategy allocation
                if allocation_amount > portfolio.available_capital:
                    raise ValueError(f"Insufficient funds: Need ${allocation_amount}, Available ${portfolio.available_capital}")
                
                old_amount = strategy_allocation.allocated_capital
                strategy_allocation.allocated_capital += allocation_amount
                strategy_allocation.allocation_percentage = (strategy_allocation.allocated_capital / portfolio.total_capital) * 100
                
                portfolio.allocated_capital += allocation_amount
                portfolio.available_capital -= allocation_amount
                
                logger.info(f"Updated allocation: {strategy_name} ${old_amount} + ${allocation_amount} = ${strategy_allocation.allocated_capital}")
            
            self.db.commit()
            self.db.refresh(strategy_allocation)
            
            # Create pair allocation
            pair_allocation = PairAllocationEntity(
                strategy_allocation_id=strategy_allocation.id,
                pair=pair,
                allocated_capital=allocation_amount,
                floating_loss_threshold_pct=floating_loss_threshold_pct
            )
            self.db.add(pair_allocation)
            self.db.commit()
            self.db.refresh(pair_allocation)
            
            logger.info(f"Allocated ${allocation_amount} to {pair} in {strategy_name} for session {session_id}")
            
            return {
                "success": True,
                "pair": pair,
                "strategy": strategy_name,
                "allocated_capital": float(allocation_amount),
                "floating_loss_threshold_pct": float(floating_loss_threshold_pct),
                "portfolio_balance": float(portfolio.total_capital)
            }
            
        except Exception as e:
            logger.error(f"Error in pair allocation: {e}")
            raise e
    

    
    def check_risk_control(self, pair: str, strategy_name: str, 
                          floating_pnl: Decimal, realized_pnl: Decimal) -> Tuple[bool, Optional[RiskEvent]]:
        """Check if risk control should trigger for a pair"""
        if not self.db:
            return False, None  # No risk control if no database
            
        pair_allocation = self._get_pair_allocation(pair, strategy_name)
        if not pair_allocation:
            return False, None
        
        # Update P&L
        pair_allocation.floating_pnl = floating_pnl
        pair_allocation.realized_pnl = realized_pnl
        
        cumulative_loss = realized_pnl + floating_pnl
        floating_loss_pct = abs(floating_pnl / pair_allocation.allocated_capital * 100) if pair_allocation.allocated_capital > 0 else 0
        capital_exhaustion_pct = abs(cumulative_loss / pair_allocation.allocated_capital * 100) if pair_allocation.allocated_capital > 0 else 0
        
        # Check floating loss threshold
        if floating_loss_pct >= pair_allocation.floating_loss_threshold_pct:
            risk_event = self._create_risk_event(
                pair_allocation.id,
                RiskEventType.FLOATING_LOSS_BREACH,
                abs(floating_pnl),
                pair_allocation.allocated_capital * (pair_allocation.floating_loss_threshold_pct / 100)
            )
            pair_allocation.risk_breached = True
            self.db.commit()
            
            logger.critical(f"FLOATING LOSS BREACH: {pair} - {floating_loss_pct:.2f}% >= {pair_allocation.floating_loss_threshold_pct}%")
            return True, risk_event
        
        # Check capital exhaustion
        if abs(cumulative_loss) >= pair_allocation.allocated_capital:
            risk_event = self._create_risk_event(
                pair_allocation.id,
                RiskEventType.CAPITAL_EXHAUSTION,
                abs(cumulative_loss),
                pair_allocation.allocated_capital
            )
            pair_allocation.risk_breached = True
            self.db.commit()
            
            logger.critical(f"CAPITAL EXHAUSTION: {pair} - Loss ${abs(cumulative_loss)} >= Allocated ${pair_allocation.allocated_capital}")
            return True, risk_event
        
        self.db.commit()
        return False, None
    
    def get_risk_status(self, pair: str, strategy_name: str) -> Optional[RiskControlStatus]:
        """Get current risk control status for a pair"""
        if not self.db:
            return None  # No risk status if no database
            
        pair_allocation = self._get_pair_allocation(pair, strategy_name)
        if not pair_allocation:
            return None
        
        cumulative_loss = pair_allocation.realized_pnl + pair_allocation.floating_pnl
        floating_loss_pct = abs(pair_allocation.floating_pnl / pair_allocation.allocated_capital * 100) if pair_allocation.allocated_capital > 0 else 0
        capital_exhaustion_pct = abs(cumulative_loss / pair_allocation.allocated_capital * 100) if pair_allocation.allocated_capital > 0 else 0
        
        return RiskControlStatus(
            pair=pair_allocation.pair,
            strategy_name=strategy_name,
            allocated_capital=pair_allocation.allocated_capital,
            used_capital=pair_allocation.used_capital,
            realized_pnl=pair_allocation.realized_pnl,
            floating_pnl=pair_allocation.floating_pnl,
            cumulative_loss=cumulative_loss,
            floating_loss_pct=floating_loss_pct,
            capital_exhaustion_pct=capital_exhaustion_pct,
            risk_breached=pair_allocation.risk_breached,
            can_trade=not pair_allocation.risk_breached
        )
    
    def reset_pair_risk(self, pair: str, strategy_name: str) -> bool:
        """Reset risk breach status for a pair"""
        pair_allocation = self._get_pair_allocation(pair, strategy_name)
        if not pair_allocation:
            return False
        
        pair_allocation.risk_breached = False
        pair_allocation.floating_pnl = Decimal('0.00')
        pair_allocation.realized_pnl = Decimal('0.00')
        self.db.commit()
        
        logger.info(f"Risk status reset for {pair} in strategy {strategy_name}")
        return True
    
    def get_portfolio_summary(self, user_id: str) -> Dict:
        """Get portfolio summary with all allocations"""
        portfolio = self.db.query(PortfolioEntity).filter(PortfolioEntity.user_id == user_id).first()
        if not portfolio:
            return {}
        
        strategy_allocations = self.db.query(StrategyAllocationEntity).filter(
            StrategyAllocationEntity.portfolio_id == portfolio.id
        ).all()
        
        summary = {
            "total_capital": float(portfolio.total_capital),
            "allocated_capital": float(portfolio.allocated_capital),
            "available_capital": float(portfolio.available_capital),
            "strategies": {}
        }
        
        for strategy in strategy_allocations:
            pair_allocations = self.db.query(PairAllocationEntity).filter(
                PairAllocationEntity.strategy_allocation_id == strategy.id
            ).all()
            
            summary["strategies"][strategy.strategy_name] = {
                "allocation_percentage": float(strategy.allocation_percentage),
                "allocated_capital": float(strategy.allocated_capital),
                "realized_pnl": float(strategy.realized_pnl),
                "floating_pnl": float(strategy.floating_pnl),
                "pairs": {
                    pa.pair: {
                        "allocated_capital": float(pa.allocated_capital),
                        "used_capital": float(pa.used_capital),
                        "available_capital": float(pa.allocated_capital - pa.used_capital),
                        "realized_pnl": float(pa.realized_pnl),
                        "floating_pnl": float(pa.floating_pnl),
                        "risk_breached": pa.risk_breached,
                        "can_trade": not pa.risk_breached
                    } for pa in pair_allocations
                }
            }
        
        return summary
    
    def get_mt5_user_id(self) -> str:
        """Get standardized MT5 user ID"""
        try:
            if self.mt5_manager.is_terminal_connected():
                import MetaTrader5 as mt5
                account_info = mt5.account_info()
                if account_info:
                    return str(account_info.login)
        except:
            pass
        return "demo_user"
    
    def update_dynamic_capital(self, user_id: str) -> Dict:
        """Update portfolio capital based on current MT5 balance (for dynamic compounding mode)"""
        try:
            portfolio = self.db.query(PortfolioEntity).filter(
                PortfolioEntity.user_id == user_id
            ).first()
            
            if not portfolio:
                return {"error": "Portfolio not found"}
            
            current_balance = self.get_mt5_account_balance()
            if not current_balance:
                return {"error": "Cannot fetch MT5 balance"}
            
            old_capital = portfolio.total_capital
            portfolio.total_capital = current_balance
            
            # Recalculate available capital
            portfolio.available_capital = current_balance - portfolio.allocated_capital
            
            # Update strategy allocations proportionally
            strategy_allocations = self.db.query(StrategyAllocationEntity).filter(
                StrategyAllocationEntity.portfolio_id == portfolio.id
            ).all()
            
            for strategy in strategy_allocations:
                # Maintain percentage allocation
                new_allocation = current_balance * (strategy.allocation_percentage / 100)
                strategy.allocated_capital = new_allocation
                
                # Update pair allocations proportionally
                pair_allocations = self.db.query(PairAllocationEntity).filter(
                    PairAllocationEntity.strategy_allocation_id == strategy.id
                ).all()
                
                for pair_alloc in pair_allocations:
                    pair_alloc.allocated_capital = new_allocation / len(pair_allocations)
            
            self.db.commit()
            
            logger.info(f"Dynamic capital updated: ${old_capital} -> ${current_balance}")
            
            return {
                "success": True,
                "old_capital": float(old_capital),
                "new_capital": float(current_balance),
                "change": float(current_balance - old_capital)
            }
            
        except Exception as e:
            logger.error(f"Error updating dynamic capital: {e}")
            return {"error": str(e)}
    
    def get_comprehensive_analytics(self, user_id: str) -> Dict:
        """Get comprehensive analytics for capital allocation dashboard"""
        try:
            portfolio = self.db.query(PortfolioEntity).filter(
                PortfolioEntity.user_id == user_id
            ).first()
            
            if not portfolio:
                return {"error": "Portfolio not found"}
            
            # Get all strategy allocations
            strategy_allocations = self.db.query(StrategyAllocationEntity).filter(
                StrategyAllocationEntity.portfolio_id == portfolio.id
            ).all()
            
            # Calculate totals
            total_allocated = float(portfolio.allocated_capital)
            total_utilized = Decimal('0')
            total_realized_pnl = Decimal('0')
            total_floating_pnl = Decimal('0')
            
            # Get pair summary
            pairs_summary = self.get_pairs_cross_strategy_summary(user_id)
            
            # Calculate utilized capital across all pairs
            for strategy in strategy_allocations:
                pair_allocations = self.db.query(PairAllocationEntity).filter(
                    PairAllocationEntity.strategy_allocation_id == strategy.id
                ).all()
                
                for pa in pair_allocations:
                    total_utilized += pa.used_capital
                    total_realized_pnl += pa.realized_pnl
                    total_floating_pnl += pa.floating_pnl
            
            return {
                "success": True,
                "overview": {
                    "total_capital": float(portfolio.total_capital),
                    "allocated_capital": total_allocated,
                    "utilized_capital": float(total_utilized),
                    "available_in_allocated": total_allocated - float(total_utilized),
                    "unallocated_capital": float(portfolio.available_capital),
                    "allocation_percentage": (total_allocated / float(portfolio.total_capital) * 100) if portfolio.total_capital > 0 else 0,
                    "utilization_percentage": (float(total_utilized) / total_allocated * 100) if total_allocated > 0 else 0,
                    "total_realized_pnl": float(total_realized_pnl),
                    "total_floating_pnl": float(total_floating_pnl),
                    "total_pnl": float(total_realized_pnl + total_floating_pnl),
                    "roi_percentage": (float(total_realized_pnl + total_floating_pnl) / total_allocated * 100) if total_allocated > 0 else 0
                },
                "pairs_summary": pairs_summary,
                "strategies_count": len(strategy_allocations),
                "pairs_count": len(pairs_summary)
            }
            
        except Exception as e:
            logger.error(f"Error getting comprehensive analytics: {e}")
            return {"error": str(e)}
    
    def get_pairs_cross_strategy_summary(self, user_id: str) -> List[Dict]:
        """Get summary of each pair aggregated across all strategies"""
        try:
            portfolio = self.db.query(PortfolioEntity).filter(
                PortfolioEntity.user_id == user_id
            ).first()
            
            if not portfolio:
                return []
            
            # Get all pair allocations across all strategies
            pair_allocations = self.db.query(PairAllocationEntity).join(
                StrategyAllocationEntity
            ).filter(
                StrategyAllocationEntity.portfolio_id == portfolio.id
            ).all()
            
            # Group by pair
            pairs_data = {}
            for pa in pair_allocations:
                pair_name = pa.pair
                strategy = pa.strategy_allocation
                
                if pair_name not in pairs_data:
                    pairs_data[pair_name] = {
                        "pair": pair_name,
                        "total_allocated": Decimal('0'),
                        "total_used": Decimal('0'),
                        "total_available": Decimal('0'),
                        "total_realized_pnl": Decimal('0'),
                        "total_floating_pnl": Decimal('0'),
                        "strategies_count": 0,
                        "strategies": []
                    }
                
                pairs_data[pair_name]["total_allocated"] += pa.allocated_capital
                pairs_data[pair_name]["total_used"] += pa.used_capital
                pairs_data[pair_name]["total_available"] += (pa.allocated_capital - pa.used_capital)
                pairs_data[pair_name]["total_realized_pnl"] += pa.realized_pnl
                pairs_data[pair_name]["total_floating_pnl"] += pa.floating_pnl
                pairs_data[pair_name]["strategies_count"] += 1
                pairs_data[pair_name]["strategies"].append({
                    "strategy_name": strategy.strategy_name,
                    "allocated": float(pa.allocated_capital),
                    "used": float(pa.used_capital),
                    "realized_pnl": float(pa.realized_pnl),
                    "floating_pnl": float(pa.floating_pnl),
                    "risk_breached": pa.risk_breached
                })
            
            # Convert to list and add percentages
            result = []
            for pair_name, data in pairs_data.items():
                total_allocated = float(data["total_allocated"])
                total_pnl = float(data["total_realized_pnl"] + data["total_floating_pnl"])
                
                result.append({
                    "pair": pair_name,
                    "total_allocated": total_allocated,
                    "total_used": float(data["total_used"]),
                    "total_available": float(data["total_available"]),
                    "allocation_percentage": (total_allocated / float(portfolio.total_capital) * 100) if portfolio.total_capital > 0 else 0,
                    "utilization_percentage": (float(data["total_used"]) / total_allocated * 100) if total_allocated > 0 else 0,
                    "total_realized_pnl": float(data["total_realized_pnl"]),
                    "total_floating_pnl": float(data["total_floating_pnl"]),
                    "total_pnl": total_pnl,
                    "roi_percentage": (total_pnl / total_allocated * 100) if total_allocated > 0 else 0,
                    "strategies_count": data["strategies_count"],
                    "strategies": data["strategies"]
                })
            
            # Sort by total allocated descending
            result.sort(key=lambda x: x["total_allocated"], reverse=True)
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting pairs cross-strategy summary: {e}")
            return []
    
    def get_allocation_method_breakdown(self, user_id: str) -> Dict:
        """Get breakdown of allocations by method (this is informational since we track by amount)"""
        try:
            portfolio = self.db.query(PortfolioEntity).filter(
                PortfolioEntity.user_id == user_id
            ).first()
            
            if not portfolio:
                return {"error": "Portfolio not found"}
            
            strategy_allocations = self.db.query(StrategyAllocationEntity).filter(
                StrategyAllocationEntity.portfolio_id == portfolio.id
            ).all()
            
            # Since we store both amount and percentage, we can categorize
            # Fixed amount: where percentage is calculated from amount
            # Percentage-based: where amount is calculated from percentage
            # Balance-plus: would be dynamic (not currently distinguished in DB)
            
            strategies_by_method = {
                "fixed_amount": [],
                "percentage_based": [],
                "dynamic_balance": []
            }
            
            for strategy in strategy_allocations:
                strategy_info = {
                    "strategy_name": strategy.strategy_name,
                    "allocated_capital": float(strategy.allocated_capital),
                    "allocation_percentage": float(strategy.allocation_percentage),
                    "realized_pnl": float(strategy.realized_pnl),
                    "floating_pnl": float(strategy.floating_pnl)
                }
                
                # For now, categorize all as fixed amount (can be enhanced later)
                # This is a placeholder for future enhancement when allocation method is tracked
                strategies_by_method["fixed_amount"].append(strategy_info)
            
            return {
                "success": True,
                "methods": strategies_by_method,
                "summary": {
                    "fixed_amount_count": len(strategies_by_method["fixed_amount"]),
                    "percentage_based_count": len(strategies_by_method["percentage_based"]),
                    "dynamic_balance_count": len(strategies_by_method["dynamic_balance"])
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting allocation method breakdown: {e}")
            return {"error": str(e)}
    
    
    def _get_pair_allocation(self, pair: str, strategy_name: str) -> Optional[PairAllocationEntity]:
        """Get pair allocation entity"""
        if not self.db:
            return None
            
        return self.db.query(PairAllocationEntity).join(StrategyAllocationEntity).filter(
            PairAllocationEntity.pair == pair,
            StrategyAllocationEntity.strategy_name == strategy_name
        ).first()
    
    def _create_risk_event(self, pair_allocation_id: int, event_type: RiskEventType, 
                          trigger_value: Decimal, threshold_value: Decimal) -> RiskEvent:
        """Create a risk event record"""
        risk_event = RiskEventEntity(
            pair_allocation_id=pair_allocation_id,
            event_type=event_type.value,
            trigger_value=trigger_value,
            threshold_value=threshold_value,
            action_taken="CLOSE_ALL_TRADES"
        )
        self.db.add(risk_event)
        self.db.commit()
        self.db.refresh(risk_event)
        
        return self._entity_to_risk_event(risk_event)
    
    def calculate_lot_size_from_capital(self, pair: str, allocated_capital: Decimal, 
                                      risk_percent: Decimal = Decimal('2.0')) -> Decimal:
        """Calculate appropriate lot size based on allocated capital and risk percentage"""
        try:
            # Get symbol info for contract size
            if not self.mt5_manager.is_terminal_connected():
                return Decimal('0.01')  # Default fallback
            
            symbol_info = mt5.symbol_info(pair)
            if not symbol_info:
                return Decimal('0.01')
            
            # Calculate risk amount
            risk_amount = allocated_capital * (risk_percent / 100)
            
            # For gold (XAUUSD), typical pip value is $1 per 0.01 lot
            # For forex pairs, pip value varies
            if 'XAU' in pair:
                pip_value = Decimal('1.0')  # $1 per pip for 0.01 lot
                stop_loss_pips = Decimal('100')  # Assume 100 pip stop loss
            else:
                pip_value = Decimal('0.1')  # $0.1 per pip for 0.01 lot (major pairs)
                stop_loss_pips = Decimal('50')  # Assume 50 pip stop loss
            
            # Calculate lot size: risk_amount / (stop_loss_pips * pip_value * 100)
            lot_size = risk_amount / (stop_loss_pips * pip_value * 100)
            
            # Round to 2 decimal places and ensure minimum
            lot_size = max(Decimal('0.01'), round(lot_size, 2))
            
            logger.info(f"Calculated lot size for {pair}: {lot_size} (Capital: ${allocated_capital}, Risk: {risk_percent}%)")
            return lot_size
            
        except Exception as e:
            logger.error(f"Error calculating lot size: {e}")
            return Decimal('0.01')
    
    def _entity_to_portfolio(self, entity: PortfolioEntity) -> Portfolio:
        return Portfolio(
            id=entity.id,
            user_id=entity.user_id,
            total_capital=entity.total_capital,
            available_capital=entity.available_capital,
            allocated_capital=entity.allocated_capital,
            is_active=entity.is_active
        )
    
    def _entity_to_strategy_allocation(self, entity: StrategyAllocationEntity) -> StrategyAllocation:
        return StrategyAllocation(
            id=entity.id,
            portfolio_id=entity.portfolio_id,
            strategy_name=entity.strategy_name,
            allocation_percentage=entity.allocation_percentage,
            allocated_capital=entity.allocated_capital,
            used_capital=entity.used_capital,
            realized_pnl=entity.realized_pnl,
            floating_pnl=entity.floating_pnl,
            is_active=entity.is_active
        )
    
    def _entity_to_pair_allocation(self, entity: PairAllocationEntity) -> PairAllocation:
        return PairAllocation(
            id=entity.id,
            strategy_allocation_id=entity.strategy_allocation_id,
            pair=entity.pair,
            allocated_capital=entity.allocated_capital,
            used_capital=entity.used_capital,
            realized_pnl=entity.realized_pnl,
            floating_pnl=entity.floating_pnl,
            floating_loss_threshold_pct=entity.floating_loss_threshold_pct,
            is_active=entity.is_active,
            risk_breached=entity.risk_breached
        )
    
    def _entity_to_risk_event(self, entity: RiskEventEntity) -> RiskEvent:
        return RiskEvent(
            id=entity.id,
            pair_allocation_id=entity.pair_allocation_id,
            event_type=RiskEventType(entity.event_type),
            trigger_value=entity.trigger_value,
            threshold_value=entity.threshold_value,
            action_taken=entity.action_taken,
            trades_closed=entity.trades_closed
        )
    
    def update_used_capital(self, user_id: str, strategy_name: str, pair: str, 
                          trade_amount: Decimal, operation: str = "add") -> Dict:
        """Update used capital when trade is placed or closed"""
        try:
            portfolio = self.get_or_create_user_portfolio(user_id)
            
            strategy_allocation = self.db.query(StrategyAllocationEntity).filter(
                StrategyAllocationEntity.portfolio_id == portfolio.id,
                StrategyAllocationEntity.strategy_name == strategy_name
            ).first()
            
            if not strategy_allocation:
                raise ValueError(f"Strategy '{strategy_name}' not found")
            
            pair_allocation = self.db.query(PairAllocationEntity).filter(
                PairAllocationEntity.strategy_allocation_id == strategy_allocation.id,
                PairAllocationEntity.pair == pair
            ).first()
            
            if not pair_allocation:
                raise ValueError(f"Pair '{pair}' not allocated in strategy '{strategy_name}'")
            
            if operation == "add":
                # Check if enough capital available
                available = pair_allocation.allocated_capital - pair_allocation.used_capital
                if trade_amount > available:
                    raise ValueError(f"Insufficient capital: Need ${trade_amount}, Available ${available}")
                
                pair_allocation.used_capital += trade_amount
                logger.info(f"Added ${trade_amount} to used capital for {pair} in {strategy_name}")
            elif operation == "remove":
                pair_allocation.used_capital = max(Decimal('0'), pair_allocation.used_capital - trade_amount)
                logger.info(f"Removed ${trade_amount} from used capital for {pair} in {strategy_name}")
            
            self.db.commit()
            
            return {
                "success": True,
                "pair": pair,
                "strategy": strategy_name,
                "used_capital": float(pair_allocation.used_capital),
                "available_capital": float(pair_allocation.allocated_capital - pair_allocation.used_capital)
            }
            
        except Exception as e:
            logger.error(f"Error updating used capital: {e}")
            raise e
    
    def get_capital_allocation_for_trading(self, user_id: str, pair: str, 
                                         strategy_name: str) -> Optional[Dict]:
        """Get capital allocation info for trading decisions"""
        try:
            portfolio = self.get_or_create_user_portfolio(user_id)
            
            strategy_allocation = self.db.query(StrategyAllocationEntity).filter(
                StrategyAllocationEntity.portfolio_id == portfolio.id,
                StrategyAllocationEntity.strategy_name == strategy_name
            ).first()
            
            if not strategy_allocation:
                return None
            
            pair_allocation = self.db.query(PairAllocationEntity).filter(
                PairAllocationEntity.strategy_allocation_id == strategy_allocation.id,
                PairAllocationEntity.pair == pair
            ).first()
            
            if not pair_allocation:
                return None
            
            # Calculate suggested lot size based on available capital
            available_capital = pair_allocation.allocated_capital - pair_allocation.used_capital
            suggested_lot_size = self.calculate_lot_size_from_capital(pair, available_capital)
            
            return {
                "allocated_capital": float(pair_allocation.allocated_capital),
                "used_capital": float(pair_allocation.used_capital),
                "available_capital": float(available_capital),
                "realized_pnl": float(pair_allocation.realized_pnl),
                "floating_pnl": float(pair_allocation.floating_pnl),
                "risk_breached": pair_allocation.risk_breached,
                "can_trade": not pair_allocation.risk_breached and available_capital > 0,
                "suggested_lot_size": float(suggested_lot_size),
                "floating_loss_threshold_pct": float(pair_allocation.floating_loss_threshold_pct)
            }
            
        except Exception as e:
            logger.error(f"Error getting capital allocation for trading: {e}")
            return None