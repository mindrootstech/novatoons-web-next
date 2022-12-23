export const base_url = process.env.REACT_APP_BASE_URL
export const isUserLoggedInToken = () => localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token')
export const isUserLoggedIn = () => localStorage.getItem('userData') ? localStorage.getItem('userData') : sessionStorage.getItem('userData')
export const userData = () => JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')) : JSON.parse(sessionStorage.getItem('userData'))
