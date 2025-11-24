from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from datetime import datetime, timezone
import time
from socket import gethostname
from platform import node, system, version, python_version
from app.utilities.forex_logger import forex_logger

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import Flask blueprints
from app.api.auth.flask_router import auth_bp

# Import new dynamic trading system
from app.api.trading.session_router import session_bp
from app.api.trading.dynamic_trading_router import dynamic_trading_bp
from app.api.trading.mt5_router import mt5_bp
from app.api.trading.recovery_router import recovery_bp
from app.api.trading.capital_allocation_router import capital_bp
from app.api.trading.professional_capital_router import pro_capital_bp
from app.api.trading.mt5_trades_router import mt5_trades_bp
from app.api.trading.live_trading_router import live_trading_bp
from app.api.trading.strategy_list_router import strategy_list_bp


# Initialize database tables
from app.database.database import create_tables

# Initialize core components
from app.core.trading_engine import TradingEngine
from app.core.strategy_manager import strategy_manager
from app.services.enhanced_gold_buy_dip_strategy import EnhancedGoldBuyDipStrategy
from app.services.enhanced_rsi_pairs_strategy import EnhancedRSIPairsStrategy

# Create database tables on startup
create_tables()


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Setup logging
logger = forex_logger.get_logger(__name__)

# Enable CORS
CORS(app, origins=["*"], supports_credentials=True)

# Register blueprints
app.register_blueprint(auth_bp)

# Register new dynamic trading blueprints
app.register_blueprint(session_bp)
app.register_blueprint(dynamic_trading_bp)
app.register_blueprint(mt5_bp)
app.register_blueprint(recovery_bp)
app.register_blueprint(capital_bp)
app.register_blueprint(pro_capital_bp)
app.register_blueprint(mt5_trades_bp)
app.register_blueprint(live_trading_bp)
app.register_blueprint(strategy_list_bp)


# Initialize trading engine and register strategies
trading_engine = TradingEngine()

# Register Gold Buy Dip Strategy with default config
gold_default_config = {
    "lot_size": 0.01,
    "percentage_threshold": 2.0,
    "zscore_threshold_buy": -3.0,
    "zscore_threshold_sell": 3.0,
    "take_profit_percent": 1.0,
    "max_grid_trades": 5
}
strategy_manager.register_strategy('gold_buy_dip', EnhancedGoldBuyDipStrategy, gold_default_config)

# Register RSI Pairs Strategy with default config
rsi_default_config = {
    "lot_size": 0.01,
    "symbol1": "EURUSD",
    "symbol2": "GBPUSD",
    "rsi_period": 14,
    "rsi_overbought": 70,
    "rsi_oversold": 30,
    "mode": "negative"
}
strategy_manager.register_strategy('rsi_pairs', EnhancedRSIPairsStrategy, rsi_default_config)

# Register strategies with trading engine
trading_engine.register_strategy('gold_buy_dip', EnhancedGoldBuyDipStrategy)
trading_engine.register_strategy('rsi_pairs', EnhancedRSIPairsStrategy)

start_time = time.time()

@app.route("/", methods=["GET"])
def root_redirect():
    return redirect("/health")

@app.route("/health", methods=["GET"])
def health_check():
    try:
        current_time = time.time()
        uptime_seconds = int(current_time - start_time)

        response = {
            "status": "ok",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "uptime_seconds": uptime_seconds,
            "hostname": gethostname(),
            "server": node(),
            "os": system(),
            "os_version": version(),
            "python_version": python_version()
        }
        
        logger.info("Health check requested")
        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({"error": f"Health check failed: {str(e)}"}), 500

@app.errorhandler(404)
def not_found(error):
    logger.warning(f"404 error: {request.url}")
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 error: {str(error)}")
    return jsonify({"error": "Internal server error"}), 500

# Server now runs via uvicorn in run.py