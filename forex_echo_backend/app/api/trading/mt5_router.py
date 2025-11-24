from flask import Blueprint, request, jsonify
from app.services.mt5_connection_manager import mt5_connection_manager
from app.core.session_manager import SessionManager
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)
mt5_bp = Blueprint('mt5', __name__, url_prefix='/api/mt5')

session_manager = SessionManager()

@mt5_bp.route('/connect', methods=['POST'])
def connect_mt5():
    """Connect to MT5 terminal with required credentials"""
    try:
        data = request.get_json() or {}
        login = data.get('login')
        password = data.get('password')
        server = data.get('server')
        session_id = data.get('session_id')
        
        # Require credentials for connection (session_id is optional)
        if not all([login, password, server]):
            return jsonify({
                'success': False,
                'error': 'Missing required credentials',
                'details': 'login, password, and server are required'
            }), 400
        
        success = mt5_connection_manager.connect(login, password, server)
        
        # Update session if provided
        if session_id and success:
            session_manager.update_session(session_id, mt5_connected=True)
        
        if success:
            status = mt5_connection_manager.get_connection_status()
            return jsonify({
                'success': True,
                'message': 'MT5 connected successfully',
                'status': status
            }), 200
        else:
            # Get detailed error from connection manager
            status = mt5_connection_manager.get_connection_status()
            error_msg = status.get('error', 'Failed to connect to MT5')
            
            return jsonify({
                'success': False,
                'error': error_msg,
                'details': 'Check credentials and MT5 terminal'
            }), 400
            
    except Exception as e:
        logger.error(f"Error connecting to MT5: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@mt5_bp.route('/disconnect', methods=['POST'])
def disconnect_mt5():
    """Disconnect from MT5 terminal"""
    try:
        data = request.get_json() or {}
        session_id = data.get('session_id')
        
        mt5_connection_manager.disconnect()
        
        # Update session if provided
        if session_id:
            session_manager.update_session(session_id, mt5_connected=False)
        
        return jsonify({
            'success': True,
            'message': 'MT5 disconnected successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error disconnecting from MT5: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@mt5_bp.route('/status', methods=['GET'])
def get_mt5_status():
    """Get MT5 connection status"""
    try:
        status = mt5_connection_manager.get_connection_status()
        
        return jsonify({
            'success': True,
            'status': status
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting MT5 status: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@mt5_bp.route('/symbols', methods=['GET'])
def get_symbols():
    """Get available trading symbols"""
    try:
        symbols = mt5_connection_manager.get_available_symbols()
        
        return jsonify({
            'success': True,
            'symbols': symbols,
            'total': len(symbols)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting symbols: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@mt5_bp.route('/account-info', methods=['GET'])
def get_account_info():
    """Get MT5 account information"""
    try:
        status = mt5_connection_manager.get_connection_status()
        
        if not status.get('connected'):
            return jsonify({
                'success': False,
                'error': 'MT5 not connected'
            }), 400
        
        return jsonify({
            'success': True,
            'account': {
                'login': status.get('account_login'),
                'server': status.get('account_server'),
                'balance': status.get('account_balance'),
                'equity': status.get('account_equity'),
                'trade_allowed': status.get('trade_allowed'),
                'auto_trading': status.get('auto_trading')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting account info: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500