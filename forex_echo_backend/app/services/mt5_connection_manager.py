try:
    import MetaTrader5 as mt5
except ImportError:
    mt5 = None
import threading
import time
from typing import Optional, Dict, List
from app.utilities.forex_logger import forex_logger
from app.utilities.connection_decorator import require_mt5_connection, handle_mt5_errors

logger = forex_logger.get_logger(__name__)

class MT5ConnectionManager:
    """Manages MT5 connections with auto-reconnect and session persistence"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.is_connected = False
            self.connection_lock = threading.RLock()
            self.auto_reconnect = True
            self.reconnect_thread = None
            self.connection_params = {}
            self.last_error = None
            self.initialized = True
            logger.info("MT5ConnectionManager initialized")
    
    def connect(self, login: Optional[int] = None, password: Optional[str] = None, 
                server: Optional[str] = None) -> bool:
        """Connect to MT5 terminal with credential validation"""
        with self.connection_lock:
            try:
                # Store connection parameters
                if login and password and server:
                    self.connection_params = {
                        'login': login,
                        'password': password,
                        'server': server
                    }
                
                # Check if MT5 is available
                if mt5 is None:
                    self.last_error = "MetaTrader5 package not installed"
                    logger.error(self.last_error)
                    return False
                
                # Force shutdown any existing connection to prevent corrupted state
                try:
                    mt5.shutdown()
                except:
                    pass
                
                # Initialize MT5 fresh
                if not mt5.initialize():
                    error_code = mt5.last_error()
                    if "Authorization failed" in str(error_code[1]):
                        self.last_error = "MT5 terminal not running or access denied. Please start MetaTrader 5 terminal."
                    else:
                        self.last_error = f"MT5 initialization failed: {error_code[1]}"
                    logger.error(self.last_error)
                    return False
                
                # Verify terminal is available
                terminal_info = mt5.terminal_info()
                if not terminal_info:
                    error_code = mt5.last_error()
                    self.last_error = f"MT5 terminal not available: {error_code[1]}"
                    logger.error(self.last_error)
                    return False
                
                # If credentials provided, MUST login with those credentials
                if self.connection_params:
                    expected_login = self.connection_params['login']
                    
                    # Always attempt login with provided credentials
                    logger.info(f"Attempting login with provided credentials: {expected_login}")
                    
                    login_success = mt5.login(
                        self.connection_params['login'],
                        self.connection_params['password'],
                        self.connection_params['server']
                    )
                    
                    if not login_success:
                        error_code = mt5.last_error()
                        self.last_error = f"Invalid credentials: {error_code[1]} (Login: {expected_login})"
                        logger.error(self.last_error)
                        
                        # Reset connection state after failed login
                        mt5.shutdown()
                        self.is_connected = False
                        self.connection_params = {}  # Clear wrong credentials
                        return False
                    
                    # Verify correct account is logged in
                    account_info = mt5.account_info()
                    if not account_info or account_info.login != expected_login:
                        self.last_error = f"Login failed: Expected {expected_login}, got {account_info.login if account_info else 'None'}"
                        logger.error(self.last_error)
                        return False
                    
                    logger.info(f"Successfully authenticated account {account_info.login}")
                else:
                    # No credentials - use existing connection if available
                    account_info = mt5.account_info()
                    if not account_info:
                        self.last_error = "No account logged in and no credentials provided"
                        logger.error(self.last_error)
                        return False
                
                # Success - mark as connected
                self.is_connected = True
                self.last_error = None
                logger.info(f"MT5 connected successfully to account {account_info.login}")
                
                # Start auto-reconnect thread
                if self.auto_reconnect and not self.reconnect_thread:
                    self.reconnect_thread = threading.Thread(target=self._auto_reconnect_loop, daemon=True)
                    self.reconnect_thread.start()
                
                return True
                
            except Exception as e:
                self.last_error = str(e)
                logger.error(f"MT5 connection error: {e}")
                
                # Reset connection state on any error
                try:
                    mt5.shutdown()
                except:
                    pass
                self.is_connected = False
                self.connection_params = {}
                return False
    
    def disconnect(self):
        """Disconnect from MT5"""
        with self.connection_lock:
            try:
                self.auto_reconnect = False
                if self.is_connected:
                    mt5.shutdown()
                    self.is_connected = False
                    logger.info("MT5 disconnected")
                
            except Exception as e:
                logger.error(f"MT5 disconnect error: {e}")
    
    def is_terminal_connected(self) -> bool:
        """Check if MT5 terminal is connected with valid account"""
        try:
            terminal_info = mt5.terminal_info()
            if not terminal_info or not terminal_info.connected:
                self.is_connected = False
                return False
            
            # If credentials were provided, verify account is still logged in
            if self.connection_params:
                account_info = mt5.account_info()
                if not account_info or account_info.login != self.connection_params['login']:
                    self.is_connected = False
                    logger.warning("MT5 account login lost")
                    return False
            
            self.is_connected = True
            return True
            
        except Exception as e:
            logger.error(f"Error checking MT5 connection: {e}")
            self.is_connected = False
            return False
    
    def get_connection_status(self) -> Dict:
        """Get detailed connection status"""
        try:
            terminal_info = mt5.terminal_info()
            account_info = mt5.account_info()
            
            if not terminal_info:
                return {
                    'connected': False,
                    'error': self.last_error or 'Terminal not available'
                }
            
            return {
                'connected': terminal_info.connected,
                'terminal_name': terminal_info.name,
                'terminal_company': terminal_info.company,
                'terminal_build': terminal_info.build,
                'account_login': account_info.login if account_info else None,
                'account_server': account_info.server if account_info else None,
                'account_balance': account_info.balance if account_info else 0,
                'account_equity': account_info.equity if account_info else 0,
                'trade_allowed': terminal_info.trade_allowed,
                'auto_trading': terminal_info.tradeapi_disabled == False
            }
            
        except Exception as e:
            logger.error(f"Error getting connection status: {e}")
            return {
                'connected': False,
                'error': str(e)
            }
    
    def get_available_symbols(self) -> List[Dict]:
        """Get available trading symbols"""
        try:
            if not self.is_terminal_connected():
                return []
            
            symbols = mt5.symbols_get()
            if not symbols:
                return []
            
            symbol_list = []
            for symbol in symbols:
                if symbol.visible:
                    symbol_list.append({
                        'name': symbol.name,
                        'description': symbol.description,
                        'currency_base': symbol.currency_base,
                        'currency_profit': symbol.currency_profit,
                        'digits': symbol.digits,
                        'point': symbol.point,
                        'spread': symbol.spread,
                        'trade_mode': symbol.trade_mode
                    })
            
            return symbol_list
            
        except Exception as e:
            logger.error(f"Error getting symbols: {e}")
            return []
    
    def _auto_reconnect_loop(self):
        """Auto-reconnect loop running in background"""
        while self.auto_reconnect:
            try:
                time.sleep(30)  # Check every 30 seconds
                
                if not self.is_terminal_connected() and self.connection_params and self.is_connected:
                    logger.info("Attempting MT5 reconnection...")
                    self.connect(
                        self.connection_params['login'],
                        self.connection_params['password'], 
                        self.connection_params['server']
                    )
                
            except Exception as e:
                logger.error(f"Auto-reconnect error: {e}")
                time.sleep(60)  # Wait longer on error

# Global instance
mt5_connection_manager = MT5ConnectionManager()