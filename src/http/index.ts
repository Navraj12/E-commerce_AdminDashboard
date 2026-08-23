import axios from 'axios'

export const BASE_URL = 'http://localhost:5000/'

const APIAuthenticated = axios.create({
    baseURL : BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept' : 'application/json',
    }
})

// Read the token fresh from localStorage on every request instead of only
// once at module load time (module-load-only headers go stale after login).
APIAuthenticated.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

const API = axios.create({
    baseURL : BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept' : 'application/json',

    }
})
export{ APIAuthenticated,API}
