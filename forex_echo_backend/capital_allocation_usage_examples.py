#!/usr/bin/env python3
"""
Capital Allocation Usage Examples
Demonstrates how to use the enhanced capital allocation system
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def example_1_fetch_mt5_balance():
    """Example 1: Fetch real MT5 account balance"""
    print("Example 1: Fetching MT5 Account Balance")
    print("-" * 40)
    
    response = requests.get(f"{BASE_URL}/api/capital/mt5/balance")
    if response.status_code == 200:
        result = response.json()
        print(f"✅ MT5 Balance: ${result['balance']:,.2f}")
        return result['balance']
    else:
        print(f"❌ Error: {response.text}")
        return None

def example_2_custom_capital_mode():
    """Example 2: Using Custom Capital Mode (Fixed Amount)"""
    print("\nExample 2: Custom Capital Mode ($10,000)")
    print("-" * 40)
    
    # Create session
    session_response = requests.post(f"{BASE_URL}/api/session/create", 
                                   json={"user_id": "example_user_2"})
    session_id = session_response.json()['session_id']
    
    # Setup with custom capital
    capital_setup = {
        "total_capital": 10000.00,
        "capital_mode": "custom",
        "strategy_allocations": {
            "gold_strategy": {"amount": 5000.00},
            "forex_strategy": {"amount": 3000.00}
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/capital/session/{session_id}/setup",
                           json=capital_setup)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Custom capital setup: ${result['total_capital']:,.2f}")
        print(f"   Strategies: {len(result['strategy_allocations'])}")
    else:
        print(f"❌ Error: {response.text}")

def example_3_initial_balance_mode():
    """Example 3: Using Initial Balance Mode (MT5 Balance Snapshot)"""
    print("\nExample 3: Initial Balance Mode (MT5 Snapshot)")
    print("-" * 40)
    
    # Create session
    session_response = requests.post(f"{BASE_URL}/api/session/create", 
                                   json={"user_id": "example_user_3"})
    session_id = session_response.json()['session_id']
    
    # Setup with initial balance mode
    capital_setup = {
        "capital_mode": "initial_balance",
        "strategy_allocations": {
            "conservative_strategy": {"amount": 2000.00}
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/capital/session/{session_id}/setup",
                           json=capital_setup)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Initial balance mode: ${result['total_capital']:,.2f}")
        print(f"   (Uses MT5 balance as fixed reference)")
    else:
        print(f"❌ Error: {response.text}")

def example_4_dynamic_compounding_mode():
    """Example 4: Using Dynamic Compounding Mode (Auto-scaling)"""
    print("\nExample 4: Dynamic Compounding Mode")
    print("-" * 40)
    
    # Create session
    session_response = requests.post(f"{BASE_URL}/api/session/create", 
                                   json={"user_id": "example_user_4"})
    session_id = session_response.json()['session_id']
    
    # Setup with dynamic compounding mode
    capital_setup = {
        "capital_mode": "dynamic_compounding",
        "strategy_allocations": {
            "aggressive_strategy": {"amount": 1000.00}
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/capital/session/{session_id}/setup",
                           json=capital_setup)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Dynamic compounding setup: ${result['total_capital']:,.2f}")
        
        # Test dynamic update
        update_response = requests.post(f"{BASE_URL}/api/capital/session/{session_id}/update-dynamic")
        if update_response.status_code == 200:
            update_result = update_response.json()
            print(f"   Dynamic update: ${update_result.get('old_capital', 0):,.2f} -> ${update_result.get('new_capital', 0):,.2f}")
    else:
        print(f"❌ Error: {response.text}")

def example_5_trading_with_capital_allocation():
    """Example 5: Start Trading with Automatic Capital Allocation"""
    print("\nExample 5: Trading with Capital Allocation")
    print("-" * 40)
    
    # Create session
    session_response = requests.post(f"{BASE_URL}/api/session/create", 
                                   json={"user_id": "example_trader"})
    session_id = session_response.json()['session_id']
    
    # Start trading with capital allocation
    trading_config = {
        "pair": "XAUUSD",
        "timeframe": "5M",
        "strategy_name": "gold_buy_dip",
        "capital_allocation": 2000.00,  # Allocate $2000 to this pair
        "floating_loss_threshold_pct": 20.0,
        "config": {
            "percentage_threshold": 1.0,
            "zscore_threshold_buy": -2.5,
            "take_profit_percent": 1.5,
            "use_take_profit_percent": True,
            "max_grid_trades": 3
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/start",
                           json=trading_config)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Trading started with capital allocation")
        print(f"   Pair: {trading_config['pair']}")
        print(f"   Capital: ${trading_config['capital_allocation']:,.2f}")
        
        capital_alloc = result.get('capital_allocation', {})
        if capital_alloc.get('suggested_lot_size'):
            print(f"   Suggested Lot Size: {capital_alloc['suggested_lot_size']}")
        
        # Get capital info
        capital_info_response = requests.get(f"{BASE_URL}/api/dynamic-trading/{session_id}/capital-info/XAUUSD/gold_buy_dip")
        if capital_info_response.status_code == 200:
            capital_info = capital_info_response.json()['capital_info']
            print(f"   Available Capital: ${capital_info['available_capital']:,.2f}")
            print(f"   Can Trade: {capital_info['can_trade']}")
    else:
        print(f"❌ Error: {response.text}")

def example_6_portfolio_summary():
    """Example 6: Get Portfolio Summary"""
    print("\nExample 6: Portfolio Summary")
    print("-" * 40)
    
    response = requests.get(f"{BASE_URL}/api/capital/portfolio/example_user_2/summary")
    if response.status_code == 200:
        result = response.json()
        portfolio = result['portfolio']
        
        print(f"✅ Portfolio Summary:")
        print(f"   Total Capital: ${portfolio['total_capital']:,.2f}")
        print(f"   Allocated: ${portfolio['allocated_capital']:,.2f}")
        print(f"   Available: ${portfolio['available_capital']:,.2f}")
        print(f"   Strategies: {len(portfolio['strategies'])}")
        
        for strategy_name, strategy_data in portfolio['strategies'].items():
            print(f"      {strategy_name}: ${strategy_data['allocated_capital']:,.2f}")
    else:
        print(f"❌ Error: {response.text}")

def run_all_examples():
    """Run all usage examples"""
    print("🚀 Capital Allocation Usage Examples")
    print("=" * 50)
    
    examples = [
        example_1_fetch_mt5_balance,
        example_2_custom_capital_mode,
        example_3_initial_balance_mode,
        example_4_dynamic_compounding_mode,
        example_5_trading_with_capital_allocation,
        example_6_portfolio_summary
    ]
    
    for example in examples:
        try:
            example()
        except Exception as e:
            print(f"❌ Error in {example.__name__}: {e}")
        print()  # Add spacing between examples
    
    print("=" * 50)
    print("✅ All examples completed!")
    print("\n📚 Key Features Demonstrated:")
    print("   • Real MT5 balance fetching")
    print("   • Three capital allocation modes")
    print("   • Automatic lot size calculation")
    print("   • Risk management integration")
    print("   • Portfolio monitoring")

if __name__ == "__main__":
    run_all_examples()