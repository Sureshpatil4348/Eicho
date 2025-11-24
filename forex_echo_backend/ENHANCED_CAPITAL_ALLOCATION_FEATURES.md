# Enhanced Capital Allocation System

## 🚀 New Features Overview

Your forex trading system now includes a comprehensive capital allocation system with **MT5 integration** and **three distinct capital allocation modes**. This enhancement provides professional-grade risk management and capital optimization.

## 📊 Three Capital Allocation Modes

### 1. User-Defined Base Capital (Custom Mode)
```json
{
  "capital_mode": "custom",
  "total_capital": 50000.00
}
```
- **Description**: User manually sets a fixed capital amount
- **Use Case**: When you want to trade with a specific amount regardless of account balance
- **Benefits**: Complete control over risk exposure, independent of broker balance
- **Example**: Account has $80K, but you only want to risk $50K

### 2. Initial Account Balance (Static Reference)
```json
{
  "capital_mode": "initial_balance"
}
```
- **Description**: Uses MT5 account balance at system activation as fixed reference
- **Use Case**: Consistent exposure sizing across long-term sessions
- **Benefits**: Prevents over-leveraging as account grows, maintains risk discipline
- **Example**: Start with $50K balance, allocations stay based on $50K even if balance changes

### 3. Dynamic Compounding Mode (Balance-Linked)
```json
{
  "capital_mode": "dynamic_compounding"
}
```
- **Description**: Capital allocations automatically adjust to current MT5 balance
- **Use Case**: Automatic profit reinvestment and compounding
- **Benefits**: Scales up/down with account performance, maximizes growth potential
- **Example**: Balance grows to $60K → allocations increase proportionally

## 🔧 New API Endpoints

### MT5 Balance Integration
```bash
GET /api/capital/mt5/balance
```
Fetches real-time account balance from MT5 terminal.

### Enhanced Session Setup
```bash
POST /api/capital/session/{session_id}/setup
```
```json
{
  "capital_mode": "custom|initial_balance|dynamic_compounding",
  "total_capital": 50000.00,  // Only for custom mode
  "strategy_allocations": {
    "strategy_name": {"amount": 5000.00}
  }
}
```

### Pair Capital Allocation
```bash
POST /api/capital/session/{session_id}/allocate-pair
```
```json
{
  "strategy_name": "gold_buy_dip",
  "pair": "XAUUSD",
  "allocation_amount": 2000.00,
  "floating_loss_threshold_pct": 20.0
}
```

### Dynamic Capital Update
```bash
POST /api/capital/session/{session_id}/update-dynamic
```
Updates allocations based on current MT5 balance (for dynamic mode).

### Trading with Capital Allocation
```bash
POST /api/dynamic-trading/{session_id}/start
```
```json
{
  "pair": "XAUUSD",
  "timeframe": "5M",
  "strategy_name": "gold_buy_dip",
  "capital_allocation": 2000.00,
  "floating_loss_threshold_pct": 20.0,
  "config": {
    "percentage_threshold": 1.0
  }
}
```

## 🎯 Automatic Lot Size Calculation

The system now automatically calculates appropriate lot sizes based on:
- **Allocated Capital**: Amount assigned to the pair
- **Risk Percentage**: Default 2% risk per trade
- **Pair Type**: Different calculations for Gold vs Forex pairs
- **Stop Loss Distance**: Estimated based on pair volatility

### Example Calculation
```
Allocated Capital: $2,000
Risk Percentage: 2%
Risk Amount: $40
Estimated Stop Loss: 100 pips (Gold)
Calculated Lot Size: 0.04 lots
```

## 🛡️ Enhanced Risk Management

### Capital-Based Risk Controls
- **Floating Loss Threshold**: Configurable percentage of allocated capital
- **Capital Exhaustion Protection**: Prevents trading when capital is depleted
- **Real-time Risk Monitoring**: Continuous P&L tracking against allocations

### Risk Status Monitoring
```bash
GET /api/trading/{session_id}/{pair}/{strategy}/allocation
```
Returns:
```json
{
  "allocated_capital": 2000.00,
  "used_capital": 150.00,
  "available_capital": 1850.00,
  "can_trade": true,
  "risk_breached": false,
  "suggested_lot_size": 0.04
}
```

## 📈 Integration with Existing Strategies

### Enhanced Gold Buy Dip Strategy
- Automatically uses capital-allocated lot sizes
- Checks risk status before placing trades
- Blocks trading when risk thresholds are breached
- Provides capital status in strategy monitoring

### Strategy Status Enhancement
```json
{
  "name": "gold_buy_dip",
  "setup_state": "WAITING",
  "capital_allocation": {
    "status": "allocated",
    "allocated_capital": 2000.00,
    "can_trade": true,
    "risk_breached": false
  }
}
```

## 🚀 Usage Examples

### Quick Start with Custom Capital
```python
# 1. Create session
session_response = requests.post(f"{BASE_URL}/api/session/create", 
                               json={"user_id": "trader_1"})
session_id = session_response.json()['session_id']

# 2. Setup capital allocation
capital_setup = {
    "capital_mode": "custom",
    "total_capital": 10000.00,
    "strategy_allocations": {
        "gold_strategy": {"amount": 5000.00}
    }
}
requests.post(f"{BASE_URL}/api/capital/session/{session_id}/setup", json=capital_setup)

# 3. Start trading with capital allocation
trading_config = {
    "pair": "XAUUSD",
    "timeframe": "5M",
    "strategy_name": "gold_buy_dip",
    "capital_allocation": 2000.00,
    "config": {"percentage_threshold": 1.0}
}
requests.post(f"{BASE_URL}/api/dynamic-trading/{session_id}/start", json=trading_config)
```

### Dynamic Compounding Setup
```python
# Setup for automatic compounding
capital_setup = {
    "capital_mode": "dynamic_compounding",
    "strategy_allocations": {
        "aggressive_gold": {"amount": 1000.00}
    }
}

# Later, update allocations based on new balance
requests.post(f"{BASE_URL}/api/capital/session/{session_id}/update-dynamic")
```

## 📊 Portfolio Monitoring

### Complete Portfolio Summary
```bash
GET /api/capital/portfolio/{user_id}/summary
```
Returns comprehensive overview:
- Total, allocated, and available capital
- Strategy-level allocations and P&L
- Pair-level allocations and risk status
- Real-time trading permissions

## 🔄 Migration from Existing System

Your existing trading configurations will continue to work. The new capital allocation features are **optional enhancements** that provide:

1. **Better Risk Management**: Capital-based position sizing
2. **Professional Portfolio Management**: Multi-strategy capital allocation
3. **Real-time Balance Integration**: MT5 account synchronization
4. **Automatic Lot Sizing**: Eliminates manual lot size calculations
5. **Enhanced Monitoring**: Comprehensive capital and risk dashboards

## 🧪 Testing

Run the comprehensive test suite:
```bash
python enhanced_capital_allocation_test.py
```

Or try the usage examples:
```bash
python capital_allocation_usage_examples.py
```

## 📚 Key Benefits

✅ **Professional Risk Management**: Industry-standard capital allocation  
✅ **MT5 Integration**: Real-time balance synchronization  
✅ **Automatic Position Sizing**: Eliminates manual calculations  
✅ **Multiple Capital Modes**: Flexible allocation strategies  
✅ **Enhanced Monitoring**: Comprehensive portfolio dashboards  
✅ **Backward Compatibility**: Existing configs continue to work  
✅ **Scalable Architecture**: Supports multiple strategies and pairs  

Your forex trading system is now equipped with institutional-grade capital allocation and risk management capabilities! 🚀