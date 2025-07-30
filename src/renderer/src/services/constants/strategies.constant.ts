import { StrategyResponse } from "@renderer/types/strategy.type";

export enum STRATEGY_OPERATIONS {
  GET_STRATEGIES_REQUEST = "GET_STRATEGIES_REQUEST",
  GET_STRATEGIES_SUCCESS = "GET_STRATEGIES_SUCCESS",
  GET_STRATEGIES_FAIL = "GET_STRATEGIES_FAIL",
}

// Get Strategies Actions
export interface GET_STRATEGIES_REQUEST {
  type: STRATEGY_OPERATIONS.GET_STRATEGIES_REQUEST;
}

export interface GET_STRATEGIES_SUCCESS {
  type: STRATEGY_OPERATIONS.GET_STRATEGIES_SUCCESS;
  payload: {
    message: string;
    strategies: StrategyResponse[];
  };
}

export interface GET_STRATEGIES_FAIL {
  type: STRATEGY_OPERATIONS.GET_STRATEGIES_FAIL;
  payload: {
    message: string;
    error: string;
  };
}

// Combined action types
export type STRATEGY_ACTION = GET_STRATEGIES_REQUEST | GET_STRATEGIES_SUCCESS | GET_STRATEGIES_FAIL;

// Initial state type
export interface STRATEGY_INIT_TYPE {
  loading: boolean;
  error?: string | null;
  message: string | null;
  strategies?: StrategyResponse[];
  currentStrategy?: StrategyResponse | null;
}
