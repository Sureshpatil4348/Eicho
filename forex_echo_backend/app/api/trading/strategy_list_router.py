"""Strategy List API Router - Lists implemented strategies"""

from flask import Blueprint, jsonify
from app.core.strategy_manager import strategy_manager
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)
strategy_list_bp = Blueprint('strategy_list', __name__, url_prefix='/api/strategies')

@strategy_list_bp.route('/list', methods=['GET'])
def list_implemented_strategies():
    """List all implemented strategies available in the backend"""
    try:
        # Get available strategies from strategy manager
        available_strategies = strategy_manager.get_available_strategies()
        
        # Define strategy details
        strategy_details = {
            'gold_buy_dip': {
                'name': 'Gold Buy Dip',
                'description': 'Mean-reversion strategy with grid trading for gold and forex pairs',
                'type': 'Mean Reversion + Grid Trading',
                'recommended_pairs': ['XAUUSD', 'XAGUSD', 'EURUSD', 'GBPUSD'],
                'recommended_timeframes': ['1M', '5M', '15M', '1H'],
                'key_features': [
                    'Z-score based entry signals',
                    'Percentage threshold filtering', 
                    'Grid trading with progressive lots',
                    'Dynamic take profit levels',
                    'Risk management with max drawdown'
                ],
                'parameters': {
                    'lot_size': {'default': 0.01, 'description': 'Initial lot size'},
                    'percentage_threshold': {'default': 2.0, 'description': 'Price move % from high/low to trigger'},
                    'zscore_threshold_buy': {'default': -3.0, 'description': 'Z-score for buy signals'},
                    'zscore_threshold_sell': {'default': 3.0, 'description': 'Z-score for sell signals'},
                    'max_grid_trades': {'default': 5, 'description': 'Maximum grid trades'},
                    'take_profit_percent': {'default': 1.0, 'description': 'Take profit as % of entry'},
                    'use_grid_trading': {'default': True, 'description': 'Enable grid functionality'},
                    'max_drawdown_percent': {'default': 50.0, 'description': 'Max account drawdown %'}
                }
            },
            'rsi_pairs': {
                'name': 'RSI Pairs Trading',
                'description': 'Automated pairs trading strategy using RSI with ATR-based hedge sizing',
                'type': 'Pairs Trading + Mean Reversion',
                'recommended_pairs': ['EURUSD/GBPUSD', 'USDJPY/AUDUSD', 'XAUUSD/XAGUSD'],
                'recommended_timeframes': ['5M', '15M', '1H'],
                'key_features': [
                    'RSI-based entry signals for pairs',
                    'ATR hedge ratio calculation',
                    'USD-based profit/loss targets',
                    'Positive/negative correlation modes',
                    'Time-based exit management'
                ],
                'parameters': {
                    'mode': {'default': 'negative', 'description': 'Correlation mode: positive or negative'},
                    'symbol1': {'default': 'EURUSD', 'description': 'First symbol in pair'},
                    'symbol2': {'default': 'GBPUSD', 'description': 'Second symbol in pair'},
                    'rsi_period': {'default': 14, 'description': 'RSI calculation period'},
                    'atr_period': {'default': 5, 'description': 'ATR calculation period'},
                    'rsi_overbought': {'default': 75.0, 'description': 'RSI overbought threshold'},
                    'rsi_oversold': {'default': 25.0, 'description': 'RSI oversold threshold'},
                    'profit_target_usd': {'default': 500.0, 'description': 'Profit target in USD'},
                    'stop_loss_usd': {'default': -15000.0, 'description': 'Stop loss in USD'},
                    'max_trade_hours': {'default': 2400.0, 'description': 'Maximum trade duration in hours'},
                    'base_lot_size': {'default': 1.0, 'description': 'Base lot size for first symbol'}
                }
            }
        }
        
        # Build response with strategy details
        strategies_list = []
        for strategy_name in available_strategies:
            if strategy_name in strategy_details:
                strategy_info = strategy_details[strategy_name].copy()
                strategy_info['strategy_name'] = strategy_name
                strategy_info['is_available'] = True
                strategies_list.append(strategy_info)
        
        return jsonify({
            'success': True,
            'message': f'Found {len(strategies_list)} implemented strategies',
            'strategies': strategies_list,
            'total_count': len(strategies_list),
            'usage_info': {
                'how_to_use': 'Use strategy_name in POST /api/dynamic-trading/{session_id}/start',
                'examples': [
                    {
                        'strategy_name': 'gold_buy_dip',
                        'pair': 'XAUUSD',
                        'timeframe': '15M',
                        'config': {
                            'lot_size': 0.01,
                            'percentage_threshold': 2.0,
                            'zscore_threshold_buy': -3.0
                        }
                    },
                    {
                        'strategy_name': 'rsi_pairs',
                        'pair': 'EURUSD',
                        'timeframe': '5M',
                        'config': {
                            'mode': 'negative',
                            'symbol1': 'EURUSD',
                            'symbol2': 'GBPUSD',
                            'rsi_overbought': 75.0,
                            'rsi_oversold': 25.0,
                            'profit_target_usd': 500.0
                        }
                    }
                ]
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error listing implemented strategies: {e}")
        return jsonify({
            'success': False, 
            'error': str(e),
            'message': 'Failed to retrieve implemented strategies'
        }), 500

@strategy_list_bp.route('/list/<strategy_name>', methods=['GET'])
def get_strategy_details(strategy_name):
    """Get detailed information about a specific implemented strategy"""
    try:
        available_strategies = strategy_manager.get_available_strategies()
        
        if strategy_name not in available_strategies:
            return jsonify({
                'success': False,
                'error': f'Strategy {strategy_name} not found',
                'available_strategies': available_strategies
            }), 404
        
        # Strategy details (same as above but for single strategy)
        if strategy_name == 'gold_buy_dip':
            strategy_info = {
                'strategy_name': strategy_name,
                'name': 'Gold Buy Dip',
                'description': 'Advanced mean-reversion strategy with grid trading capabilities',
                'type': 'Mean Reversion + Grid Trading',
                'recommended_pairs': ['XAUUSD', 'XAGUSD', 'EURUSD', 'GBPUSD', 'USDJPY'],
                'recommended_timeframes': ['1M', '5M', '15M', '1H', '4H'],
                'detailed_description': {
                    'entry_logic': 'Enters trades when price moves significantly from recent high/low and Z-score confirms oversold/overbought conditions',
                    'exit_logic': 'Takes profit at percentage-based levels or closes all positions on max drawdown',
                    'grid_system': 'Places additional trades at calculated intervals to average down positions',
                    'risk_management': 'Monitors account equity and closes all positions if drawdown exceeds threshold'
                },
                'key_features': [
                    'Z-score statistical analysis for entry confirmation',
                    'Percentage threshold filtering to avoid false signals', 
                    'Multi-level grid trading with progressive lot sizing',
                    'Dynamic take profit based on market volatility',
                    'Comprehensive risk management with equity monitoring',
                    'Session persistence and recovery capabilities'
                ],
                'parameters': {
                    'lot_size': {
                        'default': 0.01,
                        'type': 'float',
                        'range': '0.01-10.0',
                        'description': 'Initial lot size for first trade'
                    },
                    'percentage_threshold': {
                        'default': 2.0,
                        'type': 'float', 
                        'range': '0.1-10.0',
                        'description': 'Percentage move from high/low required to trigger trade'
                    },
                    'zscore_threshold_buy': {
                        'default': -3.0,
                        'type': 'float',
                        'range': '-5.0 to -1.0',
                        'description': 'Z-score threshold for buy signal confirmation'
                    },
                    'zscore_threshold_sell': {
                        'default': 3.0,
                        'type': 'float',
                        'range': '1.0 to 5.0', 
                        'description': 'Z-score threshold for sell signal confirmation'
                    },
                    'max_grid_trades': {
                        'default': 5,
                        'type': 'integer',
                        'range': '1-20',
                        'description': 'Maximum number of grid trades in one direction'
                    },
                    'take_profit_percent': {
                        'default': 1.0,
                        'type': 'float',
                        'range': '0.1-5.0',
                        'description': 'Take profit as percentage of entry price'
                    },
                    'use_grid_trading': {
                        'default': True,
                        'type': 'boolean',
                        'description': 'Enable/disable grid trading functionality'
                    },
                    'max_drawdown_percent': {
                        'default': 50.0,
                        'type': 'float',
                        'range': '5.0-100.0',
                        'description': 'Maximum account drawdown before force close'
                    }
                },
                'usage_examples': [
                    {
                        'name': 'Conservative Gold Trading',
                        'config': {
                            'lot_size': 0.01,
                            'percentage_threshold': 2.0,
                            'zscore_threshold_buy': -3.0,
                            'max_grid_trades': 3,
                            'take_profit_percent': 1.0
                        }
                    },
                    {
                        'name': 'Aggressive Scalping',
                        'config': {
                            'lot_size': 0.05,
                            'percentage_threshold': 0.5,
                            'zscore_threshold_buy': -2.0,
                            'max_grid_trades': 7,
                            'take_profit_percent': 0.3
                        }
                    }
                ]
            }
            
            return jsonify({
                'success': True,
                'strategy': strategy_info
            }), 200
        
        elif strategy_name == 'rsi_pairs':
            strategy_info = {
                'strategy_name': strategy_name,
                'name': 'RSI Pairs Trading',
                'description': 'Advanced pairs trading strategy using RSI indicators with ATR-based hedge sizing',
                'type': 'Pairs Trading + Mean Reversion',
                'recommended_pairs': ['EURUSD/GBPUSD', 'USDJPY/AUDUSD', 'XAUUSD/XAGUSD'],
                'recommended_timeframes': ['5M', '15M', '1H'],
                'detailed_description': {
                    'entry_logic': 'Enters trades when both symbols show overbought/oversold RSI conditions based on correlation mode',
                    'exit_logic': 'Exits on USD profit/loss targets or maximum trade duration',
                    'hedge_system': 'Uses ATR-based hedge ratios to balance position sizes between symbols',
                    'correlation_modes': 'Supports both positive and negative correlation trading modes'
                },
                'key_features': [
                    'RSI-based entry signals for symbol pairs',
                    'ATR hedge ratio calculation with safety bounds',
                    'USD-based profit and loss targets',
                    'Configurable correlation modes (positive/negative)',
                    'Time-based exit management',
                    'Multi-symbol data synchronization'
                ],
                'parameters': {
                    'mode': {
                        'default': 'negative',
                        'type': 'string',
                        'options': ['positive', 'negative'],
                        'description': 'Correlation mode for pairs trading'
                    },
                    'symbol1': {
                        'default': 'EURUSD',
                        'type': 'string',
                        'description': 'First symbol in the trading pair'
                    },
                    'symbol2': {
                        'default': 'GBPUSD',
                        'type': 'string',
                        'description': 'Second symbol in the trading pair'
                    },
                    'rsi_period': {
                        'default': 14,
                        'type': 'integer',
                        'range': '5-50',
                        'description': 'RSI calculation period'
                    },
                    'atr_period': {
                        'default': 5,
                        'type': 'integer',
                        'range': '3-20',
                        'description': 'ATR calculation period for hedge ratio'
                    },
                    'rsi_overbought': {
                        'default': 75.0,
                        'type': 'float',
                        'range': '60.0-90.0',
                        'description': 'RSI overbought threshold'
                    },
                    'rsi_oversold': {
                        'default': 25.0,
                        'type': 'float',
                        'range': '10.0-40.0',
                        'description': 'RSI oversold threshold'
                    },
                    'profit_target_usd': {
                        'default': 500.0,
                        'type': 'float',
                        'range': '100.0-5000.0',
                        'description': 'Profit target in USD'
                    },
                    'stop_loss_usd': {
                        'default': -15000.0,
                        'type': 'float',
                        'range': '-50000.0 to -100.0',
                        'description': 'Stop loss in USD'
                    },
                    'max_trade_hours': {
                        'default': 2400.0,
                        'type': 'float',
                        'range': '1.0-8760.0',
                        'description': 'Maximum trade duration in hours'
                    },
                    'base_lot_size': {
                        'default': 1.0,
                        'type': 'float',
                        'range': '0.01-10.0',
                        'description': 'Base lot size for first symbol'
                    }
                },
                'usage_examples': [
                    {
                        'name': 'Conservative EUR/GBP Pairs',
                        'config': {
                            'mode': 'negative',
                            'symbol1': 'EURUSD',
                            'symbol2': 'GBPUSD',
                            'rsi_overbought': 80.0,
                            'rsi_oversold': 20.0,
                            'profit_target_usd': 300.0,
                            'base_lot_size': 0.5
                        }
                    },
                    {
                        'name': 'Gold/Silver Pairs Trading',
                        'config': {
                            'mode': 'negative',
                            'symbol1': 'XAUUSD',
                            'symbol2': 'XAGUSD',
                            'rsi_period': 10,
                            'profit_target_usd': 1000.0,
                            'max_trade_hours': 48.0
                        }
                    }
                ]
            }
            
            return jsonify({
                'success': True,
                'strategy': strategy_info
            }), 200
        
        # Default response for unknown strategies
        return jsonify({
            'success': True,
            'strategy': {
                'strategy_name': strategy_name,
                'name': strategy_name.replace('_', ' ').title(),
                'description': 'Strategy details not available',
                'is_available': True
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting strategy details: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500