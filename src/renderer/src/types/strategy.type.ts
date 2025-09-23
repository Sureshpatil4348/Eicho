export interface Strategy {
  name: string;
  type: string;
  timeframe: string;
  preferred_pairs: string;
  entry_conditions: string;
  exit_conditions: string;
  indicators_used: string;
  risk_reward_ratio_target: number;
  max_drawdown_tolerance: number;
  description: string;
  recommended_timeframes: string[];
  recommended_pairs: string[];
  capital_allocation?: any;
  strategy_id?: number;
  total_trades?: number
}

export interface CreateStrategyFormData extends Strategy { }


export interface StrategyResponse extends Strategy {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface FundAllocate {
  strategy_id: number
  amount: number,
  percentage: number
}
