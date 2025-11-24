from flask import Blueprint, request, jsonify
try:
    import MetaTrader5 as mt5
except ImportError:
    mt5 = None
from app.core.trading_engine import TradingEngine
from app.core.session_manager import SessionManager
from app.core.strategy_manager import strategy_manager
from app.utilities.forex_logger import forex_logger
from app.schemas.trading_schemas import StartTradingRequest, TradingResponse
from app.services.capital_allocation_service import CapitalAllocationService
from app.database.database import get_db
from decimal import Decimal

logger = forex_logger.get_logger(__name__)
dynamic_trading_bp = Blueprint('dynamic_trading', __name__, url_prefix='/api/dynamic-trading')

trading_engine = TradingEngine()
session_manager = SessionManager()

@dynamic_trading_bp.route('/pairs/available', methods=['GET'])
def get_available_pairs():
    """Get available trading pairs"""
    try:
        if mt5 is None:
            return jsonify({'success': False, 'error': 'MetaTrader5 not installed'}), 500
        
        if not mt5.initialize():
            return jsonify({'success': False, 'error': 'MT5 initialization failed'}), 500
        
        symbols = mt5.symbols_get()
        if not symbols:
            return jsonify({'success': False, 'error': 'No symbols available'}), 500
        
        forex_pairs = []
        for symbol in symbols:
            if symbol.visible and (
                'USD' in symbol.name or 'EUR' in symbol.name or 
                'GBP' in symbol.name or 'JPY' in symbol.name or
                'XAU' in symbol.name or 'XAG' in symbol.name
            ):
                forex_pairs.append({
                    'symbol': symbol.name,
                    'description': symbol.description,
                    'digits': symbol.digits,
                    'spread': symbol.spread,
                    'trade_mode': symbol.trade_mode
                })
        
        return jsonify({
            'success': True,
            'pairs': forex_pairs,
            'total': len(forex_pairs)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting available pairs: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@dynamic_trading_bp.route('/timeframes/available', methods=['GET'])
def get_available_timeframes():
    """Get available timeframes"""
    timeframes = [
        {'code': '1M', 'name': '1 Minute', 'seconds': 60},
        {'code': '5M', 'name': '5 Minutes', 'seconds': 300},
        {'code': '15M', 'name': '15 Minutes', 'seconds': 900},
        {'code': '1H', 'name': '1 Hour', 'seconds': 3600},
        {'code': '4H', 'name': '4 Hours', 'seconds': 14400},
        {'code': '1D', 'name': '1 Day', 'seconds': 86400}
    ]
    
    return jsonify({
        'success': True,
        'timeframes': timeframes
    }), 200

@dynamic_trading_bp.route('/strategies/available', methods=['GET'])
def get_available_strategies():
    """Get available strategies"""
    try:
        strategies = []
        for name in strategy_manager.get_available_strategies():
            config = strategy_manager.get_strategy_config(name)
            strategies.append({
                'name': name,
                'default_config': config
            })
        
        return jsonify({
            'success': True,
            'strategies': strategies
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting available strategies: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@dynamic_trading_bp.route('/<session_id>/start', methods=['POST'])
def start_trading(session_id):
    """Start trading with professional capital allocation integration"""
    db = None
    try:
        data = request.get_json()
        pair = data.get('pair')
        timeframe = data.get('timeframe')
        strategy_name = data.get('strategy_name')
        config = data.get('config', {})
        
        if not all([pair, timeframe, strategy_name]):
            return jsonify({
                'success': False, 
                'error': 'pair, timeframe, and strategy_name are required'
            }), 400
        
        # Validate session exists
        session = session_manager.get_session(session_id)
        if not session:
            return jsonify({'success': False, 'error': 'Session not found'}), 404
        
        # Check professional capital allocation
        db = next(get_db())
        capital_service = CapitalAllocationService(db)
        user_id = capital_service.get_mt5_user_id()
        
        # Get capital allocation for this pair/strategy
        allocation_info = capital_service.get_capital_allocation_for_trading(user_id, pair, strategy_name)
        
        if not allocation_info:
            return jsonify({
                'success': False, 
                'error': f'No capital allocation found for {pair} in {strategy_name}. Please allocate capital first using /api/pro-capital endpoints.'
            }), 400
        
        if not allocation_info['can_trade']:
            return jsonify({
                'success': False,
                'error': 'Trading not allowed: Risk breached or no available capital'
            }), 400
        
        # Use capital allocation suggested lot size if not provided
        if 'lot_size' not in config or config['lot_size'] == 0:
            config['lot_size'] = allocation_info['suggested_lot_size']
        
        # Reserve capital for trading (10% of available)
        trade_amount = Decimal(str(allocation_info['available_capital'] * 0.1))
        capital_service.update_used_capital(user_id, strategy_name, pair, trade_amount, "add")
        
        # Validate strategy config
        valid, message = strategy_manager.validate_strategy_config(strategy_name, config)
        if not valid:
            return jsonify({'success': False, 'error': message}), 400
        
        # Start trading task
        success = trading_engine.start_trading_task(session_id, pair, timeframe, strategy_name, config)
        if not success:
            return jsonify({'success': False, 'error': 'Failed to start trading task'}), 500
        
        # Update session
        session_manager.add_pair_to_session(session_id, pair)
        session_manager.add_timeframe_to_session(session_id, timeframe)
        session_manager.set_strategy_config(session_id, strategy_name, config)
        
        return jsonify({
            'success': True,
            'message': f'Trading started for {pair} {timeframe} with {strategy_name}',
            'task_id': trading_engine.create_task_id(session_id, pair, timeframe, strategy_name),
            'config': config,
            'capital_allocation': {
                'allocated_capital': allocation_info['allocated_capital'],
                'used_capital': allocation_info['used_capital'] + float(trade_amount),
                'available_capital': allocation_info['available_capital'] - float(trade_amount),
                'reserved_for_trading': float(trade_amount),
                'lot_size': config['lot_size']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error starting trading: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        if db:
            db.close()

@dynamic_trading_bp.route('/<session_id>/stop', methods=['POST'])
def stop_trading(session_id):
    """Stop trading for specific pair/timeframe/strategy"""
    try:
        data = request.get_json()
        pair = data.get('pair')
        timeframe = data.get('timeframe')
        strategy_name = data.get('strategy_name')
        
        if not all([pair, timeframe, strategy_name]):
            return jsonify({
                'success': False, 
                'error': 'pair, timeframe, and strategy_name are required'
            }), 400
        
        success = trading_engine.stop_trading_task(session_id, pair, timeframe, strategy_name)
        if not success:
            return jsonify({'success': False, 'error': 'Trading task not found'}), 404
        
        return jsonify({
            'success': True,
            'message': f'Trading stopped for {pair} {timeframe} with {strategy_name}'
        }), 200
        
    except Exception as e:
        logger.error(f"Error stopping trading: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@dynamic_trading_bp.route('/<session_id>/tasks', methods=['GET'])
def get_active_tasks(session_id):
    """Get active trading tasks for session"""
    try:
        tasks = trading_engine.get_active_tasks_for_session(session_id)
        
        task_list = []
        for task in tasks:
            task_list.append({
                'pair': task.pair,
                'timeframe': task.timeframe,
                'strategy_name': task.strategy_name,
                'config': task.config,
                'is_active': task.is_active,
                'task_id': trading_engine.create_task_id(session_id, task.pair, task.timeframe, task.strategy_name)
            })
        
        return jsonify({
            'success': True,
            'tasks': task_list,
            'total': len(task_list)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting active tasks: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@dynamic_trading_bp.route('/<session_id>/market-data/<pair>/<timeframe>', methods=['GET'])
def get_market_data(session_id, pair, timeframe):
    """Get current market data for pair/timeframe"""
    try:
        if mt5 is None:
            return jsonify({'success': False, 'error': 'MetaTrader5 not installed'}), 500
        
        if not mt5.initialize():
            return jsonify({'success': False, 'error': 'MT5 initialization failed'}), 500
        
        timeframe_map = {
            "1M": mt5.TIMEFRAME_M1,
            "5M": mt5.TIMEFRAME_M5,
            "15M": mt5.TIMEFRAME_M15,
            "1H": mt5.TIMEFRAME_H1,
            "4H": mt5.TIMEFRAME_H4,
            "1D": mt5.TIMEFRAME_D1
        }
        
        mt5_timeframe = timeframe_map.get(timeframe, mt5.TIMEFRAME_M15)
        
        rates = mt5.copy_rates_from_pos(pair, mt5_timeframe, 0, 100)
        if rates is None:
            return jsonify({'success': False, 'error': f'No data for {pair}'}), 404
        
        tick = mt5.symbol_info_tick(pair)
        
        candles = []
        for rate in rates:
            candles.append({
                'timestamp': int(rate['time']),
                'open': float(rate['open']),
                'high': float(rate['high']),
                'low': float(rate['low']),
                'close': float(rate['close']),
                'volume': int(rate['tick_volume'])
            })
        
        return jsonify({
            'success': True,
            'pair': pair,
            'timeframe': timeframe,
            'candles': candles,
            'current_tick': {
                'bid': float(tick.bid) if tick else 0,
                'ask': float(tick.ask) if tick else 0,
                'time': int(tick.time) if tick else 0
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting market data: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@dynamic_trading_bp.route('/<session_id>/capital-info/<pair>/<strategy_name>', methods=['GET'])
def get_capital_info(session_id, pair, strategy_name):
    """Get capital allocation information for a specific pair/strategy"""
    db = None
    try:
        db = next(get_db())
        capital_service = CapitalAllocationService(db)
        
        allocation_info = capital_service.get_capital_allocation_for_trading(session_id, pair, strategy_name)
        
        if not allocation_info:
            return jsonify({
                'success': False,
                'error': 'No capital allocation found for this pair/strategy combination'
            }), 404
        
        return jsonify({
            'success': True,
            'capital_info': allocation_info
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting capital info: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        if db:
            db.close()