
import { ACCOUNT_CONNECT, ACCOUNT_CONNECT_ACTION, ACCOUNT_CONNECT_INIT_TYPE } from "../constants/account.constants";

const ACCOUNT_INIT: ACCOUNT_CONNECT_INIT_TYPE = {
    loading: false,
    message: null,
    accountstatus: null,
    session_id: null
}

export const AccountReducer = (state = ACCOUNT_INIT, action: ACCOUNT_CONNECT_ACTION): ACCOUNT_CONNECT_INIT_TYPE => {
    switch (action.type) {
        case ACCOUNT_CONNECT.ACCOUNT_CONNECT_REQUEST:
            return { ...state, loading: true, message: null, error: null }

        case ACCOUNT_CONNECT.ACCOUNT_CONNECT_SUCCESS:
            return { ...state, loading: false, message: action.payload.message, accountstatus: action.payload.data, error: null }

        case ACCOUNT_CONNECT.ACCOUNT_CONNECT_FAIL:
            return { ...state, loading: false, message: action.payload.message, error: action.payload.error }
        case ACCOUNT_CONNECT.SESSION_REQUEST:
            return { ...state, loading: true, message: null, error: null }

        case ACCOUNT_CONNECT.SESSION_SUCCESS:
            return { ...state, loading: false, message: action.payload.message, session_id: action.payload.session_id, error: null }

        case ACCOUNT_CONNECT.SESSION_FAIL:
            return { ...state, loading: false, message: action.payload.message, error: action.payload.error }
        default:
            return state;
    }
}
