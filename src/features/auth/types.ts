// User types
export interface User {
    id: string
    username: string
    email: string
    avatar_url?: string | null
}

// Auth request types
export interface LoginRequest {
    username?: string
    email?: string
    password: string
}

export interface RegisterRequest {
    username: string
    email: string
    password1: string
    password2: string
}

export interface GoogleAuthRequest {
    access_token: string
    id_token?: string
}

export interface PasswordResetRequest {
    email: string
}

export interface PasswordResetConfirmRequest {
    uid: string
    token: string
    new_password1: string
    new_password2: string
}

export interface PasswordChangeRequest {
    old_password: string
    new_password1: string
    new_password2: string
}

// Auth response types
export interface AuthResponse {
    access: string
    refresh: string
    user: User
}

export interface UserListItem {
    id: string
    username: string
}
