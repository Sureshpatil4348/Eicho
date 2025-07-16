/* eslint-disable @typescript-eslint/no-explicit-any */

import Cookies, { CookieSetOptions } from "universal-cookie";

const cookies = new Cookies(null, { path: '/' });

export const setCookie = (name: string, value: string, options: CookieSetOptions): void => {
  cookies.set(name, value, options)
}

export const removeCookie = (name: string): void => {
  cookies.remove(name)
}

export const getCookie = (name: string): any => {
  return cookies.get(name)
}
