import { Dispatch } from 'react';
import { STRATEGY_ACTION, STRATEGY_OPERATIONS } from '../constants/strategies.constant';
import { API_URL } from '@renderer/utils/constant';
import axios from '@renderer/config/axios';

export const GetStrategiesAction = (dispatch: Dispatch<STRATEGY_ACTION>): void => {
  dispatch({ type: STRATEGY_OPERATIONS.GET_STRATEGIES_REQUEST });
  axios.get(API_URL.STRATEGY_OPERATIONS).then((response) => {
    dispatch({ type: STRATEGY_OPERATIONS.GET_STRATEGIES_SUCCESS, payload: { message: 'Strategies fetched successfully', strategies: response.data } });
  }).catch((error) => {
    if (error.response) {
      dispatch({ type: STRATEGY_OPERATIONS.GET_STRATEGIES_FAIL, payload: { message: error.response.data.message, error: error.response.data.error || 'Failed to fetch strategies' } });
    } else {
      dispatch({ type: STRATEGY_OPERATIONS.GET_STRATEGIES_FAIL, payload: { message: 'Network error', error: error.message } });
    }
  });
};
