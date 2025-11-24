#!/usr/bin/env python3
"""
Debug MT5 Connection and Market Data
"""

import MetaTrader5 as mt5
import time
from datetime import datetime

def debug_mt5():
    print("🔍 MT5 CONNECTION DEBUG")
    print("=" * 40)
    
    # 1. Check MT5 initialization
    if not mt5.initialize():
        print("❌ MT5 initialization failed!")
        print(f"Error: {mt5.last_error()}")
        return
    
    print("✅ MT5 initialized successfully")
    
    # 2. Check account info
    account = mt5.account_info()
    if account:
        print(f"✅ Account: {account.login}")
        print(f"✅ Server: {account.server}")
        print(f"✅ Balance: ${account.balance}")
    else:
        print("❌ Account info failed")
    
    # 3. Check terminal info
    terminal = mt5.terminal_info()
    if terminal:
        print(f"✅ Terminal connected: {terminal.connected}")
        print(f"✅ Algo trading: {terminal.trade_allowed}")
    else:
        print("❌ Terminal info failed")
    
    # 4. Check XAUUSD symbol
    symbol_info = mt5.symbol_info("XAUUSD")
    if symbol_info:
        print(f"✅ XAUUSD available: {symbol_info.visible}")
        print(f"✅ Trading allowed: {symbol_info.trade_mode}")
    else:
        print("❌ XAUUSD not available")
        mt5.shutdown()
        return
    
    # 5. Check live tick data
    print(f"\n📊 LIVE TICK TEST (10 seconds):")
    for i in range(10):
        tick = mt5.symbol_info_tick("XAUUSD")
        if tick:
            print(f"[{i+1:2d}] XAUUSD: {tick.bid:.2f} | Time: {datetime.fromtimestamp(tick.time)}")
        else:
            print(f"[{i+1:2d}] ❌ No tick data")
        time.sleep(1)
    
    # 6. Check candle data
    print(f"\n📈 CANDLE DATA TEST:")
    rates = mt5.copy_rates_from_pos("XAUUSD", mt5.TIMEFRAME_M1, 0, 5)
    if rates is not None and len(rates) > 0:
        print(f"✅ Got {len(rates)} candles")
        latest = rates[-1]
        candle_time = datetime.fromtimestamp(latest['time'])
        print(f"Latest candle: {candle_time} | Close: {latest['close']:.2f}")
        
        # Check if candle is recent (within last 2 minutes)
        now = datetime.now()
        age_minutes = (now - candle_time).total_seconds() / 60
        if age_minutes < 2:
            print(f"✅ Candle is fresh ({age_minutes:.1f} min old)")
        else:
            print(f"⚠️ Candle is old ({age_minutes:.1f} min old)")
    else:
        print("❌ No candle data available")
    
    # 7. Market hours check
    print(f"\n⏰ MARKET STATUS:")
    current_time = datetime.now()
    print(f"Current time: {current_time}")
    
    # Simple market hours check (approximate)
    weekday = current_time.weekday()  # 0=Monday, 6=Sunday
    hour = current_time.hour
    
    if weekday == 6:  # Sunday
        if hour >= 17:  # After 5 PM Sunday
            print("✅ Market should be open (Sunday evening)")
        else:
            print("❌ Market closed (Sunday before 5 PM)")
    elif weekday == 5:  # Saturday
        print("❌ Market closed (Saturday)")
    elif weekday < 5:  # Monday-Friday
        print("✅ Market should be open (Weekday)")
    else:
        print("⚠️ Market status unclear")
    
    mt5.shutdown()
    
    print(f"\n🎯 SUMMARY:")
    print("If you see ❌ errors above, that's why strategy isn't working!")
    print("If you see ✅ everywhere, strategy should be getting data.")

if __name__ == "__main__":
    debug_mt5()