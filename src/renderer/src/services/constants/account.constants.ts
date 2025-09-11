export enum ACCOUNT_CONNECT {
    ACCOUNT_CONNECT_REQUEST = "ACCOUNT_CONNECT_REQUEST",
    ACCOUNT_CONNECT_SUCCESS = "ACCOUNT_CONNECT_SUCCESS",
    ACCOUNT_CONNECT_FAIL = "ACCOUNT_CONNECT_FAIL",

    SESSION_REQUEST = "SESSION_REQUEST",
    SESSION_SUCCESS = "SESSION_SUCCESS",
    SESSION_FAIL = "SESSION_FAIL",
}
export interface Mt5payload {
    login: number
    password: string
    server: string
}
export interface SessionCreate {
    user_id?: string | number
}
export interface ACCOUNT_CONNECT_REQUEST {
    type: ACCOUNT_CONNECT.ACCOUNT_CONNECT_REQUEST;
}

export interface ACCOUNT_CONNECT_SUCCESS {
    type: ACCOUNT_CONNECT.ACCOUNT_CONNECT_SUCCESS;
    payload: {
        message: string | null;
        data: object | null;
    };
}

export interface ACCOUNT_CONNECT_FAIL {
    type: ACCOUNT_CONNECT.ACCOUNT_CONNECT_FAIL;
    payload: {
        message: string | null;
        error: string | null;
    };
}

export interface SESSION_REQUEST_REQUEST {
    type: ACCOUNT_CONNECT.SESSION_REQUEST;
}

export interface SESSION_REQUEST_SUCCESS {
    type: ACCOUNT_CONNECT.SESSION_SUCCESS;
    payload: {
        message: string | null;
        session_id?: any | null;
    };
}

export interface SESSION_REQUEST_FAIL {
    type: ACCOUNT_CONNECT.SESSION_FAIL;
    payload: {
        message: string | null;
        error: string | null;
    };
}
export type ACCOUNT_CONNECT_ACTION = ACCOUNT_CONNECT_REQUEST | ACCOUNT_CONNECT_SUCCESS | ACCOUNT_CONNECT_FAIL | SESSION_REQUEST_REQUEST | SESSION_REQUEST_SUCCESS | SESSION_REQUEST_FAIL;

export interface ACCOUNT_CONNECT_INIT_TYPE {
    loading: boolean;
    error?: string | null | object | Array<object>;
    message: string | null;
    accountstatus?: object | null;
    session_id?: string | null
}
