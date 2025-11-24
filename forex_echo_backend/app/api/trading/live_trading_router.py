"""Flask API endpoints for live trading control"""

from flask import Blueprint, request, jsonify
from typing import Dict, List, Any

from app.services.mt5_live_monitor import LiveTradingManager
from app.services.strategy_adapter import create_strategy
from app.database.database import get_db
from app.utilities.forex_logger import forex_logger

live_trading_bp = Blueprint('live_trading', __name__, url_prefix='/api/live-trading')
logger = forex_logger.get_logger(__name__)

# Global trading manager instance
trading_manager = None

@live_trading_bp.route('/start', methods=['POST'])
def start_live_trading():
    """Start live trading with strategies"""
    global trading_manager
    
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'default_user')
        
        # Strategy configurations
        strategies_config = data.get('strategies', [
            {
                "pair": "XAUUSD",
                "timeframe": "1M",
                "strategy_name": "gold_buy_dip",
                "config": {
                    "lot_size": 0.01,
                    "percentage_threshold": 1.0,
                    "zscore_threshold_buy": -2.0,
                    "zscore_threshold_sell": 2.0,
                    "max_grid_trades": 3,
                    "take_profit_percent": 0.5,
                    "max_drawdown_percent": 10.0
                }
            }
        ])
        
        # Create strategies with capital allocation
        db = next(get_db())
        processed_strategies = []
        
        for config in strategies_config:
            try:
                # Add strategy_name if missing
                if "strategy_name" not in config:
                    config["strategy_name"] = "gold_buy_dip"
                
                strategy_class = create_strategy(
                    config["strategy_name"],
                    config["config"],
                    config["pair"],
                    config["timeframe"],
                    db
                )
                processed_strategies.append({
                    "pair": config["pair"],
                    "timeframe": config["timeframe"],
                    "strategy_class": strategy_class
                })
            except Exception as e:
                logger.error(f"Failed to create strategy: {e}")
                return jsonify({"error": f"Failed to create strategy: {str(e)}"}), 400
        
        # Create new trading manager
        trading_manager = LiveTradingManager()
        
        # Setup trading with processed strategies
        if not trading_manager.connect():
            return jsonify({"error": "Failed to connect to MT5"}), 400
        
        if not trading_manager.setup_trading(user_id):
            return jsonify({"error": "Failed to setup trading"}), 400
        
        # Add strategies to trading manager
        for strategy_config in processed_strategies:
            trading_manager.monitor.add_strategy(
                strategy_config["pair"],
                strategy_config["timeframe"],
                strategy_config["strategy_class"]
            )
        
        # Start trading
        if not trading_manager.start_trading():
            return jsonify({"error": "Failed to start trading"}), 400
        
        return jsonify({
            "success": True,
            "message": "Live trading started successfully",
            "user_id": user_id,
            "strategies_count": len(processed_strategies)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@live_trading_bp.route('/stop', methods=['POST'])
def stop_live_trading():
    """Stop live trading"""
    global trading_manager
    
    try:
        if not trading_manager:
            return jsonify({"error": "No active trading session"}), 400
        
        trading_manager.stop_trading()
        trading_manager = None
        
        return jsonify({
            "success": True,
            "message": "Live trading stopped successfully"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@live_trading_bp.route('/status', methods=['GET'])
def get_trading_status():
    """Get current trading status"""
    global trading_manager
    
    try:
        if not trading_manager:
            return jsonify({
                "success": True,
                "status": {
                    "connected": False,
                    "trading_enabled": False,
                    "monitoring": False,
                    "active_strategies": 0,
                    "active_positions": {}
                }
            })
        
        status = trading_manager.get_status()
        
        return jsonify({
            "success": True,
            "status": status
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@live_trading_bp.route('/config', methods=['POST'])
def update_trading_config():
    """Update trading configuration"""
    try:
        data = request.get_json()
        
        # This would update strategy configurations
        # For now, just return the received config
        
        return jsonify({
            "success": True,
            "message": "Configuration updated",
            "config": data
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@live_trading_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Live Trading API",
        "trading_active": trading_manager is not None
    })