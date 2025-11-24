# RSI Strategy - Simple API Guide

## Basic Steps to Use RSI Strategy

### Step 1: Create Session
```
POST /api/session/create

Send:
{
  "user_id": "my_user"
}

Get:
{
  "session_id": "abc-123-xyz"
}
```

### Step 2: Start RSI Strategy
```
POST /api/dynamic-trading/abc-123-xyz/start

Send:
{
  "strategy_name": "rsi_pairs",
  "pair": "EURUSD",
  "timeframe": "5M",
  "config": {
    "symbol1": "EURUSD",
    "symbol2": "GBPUSD",
    "rsi_overbought": 70,
    "rsi_oversold": 30,
    "profit_target_usd": 50,
    "lot_size": 0.01
  }
}

Get:
{
  "task_id": "abc-123-xyz_EURUSD_5M_rsi_pairs",
  "message": "Strategy started"
}
```

### Step 3: Check if Running
```
GET /api/dynamic-trading/abc-123-xyz/tasks

Get:
{
  "tasks": [
    {
      "task_id": "abc-123-xyz_EURUSD_5M_rsi_pairs",
      "status": "running"
    }
  ]
}
```

### Step 4: Stop Strategy
```
POST /api/dynamic-trading/abc-123-xyz/stop

Send:
{
  "task_id": "abc-123-xyz_EURUSD_5M_rsi_pairs"
}

Get:
{
  "message": "Strategy stopped"
}
```

---

## RSI Strategy Settings

### Required Settings (User Must Specify)
- `symbol1`: First currency pair (like "EURUSD") - **USER CHOICE**
- `symbol2`: Second currency pair (like "GBPUSD") - **USER CHOICE**
- `lot_size`: How much to trade (like 0.01)
- `base_lot_size`: Base position size for symbol1

### RSI Settings
- `rsi_overbought`: When to sell (default: 70)
- `rsi_oversold`: When to buy (default: 30)
- `rsi_period`: RSI calculation period (default: 14)

### Money Settings
- `profit_target_usd`: Take profit at this amount (like 50)
- `stop_loss_usd`: Stop loss at this amount (like -100)
- `max_trade_hours`: Close after this many hours (like 4)

### Capital Allocation (Automatic)
- `base_lot_size`: Base position size for capital allocation (optional)
- System automatically allocates capital per strategy
- Position sizes adjusted based on allocated capital
- Risk management applied automatically

---

## Simple Examples

### Conservative Setup (Safe)
```json
{
  "strategy_name": "rsi_pairs",
  "pair": "EURUSD",
  "timeframe": "15M",
  "config": {
    "symbol1": "EURUSD",
    "symbol2": "GBPUSD",
    "rsi_overbought": 75,
    "rsi_oversold": 25,
    "profit_target_usd": 100,
    "stop_loss_usd": -200,
    "lot_size": 0.01
  }
}
```

### Aggressive Setup (Risky)
```json
{
  "strategy_name": "rsi_pairs",
  "pair": "EURUSD", 
  "timeframe": "1M",
  "config": {
    "symbol1": "EURUSD",
    "symbol2": "GBPUSD",
    "rsi_overbought": 65,
    "rsi_oversold": 35,
    "profit_target_usd": 25,
    "stop_loss_usd": -50,
    "lot_size": 0.02
  }
}
```

---

## Popular Currency Pairs

### Good Combinations
- EURUSD + GBPUSD (most popular)
- EURUSD + USDJPY
- GBPUSD + USDJPY
- XAUUSD + EURUSD (Gold with Euro)

### Timeframes
- 1M = Very fast trading
- 5M = Fast trading  
- 15M = Medium trading
- 1H = Slow trading

---

## What You Get Back

### Success Response
```json
{
  "task_id": "your_task_id",
  "message": "Strategy started successfully"
}
```

### Error Response
```json
{
  "error": "Invalid parameters",
  "message": "Symbol not found"
}
```

---

## Capital Allocation Setup (Optional)

### Step 0: Set Capital Allocation (Before Starting Strategy)
```
POST /api/capital-allocation/allocate

Send:
{
  "session_id": "your-session-id",
  "strategy_name": "rsi_pairs",
  "allocated_amount": 1000.0,
  "risk_percentage": 2.0
}

Get:
{
  "message": "Capital allocated successfully",
  "allocated_amount": 1000.0
}
```

### What Happens Automatically:
- If no capital allocation set: Uses your lot_size directly
- If capital allocation set: Adjusts position sizes automatically
- Risk management applied based on allocated capital
- Position sizing optimized for better risk control

---

## Important Notes

1. **MT5 Must Be Running**: Make sure MetaTrader 5 is open
2. **Enable Algo Trading**: Click the "AutoTrading" button in MT5
3. **Valid Session**: Always use the session_id you got from step 1
4. **Check Balance**: Make sure you have enough money in MT5 account
5. **Internet Connection**: Keep stable internet for live trading
6. **Capital Allocation**: Optional but recommended for better risk management

---

## Quick Test

```bash
# 1. Create session
curl -X POST http://127.0.0.1:8000/api/session/create \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test"}'

# 2. Start RSI strategy (use session_id from step 1)
curl -X POST http://127.0.0.1:8000/api/dynamic-trading/YOUR_SESSION_ID/start \
  -H "Content-Type: application/json" \
  -d '{
    "strategy_name": "rsi_pairs",
    "pair": "EURUSD",
    "timeframe": "5M",
    "config": {
      "symbol1": "EURUSD",
      "symbol2": "GBPUSD",
      "rsi_overbought": 70,
      "rsi_oversold": 30,
      "profit_target_usd": 50,
      "lot_size": 0.01
    }
  }'

# 3. Check if running
curl http://127.0.0.1:8000/api/dynamic-trading/YOUR_SESSION_ID/tasks
```

Replace `YOUR_SESSION_ID` with the actual session ID you got from step 1.