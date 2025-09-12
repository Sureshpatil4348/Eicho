export interface MT5_CONNECT_RESPONSE {
    message: string
    status: Status
    success: boolean
}

export interface Status {
    account_balance: number
    account_equity: number
    account_login: number
    account_server: string
    auto_trading: boolean
    connected: boolean
    terminal_build: number
    terminal_company: string
    terminal_name: string
    trade_allowed: boolean
}
