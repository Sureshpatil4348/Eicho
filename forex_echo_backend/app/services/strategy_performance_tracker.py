from typing import Dict, List, Optional
from datetime import datetime
import json
import os

class StrategyPerformanceTracker:
    def __init__(self, timeframe: str = "15M"):
        self.timeframe = timeframe
        self.trades: List[Dict] = []
        self.balance_history: List[Dict] = []
        self.initial_balance = 10000.0
        self.current_balance = 10000.0
        self.peak_balance = 10000.0
        self.max_drawdown = 0.0
        
        # Load existing data if available
        self._load_performance_data()
    
    def add_trade(self, trade_data: Dict):
        """Add completed trade to performance tracking."""
        trade_data['trade_id'] = len(self.trades) + 1
        trade_data['timestamp'] = datetime.now().isoformat()
        self.trades.append(trade_data)
        
        # Update balance
        pnl = trade_data.get('pnl', 0)
        self.current_balance += pnl
        
        # Update peak and drawdown
        if self.current_balance > self.peak_balance:
            self.peak_balance = self.current_balance
        
        current_drawdown = ((self.peak_balance - self.current_balance) / self.peak_balance) * 100
        if current_drawdown > self.max_drawdown:
            self.max_drawdown = current_drawdown
        
        # Add to balance history
        self.balance_history.append({
            'timestamp': datetime.now().isoformat(),
            'balance': self.current_balance,
            'equity': self.current_balance,  # Simplified for demo
            'drawdown_pct': current_drawdown
        })
        
        self._save_performance_data()
    
    def get_performance_metrics(self) -> Dict:
        """Calculate comprehensive performance metrics."""
        if not self.trades:
            return self._empty_metrics()
        
        winning_trades = [t for t in self.trades if t.get('pnl', 0) > 0]
        losing_trades = [t for t in self.trades if t.get('pnl', 0) < 0]
        
        total_trades = len(self.trades)
        win_count = len(winning_trades)
        loss_count = len(losing_trades)
        
        win_rate = (win_count / total_trades * 100) if total_trades > 0 else 0
        
        total_pnl = sum(t.get('pnl', 0) for t in self.trades)
        
        avg_win = sum(t.get('pnl', 0) for t in winning_trades) / win_count if win_count > 0 else 0
        avg_loss = sum(t.get('pnl', 0) for t in losing_trades) / loss_count if loss_count > 0 else 0
        
        largest_win = max((t.get('pnl', 0) for t in winning_trades), default=0)
        largest_loss = min((t.get('pnl', 0) for t in losing_trades), default=0)
        
        profit_factor = abs(avg_win / avg_loss) if avg_loss != 0 else 0
        
        current_drawdown = ((self.peak_balance - self.current_balance) / self.peak_balance) * 100
        
        return {
            'timestamp': datetime.now().isoformat(),
            'timeframe': self.timeframe,
            'total_trades': total_trades,
            'winning_trades': win_count,
            'losing_trades': loss_count,
            'win_rate_pct': round(win_rate, 2),
            'total_pnl': round(total_pnl, 2),
            'max_drawdown_pct': round(self.max_drawdown, 2),
            'current_drawdown_pct': round(current_drawdown, 2),
            'profit_factor': round(profit_factor, 2),
            'avg_win': round(avg_win, 2),
            'avg_loss': round(avg_loss, 2),
            'largest_win': round(largest_win, 2),
            'largest_loss': round(largest_loss, 2),
            'current_balance': round(self.current_balance, 2),
            'equity': round(self.current_balance, 2),
            'margin_used': 0,  # Simplified for demo
            'free_margin': round(self.current_balance, 2)
        }
    
    def _empty_metrics(self) -> Dict:
        """Return empty metrics when no trades exist."""
        return {
            'timestamp': datetime.now().isoformat(),
            'timeframe': self.timeframe,
            'total_trades': 0,
            'winning_trades': 0,
            'losing_trades': 0,
            'win_rate_pct': 0,
            'total_pnl': 0,
            'max_drawdown_pct': 0,
            'current_drawdown_pct': 0,
            'profit_factor': 0,
            'avg_win': 0,
            'avg_loss': 0,
            'largest_win': 0,
            'largest_loss': 0,
            'current_balance': self.current_balance,
            'equity': self.current_balance,
            'margin_used': 0,
            'free_margin': self.current_balance
        }
    
    def _save_performance_data(self):
        """Save performance data to JSON file."""
        data = {
            'trades': self.trades,
            'balance_history': self.balance_history,
            'initial_balance': self.initial_balance,
            'current_balance': self.current_balance,
            'peak_balance': self.peak_balance,
            'max_drawdown': self.max_drawdown
        }
        
        os.makedirs('data/performance', exist_ok=True)
        filename = f'data/performance/strategy_{self.timeframe}.json'
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
    
    def _load_performance_data(self):
        """Load existing performance data."""
        filename = f'data/performance/strategy_{self.timeframe}.json'
        
        if os.path.exists(filename):
            try:
                with open(filename, 'r') as f:
                    data = json.load(f)
                
                self.trades = data.get('trades', [])
                self.balance_history = data.get('balance_history', [])
                self.initial_balance = data.get('initial_balance', 10000.0)
                self.current_balance = data.get('current_balance', 10000.0)
                self.peak_balance = data.get('peak_balance', 10000.0)
                self.max_drawdown = data.get('max_drawdown', 0.0)
            except Exception:
                pass  # Use defaults if file is corrupted
    
    def reset_performance(self):
        """Reset all performance data."""
        self.trades = []
        self.balance_history = []
        self.current_balance = self.initial_balance
        self.peak_balance = self.initial_balance
        self.max_drawdown = 0.0
        self._save_performance_data()