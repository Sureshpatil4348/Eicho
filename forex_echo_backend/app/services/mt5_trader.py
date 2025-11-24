import MetaTrader5 as mt5
from typing import Optional, Dict
from app.utilities.forex_logger import forex_logger
from app.utilities.connection_decorator import require_mt5_connection, handle_mt5_errors

logger = forex_logger.get_logger(__name__)

class MT5Trader:
    def __init__(self):
        self.symbol = "XAUUSD"
        self.magic_number = 12345
    
    @require_mt5_connection
    @handle_mt5_errors
    def place_order(self, action: str, lot_size: float, take_profit: Optional[float] = None) -> Optional[Dict]:
        """Place buy/sell order on MT5."""
        if not mt5.terminal_info():
            logger.error("MT5 terminal not connected")
            return None
        
        try:
            tick = mt5.symbol_info_tick(self.symbol)
            if not tick:
                logger.error(f"Failed to get tick for {self.symbol}")
                return None
            
            if action == "BUY":
                order_type = mt5.ORDER_TYPE_BUY
                price = tick.ask
                sl = None  # No stop loss for grid strategy
                tp = take_profit if take_profit else None
            elif action == "SELL":
                order_type = mt5.ORDER_TYPE_SELL
                price = tick.bid
                sl = None
                tp = take_profit if take_profit else None
            else:
                logger.error(f"Invalid action: {action}")
                return None
            
            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": self.symbol,
                "volume": lot_size,
                "type": order_type,
                "price": price,
                "magic": self.magic_number,
                "comment": f"Gold Buy Dip - {action}",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }
            
            # Only add sl/tp if they have values
            if sl is not None:
                request["sl"] = sl
            if tp is not None:
                request["tp"] = tp
            
            # Log the exact request being sent
            logger.info(f"Sending MT5 order: {request}")
            
            result = mt5.order_send(request)
            
            if result is None:
                # Get last error from MT5
                last_error = mt5.last_error()
                logger.error(f"MT5 order_send returned None. Last error: {last_error}")
                logger.error(f"Request sent: {request}")
                return None
                
            if result.retcode != mt5.TRADE_RETCODE_DONE:
                logger.error(f"MT5 Order rejected: Code {result.retcode} - {result.comment}")
                logger.error(f"Request: {request}")
                logger.error(f"Full result: {result._asdict() if hasattr(result, '_asdict') else result}")
                return None
            
            logger.info(f"Order placed: {action} {lot_size} lots at {price} (Ticket: {result.order})")
            
            return {
                "ticket": result.order,
                "action": action,
                "volume": lot_size,
                "price": price,
                "take_profit": tp,
                "retcode": result.retcode
            }
            
        except Exception as e:
            # Let the actual error bubble up
            raise e
    
    @require_mt5_connection
    @handle_mt5_errors
    def close_all_positions(self) -> bool:
        """Close all open positions for this symbol."""
        try:
            positions = mt5.positions_get(symbol=self.symbol)
            if not positions:
                logger.info("No positions to close")
                return True
            
            closed_count = 0
            for position in positions:
                if position.magic == self.magic_number:
                    close_type = mt5.ORDER_TYPE_SELL if position.type == mt5.ORDER_TYPE_BUY else mt5.ORDER_TYPE_BUY
                    close_price = mt5.symbol_info_tick(self.symbol).bid if position.type == mt5.ORDER_TYPE_BUY else mt5.symbol_info_tick(self.symbol).ask
                    
                    request = {
                        "action": mt5.TRADE_ACTION_DEAL,
                        "symbol": self.symbol,
                        "volume": position.volume,
                        "type": close_type,
                        "position": position.ticket,
                        "price": close_price,
                        "magic": self.magic_number,
                        "comment": "Grid close all",
                        "type_time": mt5.ORDER_TIME_GTC,
                        "type_filling": mt5.ORDER_FILLING_IOC,
                    }
                    
                    result = mt5.order_send(request)
                    if result.retcode == mt5.TRADE_RETCODE_DONE:
                        closed_count += 1
                        logger.info(f"Position closed: {position.ticket}")
                    else:
                        logger.error(f"Failed to close position {position.ticket}: {result.comment}")
            
            logger.info(f"Closed {closed_count}/{len(positions)} positions")
            return closed_count > 0
            
        except Exception as e:
            logger.error(f"Error closing positions: {e}")
            return False