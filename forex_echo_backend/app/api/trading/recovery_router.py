from flask import Blueprint, request, jsonify
from app.core.session_manager import SessionManager
from app.core.trading_engine import TradingEngine
from app.services.session_persistence_service import session_persistence
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)
recovery_bp = Blueprint('recovery', __name__, url_prefix='/api/recovery')

session_manager = SessionManager()
trading_engine = TradingEngine()

@recovery_bp.route('/session/<session_id>', methods=['POST'])
def recover_session(session_id):
    """Recover session from database and restart trading tasks"""
    try:
        # Load session from database
        session = session_persistence.load_session(session_id)
        if not session:
            return jsonify({
                'success': False,
                'error': 'Session not found in database'
            }), 404
        
        # Restore session in memory
        session_manager.sessions[session_id] = session
        logger.info(f"Session {session_id} restored to memory")
        
        # Get active trading tasks from database
        active_tasks = session_persistence.get_active_tasks_for_session(session_id)
        
        # Restart trading tasks
        restarted_tasks = []
        failed_tasks = []
        
        for task_data in active_tasks:
            try:
                success = trading_engine.start_trading_task(
                    session_id=task_data['session_id'],
                    pair=task_data['pair'],
                    timeframe=task_data['timeframe'],
                    strategy_name=task_data['strategy_name'],
                    config=task_data['config']
                )
                
                if success:
                    restarted_tasks.append({
                        'task_id': task_data['task_id'],
                        'pair': task_data['pair'],
                        'timeframe': task_data['timeframe'],
                        'strategy_name': task_data['strategy_name']
                    })
                else:
                    failed_tasks.append(task_data['task_id'])
                    
            except Exception as e:
                logger.error(f"Error restarting task {task_data['task_id']}: {e}")
                failed_tasks.append(task_data['task_id'])
        
        return jsonify({
            'success': True,
            'message': f'Session {session_id} recovered successfully',
            'session': {
                'session_id': session.session_id,
                'user_id': session.user_id,
                'active_pairs': session.active_pairs,
                'active_timeframes': session.active_timeframes,
                'active_strategies': list(session.active_strategies.keys()),
                'created_at': session.created_at.isoformat(),
                'last_activity': session.last_activity.isoformat()
            },
            'restarted_tasks': restarted_tasks,
            'failed_tasks': failed_tasks,
            'total_tasks_found': len(active_tasks),
            'tasks_restarted': len(restarted_tasks)
        }), 200
        
    except Exception as e:
        logger.error(f"Error recovering session {session_id}: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@recovery_bp.route('/user/<user_id>/sessions', methods=['GET'])
def get_user_sessions(user_id):
    """Get all sessions for a user"""
    try:
        sessions = session_persistence.get_user_sessions(user_id, active_only=True)
        
        session_list = []
        for session in sessions:
            # Get active tasks count
            active_tasks = session_persistence.get_active_tasks_for_session(session.session_id)
            
            session_list.append({
                'session_id': session.session_id,
                'user_id': session.user_id,
                'active_pairs': session.active_pairs,
                'active_timeframes': session.active_timeframes,
                'active_strategies': list(session.active_strategies.keys()),
                'active_tasks_count': len(active_tasks),
                'is_active': session.is_active,
                'mt5_connected': session.mt5_connected,
                'created_at': session.created_at.isoformat(),
                'last_activity': session.last_activity.isoformat()
            })
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'sessions': session_list,
            'total': len(session_list)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting user sessions: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@recovery_bp.route('/session/<session_id>/tasks', methods=['GET'])
def get_session_tasks(session_id):
    """Get all tasks for a session from database"""
    try:
        tasks = session_persistence.get_active_tasks_for_session(session_id)
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'tasks': tasks,
            'total': len(tasks)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting session tasks: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@recovery_bp.route('/auto-recover', methods=['POST'])
def auto_recover_all_sessions():
    """Auto-recover all active sessions from database"""
    try:
        data = request.get_json() or {}
        user_id = data.get('user_id')
        
        if user_id:
            # Recover sessions for specific user
            sessions = session_persistence.get_user_sessions(user_id, active_only=True)
        else:
            # This would require a method to get all active sessions
            # For now, return error asking for user_id
            return jsonify({
                'success': False,
                'error': 'user_id is required for auto-recovery'
            }), 400
        
        recovered_sessions = []
        failed_sessions = []
        total_tasks_restarted = 0
        
        for session in sessions:
            try:
                # Restore session in memory
                session_manager.sessions[session.session_id] = session
                
                # Get and restart tasks
                active_tasks = session_persistence.get_active_tasks_for_session(session.session_id)
                restarted_count = 0
                
                for task_data in active_tasks:
                    try:
                        success = trading_engine.start_trading_task(
                            session_id=task_data['session_id'],
                            pair=task_data['pair'],
                            timeframe=task_data['timeframe'],
                            strategy_name=task_data['strategy_name'],
                            config=task_data['config']
                        )
                        if success:
                            restarted_count += 1
                    except Exception as e:
                        logger.error(f"Error restarting task: {e}")
                
                recovered_sessions.append({
                    'session_id': session.session_id,
                    'tasks_restarted': restarted_count,
                    'total_tasks': len(active_tasks)
                })
                total_tasks_restarted += restarted_count
                
            except Exception as e:
                logger.error(f"Error recovering session {session.session_id}: {e}")
                failed_sessions.append(session.session_id)
        
        return jsonify({
            'success': True,
            'message': 'Auto-recovery completed',
            'recovered_sessions': recovered_sessions,
            'failed_sessions': failed_sessions,
            'total_sessions_recovered': len(recovered_sessions),
            'total_tasks_restarted': total_tasks_restarted
        }), 200
        
    except Exception as e:
        logger.error(f"Error in auto-recovery: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500