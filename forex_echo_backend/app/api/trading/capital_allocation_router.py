"""Flask API endpoints for capital allocation and risk control"""

from flask import Blueprint, request, jsonify
from typing import Dict, List, Any
from decimal import Decimal

from app.database.database import get_db
from app.services.capital_allocation_service import CapitalAllocationService
from app.services.risk_control_manager import RiskControlManager
from app.database.entities.capital_allocation_entity import PortfolioEntity

capital_bp = Blueprint('capital', __name__, url_prefix='/api/capital')

@capital_bp.route('/portfolio/create', methods=['POST'])
def create_portfolio():
    """Create a new portfolio for capital allocation"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        total_capital = data.get('total_capital')
        
        if not user_id or not total_capital:
            return jsonify({"error": "user_id and total_capital are required"}), 400
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        portfolio = service.create_portfolio(user_id, Decimal(str(total_capital)))
        
        return jsonify({
            "success": True,
            "portfolio_id": portfolio.id,
            "message": f"Portfolio created with ${total_capital} capital"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@capital_bp.route('/strategy/allocate', methods=['POST'])
def allocate_strategy_capital():
    """Allocate fixed dollar amount to a trading strategy"""
    db = None
    try:
        data = request.get_json()
        portfolio_id = data.get('portfolio_id')
        strategy_name = data.get('strategy_name')
        allocation_amount = data.get('allocation_amount')
        
        if not all([portfolio_id, strategy_name, allocation_amount]):
            return jsonify({"error": "portfolio_id, strategy_name, and allocation_amount are required"}), 400
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        allocation = service.allocate_fixed_amount(
            portfolio_id, strategy_name, Decimal(str(allocation_amount))
        )
        
        return jsonify({
            "success": True,
            "allocation_id": allocation.id,
            "allocated_capital": float(allocation.allocated_capital),
            "message": f"Allocated ${allocation_amount} to {strategy_name}"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/strategy/mt5/allocate', methods=['POST'])
def allocate_mt5_strategy_capital():
    """Allocate capital to strategy using MT5 account (adds to existing if present)"""
    db = None
    try:
        data = request.get_json()
        strategy_name = data.get('strategy_name')
        allocation_amount = data.get('allocation_amount')
        pair = data.get('pair', 'XAUUSD')
        floating_loss_threshold_pct = data.get('floating_loss_threshold_pct', 20.0)
        
        if not all([strategy_name, allocation_amount]):
            return jsonify({"error": "strategy_name and allocation_amount are required"}), 400
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        
        # Get MT5 account info for user-based allocation
        mt5_balance = service.get_mt5_account_balance()
        if not mt5_balance:
            return jsonify({"error": "Cannot fetch MT5 balance. Check connection."}), 500
        
        # Use MT5 account as user_id for persistence
        account_info = None
        if service.mt5_manager.is_terminal_connected():
            try:
                import MetaTrader5 as mt5
                account_info = mt5.account_info()
            except:
                pass
        
        user_id = f"mt5_account_{account_info.login}" if account_info else "temp_session"
        
        # Find or create portfolio
        portfolio = db.query(PortfolioEntity).filter(PortfolioEntity.user_id == user_id).first()
        if not portfolio:
            portfolio = PortfolioEntity(
                user_id=user_id,
                total_capital=mt5_balance,
                available_capital=mt5_balance
            )
            db.add(portfolio)
            db.commit()
            db.refresh(portfolio)
        
        # Use allocate_fixed_amount which handles adding to existing strategies
        allocation = service.allocate_fixed_amount(
            portfolio.id, strategy_name, Decimal(str(allocation_amount))
        )
        
        return jsonify({
            "success": True,
            "allocation_id": allocation.id,
            "allocated_capital": float(allocation.allocated_capital),
            "message": f"Allocated ${allocation_amount} to {strategy_name}"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/pairs/allocate', methods=['POST'])
def allocate_pair_capital():
    """Allocate strategy capital to pairs with user-defined amounts"""
    db = None
    try:
        data = request.get_json()
        strategy_allocation_id = data.get('strategy_allocation_id')
        pair_allocations = data.get('pair_allocations')
        floating_loss_threshold_pct = data.get('floating_loss_threshold_pct', 20.0)
        
        if not strategy_allocation_id or not pair_allocations:
            return jsonify({"error": "strategy_allocation_id and pair_allocations are required"}), 400
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        allocations = service.allocate_pair_capital(
            strategy_allocation_id,
            pair_allocations,
            Decimal(str(floating_loss_threshold_pct))
        )
        
        return jsonify({
            "success": True,
            "pair_allocations": [
                {
                    "pair": pa.pair,
                    "allocated_capital": float(pa.allocated_capital),
                    "floating_loss_threshold": float(pa.floating_loss_threshold_pct)
                } for pa in allocations
            ],
            "message": f"User allocated capital to {len(pair_allocations)} pairs"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/portfolio/<user_id>/summary', methods=['GET'])
def get_portfolio_summary(user_id):
    """Get complete portfolio summary with all allocations"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        summary = service.get_portfolio_summary(user_id)
        
        if not summary:
            return jsonify({"error": "Portfolio not found"}), 404
        
        # Get portfolio ID
        portfolio_entity = db.query(PortfolioEntity).filter(PortfolioEntity.user_id == user_id).first()
        portfolio_id = portfolio_entity.id if portfolio_entity else None
        
        return jsonify({
            "success": True, 
            "portfolio": summary,
            "portfolio_id": portfolio_id
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/portfolio/mt5/summary', methods=['GET'])
def get_mt5_portfolio_summary():
    """Get portfolio summary for current MT5 account"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        
        # Get MT5 account info
        if not service.mt5_manager.is_terminal_connected():
            return jsonify({'error': 'MT5 not connected'}), 400
        
        try:
            import MetaTrader5 as mt5
            account_info = mt5.account_info()
            if not account_info:
                return jsonify({'error': 'Cannot get MT5 account info'}), 400
            
            user_id = f"mt5_account_{account_info.login}"
        except Exception as e:
            return jsonify({'error': f'MT5 error: {str(e)}'}), 500
        
        summary = service.get_portfolio_summary(user_id)
        if not summary:
            return jsonify({'error': 'Portfolio not found'}), 404
        
        return jsonify({
            'success': True,
            'portfolio': summary,
            'mt5_account': account_info.login
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if db:
            db.close()

@capital_bp.route('/risk/dashboard/<user_id>', methods=['GET'])
def get_risk_dashboard(user_id):
    """Get comprehensive risk control dashboard"""
    db = None
    try:
        db = next(get_db())
        risk_manager = RiskControlManager(db)
        dashboard = risk_manager.get_risk_dashboard(user_id)
        
        return jsonify({"success": True, "dashboard": dashboard})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/risk/status/<pair>/<strategy_name>', methods=['GET'])
def get_pair_risk_status(pair, strategy_name):
    """Get risk status for a specific pair/strategy combination"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        risk_status = service.get_risk_status(pair, strategy_name)
        
        if not risk_status:
            return jsonify({"error": "Risk allocation not found"}), 404
        
        return jsonify({
            "success": True,
            "risk_status": {
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
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/risk/reset/<pair>/<strategy_name>', methods=['POST'])
def reset_pair_risk(pair, strategy_name):
    """Reset risk breach status for a specific pair/strategy"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        success = service.reset_pair_risk(pair, strategy_name)
        
        if not success:
            return jsonify({"error": "Risk allocation not found"}), 404
        
        return jsonify({
            "success": True,
            "message": f"Risk status reset for {pair} in strategy {strategy_name}"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/risk/reset-all/<user_id>', methods=['POST'])
def reset_all_risks(user_id):
    """Reset all risk breaches for a user (admin function)"""
    db = None
    try:
        db = next(get_db())
        risk_manager = RiskControlManager(db)
        result = risk_manager.reset_all_risks(user_id)
        
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

# Enhanced Capital Allocation Endpoints

@capital_bp.route('/session/<session_id>/setup', methods=['POST'])
def setup_session_capital(session_id):
    """Setup capital allocation for a trading session with multiple strategies"""
    db = None
    try:
        data = request.get_json()
        total_capital = data.get('total_capital')
        strategy_allocations = data.get('strategy_allocations', {})
        capital_mode = data.get('capital_mode', 'custom')  # custom, initial_balance, dynamic_compounding
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        
        # Create or update portfolio based on mode
        if capital_mode == 'custom' and total_capital:
            portfolio = service.create_portfolio_with_mode(session_id, 'custom', Decimal(str(total_capital)))
        else:
            portfolio = service.create_portfolio_with_mode(session_id, capital_mode)
        
        # Allocate to strategies
        allocations = []
        for strategy_name, strategy_data in strategy_allocations.items():
            allocation_amount = Decimal(str(strategy_data['amount']))
            allocation = service.allocate_fixed_amount(portfolio.id, strategy_name, allocation_amount)
            allocations.append({
                "strategy": strategy_name,
                "allocated_capital": float(allocation.allocated_capital),
                "allocation_id": allocation.id
            })
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "portfolio_id": portfolio.id,
            "total_capital": float(portfolio.total_capital),
            "capital_mode": capital_mode,
            "strategy_allocations": allocations,
            "message": f"Capital allocation setup completed for session {session_id}"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/session/<session_id>/allocate-pair', methods=['POST'])
def allocate_pair_to_session(session_id):
    """Allocate capital to a specific pair within a strategy for a session"""
    db = None
    try:
        data = request.get_json()
        strategy_name = data.get('strategy_name')
        pair = data.get('pair')
        allocation_amount = data.get('allocation_amount')
        floating_loss_threshold_pct = data.get('floating_loss_threshold_pct', 20.0)
        
        if not all([strategy_name, pair, allocation_amount]):
            return jsonify({"error": "strategy_name, pair, and allocation_amount are required"}), 400
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        
        result = service.allocate_pair_with_capital(
            session_id, strategy_name, pair, 
            Decimal(str(allocation_amount)), 
            Decimal(str(floating_loss_threshold_pct))
        )
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/mt5/balance', methods=['GET'])
def get_mt5_balance():
    """Get current MT5 account balance"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        balance = service.get_mt5_account_balance()
        
        if balance is None:
            return jsonify({"error": "Cannot fetch MT5 balance. Check connection."}), 500
        
        return jsonify({
            "success": True,
            "balance": float(balance),
            "currency": "USD",
            "timestamp": "now"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db:
            db.close()

@capital_bp.route('/session/<session_id>/update-dynamic', methods=['POST'])
def update_dynamic_capital(session_id):
    """Update capital allocation based on current MT5 balance (for dynamic compounding mode)"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        result = service.update_dynamic_capital(session_id)
        
        if "error" in result:
            return jsonify(result), 400
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db:
            db.close()

@capital_bp.route('/trading/<session_id>/<pair>/<strategy_name>/allocation', methods=['GET'])
def get_trading_allocation(session_id, pair, strategy_name):
    """Get capital allocation info for trading decisions"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        allocation_info = service.get_capital_allocation_for_trading(session_id, pair, strategy_name)
        
        if not allocation_info:
            return jsonify({"error": "No capital allocation found for this pair/strategy"}), 404
        
        return jsonify({
            "success": True,
            "allocation": allocation_info
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db:
            db.close()

@capital_bp.route('/strategy/{user_id}/{strategy_name}/allocation', methods=['GET'])
def get_strategy_allocation(user_id, strategy_name):
    """Get allocation details for a specific strategy"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        allocation = service.get_strategy_allocation(user_id, strategy_name)
        
        if not allocation:
            return jsonify({"error": "Strategy allocation not found"}), 404
        
        return jsonify({
            "success": True,
            "allocation": allocation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@capital_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Enhanced Capital Allocation API"})