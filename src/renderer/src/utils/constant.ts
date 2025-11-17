export const API_URL = Object.freeze({
  LOGIN_URL: '/auth/login',
  GET_USER_DETAILS: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_OTP: '/auth/verify-reset-code',
  RESET_PASSWORD: '/auth/reset-password',
  STRATEGY_OPERATIONS: '/strategies/create',
  GET_STRATEGIES: (userId: number | undefined) => `/strategies/list/${userId}`,
  CONNECT_MT5: '/mt5/connect',
  GET_MT5_DETAILS: '/mt5/connect',
  CREATE_TRADING_SESSION: '/session/create',
  CAPITAL_ALOCATION: '/pro-capital/allocations/bulk',
  GET_CAPITAL_ALLOCATION: '/mt5/account-info',
  GET_TRADING_HISTORY: (userId: number | undefined) => `/trades/user/${userId}/history`,
  GET_TRADE_SUMMARY: `/metrics/trade-analysis`,

  GET_KEY_PAIRTRADING_HISTORY: (id: any, userId: any) => `/trades/user/${userId}/history/${id}`,

  GET_DASHBOARD_HISTORY: (userId: number | undefined) => `/metrics/user/${userId}/get-dashboard-data`,
  GET_CONFIG_DATA: (strategy_id: string | undefined) => `/strategies/config/${strategy_id}`,
  GET_SINGLE_ALLOCATION_DATA: (strategy_id: string | undefined) => `pro-capital/allocations/${strategy_id}`,
  TRADE_START: `/dynamic-trading/start`,
  GET_ACCOUNT_GROWTH: `/metrics/balance-equity-chart`,
  PROFIT_LOSS_ANALYSIS: `/metrics/monthly-pnl-analysis`,
  TRADE_HISTORY_DASHBOARD: `/metrics/trade-history`,
  ADVANCE_STATICS: `/metrics/advanced-statistics`
});
