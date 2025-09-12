
import { STRATEGY_ACTION, STRATEGY_INIT_TYPE, STRATEGY_OPERATIONS } from "../constants/strategies.constant";

const STRATEGY_INIT: STRATEGY_INIT_TYPE = {
  loading: false,
  message: null,
  strategies: [],
  currentStrategy: null,
}

export const StrategyReducer = (state = STRATEGY_INIT, action: STRATEGY_ACTION): STRATEGY_INIT_TYPE => {
  switch (action.type) {
    case STRATEGY_OPERATIONS.GET_STRATEGIES_REQUEST:
      return { ...state, loading: true, message: null, error: null }

    case STRATEGY_OPERATIONS.GET_STRATEGIES_SUCCESS:
      return { ...state, loading: false, message: action.payload.message, strategies: action.payload.strategies, error: null }

    case STRATEGY_OPERATIONS.GET_STRATEGIES_FAIL:
      return { ...state, loading: false, message: action.payload.message, error: action.payload.error }

    default:
      return state;
  }
}
