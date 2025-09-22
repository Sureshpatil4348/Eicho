import { Dispatch } from 'react';
import { STRATEGY_ACTION, STRATEGY_OPERATIONS } from '../constants/strategies.constant';
import { API_URL } from '@renderer/utils/constant';
import axios from '@renderer/config/axios';
import { FundAllocate } from '@renderer/types/strategy.type';
import { AxiosResponse } from 'axios';

export const GetStrategiesAction = (userId: any, dispatch: Dispatch<STRATEGY_ACTION>): void => {
  dispatch({ type: STRATEGY_OPERATIONS.GET_STRATEGIES_REQUEST });
  axios.get(API_URL.GET_STRATEGIES(userId)).then((response) => {
    dispatch({ type: STRATEGY_OPERATIONS.GET_STRATEGIES_SUCCESS, payload: { message: 'Strategies fetched successfully', strategies: response.data?.strategies } });
  }).catch((error) => {
    if (error.response) {
      dispatch({ type: STRATEGY_OPERATIONS.GET_STRATEGIES_FAIL, payload: { message: error.response.data.message, error: error.response.data.error || 'Failed to fetch strategies' } });
    } else {
      dispatch({ type: STRATEGY_OPERATIONS.GET_STRATEGIES_FAIL, payload: { message: 'Network error', error: error.message } });
    }
  });
};

export const CapitalAllocation = (data: FundAllocate, dispatch: Dispatch<STRATEGY_ACTION>): void => {
  dispatch({ type: STRATEGY_OPERATIONS.ALLOCATE_FUND_REQUEST })
  axios.post(API_URL.CREATE_TRADING_SESSION, data).then((response: AxiosResponse) => {
    if (response.data.success) {
      dispatch({ type: STRATEGY_OPERATIONS.ALLOCATE_FUND_SUCCESS, payload: { message: response.data.message, data: response.data.data } });
    } else {
      dispatch({ type: STRATEGY_OPERATIONS.ALLOCATE_FUND_FAIL, payload: { message: response.data.message, error: response.data } });
    }
  }).catch((error) => {
    if (error.response) {
      dispatch({ type: STRATEGY_OPERATIONS.ALLOCATE_FUND_FAIL, payload: { message: error.response.data.message, error: error.response.data } });
    } else {
      dispatch({ type: STRATEGY_OPERATIONS.ALLOCATE_FUND_FAIL, payload: { error: error.stack, message: error.message } });
    }
  })
}
