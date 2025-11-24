# Forex Echo Backend

🚀 **Professional Multi-Threaded Forex Trading System**

Dynamic configuration • Session persistence • Real-time execution • Multi-asset trading

## 🚀 Quick Start

```bash
# Create  Virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate


# Install dependencies
pip install -r requirements.txt

# Start server
python run.py

# Test system
python test_dynamic_system.py
```

**Server:** http://127.0.0.1:8000

## ✨ Key Features

- 🎯 **Zero Hardcode** - All parameters configurable via API
- 🧵 **Multi-Threading** - 20 concurrent trading tasks
- 💾 **Session Persistence** - Auto-recovery after disconnection
- 📊 **Multi-Asset Trading** - Gold, Forex, any MT5 symbol
- ⚡ **Real-time Execution** - Live MT5 integration
- 🔄 **Dynamic Strategies** - Pluggable strategy system

## 📚 Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Requirements](#requirements)** - Installation requirements
- **[Architecture](#architecture)** - System design overview

## 🏗️ Architecture

### Multi-Threading Design
```
User Request → Session Manager → Trading Engine → Thread Pool (20 workers)
     ↓              ↓               ↓                    ↓
  Session ID    →  Task Creation  →  Strategy Init  →  Independent Execution
```

### Database Persistence
- **Sessions**: User trading sessions with configurations
- **Tasks**: Active trading task states and parameters
- **Trades**: Complete trade execution history
- **Recovery**: Auto-restore after system restart

### Strategy System
- **Pluggable**: Easy to add new strategies
- **Dynamic Config**: All parameters via API
- **Isolated Execution**: Each strategy runs independently

## 🎯 Use Cases

### Gold Trading Portfolio
```json
// Conservative 15M
{"pair": "XAUUSD", "timeframe": "15M", "config": {"percentage_threshold": 2.0}}

// Aggressive 1M scalping
{"pair": "XAUUSD", "timeframe": "1M", "config": {"percentage_threshold": 0.1}}
```

### Multi-Pair Forex
```json
// Major pairs with different strategies
{"pair": "EURUSD", "strategy_name": "simple_ma"}
{"pair": "GBPUSD", "strategy_name": "gold_buy_dip"}
{"pair": "USDJPY", "strategy_name": "simple_ma"}
```

### Session Recovery
```bash
# After system restart/crash
POST /api/recovery/auto-recover
# → All sessions and tasks automatically restored
```

## 🔧 Configuration Examples

### Conservative Gold Trading
```json
{
  "pair": "XAUUSD",
  "timeframe": "15M",
  "strategy_name": "gold_buy_dip",
  "config": {
    "lot_size": 0.01,
    "percentage_threshold": 2.0,
    "zscore_threshold_buy": -3.0,
    "max_grid_trades": 5,
    "take_profit_percent": 1.0
  }
}
```

### Aggressive Scalping
```json
{
  "pair": "XAUUSD",
  "timeframe": "1M",
  "config": {
    "percentage_threshold": 0.1,
    "zscore_threshold_buy": -1.0,
    "take_profit_percent": 0.2
  }
}
```

## 📊 Available Assets

- **Gold**: XAUUSD, XAGUSD
- **Major Forex**: EURUSD, GBPUSD, USDJPY, USDCHF
- **Minor Pairs**: EURGBP, EURJPY, GBPJPY
- **Any MT5 Symbol**: Configurable via API

## ⏱️ Timeframes

`1M` • `5M` • `15M` • `1H` • `4H` • `1D`

## 🎛️ Strategies

### Built-in Strategies
- **gold_buy_dip** - Mean-reversion with grid trading
- **simple_ma** - Moving average crossover

### Custom Strategy System
- **Create Custom Strategies** - Define your own trading logic via UI
- **Strategy Library** - Save and reuse custom strategies
- **Dynamic Integration** - Use custom strategies with existing trading engine
- **Two Usage Modes**:
  1. **Direct Usage** - Apply existing custom strategies to trading
  2. **Create & Use** - Build new strategies and immediately deploy them

## 📋 Complete Trading Parameters

### Available in `POST /api/dynamic-trading/{session_id}/start`

| Parameter | Description | Default |
|-----------|-------------|----------|
| `lot_size` | Initial lot size for first trade | `0.1` |
| `take_profit` | Take profit in points (if not using percent) | `200` |
| `percentage_threshold` | % move from high/low to trigger trade | `2.0` |
| `lookback_candles` | Candles to analyze for high/low price | `50` |
| `zscore_wait_candles` | Max candles to wait for Z-score confirmation | `10` |
| `zscore_threshold_sell` | Z-score value to confirm SELL trade | `3.0` |
| `zscore_threshold_buy` | Z-score value to confirm BUY trade | `-3.0` |
| `zscore_period` | Candles for Z-score calculation | `20` |
| `magic_number` | Unique ID for EA trade management | `12345` |
| `use_take_profit_percent` | Use percentage TP instead of points | `false` |
| `take_profit_percent` | Take profit as % of entry price | `1.0` |
| `use_grid_trading` | Enable/disable grid functionality | `true` |
| `max_grid_trades` | Maximum trades in single grid series | `5` |
| `use_grid_percent` | Use percentage for grid spacing | `false` |
| `grid_percent` | Distance between grid trades as % | `0.5` |
| `grid_atr_multiplier` | ATR multiplier for grid spacing | `1.0` |
| `atr_period` | Period for ATR calculation | `14` |
| `grid_lot_multiplier` | Lot size multiplier for grid trades | `1.0` |
| `use_progressive_lots` | Increase lot size for each grid level | `false` |
| `lot_progression_factor` | Factor to multiply lot size (e.g. 1.5) | `1.5` |
| `max_drawdown_percent` | Max account drawdown before force close | `50.0` |

### 🔄 Multiple Timeframes Support

**YES! You can run multiple timeframes for the same pair:**

```bash
# Same pair, different timeframes = Independent tasks
POST /api/dynamic-trading/session_123/start
{"pair": "XAUUSD", "timeframe": "1M", "config": {"percentage_threshold": 0.1}}

POST /api/dynamic-trading/session_123/start  
{"pair": "XAUUSD", "timeframe": "15M", "config": {"percentage_threshold": 2.0}}

POST /api/dynamic-trading/session_123/start
{"pair": "XAUUSD", "timeframe": "1H", "config": {"percentage_threshold": 5.0}}
```

**Result**: 3 independent XAUUSD strategies running simultaneously!

## Requirements

- **Python 3.8+**
- **MetaTrader 5** terminal
- **MySQL** database
- **MT5 Account** (demo/live)

## 🚀 Production Ready

✅ Professional forex app features  
✅ Enterprise-grade session management  
✅ Scalable multi-threading architecture  
✅ Complete API documentation  
✅ Database persistence & recovery  
✅ Real-time MT5 integration  

**Ready for live trading! 📈**

## 🎨 Custom Strategy System

### Create Your Own Strategies

The system now supports creating custom strategies through a UI form with these fields:

```json
{
  "name": "Strategy Name",
  "type": "Strategy Type (Breakout, Scalping, etc.)",
  "timeframe": "Preferred timeframe (1M, 5M, 15M, etc.)",
  "preferred_pairs": "XAUUSD, EURUSD, etc.",
  "entry_conditions": "Detailed entry logic",
  "exit_conditions": "Detailed exit logic", 
  "indicators_used": "RSI, MA, ATR, etc.",
  "risk_reward_ratio_target": 2.0,
  "max_drawdown_tolerance": 5.0
}
```

### Two Usage Scenarios

#### Scenario 1: Use Existing Custom Strategy
```bash
# 1. List available custom strategies
GET /api/strategies/list

# 2. Use existing strategy for trading
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
  "name": "India Session Breakout",
  "entry_conditions": "Price breaks session high/low",
  "exit_conditions": "2R profit or stop loss",
  "risk_reward_ratio_target": 2.0
}

# 2. Immediately use the new strategy
POST /api/strategies/use/{new_strategy_id}

# 3. Start trading
POST /api/dynamic-trading/{session_id}/start
```

### Custom Strategy API Endpoints

- `POST /api/strategies/create` - Create new strategy
- `GET /api/strategies/list` - List all strategies  
- `GET /api/strategies/{id}` - Get specific strategy
- `PUT /api/strategies/{id}/update` - Update strategy
- `DELETE /api/strategies/{id}/delete` - Delete strategy
- `POST /api/strategies/use/{id}` - Convert to trading config

