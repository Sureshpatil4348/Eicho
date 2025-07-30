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
}

export interface CreateStrategyFormData extends Strategy {}


export interface StrategyResponse extends Strategy {
  id: number;
  created_at: string;
  updated_at: string;
}
