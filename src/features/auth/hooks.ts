import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { authApi, userApi } from './api'
import { useAuthStore } from '@/stores/auth-store'
import type {
    LoginRequest,
    RegisterRequest,
    GoogleAuthRequest,
    PasswordResetRequest,
    PasswordChangeRequest,
} from './types'

// Query keys
export const authKeys = {
    currentUser: ['auth', 'currentUser'] as const,
    allUsers: ['users', 'all'] as const,
}

// Login mutation
export function useLogin() {
    const { auth } = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: (response) => {
            // Store tokens and user
            auth.setAccessToken(response.access)
            auth.setUser({
                id: response.user.id,
                username: response.user.username,
                email: response.user.email,
                avatar_url: response.user.avatar_url,
            })

            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser })

            toast.success(`Welcome back, ${response.user.username}!`)
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'Login failed. Please check your credentials.'
            toast.error(errorMessage)
        },
    })
}

// Register mutation
export function useRegister() {
    const navigate = useNavigate()
    const { auth } = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: RegisterRequest) => authApi.register(data),
        onSuccess: (response) => {
            // Store tokens and user
            auth.setAccessToken(response.access)
            auth.setUser({
                id: response.user.id,
                username: response.user.username,
                email: response.user.email,
                avatar_url: response.user.avatar_url,
            })

            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser })

            toast.success(`Welcome, ${response.user.username}!`)
            navigate({ to: '/' })
        },
        onError: (error: any) => {
            const errorData = error.response?.data
            let errorMessage = 'Registration failed. Please try again.'

            if (errorData) {
                // Handle field-specific errors
                if (errorData.username) {
                    errorMessage = Array.isArray(errorData.username)
                        ? errorData.username[0]
                        : errorData.username
                } else if (errorData.email) {
                    errorMessage = Array.isArray(errorData.email)
                        ? errorData.email[0]
                        : errorData.email
                } else if (errorData.password1) {
                    errorMessage = Array.isArray(errorData.password1)
                        ? errorData.password1[0]
                        : errorData.password1
                } else if (errorData.detail) {
                    errorMessage = errorData.detail
                }
            }

            toast.error(errorMessage)
        },
    })
}

// Google login mutation
export function useGoogleLogin() {
    const navigate = useNavigate()
    const { auth } = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: GoogleAuthRequest) => authApi.googleLogin(data),
        onSuccess: (response) => {
            // Store tokens and user
            auth.setAccessToken(response.access)
            auth.setUser({
                id: response.user.id,
                username: response.user.username,
                email: response.user.email,
                avatar_url: response.user.avatar_url,
            })

            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser })

            toast.success(`Welcome, ${response.user.username}!`)
            navigate({ to: '/' })
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.detail ||
                'Google login failed. Please try again.'
            toast.error(errorMessage)
        },
    })
}

// Logout mutation
export function useLogout() {
    const navigate = useNavigate()
    const { auth } = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            // Clear auth state
            auth.reset()

            // Clear all queries
            queryClient.clear()

            toast.success('Logged out successfully')
            navigate({ to: '/sign-in', replace: true })
        },
        onError: () => {
            // Even if the API call fails, clear local state
            auth.reset()
            queryClient.clear()
            navigate({ to: '/sign-in', replace: true })
        },
    })
}

// Password reset request mutation
export function usePasswordResetRequest() {
    return useMutation({
        mutationFn: (data: PasswordResetRequest) =>
            authApi.passwordResetRequest(data),
        onSuccess: () => {
            toast.success('Password reset email sent. Please check your inbox.')
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.detail ||
                'Failed to send reset email. Please try again.'
            toast.error(errorMessage)
        },
    })
}

// Password change mutation
export function usePasswordChange() {
    return useMutation({
        mutationFn: (data: PasswordChangeRequest) => authApi.changePassword(data),
        onSuccess: () => {
            toast.success('Password changed successfully')
        },
        onError: (error: any) => {
            const errorData = error.response?.data
            let errorMessage = 'Failed to change password. Please try again.'

            if (errorData) {
                if (errorData.old_password) {
                    errorMessage = Array.isArray(errorData.old_password)
                        ? errorData.old_password[0]
                        : errorData.old_password
                } else if (errorData.new_password1) {
                    errorMessage = Array.isArray(errorData.new_password1)
                        ? errorData.new_password1[0]
                        : errorData.new_password1
                } else if (errorData.detail) {
                    errorMessage = errorData.detail
                }
            }

            toast.error(errorMessage)
        },
    })
}

// Get current user query
export function useCurrentUser() {
    const { auth } = useAuthStore()

    return useQuery({
        queryKey: authKeys.currentUser,
        queryFn: () => userApi.getCurrentUser(),
        enabled: !!auth.accessToken, // Only fetch if authenticated
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    })
}

// Get all users query
export function useAllUsers() {
    return useQuery({
        queryKey: authKeys.allUsers,
        queryFn: () => userApi.getAllUsers(),
        staleTime: 1 * 60 * 1000, // 1 minute
    })
}
