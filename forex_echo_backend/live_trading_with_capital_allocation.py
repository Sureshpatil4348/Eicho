#!/usr/bin/env python3
"""
Live Trading with Capital Allocation - Places Real Trades
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://20.83.157.24:8000"

class LiveTradingWithCapital:
    def __init__(self):
        self.session_id = None
        
        # Live trading configurations
        self.live_configs = [
            {
                "name": "Live_Gold_1M",
                "pair": "XAUUSD",
                "timeframe": "1M",
                "strategy_name": "gold_buy_dip",
                "capital_allocation": 500.00,
                "config": {
                    "percentage_threshold": 0.1,
                    "zscore_threshold_buy": -1.5,
                    "take_profit_percent": 0.5,
                    "use_take_profit_percent": True,
                    "max_grid_trades": 3,
                    "max_drawdown_percent": 10.0
                }
            },
            {
                "name": "Live_Gold_5M",
                "pair": "XAUUSD",
                "timeframe": "5M",
                "strategy_name": "gold_buy_dip",
                "capital_allocation": 1000.00,
                "config": {
                    "percentage_threshold": 0.5,
                    "zscore_threshold_buy": -2.0,
                    "take_profit_percent": 1.0,
                    "use_take_profit_percent": True,
                    "max_grid_trades": 2,
                    "max_drawdown_percent": 15.0
                }
            }
        ]
    
    def create_session(self):
        """Create live trading session"""
        print("🎯 Creating live trading session...")
        response = requests.post(f"{BASE_URL}/api/session/create", 
                               json={"user_id": "live_trader"})
        if response.status_code == 200:
            self.session_id = response.json()['session_id']
            print(f"✅ Session: {self.session_id}")
            return True
        print(f"❌ Failed: {response.text}")
        return False
    
    def check_mt5_balance(self):
        """Check MT5 balance"""
        print("\n🔍 Checking MT5 balance...")
        response = requests.get(f"{BASE_URL}/api/capital/mt5/balance")
        if response.status_code == 200:
            balance = response.json()['balance']
            print(f"✅ MT5 Balance: ${balance:,.2f}")
            return balance
        print(f"❌ MT5 Error: {response.text}")
        return None
    
    def start_live_trading(self):
        """Start live trading with capital allocation"""
        print(f"\n🚀 Starting live trading...")
        
        for config in self.live_configs:
            print(f"\n📈 {config['name']}...")
            
            trading_request = {
                "pair": config["pair"],
                "timeframe": config["timeframe"],
                "strategy_name": config["strategy_name"],
                "capital_allocation": config["capital_allocation"],
                "floating_loss_threshold_pct": config["config"]["max_drawdown_percent"],
                "config": config["config"]
            }
            
            response = requests.post(f"{BASE_URL}/api/dynamic-trading/{self.session_id}/start",
                                   json=trading_request)
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Started - Capital: ${config['capital_allocation']:,.2f}")
                
                capital_alloc = result.get('capital_allocation', {})
                if capital_alloc.get('suggested_lot_size'):
                    print(f"   📊 Lot Size: {capital_alloc['suggested_lot_size']}")
            else:
                print(f"❌ Failed: {response.text}")
    
    def monitor_live_trades(self, duration_minutes=60):
        """Monitor live trades"""
        print(f"\n👁️ Monitoring for {duration_minutes} minutes...")
        
        start_time = time.time()
        end_time = start_time + (duration_minutes * 60)
        
        while time.time() < end_time:
            print(f"\n📊 Status - {datetime.now().strftime('%H:%M:%S')}")
            print("-" * 50)
            
            for config in self.live_configs:
                try:
                    response = requests.get(f"{BASE_URL}/api/dynamic-trading/{self.session_id}/capital-info/{config['pair']}/{config['strategy_name']}")
                    if response.status_code == 200:
                        info = response.json()['capital_info']
                        
                        status = "🟢 ACTIVE" if info['can_trade'] else "🔴 BLOCKED"
                        pnl = info['realized_pnl']
                        
                        print(f"{config['pair']} {config['timeframe']} - {status}")
                        print(f"   💰 Capital: ${info['allocated_capital']:,.2f}")
                        print(f"   📈 P&L: ${pnl:+,.2f}")
                        
                        if info['risk_breached']:
                            print(f"   ⚠️ RISK BREACH")
                except:
                    print(f"{config['pair']} {config['timeframe']} - ❌ ERROR")
            
            time.sleep(60)  # Check every minute
        
        print(f"\n✅ Monitoring completed")
    
    def get_final_summary(self):
        """Get final summary"""
        print(f"\n📊 Final Summary")
        print("=" * 40)
        
        total_pnl = 0
        for config in self.live_configs:
            try:
                response = requests.get(f"{BASE_URL}/api/dynamic-trading/{self.session_id}/capital-info/{config['pair']}/{config['strategy_name']}")
                if response.status_code == 200:
                    info = response.json()['capital_info']
                    pnl = info['realized_pnl']
                    total_pnl += pnl
                    
                    print(f"{config['name']}:")
                    print(f"   Capital: ${info['allocated_capital']:,.2f}")
                    print(f"   P&L: ${pnl:+,.2f}")
            except:
                print(f"{config['name']}: ERROR")
        
        print(f"\n🎯 Total P&L: ${total_pnl:+,.2f}")
    
    def run_live_test(self, duration=60):
        """Run complete live test"""
        print("🚀 Live Trading with Capital Allocation")
        print("=" * 50)
        print("⚠️  WARNING: This places REAL trades!")
        print("=" * 50)
        
        confirm = input("\nProceed with LIVE trading? (yes/no): ")
        if confirm.lower() != 'yes':
            print("❌ Cancelled")
            return
        
        if not self.create_session():
            return
        
        if not self.check_mt5_balance():
            return
        
        self.start_live_trading()
        
        try:
            self.monitor_live_trades(duration)
        except KeyboardInterrupt:
            print(f"\n⚠️ Interrupted by user")
        
        self.get_final_summary()
        
        stop = input("\nStop all trading? (yes/no): ")
        if stop.lower() == 'yes':
            print("🛑 Stopping all trades...")
            # Add stop logic here
        
        print(f"\n🎉 Live test completed!")

if __name__ == "__main__":
    test = LiveTradingWithCapital()
    test.run_live_test(duration=30)  # 30 minutes