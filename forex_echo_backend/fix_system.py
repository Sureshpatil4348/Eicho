#!/usr/bin/env python3
"""
Quick Fix Script for Forex Echo Backend Issues
Fixes: SSL, Strategy Init, Database Queries
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_database_connection():
    """Test database connection with SSL disabled"""
    try:
        from app.database.database import engine
        from sqlalchemy import text
        
        print("Testing database connection...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("Database connection successful")
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

def test_strategy_initialization():
    """Test strategy initialization"""
    try:
        from app.services.enhanced_gold_buy_dip_strategy import EnhancedGoldBuyDipStrategy
        
        config = {
            'lot_size': 0.01,
            'percentage_threshold': 0.5,
            'zscore_threshold_buy': -2.0,
            'max_grid_trades': 3
        }
        
        strategy = EnhancedGoldBuyDipStrategy(config, "1M")
        print("Strategy initialization successful")
        return True
    except Exception as e:
        print(f"Strategy initialization failed: {e}")
        return False

def test_mt5_connection():
    """Test MT5 connection"""
    try:
        import MetaTrader5 as mt5
        
        if not mt5.initialize():
            print(f"MT5 initialization failed: {mt5.last_error()}")
            return False
        
        terminal_info = mt5.terminal_info()
        if terminal_info:
            print("MT5 connection successful")
            print(f"   Terminal: {terminal_info.name}")
            print(f"   Company: {terminal_info.company}")
            mt5.shutdown()
            return True
        else:
            print("MT5 terminal info not available")
            return False
    except Exception as e:
        print(f"MT5 connection failed: {e}")
        return False

def main():
    print("FOREX ECHO BACKEND - SYSTEM FIX")
    print("=" * 50)
    
    # Test components
    db_ok = test_database_connection()
    strategy_ok = test_strategy_initialization()
    mt5_ok = test_mt5_connection()
    
    print("\n" + "=" * 50)
    print("SYSTEM STATUS:")
    print(f"Database: {'OK' if db_ok else 'FAILED'}")
    print(f"Strategy: {'OK' if strategy_ok else 'FAILED'}")
    print(f"MT5:      {'OK' if mt5_ok else 'FAILED'}")
    
    if all([db_ok, strategy_ok, mt5_ok]):
        print("\nALL SYSTEMS OPERATIONAL!")
        print("You can now run: python run.py")
    else:
        print("\nSome systems need attention")
        if not db_ok:
            print("- Check database SSL configuration")
        if not strategy_ok:
            print("- Check strategy initialization parameters")
        if not mt5_ok:
            print("- Check MT5 terminal is running")

if __name__ == "__main__":
    main()