import { AUTH_LOGIN_ACTION, USER_LOGIN, USER_LOGOUT } from "../constants/auth.constant";
import { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { AuthLoginType } from "@renderer/types/auth.type";
import axios from "@renderer/config/axios";
import { API_URL } from "@renderer/utils/constant";
import { removeCookie, setCookie } from "@renderer/utils/cookies";
import { ACCOUNT_CONNECT, ACCOUNT_CONNECT_ACTION, Mt5payload, SessionCreate } from "../constants/account.constants";
import { openModal } from "./modal.action";
import MODAL_TYPE from "@renderer/config/modal";

export const UserLoginAction = (data: AuthLoginType, dispatch: Dispatch<AUTH_LOGIN_ACTION>): void => {
  dispatch({ type: USER_LOGIN.USER_LOGIN_REQUEST })
  axios.post(API_URL.LOGIN_URL, { ...data, email: data.username }).then((response: AxiosResponse) => {
    if (response.data.success) {
      setCookie('auth-token', response.data.data.access_token)
      dispatch({ type: USER_LOGIN.USER_LOGIN_SUCCESS, payload: { message: response.data.message, token: response.data.data.access_token } });
    } else {
      dispatch({ type: USER_LOGIN.USER_LOGIN_FAIL, payload: { message: response.data.message, error: response.data } });
    }
  }).catch((error) => {
    if (error.response) {
      dispatch({ type: USER_LOGIN.USER_LOGIN_FAIL, payload: { message: error.response.data.message, error: error.response.data } });
    } else {
      dispatch({ type: USER_LOGIN.USER_LOGIN_FAIL, payload: { error: error.stack, message: error.message } });
    }
  })
}

export const UserLogoutAction = (dispatch: Dispatch<AUTH_LOGIN_ACTION>): void => {
  dispatch({ type: USER_LOGOUT.USER_LOGOUT_REQUEST })
  dispatch({ type: USER_LOGOUT.USER_LOGOUT_COMPLETE, payload: { message: 'Good bye, please visit again!' } });
  removeCookie('auth-token')
}

export const UserMt5Connect = (data: Mt5payload, dispatch: Dispatch<ACCOUNT_CONNECT_ACTION>): void => {
  dispatch({ type: ACCOUNT_CONNECT.ACCOUNT_CONNECT_REQUEST })
  axios.post(API_URL.CONNECT_MT5, data).then((response: AxiosResponse) => {
    if (response.data.success) {
      dispatch({ type: ACCOUNT_CONNECT.ACCOUNT_CONNECT_SUCCESS, payload: { message: response.data.message, data: response.data.data } });
      openModal({ body: MODAL_TYPE.DEFAULT, title: 'Connected to MT5 account', size: 'md' }, dispatch)

    } else {
      dispatch({ type: ACCOUNT_CONNECT.ACCOUNT_CONNECT_FAIL, payload: { message: response.data.message, error: response.data } });
    }
  }).catch((error) => {
    if (error.response) {
      dispatch({ type: ACCOUNT_CONNECT.ACCOUNT_CONNECT_FAIL, payload: { message: error.response.data.message, error: error.response.data } });
    } else {
      dispatch({ type: ACCOUNT_CONNECT.ACCOUNT_CONNECT_FAIL, payload: { error: error.stack, message: error.message } });
    }
  })
}

export const UserCreateSession = (data: SessionCreate, dispatch: Dispatch<ACCOUNT_CONNECT_ACTION>): void => {
  dispatch({ type: ACCOUNT_CONNECT.SESSION_REQUEST })
  axios.post(API_URL.CREATE_TRADING_SESSION, data).then((response: AxiosResponse) => {
    if (response.data.success) {
      dispatch({ type: ACCOUNT_CONNECT.SESSION_SUCCESS, payload: { message: response.data.message, session_id: response.data.data?.session_id } });
      openModal({ body: MODAL_TYPE.DEFAULT, title: 'Session created successfully', size: 'md' }, dispatch)

    } else {
      dispatch({ type: ACCOUNT_CONNECT.SESSION_FAIL, payload: { message: response.data.message, error: response.data } });
    }
  }).catch((error) => {
    if (error.response) {
      dispatch({ type: ACCOUNT_CONNECT.SESSION_FAIL, payload: { message: error.response.data.message, error: error.response.data } });
    } else {
      dispatch({ type: ACCOUNT_CONNECT.SESSION_FAIL, payload: { error: error.stack, message: error.message } });
    }
  })
}