"""Professional Capital Allocation API - Single Portfolio Per User"""

from flask import Blueprint, request, jsonify
from typing import Dict, List, Any
from decimal import Decimal

from app.database.database import get_db
from app.services.capital_allocation_service import CapitalAllocationService

pro_capital_bp = Blueprint('pro_capital', __name__, url_prefix='/api/pro-capital')

@pro_capital_bp.route('/portfolio', methods=['GET'])
def get_user_portfolio():
    """Get user's single portfolio (creates if not exists)"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        portfolio = service.get_or_create_user_portfolio(user_id)
        summary = service.get_portfolio_summary(user_id)
        
        return jsonify({
            "success": True,
            "user_id": user_id,
            "portfolio_id": portfolio.id,
            "portfolio": summary
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/strategy/add', methods=['POST'])
def add_strategy_capital():
    """Add capital to strategy (creates strategy if not exists)"""
    db = None
    try:
        data = request.get_json()
        strategy_name = data.get('strategy_name')
        amount = data.get('amount')
        
        if not all([strategy_name, amount]):
            return jsonify({"error": "strategy_name and amount are required"}), 400
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        result = service.add_strategy_capital(user_id, strategy_name, Decimal(str(amount)))
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/strategy/remove', methods=['POST'])
def remove_strategy_capital():
    """Remove capital from strategy"""
    db = None
    try:
        data = request.get_json()
        strategy_name = data.get('strategy_name')
        amount = data.get('amount')
        
        if not all([strategy_name, amount]):
            return jsonify({"error": "strategy_name and amount are required"}), 400
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        result = service.remove_strategy_capital(user_id, strategy_name, Decimal(str(amount)))
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/strategy/<strategy_name>/pair/add', methods=['POST'])
def add_pair_to_strategy(strategy_name):
    """Allocate capital from strategy to specific pair"""
    db = None
    try:
        data = request.get_json()
        pair = data.get('pair')
        amount = data.get('amount')
        floating_loss_threshold_pct = data.get('floating_loss_threshold_pct', 20.0)
        
        if not all([pair, amount]):
            return jsonify({"error": "pair and amount are required"}), 400
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        result = service.allocate_pair_to_strategy(
            user_id, strategy_name, pair, 
            Decimal(str(amount)), 
            Decimal(str(floating_loss_threshold_pct))
        )
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/strategy/<strategy_name>/details', methods=['GET'])
def get_strategy_details(strategy_name):
    """Get detailed strategy allocation info"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        allocation = service.get_strategy_allocation(user_id, strategy_name)
        
        if not allocation:
            return jsonify({"error": "Strategy not found"}), 404
        
        return jsonify({
            "success": True,
            "strategy": allocation
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/balance', methods=['GET'])
def get_mt5_balance():
    """Get current MT5 account balance"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        balance = service.get_mt5_account_balance()
        
        if balance is None:
            return jsonify({"error": "Cannot fetch MT5 balance"}), 500
        
        return jsonify({
            "success": True,
            "balance": float(balance),
            "currency": "USD"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/trading/<strategy_name>/<pair>/allocation', methods=['GET'])
def get_trading_allocation(strategy_name, pair):
    """Get capital allocation for trading decisions"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        allocation = service.get_capital_allocation_for_trading(user_id, pair, strategy_name)
        
        if not allocation:
            return jsonify({"error": "No allocation found for this pair/strategy"}), 404
        
        return jsonify({
            "success": True,
            "allocation": allocation
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/trading/<strategy_name>/<pair>/use-capital', methods=['POST'])
def use_capital_for_trade(strategy_name, pair):
    """Update used capital when placing a trade"""
    db = None
    try:
        data = request.get_json()
        trade_amount = data.get('trade_amount')
        operation = data.get('operation', 'add')  # 'add' or 'remove'
        
        if not trade_amount:
            return jsonify({"error": "trade_amount is required"}), 400
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        result = service.update_used_capital(
            user_id, strategy_name, pair, 
            Decimal(str(trade_amount)), operation
        )
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/start-trading/<strategy_name>/<pair>', methods=['POST'])
def start_trading_with_allocation(strategy_name, pair):
    """Start trading with capital allocation integration"""
    db = None
    try:
        data = request.get_json()
        timeframe = data.get('timeframe', '15M')
        config = data.get('config', {})
        
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        # Get allocation info
        allocation = service.get_capital_allocation_for_trading(user_id, pair, strategy_name)
        if not allocation:
            return jsonify({"error": "No capital allocation found. Allocate capital to this pair first."}), 400
        
        if not allocation['can_trade']:
            return jsonify({"error": "Trading not allowed: Risk breached or no available capital"}), 400
        
        # Calculate lot size based on available capital
        suggested_lot_size = allocation['suggested_lot_size']
        
        # Override config with calculated lot size
        config['lot_size'] = suggested_lot_size
        
        # Start trading via dynamic trading API
        import requests
        trading_response = requests.post(f"http://127.0.0.1:8000/api/dynamic-trading/{user_id}/start", json={
            "pair": pair,
            "timeframe": timeframe,
            "strategy_name": strategy_name,
            "config": config
        })
        
        if trading_response.status_code == 200:
            # Mark capital as used (reserve for trading)
            trade_amount = Decimal(str(allocation['available_capital'] * 0.1))  # Use 10% initially
            service.update_used_capital(user_id, strategy_name, pair, trade_amount, "add")
            
            return jsonify({
                "success": True,
                "message": f"Started trading {pair} with {strategy_name}",
                "lot_size": suggested_lot_size,
                "reserved_capital": float(trade_amount),
                "trading_response": trading_response.json()
            })
        else:
            return jsonify({
                "error": "Failed to start trading",
                "trading_error": trading_response.json()
            }), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/analytics/dashboard', methods=['GET'])
def get_analytics_dashboard():
    """Get comprehensive analytics for capital allocation dashboard"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        analytics = service.get_comprehensive_analytics(user_id)
        
        if "error" in analytics:
            return jsonify(analytics), 404
        
        return jsonify(analytics)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/analytics/pairs-summary', methods=['GET'])
def get_pairs_summary():
    """Get cross-strategy pair aggregation summary"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        pairs_summary = service.get_pairs_cross_strategy_summary(user_id)
        
        return jsonify({
            "success": True,
            "pairs": pairs_summary,
            "count": len(pairs_summary)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/analytics/allocation-breakdown', methods=['GET'])
def get_allocation_breakdown():
    """Get breakdown of allocations by method"""
    db = None
    try:
        db = next(get_db())
        service = CapitalAllocationService(db)
        user_id = service.get_mt5_user_id()
        
        breakdown = service.get_allocation_method_breakdown(user_id)
        
        if "error" in breakdown:
            return jsonify(breakdown), 404
        
        return jsonify(breakdown)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db:
            db.close()

@pro_capital_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Professional Capital Allocation API"})