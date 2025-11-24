import statistics
from typing import List
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

def calculate_zscore(prices: List[float], period: int) -> float:
    """Calculate Z-score for the latest price."""
    if len(prices) < period:
        logger.debug(f"Insufficient data for Z-score: {len(prices)}/{period}")
        return 0.0
    
    recent_prices = prices[-period:]
    current_price = prices[-1]
    
    mean_price = statistics.mean(recent_prices)
    stdev_price = statistics.stdev(recent_prices) if len(recent_prices) > 1 else 0.0
    
    if stdev_price == 0:
        logger.warning("Standard deviation is 0, returning Z-score of 0")
        return 0.0
    
    zscore = (current_price - mean_price) / stdev_price
    logger.debug(f"Z-score calculated: {zscore:.3f} (price: ${current_price}, mean: ${mean_price:.2f}, stdev: {stdev_price:.2f})")
    return zscore