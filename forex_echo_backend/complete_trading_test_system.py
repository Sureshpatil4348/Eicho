#!/usr/bin/env python3
"""
Complete Professional Trading System Test
- High capital allocation ($50,000)
- Multiple timeframes (1M, 5M)
- Aggressive configs for 30+ trades in 2 days
- Full risk management and P&L tracking
- Grid trading with progressive lots
"""

import requests
import time
import json

BASE_URL = "http://20.83.157.24:8000"

def test_complete_system():
    print("🚀 COMPLETE PROFESSIONAL TRADING SYSTEM TEST")
    print("=" * 50)
    
    # 1. MT5 Connection
    print("\n1. 🔌 Connecting to MT5...")
    mt5_credentials = {
        "login": 10007176246,
        "password": "-6TiNhUm",
        "server": "MetaQuotes-Demo"
    }
    
    response = requests.post(f"{BASE_URL}/api/mt5/connect", json=mt5_credentials)
    if response.status_code != 200:
        print("❌ MT5 connection failed!")
        return
    
    connect_result = response.json()
    print(f"✅ Connected - Login: {connect_result.get('status', {}).get('account_login')}")
    
    # 2. Portfolio Setup with High Capital
    print("\n2. 💰 Setting up high-capital portfolio...")
    response = requests.get(f"{BASE_URL}/api/pro-capital/portfolio")
    portfolio_result = response.json()
    user_id = portfolio_result.get('user_id')
    total_capital = portfolio_result.get('portfolio', {}).get('total_capital', 0)
    print(f"User ID: {user_id}")
    print(f"Total Capital: ${total_capital:,.2f}")
    
    # 3. Massive Strategy Allocation - $50,000
    print("\n3. 📈 Allocating $50,000 to gold_buy_dip strategy...")
    response = requests.post(f"{BASE_URL}/api/pro-capital/strategy/add", json={
        "strategy_name": "gold_buy_dip",
        "amount": 50000.0
    })
    result = response.json()
    print(f"✅ Strategy Capital: ${result.get('allocated_capital', 0):,.2f}")
    
    # 4. High Pair Allocation - $30,000 to XAUUSD
    print("\n4. 🥇 Allocating $30,000 to XAUUSD pair...")
    response = requests.post(f"{BASE_URL}/api/pro-capital/strategy/gold_buy_dip/pair/add", json={
        "pair": "XAUUSD",
        "amount": 30000.0,
        "floating_loss_threshold_pct": 15.0  # 15% max drawdown
    })
    result = response.json()
    print(f"✅ Pair Capital: ${result.get('allocated_capital', 0):,.2f}")
    
    # 5. Create Trading Session
    print("\n5. 🎯 Creating professional trading session...")
    response = requests.post(f"{BASE_URL}/api/session/create", json={
        "user_id": user_id,
        "session_name": "Complete System Test - 2 Day Run"
    })
    session_id = response.json()['session_id']
    print(f"✅ Session ID: {session_id}")
    
    # 6. Ultra-Aggressive 1M Scalping Configuration
    print("\n6. ⚡ Starting ULTRA-AGGRESSIVE 1M scalping...")
    scalping_config = {
        "pair": "XAUUSD",
        "timeframe": "1M",
        "strategy_name": "gold_buy_dip",
        "config": {
            # ULTRA AGGRESSIVE ENTRY
            "percentage_threshold": 0.001,        # 0.001% = Any tiny movement
            "zscore_threshold_buy": -0.05,        # Almost immediate BUY
            "zscore_threshold_sell": 0.05,        # Almost immediate SELL
            "lookback_candles": 3,                # Very short lookback
            "zscore_period": 3,                   # Ultra short period
            "zscore_wait_candles": 1,             # Immediate execution
            
            # NO TAKE PROFIT (avoid MT5 errors)
            "take_profit_percent": 0.0,
            "use_take_profit_percent": False,
            
            # AGGRESSIVE GRID SYSTEM
            "use_grid_trading": True,
            "max_grid_trades": 8,                 # Up to 8 grid levels
            "grid_percent": 0.02,                 # 0.02% between grids
            "use_grid_percent": True,
            
            # PROGRESSIVE LOT SIZING
            "use_progressive_lots": True,
            "lot_progression_factor": 1.3,        # 30% increase per level
            "grid_lot_multiplier": 1.3,
            
            # RISK MANAGEMENT
            "max_drawdown_percent": 12.0,         # 12% max account drawdown
            
            # ATR SETTINGS
            "atr_period": 5,                      # Short ATR period
            "grid_atr_multiplier": 0.5            # Tight grid spacing
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/start", json=scalping_config)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ 1M Scalping Started - Task ID: {result.get('task_id')}")
        print(f"   Lot Size: {result.get('config', {}).get('lot_size')}")
        scalping_task_id = result.get('task_id')
    else:
        print(f"❌ 1M Scalping Failed: {response.json()}")
        return
    
    # 7. Medium-Aggressive 5M Swing Trading
    print("\n7. 📊 Starting MEDIUM-AGGRESSIVE 5M swing trading...")
    swing_config = {
        "pair": "XAUUSD",
        "timeframe": "5M",
        "strategy_name": "gold_buy_dip",
        "config": {
            # MEDIUM AGGRESSIVE ENTRY
            "percentage_threshold": 0.01,         # 0.01% threshold
            "zscore_threshold_buy": -0.3,         # Easier BUY trigger
            "zscore_threshold_sell": 0.3,         # Easier SELL trigger
            "lookback_candles": 10,               # Medium lookback
            "zscore_period": 8,                   # Medium period
            "zscore_wait_candles": 2,             # Quick execution
            
            # NO TAKE PROFIT
            "take_profit_percent": 0.0,
            "use_take_profit_percent": False,
            
            # MODERATE GRID SYSTEM
            "use_grid_trading": True,
            "max_grid_trades": 5,                 # 5 grid levels
            "grid_percent": 0.05,                 # 0.05% between grids
            "use_grid_percent": True,
            
            # MODERATE PROGRESSIVE LOTS
            "use_progressive_lots": True,
            "lot_progression_factor": 1.2,        # 20% increase per level
            "grid_lot_multiplier": 1.2,
            
            # RISK MANAGEMENT
            "max_drawdown_percent": 10.0,         # 10% max drawdown
            
            # ATR SETTINGS
            "atr_period": 8,
            "grid_atr_multiplier": 0.8
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/start", json=swing_config)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ 5M Swing Started - Task ID: {result.get('task_id')}")
        print(f"   Lot Size: {result.get('config', {}).get('lot_size')}")
        swing_task_id = result.get('task_id')
    else:
        print(f"❌ 5M Swing Failed: {response.json()}")
    
    # 8. Display Complete System Status
    print("\n8. 📋 COMPLETE SYSTEM STATUS")
    print("=" * 40)
    
    # Portfolio Status
    response = requests.get(f"{BASE_URL}/api/pro-capital/portfolio")
    if response.status_code == 200:
        portfolio = response.json()['portfolio']
        print(f"💰 PORTFOLIO:")
        print(f"   Total Capital: ${portfolio['total_capital']:,.2f}")
        print(f"   Allocated: ${portfolio['allocated_capital']:,.2f}")
        print(f"   Available: ${portfolio['available_capital']:,.2f}")
        
        for strategy_name, details in portfolio.get('strategies', {}).items():
            print(f"\n📊 {strategy_name.upper()}: ${details['allocated_capital']:,.2f}")
            for pair, pair_details in details.get('pairs', {}).items():
                allocated = pair_details['allocated_capital']
                used = pair_details.get('used_capital', 0)
                available = allocated - used
                print(f"   💎 {pair}: Allocated=${allocated:,.2f} | Used=${used:,.2f} | Available=${available:,.2f}")
    
    # Active Tasks
    response = requests.get(f"{BASE_URL}/api/session/{session_id}/tasks")
    if response.status_code == 200:
        tasks = response.json().get('tasks', [])
        print(f"\n🎯 ACTIVE TRADING TASKS: {len(tasks)}")
        for task in tasks:
            print(f"   Task {task['task_id']}: {task['pair']} {task['timeframe']} - {task['status']}")
    
    # Trading Allocation Check
    response = requests.get(f"{BASE_URL}/api/pro-capital/trading/gold_buy_dip/XAUUSD/allocation")
    if response.status_code == 200:
        allocation = response.json()['allocation']
        print(f"\n💹 TRADING ALLOCATION:")
        print(f"   Available Capital: ${allocation['available_capital']:,.2f}")
        print(f"   Suggested Lot Size: {allocation['suggested_lot_size']}")
        print(f"   Max Position Size: {allocation.get('max_position_size', 'N/A')}")
        print(f"   Can Trade: {'✅' if allocation['can_trade'] else '❌'}")
    
    # 9. Expected Trading Performance
    print(f"\n9. 📈 EXPECTED PERFORMANCE (2 DAYS)")
    print("=" * 40)
    print("🎯 TARGET: 30+ trades in 48 hours")
    print("⚡ 1M Scalping: ~20-25 trades/day = 40-50 total")
    print("📊 5M Swing: ~5-8 trades/day = 10-16 total")
    print("🎲 TOTAL EXPECTED: 50-66 trades")
    print()
    print("💰 CAPITAL ALLOCATION:")
    print(f"   Strategy Capital: $50,000")
    print(f"   Pair Capital: $30,000")
    print(f"   Risk per Trade: ~0.3-1.0% of pair capital")
    print(f"   Max Grid Exposure: ~5-8% of pair capital")
    print()
    print("⚠️ RISK MANAGEMENT:")
    print("   • Max Drawdown: 10-15% per timeframe")
    print("   • Progressive lot sizing active")
    print("   • Grid trading with 5-8 levels")
    print("   • No take profit (manual management)")
    print("   • ATR-based grid spacing")
    
    # 10. Monitoring Instructions
    print(f"\n10. 🔍 MONITORING INSTRUCTIONS")
    print("=" * 40)
    print("📊 Check portfolio status:")
    print(f"   GET {BASE_URL}/api/pro-capital/portfolio")
    print()
    print("📈 Check active positions:")
    print(f"   GET {BASE_URL}/api/mt5/positions")
    print()
    print("📋 Check trade history:")
    print(f"   GET {BASE_URL}/api/mt5/history")
    print()
    print("🎯 Check task status:")
    print(f"   GET {BASE_URL}/api/session/{session_id}/tasks")
    print()
    print("💹 Check P&L:")
    print(f"   GET {BASE_URL}/api/pro-capital/trading/gold_buy_dip/XAUUSD/allocation")
    
    print(f"\n✅ COMPLETE SYSTEM LAUNCHED!")
    print("🚀 Ready for 2-day high-frequency trading test")
    print("📱 Monitor logs and MT5 terminal for trade execution")
    print("⏰ Expected first trades within 1-5 minutes")

if __name__ == "__main__":
    test_complete_system()