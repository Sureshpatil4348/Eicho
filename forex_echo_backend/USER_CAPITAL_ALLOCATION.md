# User-Controlled Capital Allocation

## How Capital Allocation Works

### Without Capital Allocation (Default)
- Uses your fixed `lot_size` directly (like 0.02 lots)
- No risk management limits
- User controls everything manually

### With Capital Allocation (User Setup)
- User decides how much money to allocate to each strategy
- System calculates optimal position sizes
- Automatic risk management and stop-loss protection

---

## Step-by-Step User Setup

### Step 1: Create Portfolio
```bash
curl --location 'http://127.0.0.1:8000/api/capital/portfolio/create' \
--header 'Content-Type: application/json' \
--data '{
  "user_id": "your_user_id",
  "total_capital": 10000.0
}'
```

**Response:**
```json
{
  "success": true,
  "portfolio_id": 1,
  "message": "Portfolio created with $10000.0 capital"
}
```

### Step 2: Allocate Money to RSI Strategy
```bash
curl --location 'http://127.0.0.1:8000/api/capital/strategy/allocate' \
--header 'Content-Type: application/json' \
--data '{
  "portfolio_id": 1,
  "strategy_name": "rsi_pairs",
  "allocation_amount": 1000.0
}'
```

**Response:**
```json
{
  "success": true,
  "allocation_id": 1,
  "allocated_capital": 1000.0,
  "message": "Allocated $1000.0 to rsi_pairs"
}
```

### Step 3: Allocate Money to Specific Pairs
```bash
curl --location 'http://127.0.0.1:8000/api/capital/pairs/allocate' \
--header 'Content-Type: application/json' \
--data '{
  "strategy_allocation_id": 1,
  "pair_allocations": [
    {
      "pair": "EURUSD",
      "allocated_amount": 500.0
    },
    {
      "pair": "GBPUSD", 
      "allocated_amount": 500.0
    }
  ],
  "floating_loss_threshold_pct": 20.0
}'
```

---

## Gold Strategy Capital Allocation

### Same Process for Gold Strategy
```bash
# 1. Allocate to gold strategy
curl --location 'http://127.0.0.1:8000/api/capital/strategy/allocate' \
--header 'Content-Type: application/json' \
--data '{
  "portfolio_id": 1,
  "strategy_name": "gold_buy_dip",
  "allocation_amount": 2000.0
}'

# 2. Allocate to XAUUSD pair
curl --location 'http://127.0.0.1:8000/api/capital/pairs/allocate' \
--header 'Content-Type: application/json' \
--data '{
  "strategy_allocation_id": 2,
  "pair_allocations": [
    {
      "pair": "XAUUSD",
      "allocated_amount": 2000.0
    }
  ],
  "floating_loss_threshold_pct": 15.0
}'
```

---

## Check Your Allocations

### View Portfolio Summary
```bash
curl --location 'http://127.0.0.1:8000/api/capital/portfolio/your_user_id/summary'
```

### Check Risk Status
```bash
curl --location 'http://127.0.0.1:8000/api/capital/risk/status/EURUSD/rsi_pairs'
```

---

## User Control Examples

### Conservative User
```json
{
  "total_capital": 10000,
  "allocations": {
    "rsi_pairs": 1000,     // 10% to RSI
    "gold_buy_dip": 2000,  // 20% to Gold
    "cash_reserve": 7000   // 70% in cash
  }
}
```

### Aggressive User
```json
{
  "total_capital": 10000,
  "allocations": {
    "rsi_pairs": 4000,     // 40% to RSI
    "gold_buy_dip": 4000,  // 40% to Gold
    "cash_reserve": 2000   // 20% in cash
  }
}
```

---

## Benefits of User-Controlled Allocation

### Risk Management
- **Stop Loss Protection**: Automatically stops trading if losses exceed threshold
- **Position Sizing**: Calculates optimal lot sizes based on allocated capital
- **Drawdown Control**: Prevents over-risking on single trades

### Portfolio Management
- **Capital Distribution**: User decides how much to allocate to each strategy
- **Risk Limits**: User sets loss thresholds per strategy/pair
- **Performance Tracking**: Monitor P&L per allocation

### Flexibility
- **Optional**: Can trade without allocation (uses fixed lot sizes)
- **Adjustable**: Change allocations anytime
- **Scalable**: Add more strategies and pairs as needed

---

## Current Status

### Your RSI Strategy
- **Currently**: Using fixed lot_size (0.02) - no allocation needed
- **Optional**: Set up allocation for better risk management
- **Benefit**: Automatic position sizing and risk control

### Your Gold Strategy (if running)
- **Same**: Uses fixed lot_size by default
- **Optional**: Set up allocation for grid trading optimization
- **Benefit**: Better grid management with allocated capital

**Bottom Line: Capital allocation is completely optional and user-controlled. Your strategies work fine without it, but it provides better risk management when you want it.**