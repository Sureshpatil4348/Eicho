import { getCookie, removeCookie } from "@renderer/utils/cookies";
import Axios, { AxiosError, AxiosInstance } from "axios";

const axios: AxiosInstance = Axios.create({ baseURL: import.meta.env.VITE_APP_API_URL + '/api', timeout: 1800000 });

axios.interceptors.request.use((config) => {
    const token = getCookie('auth-token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
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
        window.location.href = '/'
    }
    return Promise.reject(error)
})

export default axios
