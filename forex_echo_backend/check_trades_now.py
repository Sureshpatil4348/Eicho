#!/usr/bin/env python3
"""
Check MT5 Trades Now
"""

import requests

BASE_URL = "http://127.0.0.1:8000"

def check_trades():
    print("MT5 Trades Check")
    print("=" * 16)
    
    # Check positions
    print("\n1. Current Positions:")
    response = requests.get(f"{BASE_URL}/api/mt5/positions")
    if response.status_code == 200:
        data = response.json()
        positions = data.get('positions', [])
        print(f"Open Positions: {len(positions)}")
        for pos in positions:
            print(f"  {pos['symbol']} {pos['type']} {pos['volume']} lots @ {pos['price_open']} | Profit: ${pos['profit']}")
            print(f"    Opened: {pos['open_time']} ({pos['minutes_ago']} minutes ago)")
    else:
        print(f"Error: {response.json()}")
    
    # Check history
    print("\n2. Recent Trade History:")
    response = requests.get(f"{BASE_URL}/api/mt5/history")
    if response.status_code == 200:
        data = response.json()
        deals = data.get('deals', [])
        print(f"Recent Deals: {len(deals)}")
        for deal in deals:
            print(f"  {deal['symbol']} {deal['type']} {deal['volume']} lots @ {deal['price']} | Profit: ${deal['profit']}")
            print(f"    Time: {deal['time']} ({deal['minutes_ago']} minutes ago)")
    else:
        print(f"Error: {response.json()}")

if __name__ == "__main__":
    check_trades()