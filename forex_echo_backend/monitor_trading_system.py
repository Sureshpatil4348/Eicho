#!/usr/bin/env python3
"""
Real-time Trading System Monitor
- Live P&L tracking
- Position monitoring
- Trade count statistics
- Risk management alerts
"""

import requests
import time
import json
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

def monitor_system():
    print("🔍 REAL-TIME TRADING SYSTEM MONITOR")
    print("=" * 45)
    
    start_time = datetime.now()
    trade_count = 0
    
    while True:
        try:
            current_time = datetime.now()
            runtime = current_time - start_time
            
            print(f"\n⏰ {current_time.strftime('%Y-%m-%d %H:%M:%S')} | Runtime: {runtime}")
            print("=" * 60)
            
            # 1. Portfolio Status
            response = requests.get(f"{BASE_URL}/api/pro-capital/portfolio")
            if response.status_code == 200:
                portfolio = response.json()['portfolio']
                print(f"💰 PORTFOLIO: Total=${portfolio['total_capital']:,.2f} | Available=${portfolio['available_capital']:,.2f}")
                
                for strategy_name, details in portfolio.get('strategies', {}).items():
                    for pair, pair_details in details.get('pairs', {}).items():
                        allocated = pair_details['allocated_capital']
                        used = pair_details.get('used_capital', 0)
                        available = allocated - used
                        usage_pct = (used / allocated * 100) if allocated > 0 else 0
                        print(f"   📊 {pair}: ${available:,.0f} available ({usage_pct:.1f}% used)")
            
            # 2. Active Positions
            response = requests.get(f"{BASE_URL}/api/mt5/positions")
            if response.status_code == 200:
                positions = response.json().get('positions', [])
                total_profit = sum(pos.get('profit', 0) for pos in positions)
                
                print(f"📈 POSITIONS: {len(positions)} active | P&L: ${total_profit:.2f}")
                
                for pos in positions:
                    symbol = pos.get('symbol', 'N/A')
                    volume = pos.get('volume', 0)
                    profit = pos.get('profit', 0)
                    type_str = 'BUY' if pos.get('type') == 0 else 'SELL'
                    price = pos.get('price_open', 0)
                    current = pos.get('price_current', 0)
                    
                    print(f"   🎯 {symbol} {type_str} {volume} lots @ {price:.5f} | Current: {current:.5f} | P&L: ${profit:.2f}")
            
            # 3. Recent Trade History
            response = requests.get(f"{BASE_URL}/api/mt5/history")
            if response.status_code == 200:
                history = response.json().get('deals', [])
                recent_trades = [deal for deal in history if deal.get('time', 0) > (time.time() - 3600)]  # Last hour
                
                if len(recent_trades) > trade_count:
                    new_trades = len(recent_trades) - trade_count
                    trade_count = len(recent_trades)
                    print(f"🆕 NEW TRADES: +{new_trades} | Total today: {trade_count}")
                
                total_profit_history = sum(deal.get('profit', 0) for deal in recent_trades)
                print(f"📊 HOURLY STATS: {len(recent_trades)} trades | P&L: ${total_profit_history:.2f}")
            
            # 4. System Health Check
            try:
                response = requests.get(f"{BASE_URL}/api/mt5/account-info", timeout=5)
                if response.status_code == 200:
                    account = response.json().get('account_info', {})
                    balance = account.get('balance', 0)
                    equity = account.get('equity', 0)
                    margin = account.get('margin', 0)
                    free_margin = account.get('margin_free', 0)
                    margin_level = account.get('margin_level', 0)
                    
                    print(f"🏦 ACCOUNT: Balance=${balance:.2f} | Equity=${equity:.2f} | Margin=${margin:.2f}")
                    print(f"   Free Margin=${free_margin:.2f} | Margin Level={margin_level:.0f}%")
                    
                    # Risk Alerts
                    if margin_level < 200 and margin_level > 0:
                        print("⚠️ WARNING: Low margin level!")
                    if equity < balance * 0.9:
                        print("🚨 ALERT: Significant drawdown detected!")
                else:
                    print("❌ MT5 connection issue")
            except:
                print("❌ System health check failed")
            
            # 5. Trading Statistics
            trades_per_hour = trade_count / max(runtime.total_seconds() / 3600, 0.1)
            estimated_daily = trades_per_hour * 24
            
            print(f"📈 PERFORMANCE:")
            print(f"   Trades/Hour: {trades_per_hour:.1f}")
            print(f"   Estimated Daily: {estimated_daily:.0f}")
            print(f"   Target Progress: {(trade_count/30)*100:.1f}% (30 trade goal)")
            
            print("\n" + "="*60)
            
            # Wait 30 seconds before next update
            time.sleep(30)
            
        except KeyboardInterrupt:
            print("\n🛑 Monitoring stopped by user")
            break
        except Exception as e:
            print(f"❌ Monitor error: {e}")
            time.sleep(10)

if __name__ == "__main__":
    monitor_system()