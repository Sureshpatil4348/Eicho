# Forex Echo Backend - API Documentation

🚀 **Professional Multi-Threaded Forex Trading System**

Dynamic configuration • Session persistence • Real-time execution • Multi-asset trading • 20 concurrent trades • Smart capital allocation • Unlimited concurrent trades

## Base URL
```
http://127.0.0.1:8000
```

## 🎯 Client Scenarios & Use Cases

### Scenario 1: Conservative Gold Trader ($5,000 Portfolio)
**Goal**: Steady monthly returns with low risk
```json
Portfolio: $5,000
Strategy: "Conservative Gold" (100% allocation)
Pairs: XAUUSD only
Timeframe: 15M
Risk: 2% per trade
Expected: 15-20% monthly returns
```

### Scenario 2: Aggressive Multi-Pair Trader ($50,000 Portfolio)
**Goal**: High volume diversified trading
```json
Portfolio: $50,000
Strategy 1: "Major Pairs" (70%) → $35,000
  - EURUSD, GBPUSD, USDJPY (each gets $11,667)
Strategy 2: "Gold Scalping" (30%) → $15,000
  - XAUUSD (1M timeframe)
Result: Diversified risk, higher volume
```

### Scenario 3: Hedge Fund Style ($100,000+ Portfolio)
**Goal**: Professional multi-strategy approach
```json
Portfolio: $100,000
Strategy 1: "Trend Following" (40%) → $40,000
  - 8 major pairs (each $5,000)
Strategy 2: "Mean Reversion" (35%) → $35,000
  - Gold + Silver pairs
Strategy 3: "Scalping" (25%) → $25,000
  - High-frequency 1M trades
```

---

## 💰 Capital Allocation System

### Create Portfolio
**POST** `http://127.0.0.1:8000/api/capital/portfolio`

```json
{
  "user_id": "trader_001",
  "total_capital": 10000.0,
  "currency": "USD"
}
```

### Allocate Strategy
**POST** `http://127.0.0.1:8000/api/capital/strategy/allocate`

```json
{
  "portfolio_id": 123,
  "strategy_name": "Gold Scalping",
  "allocation_amount": 6000.0
}
```

### Allocate Pairs to Strategy
**POST** `http://127.0.0.1:8000/api/capital/pairs/allocate`

**Option A: Fixed Dollar Amounts**
```json
{
  "strategy_allocation_id": 123,
  "pair_allocations": [
    {"pair": "XAUUSD", "amount": 4000.0, "floating_loss_threshold_pct": 10.0},
    {"pair": "XAGUSD", "amount": 2000.0, "floating_loss_threshold_pct": 15.0}
  ]
}
```

**Option B: Percentage Allocation**
```json
{
  "strategy_allocation_id": 123,
  "pair_allocations": [
    {"pair": "XAUUSD", "percentage": 60.0, "floating_loss_threshold_pct": 10.0},
    {"pair": "XAGUSD", "percentage": 40.0, "floating_loss_threshold_pct": 15.0}
  ]
}
```

### Get Portfolio Dashboard
**GET** `http://127.0.0.1:8000/api/capital/dashboard/{user_id}`

Example: `http://127.0.0.1:8000/api/capital/dashboard/trader_001`

### Get Risk Status
**GET** `http://127.0.0.1:8000/api/capital/risk-status/{user_id}`

### Reset Portfolio
**DELETE** `http://127.0.0.1:8000/api/capital/reset/{user_id}`

---

## 🎆 Key Client Advantages

### 💰 Smart Capital Management
```
✅ Hierarchical allocation: Portfolio → Strategy → Pairs
✅ Prevents over-allocation (cannot exceed 100%)
✅ Real-time fund tracking and validation
✅ Independent risk management per pair
✅ Example: $10K portfolio, 90% allocated = Cannot add 20% more
```

### 🚀 Multi-Threading Scalability
```
✅ 20 concurrent trading pairs maximum
✅ Each pair runs independently in separate thread
✅ Add/remove pairs dynamically without restart
✅ Scale from $1K to $1M+ portfolios seamlessly
✅ Example: Run up to 50 pairs simultaneously
```

### 🔄 Business Continuity
```
✅ Auto-recovery after system crashes
✅ Session persistence in database
✅ MT5 reconnection handling
✅ Position preservation during downtime
✅ Example: System restart → All trades resume automatically
```

### ⚡ Real-time Performance
```
✅ Live MT5 integration with real positions
✅ Real-time P&L tracking per pair
✅ Instant risk threshold monitoring
✅ Dynamic position management and grid trading
✅ Example: 16.34% loss triggers 10% threshold → Auto-close
```

### 🛡️ Risk Protection
```
✅ Fund exhaustion prevention
✅ Duplicate strategy name blocking
✅ Per-pair floating loss monitoring
✅ Automatic position closure on breach
✅ Example: Cannot allocate same strategy name twice
```

---

## 📝 Complete Client Workflow (6 Steps)

### For Any Client Portfolio Size:

**Step 1**: Create Portfolio → `POST /api/capital/portfolio`
**Step 2**: Allocate Strategies → `POST /api/capital/strategy`  
**Step 3**: Add Trading Pairs → `POST /api/capital/pair`
**Step 4**: Create Session → `POST /api/session/create`
**Step 5**: Connect MT5 → `POST /api/mt5/connect`
**Step 6**: Start Trading with Parameters → `POST /api/dynamic-trading/{session_id}/start`

**Note**: Trading parameters (lot_size, thresholds, etc.) are set in Step 6 when starting each pair

**Result**: Professional trading system running in under 5 minutes!

---

## ⚙️ When Are Trading Parameters Set?

### Capital Allocation Phase (Steps 1-3)
**What Gets Set:**
```json
✅ Portfolio total capital ($50,000)
✅ Strategy allocation percentages (60% + 40%)
✅ Which pairs go to which strategy
❌ NO trading parameters yet!
```

### Trading Execution Phase (Step 6)
**What Gets Set:**
```json
✅ lot_size (position size per trade)
✅ percentage_threshold (price movement trigger)
✅ zscore_threshold_buy/sell (signal strength)
✅ take_profit_percent (profit target)
✅ max_drawdown_percent (risk limit)
✅ max_grid_trades (maximum positions)
✅ All strategy-specific parameters
```

### Example Flow:
```bash
# Step 1-3: Capital allocation (NO parameters)
POST /api/capital/portfolio {"total_capital": 50000}
POST /api/capital/strategy {"strategy_name": "Gold", "allocation_percentage": 60}
POST /api/capital/pair {"strategy_name": "Gold", "pairs": ["XAUUSD"]}

# Step 6: Start trading (WITH parameters)
POST /api/dynamic-trading/session_id/start {
  "pair": "XAUUSD",
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.01,           // ← User sets this NOW
    "percentage_threshold": 2.0, // ← User sets this NOW
    "take_profit_percent": 1.0   // ← User sets this NOW
  }
}
```

**💡 Key Point**: Capital allocation is about MONEY distribution, Trading parameters are about HOW to trade!

---

## 📊 Complete Parameter Reference (Set in Step 6)

### When User Starts Trading Task: `POST /api/dynamic-trading/{session_id}/start`

**All these parameters are set in the `config` object:**

| Parameter | Description | Default | When Set |
|-----------|-------------|---------|----------|
| `lot_size` | Initial lot size for first trade | `0.1` | Step 6 - Trading Start |
| `take_profit` | Take profit in points (if not using percent) | `200` | Step 6 - Trading Start |
| `percentage_threshold` | % move from high/low to trigger trade | `2.0` | Step 6 - Trading Start |
| `lookback_candles` | Candles to analyze for high/low price | `50` | Step 6 - Trading Start |
| `zscore_wait_candles` | Max candles to wait for Z-score confirmation | `10` | Step 6 - Trading Start |
| `zscore_threshold_sell` | Z-score value to confirm SELL trade | `3.0` | Step 6 - Trading Start |
| `zscore_threshold_buy` | Z-score value to confirm BUY trade | `-3.0` | Step 6 - Trading Start |
| `zscore_period` | Candles for Z-score calculation | `20` | Step 6 - Trading Start |
| `magic_number` | Unique ID for EA trade management | `12345` | Step 6 - Trading Start |
| `use_take_profit_percent` | Use percentage TP instead of points | `false` | Step 6 - Trading Start |
| `take_profit_percent` | Take profit as % of entry price | `1.0` | Step 6 - Trading Start |
| `use_grid_trading` | Enable/disable grid functionality | `true` | Step 6 - Trading Start |
| `max_grid_trades` | Maximum trades in single grid series | `5` | Step 6 - Trading Start |
| `use_grid_percent` | Use percentage for grid spacing | `false` | Step 6 - Trading Start |
| `grid_percent` | Distance between grid trades as % | `0.5` | Step 6 - Trading Start |
| `grid_atr_multiplier` | ATR multiplier for grid spacing | `1.0` | Step 6 - Trading Start |
| `atr_period` | Period for ATR calculation | `14` | Step 6 - Trading Start |
| `grid_lot_multiplier` | Lot size multiplier for grid trades | `1.0` | Step 6 - Trading Start |
| `use_progressive_lots` | Increase lot size for each grid level | `false` | Step 6 - Trading Start |
| `lot_progression_factor` | Factor to multiply lot size (e.g. 1.5) | `1.5` | Step 6 - Trading Start |
| `max_drawdown_percent` | Max account drawdown before force close | `50.0` | Step 6 - Trading Start |

### Example: Complete Parameter Configuration
```json
POST /api/dynamic-trading/session_123/start
{
  "pair": "XAUUSD",
  "timeframe": "15M",
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.01,
    "percentage_threshold": 2.0,
    "lookback_candles": 50,
    "zscore_threshold_buy": -3.0,
    "zscore_threshold_sell": 3.0,
    "zscore_period": 20,
    "take_profit_percent": 1.0,
    "use_take_profit_percent": true,
    "max_grid_trades": 5,
    "grid_percent": 0.5,
    "use_grid_percent": true,
    "max_drawdown_percent": 30.0,
    "use_progressive_lots": false,
    "grid_lot_multiplier": 1.0
  }
}
```

**🎯 Client Workflow Summary:**
1. **Steps 1-3**: Money allocation only (no parameters)
2. **Step 6**: User sets ALL trading parameters when starting each pair

---

## 🔄 Session Management & Multiple Timeframes

### Understanding Session vs Trading Parameters

**Session Management (Steps 4-5):**
- Sessions are containers for organizing your trading setup
- You can add multiple pairs and timeframes to a session for convenience
- This is just for organization - NOT for trading parameters

**Trading Execution (Step 6):**
- Each trading task is independent and requires its own parameters
- You must specify pair + timeframe + parameters for each task
- Session pairs/timeframes are just "favorites" - you still choose when starting

### Multiple Timeframes: YES, You Can!

**Example: Same Pair, Different Timeframes**
```bash
# Add multiple timeframes to session (optional organization)
POST /api/session/{session_id}/timeframes {"timeframe": "1M"}
POST /api/session/{session_id}/timeframes {"timeframe": "15M"}
POST /api/session/{session_id}/timeframes {"timeframe": "1H"}

# Start MULTIPLE trading tasks for SAME pair with DIFFERENT timeframes
POST /api/dynamic-trading/{session_id}/start {
  "pair": "XAUUSD", "timeframe": "1M", "config": {"percentage_threshold": 0.1}
}
POST /api/dynamic-trading/{session_id}/start {
  "pair": "XAUUSD", "timeframe": "15M", "config": {"percentage_threshold": 2.0}
}
POST /api/dynamic-trading/{session_id}/start {
  "pair": "XAUUSD", "timeframe": "1H", "config": {"percentage_threshold": 5.0}
}
```

**Result**: 3 independent trading tasks running simultaneously:
- XAUUSD 1M (aggressive scalping)
- XAUUSD 15M (medium-term)
- XAUUSD 1H (swing trading)

### Session Management Workflow

**Step 4: Create Session (Container)**
```bash
POST /api/session/create {"user_id": "trader_001"}
# Response: {"session_id": "abc-123"}
```

**Step 4a: Add Pairs to Session (Optional - Just Organization)**
```bash
POST /api/session/abc-123/pairs {"pair": "XAUUSD"}
POST /api/session/abc-123/pairs {"pair": "EURUSD"}
```

**Step 4b: Add Timeframes to Session (Optional - Just Organization)**
```bash
POST /api/session/abc-123/timeframes {"timeframe": "1M"}
POST /api/session/abc-123/timeframes {"timeframe": "15M"}
```

**Step 6: Start Trading (Real Parameters)**
```bash
# You STILL choose pair + timeframe + parameters for each task
POST /api/dynamic-trading/abc-123/start {
  "pair": "XAUUSD",      # ← You choose (can be from session or new)
  "timeframe": "1M",     # ← You choose (can be from session or new)
  "strategy_name": "gold_buy_dip",
  "config": {"lot_size": 0.01, "percentage_threshold": 0.1}
}
```

### Key Points:

1. **Session pairs/timeframes = Organization only**
2. **Trading parameters = Set when starting each task**
3. **Multiple timeframes = YES! Each is independent task**
4. **Same pair + different timeframes = Allowed and common**

---

## 📋 Complete Parameter Reference

### Main Trading Endpoint: `POST /api/dynamic-trading/{session_id}/start`

**Request Body with ALL Parameters:**
```json
{
  "pair": "XAUUSD",
  "timeframe": "15M",
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.01,
    "take_profit": 200,
    "percentage_threshold": 2.0,
    "lookback_candles": 50,
    "zscore_wait_candles": 10,
    "zscore_threshold_sell": 3.0,
    "zscore_threshold_buy": -3.0,
    "zscore_period": 20,
    "magic_number": 12345,
    "use_take_profit_percent": true,
    "take_profit_percent": 1.0,
    "use_grid_trading": true,
    "max_grid_trades": 5,
    "use_grid_percent": false,
    "grid_percent": 0.5,
    "grid_atr_multiplier": 1.0,
    "atr_period": 14,
    "grid_lot_multiplier": 1.0,
    "use_progressive_lots": false,
    "lot_progression_factor": 1.5,
    "max_drawdown_percent": 50.0
  }
}
```

### Parameter Details

| Parameter | Description | Default | Type |
|-----------|-------------|---------|------|
| `lot_size` | Initial lot size for first trade | `0.1` | float |
| `take_profit` | Take profit in points (if not using percent) | `200` | int |
| `percentage_threshold` | % move from high/low to trigger trade | `2.0` | float |
| `lookback_candles` | Candles to analyze for high/low price | `50` | int |
| `zscore_wait_candles` | Max candles to wait for Z-score confirmation | `10` | int |
| `zscore_threshold_sell` | Z-score value to confirm SELL trade | `3.0` | float |
| `zscore_threshold_buy` | Z-score value to confirm BUY trade | `-3.0` | float |
| `zscore_period` | Candles for Z-score calculation | `20` | int |
| `magic_number` | Unique ID for EA trade management | `12345` | int |
| `use_take_profit_percent` | Use percentage TP instead of points | `false` | bool |
| `take_profit_percent` | Take profit as % of entry price | `1.0` | float |
| `use_grid_trading` | Enable/disable grid functionality | `true` | bool |
| `max_grid_trades` | Maximum trades in single grid series | `5` | int |
| `use_grid_percent` | Use percentage for grid spacing | `false` | bool |
| `grid_percent` | Distance between grid trades as % | `0.5` | float |
| `grid_atr_multiplier` | ATR multiplier for grid spacing | `1.0` | float |
| `atr_period` | Period for ATR calculation | `14` | int |
| `grid_lot_multiplier` | Lot size multiplier for grid trades | `1.0` | float |
| `use_progressive_lots` | Increase lot size for each grid level | `false` | bool |
| `lot_progression_factor` | Factor to multiply lot size (e.g. 1.5) | `1.5` | float |
| `max_drawdown_percent` | Max account drawdown before force close | `50.0` | float |

---

## 🎯 Real-World Examples

### Example 1: Conservative Gold Trading
```bash
POST /api/dynamic-trading/session_123/start
{
  "pair": "XAUUSD",
  "timeframe": "15M",
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.01,
    "percentage_threshold": 2.0,
    "zscore_threshold_buy": -3.0,
    "take_profit_percent": 1.0,
    "max_grid_trades": 3,
    "max_drawdown_percent": 20.0
  }
}
```

### Example 2: Aggressive Scalping
```bash
POST /api/dynamic-trading/session_123/start
{
  "pair": "XAUUSD",
  "timeframe": "1M",
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.02,
    "percentage_threshold": 0.1,
    "zscore_threshold_buy": -1.0,
    "take_profit_percent": 0.2,
    "max_grid_trades": 8,
    "use_progressive_lots": true,
    "lot_progression_factor": 1.3
  }
}
```

### Example 3: Multi-Timeframe Same Pair
```bash
# Start 3 tasks for same pair, different timeframes
POST /api/dynamic-trading/session_123/start {"pair": "XAUUSD", "timeframe": "1M", "config": {...}}
POST /api/dynamic-trading/session_123/start {"pair": "XAUUSD", "timeframe": "15M", "config": {...}}
POST /api/dynamic-trading/session_123/start {"pair": "XAUUSD", "timeframe": "1H", "config": {...}}
```

**Result**: 3 independent trading strategies running simultaneously on XAUUSD!ters for each pair
3. **Result**: Each pair trades with its own custom parameters

---

## 🔐 Authentication Endpoints

### Register User
**POST** `http://127.0.0.1:8000/api/auth/register`

```json
{
  "username": "john_trader",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "full_name": "John Trader"
}
```

### Login User
**POST** `http://127.0.0.1:8000/api/auth/login`

```json
{
  "email": "Sandeep@example.com",
  "password": "SecurePass123!"
}
```

---

## 🎯 Session Management Endpoints

### Create Trading Session
**POST** `http://127.0.0.1:8000/api/session/create`

```json
{
  "user_id": "user_12345"
}
```

### Get Session Status
**GET** `http://127.0.0.1:8000/api/session/{session_id}/status`

Example: `http://127.0.0.1:8000/api/session/abc123-def456/status`

### Add Trading Pair to Session
**POST** `http://127.0.0.1:8000/api/session/{session_id}/pairs`

```json
{
  "pair": "XAUUSD"
}
```

### Remove Trading Pair from Session
**DELETE** `http://127.0.0.1:8000/api/session/{session_id}/pairs/{pair}`

Example: `http://127.0.0.1:8000/api/session/abc123-def456/pairs/XAUUSD`

### Add Timeframe to Session
**POST** `http://127.0.0.1:8000/api/session/{session_id}/timeframes`

```json
{
  "timeframe": "15M"
}
```

### Set Strategy Configuration
**POST** `http://127.0.0.1:8000/api/session/{session_id}/strategies`

```json
{
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.01,
    "percentage_threshold": 2.0,
    "zscore_threshold_buy": -3.0,
    "zscore_threshold_sell": 3.0,
    "lookback_candles": 50,
    "zscore_period": 20,
    "max_grid_trades": 5,
    "take_profit_percent": 1.0,
    "max_drawdown_percent": 30.0
  }
}
```

### Get All Active Sessions
**GET** `http://127.0.0.1:8000/api/session/active`

---

## 🚀 Dynamic Trading Endpoints

### Get Available Trading Pairs
**GET** `http://127.0.0.1:8000/api/dynamic-trading/pairs/available`

### Get Available Timeframes
**GET** `http://127.0.0.1:8000/api/dynamic-trading/timeframes/available`

### Get Available Strategies
**GET** `http://127.0.0.1:8000/api/dynamic-trading/strategies/available`

### Start Trading Task
**POST** `http://127.0.0.1:8000/api/dynamic-trading/{session_id}/start`

#### Conservative Gold Trading Example:
```json
{
  "pair": "XAUUSD",
  "timeframe": "15M",
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.01,
    "percentage_threshold": 2.0,
    "zscore_threshold_buy": -3.0,
    "zscore_threshold_sell": 3.0,
    "lookback_candles": 50,
    "zscore_period": 20,
    "max_grid_trades": 5,
    "take_profit_percent": 1.0,
    "max_drawdown_percent": 30.0
  }
}
```

#### Aggressive Scalping Example:
```json
{
  "pair": "XAUUSD",
  "timeframe": "1M",
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.01,
    "percentage_threshold": 0.1,
    "zscore_threshold_buy": -1.0,
    "zscore_threshold_sell": 1.0,
    "lookback_candles": 20,
    "zscore_period": 10,
    "take_profit_percent": 0.2,
    "max_drawdown_percent": 50.0
  }
}
```

#### Forex Pair Example:
```json
{
  "pair": "EURUSD",
  "timeframe": "5M",
  "strategy_name": "simple_ma",
  "config": {
    "lot_size": 0.01,
    "fast_period": 10,
    "slow_period": 20,
    "take_profit_pips": 50,
    "stop_loss_pips": 30
  }
}
```

### Stop Trading Task
**POST** `http://127.0.0.1:8000/api/dynamic-trading/{session_id}/stop`

```json
{
  "pair": "XAUUSD",
  "timeframe": "15M",
  "strategy_name": "gold_buy_dip"
}
```

### Get Active Trading Tasks
**GET** `http://127.0.0.1:8000/api/dynamic-trading/{session_id}/tasks`

### Get Market Data
**GET** `http://127.0.0.1:8000/api/dynamic-trading/{session_id}/market-data/{pair}/{timeframe}`

Example: `http://127.0.0.1:8000/api/dynamic-trading/abc123-def456/market-data/XAUUSD/15M`

---

## 📊 MT5 Connection Endpoints

### Connect to MT5
**POST** `http://127.0.0.1:8000/api/mt5/connect`

```json
{
  "login": 12345678,
  "password": "mt5_password",
  "server": "MetaQuotes-Demo",
  "session_id": "abc123-def456"
}
```

### Disconnect from MT5
**POST** `http://127.0.0.1:8000/api/mt5/disconnect`

```json
{
  "session_id": "abc123-def456"
}
```

### Get MT5 Connection Status
**GET** `http://127.0.0.1:8000/api/mt5/status`

### Get Available Symbols
**GET** `http://127.0.0.1:8000/api/mt5/symbols`

### Get Account Information
**GET** `http://127.0.0.1:8000/api/mt5/account-info`

---

## 🔄 Session Recovery Endpoints

### Recover Specific Session
**POST** `http://127.0.0.1:8000/api/recovery/session/{session_id}`

Example: `http://127.0.0.1:8000/api/recovery/session/abc123-def456`

### Get User Sessions
**GET** `http://127.0.0.1:8000/api/recovery/user/{user_id}/sessions`

Example: `http://127.0.0.1:8000/api/recovery/user/user_12345/sessions`

### Get Session Tasks from Database
**GET** `http://127.0.0.1:8000/api/recovery/session/{session_id}/tasks`

### Auto-Recover All Sessions
**POST** `http://127.0.0.1:8000/api/recovery/auto-recover`

```json
{
  "user_id": "user_12345"
}
```

---

## 🏥 System Health Endpoints

### Health Check
**GET** `http://127.0.0.1:8000/health`

### Root Redirect
**GET** `http://127.0.0.1:8000/`

---

## 📋 Complete Client Workflows

### 🎯 Workflow 1: Conservative Gold Trader Setup (5 Minutes)

**Step 1: Create Portfolio**
```bash
POST http://127.0.0.1:8000/api/capital/portfolio
{
  "user_id": "gold_trader_001",
  "total_capital": 5000.0,
  "currency": "USD"
}
```

**Step 2: Allocate Strategy**
```bash
POST http://127.0.0.1:8000/api/capital/strategy/allocate
{
  "portfolio_id": 1,
  "strategy_name": "Conservative Gold",
  "allocation_amount": 5000.0
}
```

**Step 3: Add Gold Pairs**
```bash
POST http://127.0.0.1:8000/api/capital/pair
{
  "user_id": "gold_trader_001",
  "strategy_name": "Conservative Gold",
  "pairs": ["XAUUSD"]
}
```

**Step 4: Create Trading Session**
```bash
POST http://127.0.0.1:8000/api/session/create
{
  "user_id": "gold_trader_001"
}
```

**Step 5: Connect MT5**
```bash
POST http://127.0.0.1:8000/api/mt5/connect
{
  "login": 12345678,
  "password": "demo_password",
  "server": "MetaQuotes-Demo",
  "session_id": "your_session_id"
}
```

**Step 6: Start Trading with Parameters**
```bash
POST http://127.0.0.1:8000/api/dynamic-trading/your_session_id/start
{
  "pair": "XAUUSD",
  "timeframe": "15M", 
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.01,                    // Position size per trade
    "percentage_threshold": 2.0,         // Price movement trigger
    "zscore_threshold_buy": -3.0,        // Buy signal strength
    "take_profit_percent": 1.0,          // Profit target
    "max_drawdown_percent": 10.0,        // Risk limit per pair
    "max_grid_trades": 5,                // Maximum positions
    "grid_spacing_percent": 0.5          // Distance between trades
  }
}
```

**Result**: $5,000 portfolio trading XAUUSD with detailed risk parameters

**⚠️ Important**: User sets all trading parameters (lot_size, thresholds, etc.) when starting each pair, NOT during capital allocation

---

### 🚀 Workflow 2: Multi-Strategy Portfolio ($50,000)

**Step 1: Create Large Portfolio**
```bash
POST http://127.0.0.1:8000/api/capital/portfolio
{
  "user_id": "pro_trader_001",
  "total_capital": 50000.0,
  "currency": "USD"
}
```

**Step 2: Allocate Major Pairs Strategy**
```bash
POST http://127.0.0.1:8000/api/capital/strategy/allocate
{
  "portfolio_id": 2,
  "strategy_name": "Major Pairs",
  "allocation_amount": 35000.0
}
```

**Step 3: Add Major Forex Pairs**
```bash
POST http://127.0.0.1:8000/api/capital/pair
{
  "user_id": "pro_trader_001",
  "strategy_name": "Major Pairs",
  "pairs": ["EURUSD", "GBPUSD", "USDJPY"]
}
```

**Step 4: Allocate Gold Strategy**
```bash
POST http://127.0.0.1:8000/api/capital/strategy/allocate
{
  "portfolio_id": 2,
  "strategy_name": "Gold Scalping",
  "allocation_amount": 15000.0
}
```

**Step 5: Add Gold Pairs**
```bash
POST http://127.0.0.1:8000/api/capital/pair
{
  "user_id": "pro_trader_001",
  "strategy_name": "Gold Scalping",
  "pairs": ["XAUUSD"]
}
```

**Step 6: Start Multiple Trading Tasks**
```bash
# Start EURUSD (gets $11,667 from Major Pairs strategy)
POST http://127.0.0.1:8000/api/dynamic-trading/session_id/start
{
  "pair": "EURUSD",
  "timeframe": "5M",
  "strategy_name": "simple_ma",
  "config": {"lot_size": 0.1, "fast_period": 10, "slow_period": 20}
}

# Start GBPUSD (gets $11,667 from Major Pairs strategy)
POST http://127.0.0.1:8000/api/dynamic-trading/session_id/start
{
  "pair": "GBPUSD",
  "timeframe": "5M",
  "strategy_name": "simple_ma",
  "config": {"lot_size": 0.1, "fast_period": 10, "slow_period": 20}
}

# Start XAUUSD (gets $15,000 from Gold Scalping strategy)
POST http://127.0.0.1:8000/api/dynamic-trading/session_id/start
{
  "pair": "XAUUSD",
  "timeframe": "1M",
  "strategy_name": "gold_buy_dip",
  "config": {"lot_size": 0.05, "percentage_threshold": 0.1}
}
```

**Result**: 
- Major Pairs Strategy: $35,000 across 3 forex pairs
- Gold Scalping Strategy: $15,000 on XAUUSD
- Total: 4 concurrent trading tasks (within 20 thread limit)
- Each pair has independent risk management parameters

---

### 🏦 Workflow 3: Hedge Fund Style ($100,000+)

**Step 1: Create Enterprise Portfolio**
```bash
POST http://127.0.0.1:8000/api/capital/portfolio
{
  "user_id": "hedge_fund_001",
  "total_capital": 100000.0,
  "currency": "USD"
}
```

**Step 2: Allocate Trend Following**
```bash
POST http://127.0.0.1:8000/api/capital/strategy/allocate
{
  "portfolio_id": 3,
  "strategy_name": "Trend Following",
  "allocation_amount": 40000.0
}

POST http://127.0.0.1:8000/api/capital/pairs/allocate
{
  "strategy_allocation_id": 1,
  "pair_allocations": [
    {"pair": "EURUSD", "amount": 8000},
    {"pair": "GBPUSD", "amount": 7000},
    {"pair": "USDJPY", "amount": 6000},
    {"pair": "USDCHF", "amount": 5000},
    {"pair": "AUDUSD", "amount": 4000},
    {"pair": "NZDUSD", "amount": 3000},
    {"pair": "USDCAD", "amount": 3000},
    {"pair": "EURGBP", "amount": 4000}
  ]
}
```

**Step 3: Allocate Mean Reversion**
```bash
POST http://127.0.0.1:8000/api/capital/strategy/allocate
{
  "portfolio_id": 3,
  "strategy_name": "Mean Reversion",
  "allocation_amount": 35000.0
}

POST http://127.0.0.1:8000/api/capital/pairs/allocate
{
  "strategy_allocation_id": 2,
  "pair_allocations": [
    {"pair": "XAUUSD", "amount": 20000},
    {"pair": "XAGUSD", "amount": 15000}
  ]
}
```

**Step 4: Allocate Scalping**
```bash
POST http://127.0.0.1:8000/api/capital/strategy/allocate
{
  "portfolio_id": 3,
  "strategy_name": "Scalping",
  "allocation_amount": 25000.0
}

POST http://127.0.0.1:8000/api/capital/pairs/allocate
{
  "strategy_allocation_id": 3,
  "pair_allocations": [
    {"pair": "EURJPY", "amount": 15000},
    {"pair": "GBPJPY", "amount": 10000}
  ]
}
```

**Result**:
- Trend Following: $40,000 across 8 pairs ($5,000 each)
- Mean Reversion: $35,000 across 2 gold pairs ($17,500 each)  
- Scalping: $25,000 across 2 yen pairs ($12,500 each)
- Total: 12 concurrent trading tasks (within 20 thread limit)
- Each pair configured with individual trading parameters

---

#---

### 📊 Real-time Portfolio Monitoring

**Get Live Dashboard**
```bash
GET http://127.0.0.1:8000/api/capital/dashboard/hedge_fund_001
```

**Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "total_capital": 100000.0,
    "allocated_capital": 100000.0,
    "available_capital": 0.0,
    "total_strategies": 3,
    "total_pairs": 12,
    "strategies": {
      "Trend Following": {
        "allocation_percentage": 40.0,
        "allocated_amount": 40000.0,
        "pairs_count": 8,
        "capital_per_pair": 5000.0,
        "pairs": {
          "EURUSD": {"capital": 5000.0, "risk_threshold": 10.0, "status": "active"},
          "GBPUSD": {"capital": 5000.0, "risk_threshold": 10.0, "status": "active"}
        }
      },
      "Mean Reversion": {
        "allocation_percentage": 35.0,
        "allocated_amount": 35000.0,
        "pairs_count": 2,
        "capital_per_pair": 17500.0
      },
      "Scalping": {
        "allocation_percentage": 25.0,
        "allocated_amount": 25000.0,
        "pairs_count": 2,
        "capital_per_pair": 12500.0
      }
    }
  }
}
```

**Check Risk Status**
```bash
GET http://127.0.0.1:8000/api/capital/risk-status/hedge_fund_001
```

**Risk Response:**
```json
{
  "success": true,
  "data": {
    "overall_risk": "LOW",
    "fund_utilization": 100.0,
    "can_allocate_more": false,
    "available_percentage": 0.0,
    "strategy_risks": {
      "Trend Following": "MEDIUM",
      "Mean Reversion": "LOW",
      "Scalping": "HIGH"
    }
  }
}
```

---

### 🔄 Workflow 4: System Recovery After Crash

```bash
# Get user sessions
GET http://127.0.0.1:8000/api/recovery/user/trader_001/sessions

# Recover specific session
POST http://127.0.0.1:8000/api/recovery/session/abc123-def456

# Or auto-recover all
POST http://127.0.0.1:8000/api/recovery/auto-recover
{
  "user_id": "trader_001"
}
```

---

## 🎛️ Strategy Configuration Parameters

### Gold Buy Dip Strategy
```json
{
  "lot_size": 0.01,                    // Position size
  "percentage_threshold": 2.0,         // Price movement trigger (%)
  "zscore_threshold_buy": -3.0,        // Buy signal threshold
  "zscore_threshold_sell": 3.0,        // Sell signal threshold
  "lookback_candles": 50,              // Analysis period
  "zscore_period": 20,                 // Statistical calculation period
  "max_grid_trades": 5,                // Maximum grid positions
  "take_profit_percent": 1.0,          // Take profit (%)
  "max_drawdown_percent": 30.0,        // Maximum drawdown (%)
  "grid_spacing_percent": 0.5,         // Grid spacing (%)
  "risk_per_trade": 2.0                // Risk per trade (%)
}
```

### Simple MA Strategy
```json
{
  "lot_size": 0.01,                    // Position size
  "fast_period": 10,                   // Fast MA period
  "slow_period": 20,                   // Slow MA period
  "take_profit_pips": 50,              // Take profit in pips
  "stop_loss_pips": 30,                // Stop loss in pips
  "trailing_stop": true,               // Enable trailing stop
  "risk_per_trade": 2.0                // Risk per trade (%)
}
```

---

## 📊 Response Format

All endpoints return JSON with this structure:

### Success Response:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Endpoint-specific data
  }
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error description"
}
```

---

## 🔧 Available Timeframes
- `1M` - 1 Minute
- `5M` - 5 Minutes  
- `15M` - 15 Minutes
- `1H` - 1 Hour
- `4H` - 4 Hours
- `1D` - 1 Day

## 💰 Supported Trading Pairs
- **Gold**: XAUUSD, XAGUSD
- **Major Forex**: EURUSD, GBPUSD, USDJPY, USDCHF
- **Minor Forex**: EURGBP, EURJPY, GBPJPY
- **Exotic Pairs**: Any MT5 available symbol

## 🎯 Available Strategies
- `gold_buy_dip` - Mean-reversion with grid trading
- `simple_ma` - Moving average crossover
- **Custom Strategies** - User-defined strategies via API
- More strategies can be added dynamically

---

## 🎨 Custom Strategy Management

### Create Custom Strategy
**POST** `http://127.0.0.1:8000/api/strategies/create`

```json
{
  "name": "India Session Breakout",
  "type": "Breakout",
  "timeframe": "15M",
  "preferred_pairs": "XAUUSD",
  "entry_conditions": "Price breaks above/below previous India session high/low after 8 AM GMT.",
  "exit_conditions": "Take profit at 2R or stop loss hit. Close positions before India close.",
  "indicators_used": "Session High/Low, ATR",
  "risk_reward_ratio_target": 2.0,
  "max_drawdown_tolerance": 5.0
}
```

### List All Custom Strategies
**GET** `http://127.0.0.1:8000/api/strategies/list`

### Get Specific Strategy
**GET** `http://127.0.0.1:8000/api/strategies/{strategy_id}`

### Update Custom Strategy
**PUT** `http://127.0.0.1:8000/api/strategies/{strategy_id}/update`

```json
{
  "risk_reward_ratio_target": 2.5,
  "max_drawdown_tolerance": 3.0
}
```

### Delete Custom Strategy
**DELETE** `http://127.0.0.1:8000/api/strategies/{strategy_id}/delete`

### Use Strategy for Trading
**POST** `http://127.0.0.1:8000/api/strategies/use/{strategy_id}`

```json
{
  "session_id": "session_123",
  "pair": "XAUUSD",
  "timeframe": "15M"
}
```

### Two Usage Scenarios

#### Scenario 1: Use Existing Custom Strategy
```bash
# 1. List available strategies
GET /api/strategies/list

# 2. Use existing strategy
POST /api/strategies/use/{strategy_id}
{
  "session_id": "your_session",
  "pair": "XAUUSD",
  "timeframe": "15M"
}

# 3. Start trading with generated config
POST /api/dynamic-trading/{session_id}/start
# (Use the trading_config from step 2)
```

#### Scenario 2: Create New Strategy & Use
```bash
# 1. Create new custom strategy
POST /api/strategies/create
{
  "name": "London Open Scalp",
  "entry_conditions": "Price momentum at London open",
  "exit_conditions": "Quick 10-15 pip targets",
  "risk_reward_ratio_target": 2.0
}

# 2. Use the new strategy (get strategy_id from step 1)
POST /api/strategies/use/{new_strategy_id}

# 3. Start trading
POST /api/dynamic-trading/{session_id}/start
```

---

