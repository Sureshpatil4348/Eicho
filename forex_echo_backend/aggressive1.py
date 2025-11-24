"""Aggressive Trading Test - Very Low Thresholds for Quick Trades"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000" 



def start_aggressive_trading():
    """Start trading with very low thresholds to trigger trades quickly"""
    
    print("🔥 AGGRESSIVE TRADING TEST - LOW THRESHOLDS")
    print("=" * 60)
    print("⚠️  WARNING: Very sensitive settings for quick signals!")
    print("=" * 60)
    
    # Create session
    print("1. Creating session...")
    try:
        response = requests.post(f"{BASE_URL}/api/session/create", 
                               json={"user_id": "aggressive_test"})
        if response.status_code == 200:
            result = response.json()
            session_id = result['session_id']
            print(f"✅ Session: {session_id}")
        else:
            print(f"❌ Session failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Session error: {e}")
        return
    
    # Ultra-aggressive Gold Buy Dip
    print("\n2. Starting ULTRA-AGGRESSIVE Gold Buy Dip...")
    ultra_gold_config = {
        "strategy_name": "gold_buy_dip",
        "pair": "XAUUSD",
        "timeframe": "1M",
        "config": {
            "lot_size": 0.01,
            "percentage_threshold": 0.001, # 0.001% - EXTREME!
            "zscore_threshold_buy": -0.01, # -0.01 instead of -3.0
            "zscore_threshold_sell": 0.01, # 0.01 instead of 3.0
            "zscore_period": 2,            # 2 candles instead of 20
            "lookback_candles": 3,         # 3 candles instead of 50
            "use_grid_trading": True,
            "max_grid_trades": 2,          # Only 2 levels
            "take_profit_percent": 0.01,   # 0.01% profit target
            "zscore_wait_candles": 1,      # Wait only 1 candle
            "max_drawdown_percent": 5.0    # 5% max drawdown
        }
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/start",
                               json=ultra_gold_config)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Ultra Gold started - Task: {result.get('task_id', 'N/A')}")
        else:
            print(f"❌ Ultra Gold failed: {response.text}")
    except Exception as e:
        print(f"❌ Ultra Gold error: {e}")
    
    # Ultra-aggressive RSI Pairs
    print("\n3. Starting ULTRA-AGGRESSIVE RSI Pairs...")
    ultra_rsi_config = {
        "strategy_name": "rsi_pairs",
        "pair": "XAUUSD",
        "timeframe": "1M",
        "config": {
            "mode": "negative",
            "symbol1": "XAUUSD",
            "symbol2": "EURUSD",
            "rsi_period": 3,               # 3 instead of 14
            "atr_period": 3,               # 3 instead of 5
            "rsi_overbought": 51.0,        # 51 instead of 75 - EXTREME!
            "rsi_oversold": 49.0,          # 49 instead of 25 - EXTREME!
            "profit_target_usd": 1.0,      # $1 target - EXTREME!
            "stop_loss_usd": -50.0,        # $50 stop - VERY LOW!
            "max_trade_hours": 0.5,        # 30 min max
            "lot_size": 0.01,
            "base_lot_size": 0.01
        }
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/start",
                               json=ultra_rsi_config)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Ultra RSI started - Task: {result.get('task_id', 'N/A')}")
        else:
            print(f"❌ Ultra RSI failed: {response.text}")
    except Exception as e:
        print(f"❌ Ultra RSI error: {e}")
    
    # Monitor aggressively
    print(f"\n4. 🔥 AGGRESSIVE MONITORING (2 minutes)")
    print("With these settings, trades should happen VERY quickly!")
    print("Watch server console for rapid signals...")
    
    for i in range(24):  # 24 x 5 seconds = 2 minutes
        try:
            response = requests.get(f"{BASE_URL}/api/dynamic-trading/{session_id}/tasks")
            if response.status_code == 200:
                status = response.json()
                active_count = len(status.get('tasks', []))
                
                # Check for market data to show activity
                try:
                    market_response = requests.get(f"{BASE_URL}/api/dynamic-trading/{session_id}/market-data/XAUUSD/1M")
                    if market_response.status_code == 200:
                        market_data = market_response.json()
                        candles = market_data.get('candles', [])
                        if candles:
                            latest_price = candles[-1].get('close', 0)
                            print(f"[{datetime.now().strftime('%H:%M:%S')}] Active: {active_count} | XAUUSD: {latest_price} | Check: {i+1}/24")
                        else:
                            print(f"[{datetime.now().strftime('%H:%M:%S')}] Active: {active_count} | No price data | Check: {i+1}/24")
                    else:
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] Active: {active_count} | MT5 disconnected? | Check: {i+1}/24")
                except:
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] Active: {active_count} | Market check failed | Check: {i+1}/24")
            
            time.sleep(5)
        except Exception as e:
            print(f"Monitor error: {e}")
            break
    
    print(f"\n5. 🎯 FINAL CHECK - Looking for trades...")
    
    # Check MT5 for actual trades
    try:
        import MetaTrader5 as mt5
        if mt5.initialize():
            positions = mt5.positions_get()
            if positions:
                print(f"🎉 SUCCESS! Found {len(positions)} open positions:")
                for pos in positions:
                    print(f"  Ticket: {pos.ticket} | {pos.symbol} | {'BUY' if pos.type == 0 else 'SELL'} | {pos.volume} lots")
            else:
                print("🟡 No open positions yet - strategies may need more time")
            
            # Check recent orders
            from datetime import timedelta
            yesterday = datetime.now() - timedelta(hours=1)
            orders = mt5.history_orders_get(yesterday, datetime.now())
            if orders:
                print(f"📋 Recent orders: {len(orders)}")
                for order in orders[-3:]:  # Last 3 orders
                    print(f"  Order: {order.ticket} | {order.symbol} | {order.type}")
            
            mt5.shutdown()
        else:
            print("❌ Could not connect to MT5 to check trades")
    except ImportError:
        print("⚠️ MT5 module not available for direct check")
    except Exception as e:
        print(f"⚠️ MT5 check error: {e}")
    
    print(f"\n" + "=" * 60)
    print("🔥 AGGRESSIVE TEST COMPLETED")
    print("=" * 60)
    print("Settings used:")
    print("📊 Gold: 0.001% threshold, ±0.01 Z-score, 0.01% profit")
    print("📊 RSI: 51/49 thresholds, $1 target, 30min max")
    print(f"📊 Session: {session_id}")
    print("\nIf no trades yet:")
    print("1. Check MT5 is connected and logged in")
    print("2. Enable algorithmic trading in MT5")
    print("3. Watch server console for signals")
    print("4. Market may be too stable (try during active hours)")

if __name__ == "__main__":
    print("⚠️  This test uses VERY aggressive settings!")
    print("Trades should happen within minutes if market is active.")
    
    confirm = input("Continue with aggressive test? (y/n): ").strip().lower()
    if confirm == 'y':
        start_aggressive_trading()
    else:
        print("Test cancelled.")