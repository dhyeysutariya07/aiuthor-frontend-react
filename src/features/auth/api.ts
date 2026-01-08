import apiClient from '@/lib/api'
import type {
    LoginRequest,
    RegisterRequest,
    GoogleAuthRequest,
    PasswordResetRequest,
    PasswordResetConfirmRequest,
    PasswordChangeRequest,
    AuthResponse,
    User,
    UserListItem,
} from './types'

// Authentication endpoints
export const authApi = {
    // Login with username/email and password
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/auth/user/login/',
            data
        )
        return response.data
    },

    // Register new user
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/auth/user/registration/',
            data
        )
        return response.data
    },

    // Google OAuth login
    googleLogin: async (data: GoogleAuthRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/auth/user/google/',
            data
        )
        return response.data
    },

    // Logout
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/user/logout/')
    },

    // Password reset request
    passwordResetRequest: async (data: PasswordResetRequest): Promise<void> => {
        await apiClient.post('/auth/user/password/reset/', data)
    },

    // Password reset confirm
    passwordResetConfirm: async (
        data: PasswordResetConfirmRequest
    ): Promise<void> => {
        await apiClient.post('/auth/user/password/reset/confirm/', data)
    },

    // Change password (authenticated)
    changePassword: async (data: PasswordChangeRequest): Promise<void> => {
        await apiClient.post('/auth/user/password/change/', data)
    },
}

// User endpoints
export const userApi = {
    // Get current user profile
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/user/me/')
        return response.data
    },

    // Get all users
    getAllUsers: async (): Promise<UserListItem[]> => {
        const response = await apiClient.get<UserListItem[]>('/user/all')
        return response.data
    },
}
