#!/usr/bin/env python3
"""
Force Immediate Trade Execution
"""

import requests

BASE_URL = "http://127.0.0.1:8000"

def force_trade():
    print("Force Trade Execution")
    print("=" * 21)
    
    # 1. Stop current trading
    session_id = "514e9240-b8d2-4b82-8cad-dd709d9b135b"
    
    print("\n1. Stopping current trading...")
    response = requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/stop", json={
        "pair": "XAUUSD",
        "timeframe": "1M", 
        "strategy_name": "gold_buy_dip"
    })
    print(f"Stop Status: {response.status_code}")
    
    # 2. Start with EXTREMELY aggressive settings
    print("\n2. Starting with EXTREME settings...")
    response = requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/start", json={
        "pair": "XAUUSD",
        "timeframe": "1M",
        "strategy_name": "gold_buy_dip", 
        "config": {
            "percentage_threshold": 0.001,    # 0.001% - almost any movement
            "zscore_threshold_buy": -0.1,     # Very easy BUY trigger
            "zscore_threshold_sell": 0.1,     # Very easy SELL trigger
            "take_profit_percent": 0.01,      # 1 pip profit
            "max_grid_trades": 1,
            "use_take_profit_percent": True,
            "lookback_candles": 5,            # Very short lookback
            "zscore_period": 5,               # Short period
            "zscore_wait_candles": 1          # Immediate execution
        }
    })
    
    print(f"Start Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"✅ EXTREME settings applied!")
        print(f"Lot Size: {result.get('config', {}).get('lot_size')}")
    else:
        print(f"❌ Failed: {response.json()}")
    
    # 3. Wait and check for NEW trades
    import time
    print(f"\n3. Waiting 30 seconds for new trades...")
    time.sleep(30)
    
    # Check for new positions
    response = requests.get(f"{BASE_URL}/api/mt5/positions")
    if response.status_code == 200:
        positions = response.json().get('positions', [])
        print(f"\nCurrent positions: {len(positions)}")
        
        new_trades = []
        for pos in positions:
            if pos['minutes_ago'] < 5:  # Less than 5 minutes old
                new_trades.append(pos)
                print(f"🆕 NEW: {pos['symbol']} {pos['type']} {pos['volume']} lots @ {pos['price_open']}")
                print(f"    Opened: {pos['open_time']} ({pos['minutes_ago']} minutes ago)")
        
        if not new_trades:
            print("❌ No new trades detected")
            print("💡 Strategy may need market volatility to trigger")
        else:
            print(f"✅ {len(new_trades)} NEW trades found!")

if __name__ == "__main__":
    force_trade()