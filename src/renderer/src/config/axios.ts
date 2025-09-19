import { getCookie, removeCookie } from "@renderer/utils/cookies";
import Axios, { AxiosError, AxiosInstance } from "axios";

const axios: AxiosInstance = Axios.create({ baseURL: 'http://20.83.157.24:8000/api/' });

axios.interceptors.request.use((config) => {
  const token = getCookie('auth-token')
  const sessionId = getCookie('sessionId')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId; // 👈 add session header
  }
  return config
}, (error: AxiosError) => {
  Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, (error: AxiosError) => {
  if (error.response?.status == 401) {
    removeCookie('auth-token')
    removeCookie('sessionId')
    // window.location.href = '/'
  }
  return Promise.reject(error)
})

export default axios
