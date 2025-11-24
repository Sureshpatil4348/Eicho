import csv
import os
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from app.models.trading_models import TradeSignal

class ForexLogger:
    """Centralized logging for professional forex systems"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.base_path = "data/logs"
            os.makedirs(self.base_path, exist_ok=True)
            self._setup_app_logger()
            self.initialized = True
    
    def _setup_app_logger(self):
        """Setup application logger"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(name)s] %(levelname)s: %(message)s',
            handlers=[
                logging.FileHandler(f'{self.base_path}/app.log'),
                logging.StreamHandler()
            ]
        )
    
    def get_logger(self, name: str = __name__):
        """Get application logger"""
        return logging.getLogger(name)
    
    def log_signal(self, timeframe: str, candle: Dict, signal: Optional[TradeSignal] = None, indicators: Dict = None):
        """Log trading signals - forex standard"""
        filename = f"{self.base_path}/signals_{timeframe}.csv"
        
        headers = ['timestamp', 'timeframe', 'open', 'high', 'low', 'close',
                  'zscore', 'atr', 'price_movement_pct', 'signal_action', 
                  'lot_size', 'entry_price', 'reason', 'strategy_state']
        
        file_exists = os.path.exists(filename)
        
        with open(filename, 'a', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=headers)
            if not file_exists:
                writer.writeheader()
            
            writer.writerow({
                'timestamp': datetime.fromtimestamp(candle['timestamp']).isoformat(),
                'timeframe': timeframe,
                'open': candle['open'],
                'high': candle['high'],
                'low': candle['low'],
                'close': candle['close'],
                'zscore': round(indicators.get('zscore', 0), 4) if indicators else 0,
                'atr': round(indicators.get('atr', 0), 6) if indicators else 0,
                'price_movement_pct': round(indicators.get('price_movement_score', 0), 2) if indicators else 0,
                'signal_action': signal.action if signal else 'NONE',
                'lot_size': signal.lot_size if signal else 0,
                'entry_price': candle['close'] if signal else 0,
                'reason': signal.reason if signal else '',
                'strategy_state': indicators.get('strategy_state', '') if indicators else ''
            })
    
    def log_trade(self, pair: str, timeframe: str, signal_data: dict, candle_data: dict, mt5_result: Optional[dict] = None):
        """Log trade executions"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.base_path}/trades/{pair}_{timeframe}_trade_{timestamp}.csv"
        
        os.makedirs(f"{self.base_path}/trades", exist_ok=True)
        
        trade_data = {
            'timestamp': datetime.now().isoformat(),
            'pair': pair,
            'timeframe': timeframe,
            'action': signal_data.get('action', ''),
            'lot_size': signal_data.get('lot_size', 0),
            'reason': signal_data.get('reason', ''),
            'candle_close': candle_data.get('close', 0),
            'mt5_ticket': mt5_result.get('ticket', '') if mt5_result else '',
            'mt5_price': mt5_result.get('price', 0) if mt5_result else 0,
            'execution_status': 'SUCCESS' if mt5_result else 'FAILED'
        }
        
        with open(filename, 'w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=trade_data.keys())
            writer.writeheader()
            writer.writerow(trade_data)

# Global singleton instance
forex_logger = ForexLogger()