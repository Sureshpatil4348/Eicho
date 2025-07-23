import { AUTH_LOGIN_ACTION, USER_LOGIN, USER_LOGOUT } from "../constants/auth.constant";
import { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import moment from "moment-timezone"
import { AuthLoginType } from "@renderer/types/auth.type";
import axios from "@renderer/config/axios";
import { API_URL } from "@renderer/utils/constant";
import { removeCookie, setCookie } from "@renderer/utils/cookies";

export const UserLoginAction = (data: AuthLoginType, dispatch: Dispatch<AUTH_LOGIN_ACTION>): void => {
  dispatch({ type: USER_LOGIN.USER_LOGIN_REQUEST })
  axios.post(API_URL.LOGIN_URL, { email: data.userName, password: data.password }).then((response: AxiosResponse) => {
    if (response.data.success) {
      setCookie('auth-token', response.data.data.token, { expires: new Date(moment().add(15, 'days').format()) })
      dispatch({ type: USER_LOGIN.USER_LOGIN_SUCCESS, payload: { message: response.data.data.message, token: response.data.data.token } });
    } else {
      dispatch({ type: USER_LOGIN.USER_LOGIN_FAIL, payload: { message: response.data.data.message, error: response.data } });
    }
  }).catch((error) => {
    if (error.response) {
      dispatch({ type: USER_LOGIN.USER_LOGIN_FAIL, payload: { message: error.response.data.message, error: error.response.data.errors || error.response.data } });
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
