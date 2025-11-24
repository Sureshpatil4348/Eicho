"""
Connection decorator for MT5 operations
Ensures MT5 connection is established before executing trades
"""

from functools import wraps
from typing import Optional, Dict, Any
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

def require_mt5_connection(func):
    """
    Decorator to ensure MT5 connection is established before executing trades.
    Returns None and logs error if connection is not available.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            import MetaTrader5 as mt5
            
            # Check if MT5 is initialized and connected
            terminal_info = mt5.terminal_info()
            if terminal_info is None:
                logger.error("MT5 terminal not connected - trade execution blocked")
                return None
            
            if not terminal_info.connected:
                logger.error("MT5 terminal not connected to server - trade execution blocked")
                return None
            
            # Check if trading is allowed
            if not terminal_info.trade_allowed:
                logger.error("Trading not allowed on MT5 terminal - trade execution blocked")
                return None
            
            return func(*args, **kwargs)
            
        except Exception as e:
            logger.error(f"Connection check failed: {e}")
            return None
    
    return wrapper

def require_symbol_available(symbol: str):
    """
    Decorator to ensure trading symbol is available before executing trades.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                import MetaTrader5 as mt5
                
                # Check if symbol is available
                symbol_info = mt5.symbol_info(symbol)
                if symbol_info is None:
                    logger.error(f"Symbol {symbol} not available - trade execution blocked")
                    return None
                
                if not symbol_info.visible:
                    logger.error(f"Symbol {symbol} not visible - trade execution blocked")
                    return None
                
                return func(*args, **kwargs)
                
            except Exception as e:
                logger.error(f"Symbol availability check failed: {e}")
                return None
        
        return wrapper
    return decorator

def handle_mt5_errors(func):
    """
    Decorator to handle MT5 specific errors gracefully.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            import MetaTrader5 as mt5
            
            # Get MT5 specific error if available
            mt5_error = mt5.last_error()
            if mt5_error and mt5_error[0] != 0:
                logger.error(f"MT5 Error {mt5_error[0]}: {mt5_error[1]}")
            
            logger.error(f"MT5 operation failed: {e}")
            return None
    
    return wrapper

def prevent_db_entry_without_connection(func):
    """
    Decorator to prevent database entries when MT5 connection is not established.
    This ensures trades are only logged to database when they can actually be executed.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            import MetaTrader5 as mt5
            
            # Check if MT5 is connected before allowing DB operations
            terminal_info = mt5.terminal_info()
            if terminal_info is None or not terminal_info.connected:
                logger.error("MT5 not connected - blocking database entry for trade")
                return None
            
            return func(*args, **kwargs)
            
        except Exception as e:
            logger.error(f"Connection check failed for DB operation: {e}")
            return None
    
    return wrapper