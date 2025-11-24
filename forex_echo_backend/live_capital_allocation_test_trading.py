#!/usr/bin/env python3
"""
Professional MT5 Trading Flow Test
1. Connect to MT5 with credentials
2. Use real account balance
3. Allocate to strategy and pair
4. Place actual trade
"""

import requests

BASE_URL = "http://127.0.0.1:8000"

def test_professional_flow():
    print("Professional MT5 Trading Flow")
    print("=" * 35)
    
    # 1. Connect to MT5 with real credentials
    print("\n1. Connecting to MT5...")
    mt5_credentials = {
        "login": 10007176246,
        "password": "-6TiNhUm",
        "server": "MetaQuotes-Demo"
    }
    
    response = requests.post(f"{BASE_URL}/api/mt5/connect", json=mt5_credentials)
    print(f"Status: {response.status_code}")
    connect_result = response.json()
    print(f"Response: {connect_result}")
    
    if response.status_code != 200:
        print("❌ MT5 connection failed!")
        return
    
    # Get MT5 login for reference
    mt5_login = connect_result.get('status', {}).get('account_login')
    trade_allowed = connect_result.get('status', {}).get('trade_allowed')
    print(f"MT5 Login: {mt5_login}")
    print(f"Trade Allowed: {trade_allowed}")
    
    if not trade_allowed:
        print("⚠️ Trading not allowed - check MT5 AutoTrading button")
    
    # 2. Get real account balance and portfolio
    print("\n2. Getting portfolio with real MT5 balance...")
    response = requests.get(f"{BASE_URL}/api/pro-capital/portfolio")
    result = response.json()
    print(f"User ID: {result.get('user_id')}")
    print(f"Portfolio ID: {result.get('portfolio_id')}")
    
    portfolio = result.get('portfolio', {})
    total_capital = portfolio.get('total_capital', 0)
    available = portfolio.get('available_capital', 0)
    print(f"Total Capital: ${total_capital:,.2f}")
    print(f"Available: ${available:,.2f}")
    
    # 3. Allocate $5000 to gold_buy_dip strategy
    print("\n3. Allocating $5000 to gold_buy_dip strategy...")
    response = requests.post(f"{BASE_URL}/api/pro-capital/strategy/add", json={
        "strategy_name": "gold_buy_dip",
        "amount": 5000.0
    })
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Strategy Capital: ${result.get('allocated_capital', 0):,.2f}")
    print(f"Portfolio Available: ${result.get('portfolio_available', 0):,.2f}")
    
    # 4. Allocate $3000 from strategy to XAUUSD pair
    print("\n4. Allocating $3000 to XAUUSD pair...")
    response = requests.post(f"{BASE_URL}/api/pro-capital/strategy/gold_buy_dip/pair/add", json={
        "pair": "XAUUSD",
        "amount": 3000.0,
        "floating_loss_threshold_pct": 20.0
    })
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Pair Capital: ${result.get('allocated_capital', 0):,.2f}")
    print(f"Strategy Remaining: ${result.get('strategy_remaining', 0):,.2f}")
    
    # 5. Check trading allocation
    print("\n5. Checking trading allocation...")
    response = requests.get(f"{BASE_URL}/api/pro-capital/trading/gold_buy_dip/XAUUSD/allocation")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        allocation = response.json()['allocation']
        print(f"Available for Trading: ${allocation['available_capital']:,.2f}")
        print(f"Suggested Lot Size: {allocation['suggested_lot_size']}")
        print(f"Can Trade: {allocation['can_trade']}")
    else:
        print(f"Error: {response.json()}")
    
    # 6. Create trading session with MT5 user ID from portfolio
    print("\n6. Creating trading session...")
    # Get user ID from portfolio response (step 2)
    response = requests.get(f"{BASE_URL}/api/pro-capital/portfolio")
    portfolio_result = response.json()
    actual_user_id = portfolio_result.get('user_id')
    print(f"Using User ID: {actual_user_id}")
    
    response = requests.post(f"{BASE_URL}/api/session/create", json={
        "user_id": actual_user_id,
        "session_name": "Professional Trading Session"
    })
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        session_id = response.json()['session_id']
        print(f"Session ID: {session_id}")
        
        # 7. Start trading with very low config for actual trades
        print("\n7. Starting trading with capital allocation...")
        response = requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/start", json={
            "pair": "XAUUSD",
            "timeframe": "1M",
            "strategy_name": "gold_buy_dip",
            "config": {
            "percentage_threshold": 0.001,    # 0.001% - almost any movement
            "zscore_threshold_buy": -0.1,     # Very easy BUY trigger
            "zscore_threshold_sell": 0.1,     # Very easy SELL trigger
            "take_profit_percent": 0.0,       # No TP to avoid MT5 errors
            "max_grid_trades": 1,
            "use_take_profit_percent": False,  # Disable TP
            "lookback_candles": 5,            # Very short lookback
            "zscore_period": 5,               # Short period
            "zscore_wait_candles": 1          # Immediate execution
        }
        })
        
        print(f"Trading Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Trading Started!")
            print(f"Task ID: {result.get('task_id')}")
            print(f"Lot Size: {result.get('config', {}).get('lot_size')}")
            
            capital_info = result.get('capital_allocation', {})
            print(f"Reserved Capital: ${capital_info.get('reserved_for_trading', 0):,.2f}")
            print(f"Available Capital: ${capital_info.get('available_capital', 0):,.2f}")
        else:
            print(f"❌ Trading Failed: {response.json()}")
    else:
        print(f"Session creation failed: {response.json()}")
        return
    
    # 8. Final portfolio status
    print("\n8. Final portfolio status...")
    response = requests.get(f"{BASE_URL}/api/pro-capital/portfolio")
    if response.status_code == 200:
        result = response.json()
        portfolio = result['portfolio']
        
        print(f"Total: ${portfolio['total_capital']:,.2f}")
        print(f"Allocated: ${portfolio['allocated_capital']:,.2f}")
        print(f"Available: ${portfolio['available_capital']:,.2f}")
        
        for strategy_name, details in portfolio.get('strategies', {}).items():
            print(f"\n📊 {strategy_name}: ${details['allocated_capital']:,.2f}")
            for pair, pair_details in details.get('pairs', {}).items():
                allocated = pair_details['allocated_capital']
                used = pair_details.get('used_capital', 0)
                available = allocated - used
                print(f"  💰 {pair}: ${allocated:,.2f} | Used: ${used:,.2f} | Available: ${available:,.2f}")
    
    print("\n✅ Professional MT5 Trading Flow Complete!")

if __name__ == "__main__":
    test_professional_flow()