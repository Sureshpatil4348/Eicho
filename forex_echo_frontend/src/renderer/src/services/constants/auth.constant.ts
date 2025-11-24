export enum USER_LOGIN {
    USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST",
    USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS",
    USER_LOGIN_FAIL = "USER_LOGIN_FAIL",
}

export interface USER_LOGIN_REQUEST {
    type: USER_LOGIN.USER_LOGIN_REQUEST;
}

export interface USER_LOGIN_SUCCESS {
    type: USER_LOGIN.USER_LOGIN_SUCCESS;
    payload: {
        message: string | null;
        token: string | null;
    };
}

export interface USER_LOGIN_FAIL {
    type: USER_LOGIN.USER_LOGIN_FAIL;
    payload: {
        message: string | null;
        error: string | null;
    };
}

export enum USER_LOGOUT {
    USER_LOGOUT_REQUEST = "USER_LOGOUT_REQUEST",
    USER_LOGOUT_COMPLETE = "USER_LOGOUT_COMPLETE"
}

export interface USER_LOGOUT_REQUEST {
    type: USER_LOGOUT.USER_LOGOUT_REQUEST;
}

export interface USER_LOGOUT_COMPLETE {
    type: USER_LOGOUT.USER_LOGOUT_COMPLETE;
    payload: {
        message: string | null;
    };
}

export type AUTH_LOGIN_ACTION = USER_LOGIN_REQUEST | USER_LOGIN_SUCCESS | USER_LOGIN_FAIL | USER_LOGOUT_REQUEST | USER_LOGOUT_COMPLETE;

export interface AUTH_LOGIN_INIT_TYPE {
    loading: boolean;
    error?: string | null | object | Array<object>;
    message: string | null;
    token?: string | null;
    isLogout?: boolean;
}
