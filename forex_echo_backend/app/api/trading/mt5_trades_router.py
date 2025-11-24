"""MT5 Trades and Positions Router"""

from flask import Blueprint, jsonify
try:
    import MetaTrader5 as mt5
except ImportError:
    mt5 = None

mt5_trades_bp = Blueprint('mt5_trades', __name__, url_prefix='/api/mt5')

@mt5_trades_bp.route('/positions', methods=['GET'])
def get_positions():
    """Get current open positions"""
    try:
        if not mt5 or not mt5.initialize():
            return jsonify({"error": "MT5 not available"}), 500
        
        positions = mt5.positions_get()
        if positions is None:
            positions = []
        
        position_list = []
        for pos in positions:
            from datetime import datetime
            open_time = datetime.fromtimestamp(pos.time)
            position_list.append({
                "ticket": pos.ticket,
                "symbol": pos.symbol,
                "type": "BUY" if pos.type == 0 else "SELL",
                "volume": pos.volume,
                "price_open": pos.price_open,
                "price_current": pos.price_current,
                "profit": pos.profit,
                "comment": pos.comment,
                "open_time": open_time.strftime("%Y-%m-%d %H:%M:%S"),
                "minutes_ago": int((datetime.now() - open_time).total_seconds() / 60)
            })
        
        return jsonify({
            "success": True,
            "positions": position_list,
            "count": len(position_list)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mt5_trades_bp.route('/history', methods=['GET'])
def get_trade_history():
    """Get recent trade history"""
    try:
        if not mt5 or not mt5.initialize():
            return jsonify({"error": "MT5 not available"}), 500
        
        from datetime import datetime, timedelta
        
        # Get trades from last hour
        now = datetime.now()
        from_date = now - timedelta(hours=1)
        
        deals = mt5.history_deals_get(from_date, now)
        if deals is None:
            deals = []
        
        deal_list = []
        for deal in deals:
            from datetime import datetime
            deal_time = datetime.fromtimestamp(deal.time)
            deal_list.append({
                "ticket": deal.ticket,
                "symbol": deal.symbol,
                "type": "BUY" if deal.type == 0 else "SELL",
                "volume": deal.volume,
                "price": deal.price,
                "profit": deal.profit,
                "time": deal_time.strftime("%Y-%m-%d %H:%M:%S"),
                "minutes_ago": int((datetime.now() - deal_time).total_seconds() / 60),
                "comment": deal.comment
            })
        
        return jsonify({
            "success": True,
            "deals": deal_list,
            "count": len(deal_list)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500