#!/usr/bin/env python3
"""
Check MT5 Trade History and Positions
"""

import requests

BASE_URL = "http://127.0.0.1:8000"

def check_mt5_trades():
    print("MT5 Trades Check")
    print("=" * 16)
    
    # Check if there's an endpoint to get positions/trades
    endpoints_to_try = [
        "/api/mt5/positions",
        "/api/mt5/trades", 
        "/api/mt5/history",
        "/api/mt5/orders"
    ]
    
    for endpoint in endpoints_to_try:
        print(f"\nTrying {endpoint}...")
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
        elif response.status_code == 404:
            print("Endpoint not available")
    
    # Check account info for any changes
    print(f"\nAccount Status:")
    response = requests.get(f"{BASE_URL}/api/mt5/status")
    if response.status_code == 200:
        status = response.json()['status']
        print(f"Balance: ${status.get('account_balance', 0):,.2f}")
        print(f"Equity: ${status.get('account_equity', 0):,.2f}")
        print(f"Margin: ${status.get('account_margin', 0):,.2f}")
        print(f"Free Margin: ${status.get('account_margin_free', 0):,.2f}")

if __name__ == "__main__":
    check_mt5_trades()