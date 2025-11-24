"""RSI technical indicator implementation."""

def calculate_rsi(prices: list, period: int = 14) -> float:
    """Calculate RSI indicator using SMA-based gain/loss averaging."""
    if len(prices) < period + 1:
        return 50.0  # Neutral RSI when insufficient data
    
    # Calculate price differences
    deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
    
    # Separate gains and losses
    gains = [delta if delta > 0 else 0 for delta in deltas]
    losses = [-delta if delta < 0 else 0 for delta in deltas]
    
    # Calculate average gain and loss using simple moving average
    if len(gains) < period:
        return 50.0
    
    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    
    # Avoid division by zero
    if avg_loss == 0:
        return 100.0
    
    # Calculate RSI
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    return rsi