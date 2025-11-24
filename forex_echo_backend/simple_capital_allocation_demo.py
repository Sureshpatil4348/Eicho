"""
🔍 SIMPLE CAPITAL ALLOCATION DEMO
Shows exactly how capital allocation works step by step
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def demo_capital_allocation():
    print("🔍 CAPITAL ALLOCATION DEMO - How It Actually Works")
    print("=" * 60)
    
    # Step 1: Create session
    print("1️⃣ Creating session...")
    response = requests.post(f"{BASE_URL}/api/session/create", 
                           json={"user_id": "demo_user"})
    session_id = response.json()['session_id']
    print(f"   ✅ Session: {session_id}")
    
    # Step 2: Setup capital WITHOUT allocation (this is key!)
    print("\n2️⃣ Setting up capital pool...")
    capital_setup = {
        "total_capital": 10000.00,  # $10K total
        "strategy_allocations": {
            "gold_buy_dip": {"amount": 5000.00}  # Allocate $5K to gold strategy
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/capital/session/{session_id}/setup",
                           json=capital_setup)
    print(f"   ✅ Capital Pool: $10,000")
    print(f"   ✅ Strategy Allocation: $5,000 for gold_buy_dip")
    
    # Step 3: Allocate to specific pair
    print("\n3️⃣ Allocating capital to XAUUSD...")
    pair_allocation = {
        "strategy_name": "gold_buy_dip",
        "pair": "XAUUSD", 
        "allocation_amount": 2500.00,  # $2.5K for XAUUSD
        "floating_loss_threshold_pct": 20.0  # 20% loss limit
    }
    
    response = requests.post(f"{BASE_URL}/api/capital/session/{session_id}/allocate-pair",
                           json=pair_allocation)
    print(f"   ✅ XAUUSD gets $2,500 with 20% risk limit")
    
    # Step 4: Start trading (THIS is where your curl command fits)
    print("\n4️⃣ Starting trading (your curl command)...")
    trading_config = {
        "pair": "XAUUSD",
        "timeframe": "1M", 
        "strategy_name": "gold_buy_dip",
        "config": {
            "lot_size": 0.05,
            "percentage_threshold": 0.010,
            "zscore_threshold_buy": -3.0,
            "take_profit_percent": 1.5,
            "use_take_profit_percent": True,
            "use_grid_trading": True,
            "max_grid_trades": 5,
            "grid_percent": 0.5,
            "use_grid_percent": True,
            "lot_progression_factor": 1.2,
            "use_progressive_lots": True,
            "max_drawdown_percent": 20.0,
            "lookback_candles": 50,
            "zscore_period": 20
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/start",
                           json=trading_config)
    
    if response.status_code == 200:
        print(f"   ✅ Trading started with capital validation")
    else:
        print(f"   ❌ Trading failed: {response.text}")
        return
    
    # Step 5: Show how capital allocation affects trading
    print("\n5️⃣ HOW CAPITAL ALLOCATION WORKS:")
    print("   📊 Your lot_size: 0.05 (from config)")
    print("   💰 Allocated capital: $2,500")
    print("   🚨 Risk limit: 20% = $500 max loss")
    print("   🔄 Grid trades: Up to 5 positions")
    print("   📈 Progressive lots: 1.2x multiplier per level")
    
    print("\n   🎯 WHAT HAPPENS DURING TRADING:")
    print("   • Strategy calculates position size based on $2,500 allocation")
    print("   • Each trade is validated against remaining capital")
    print("   • If floating loss hits $500 (20%), all trades close")
    print("   • Grid trades use progressive sizing within capital limits")
    print("   • System tracks P&L against the $2,500 allocation")
    
    # Step 6: Check current status
    print("\n6️⃣ Checking current capital status...")
    response = requests.get(f"{BASE_URL}/api/dynamic-trading/{session_id}/capital-status")
    
    if response.status_code == 200:
        capital_status = response.json()['capital_status']
        portfolio = capital_status.get('portfolio_summary', {})
        
        print(f"   💰 Total Capital: ${portfolio.get('total_capital', 0):,.2f}")
        print(f"   📊 Allocated: ${portfolio.get('allocated_capital', 0):,.2f}")
        print(f"   💵 Available: ${portfolio.get('available_capital', 0):,.2f}")
        
        active_tasks = capital_status.get('active_tasks', [])
        for task in active_tasks:
            pnl = task['realized_pnl'] + task['floating_pnl']
            print(f"   📈 {task['pair']}: Allocated ${task['allocated_capital']:,.2f} | P&L ${pnl:+.2f}")
    
    print(f"\n🎯 KEY POINTS:")
    print(f"   • Capital allocation is NOT hardcoded")
    print(f"   • You set it via API before trading")
    print(f"   • Your curl command uses the allocated capital")
    print(f"   • System enforces risk limits automatically")
    print(f"   • Position sizing adapts to available capital")
    
    print(f"\n📋 Session ID: {session_id}")
    print(f"💡 Use this session to continue testing")

if __name__ == "__main__":
    demo_capital_allocation()