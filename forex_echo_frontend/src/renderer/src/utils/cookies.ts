export const setCookie = (name: string, value: string): void => {
  localStorage.setItem(name, value)
}

export const removeCookie = (name: string): void => {
  localStorage.removeItem(name)
}

export const getCookie = (name: string): string | null => {
  return localStorage.getItem(name)
}
