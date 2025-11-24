from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from app.core.session_manager import SessionManager
from app.utilities.forex_logger import forex_logger
from app.schemas.trading_schemas import CreateSessionRequest, SessionStatusResponse

logger = forex_logger.get_logger(__name__)
session_bp = Blueprint('session', __name__, url_prefix='/api/session')

session_manager = SessionManager()

@session_bp.route('/create', methods=['POST'])
def create_session():
    """Create new trading session"""
    try:
        data = request.get_json() or {}
        user_id = data.get('user_id', 'default_user')
        session_id = str(uuid.uuid4())
        
        session = session_manager.create_session(session_id, user_id)
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'created_at': session.created_at.isoformat(),
            'message': 'Session created successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error creating session: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/<session_id>/status', methods=['GET'])
def get_session_status(session_id):
    """Get session status"""
    try:
        session = session_manager.get_session(session_id)
        if not session:
            return jsonify({'success': False, 'error': 'Session not found'}), 404
        
        return jsonify({
            'success': True,
            'session': {
                'session_id': session.session_id,
                'user_id': session.user_id,
                'active_pairs': session.active_pairs,
                'active_timeframes': session.active_timeframes,
                'active_strategies': session.active_strategies,
                'is_active': session.is_active,
                'mt5_connected': session.mt5_connected,
                'created_at': session.created_at.isoformat(),
                'last_activity': session.last_activity.isoformat()
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting session status: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/<session_id>/pairs', methods=['POST'])
def add_pair_to_session(session_id):
    """Add trading pair to session"""
    try:
        data = request.get_json()
        pair = data.get('pair')
        
        if not pair:
            return jsonify({'success': False, 'error': 'Pair is required'}), 400
        
        success = session_manager.add_pair_to_session(session_id, pair)
        if not success:
            return jsonify({'success': False, 'error': 'Session not found'}), 404
        
        return jsonify({
            'success': True,
            'message': f'Pair {pair} added to session'
        }), 200
        
    except ValueError as e:
        # Handle validation errors (like invalid pair)
        logger.warning(f"Validation error adding pair: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error adding pair to session: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/<session_id>/pairs/<pair>', methods=['DELETE'])
def remove_pair_from_session(session_id, pair):
    """Remove trading pair from session"""
    try:
        success = session_manager.remove_pair_from_session(session_id, pair)
        if not success:
            return jsonify({'success': False, 'error': 'Session not found'}), 404
        
        return jsonify({
            'success': True,
            'message': f'Pair {pair} removed from session'
        }), 200
        
    except Exception as e:
        logger.error(f"Error removing pair from session: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/<session_id>/timeframes', methods=['POST'])
def add_timeframe_to_session(session_id):
    """Add timeframe to session"""
    try:
        data = request.get_json()
        timeframe = data.get('timeframe')
        
        if not timeframe:
            return jsonify({'success': False, 'error': 'Timeframe is required'}), 400
        
        success = session_manager.add_timeframe_to_session(session_id, timeframe)
        if not success:
            return jsonify({'success': False, 'error': 'Session not found'}), 404
        
        return jsonify({
            'success': True,
            'message': f'Timeframe {timeframe} added to session'
        }), 200
        
    except Exception as e:
        logger.error(f"Error adding timeframe to session: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/<session_id>/strategies', methods=['POST'])
def set_strategy_config(session_id):
    """Set strategy configuration for session"""
    try:
        data = request.get_json()
        strategy_name = data.get('strategy_name')
        config = data.get('config', {})
        
        if not strategy_name:
            return jsonify({'success': False, 'error': 'Strategy name is required'}), 400
        
        success = session_manager.set_strategy_config(session_id, strategy_name, config)
        if not success:
            return jsonify({'success': False, 'error': 'Session not found'}), 404
        
        return jsonify({
            'success': True,
            'message': f'Strategy {strategy_name} configured for session'
        }), 200
        
    except Exception as e:
        logger.error(f"Error setting strategy config: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/active', methods=['GET'])
def get_active_sessions():
    """Get all active sessions"""
    try:
        sessions = session_manager.get_all_active_sessions()
        
        session_list = []
        for session_id, session in sessions.items():
            session_list.append({
                'session_id': session.session_id,
                'user_id': session.user_id,
                'active_pairs': session.active_pairs,
                'active_timeframes': session.active_timeframes,
                'active_strategies': list(session.active_strategies.keys()),
                'created_at': session.created_at.isoformat(),
                'last_activity': session.last_activity.isoformat()
            })
        
        return jsonify({
            'success': True,
            'sessions': session_list,
            'total': len(session_list)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting active sessions: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500