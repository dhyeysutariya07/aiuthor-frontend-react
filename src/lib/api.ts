import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookie-based auth
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().auth.accessToken
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If 401 and we haven't retried yet, try to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // The refresh token is in the cookie, so just make the request
                // The backend will handle the refresh automatically
                const response = await axios.post(
                    `${API_BASE_URL}/auth/user/token/refresh/`,
                    {},
                    { withCredentials: true }
                )

                if (response.data.access) {
                    useAuthStore.getState().auth.setAccessToken(response.data.access)
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`
                    return apiClient(originalRequest)
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                useAuthStore.getState().auth.reset()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient
