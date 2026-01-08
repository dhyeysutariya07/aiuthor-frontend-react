import apiClient from '@/lib/api'
import {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    InviteUserRequest,
} from './types'

export const usersApi = {
    // List all users
    getUsers: async (): Promise<User[]> => {
        const response = await apiClient.get<User[]>('/user/all/')
        return response.data
    },

    // Get a single user
    getUser: async (id: string): Promise<User> => {
        const response = await apiClient.get<User>(`/user/${id}/`)
        return response.data
    },

    // Create a new user
    createUser: async (data: CreateUserRequest): Promise<User> => {
        const response = await apiClient.post<User>('/user/create/', data)
        return response.data
    },

    // Update an existing user
    updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
        const response = await apiClient.patch<User>(`/user/${id}/`, data)
        return response.data
    },

    // Delete a user
    deleteUser: async (id: string): Promise<void> => {
        await apiClient.delete(`/user/${id}/`)
    },

    // Invite a user
    inviteUser: async (data: InviteUserRequest): Promise<void> => {
        await apiClient.post('/user/invite/', data)
    },

    // Update current user profile
    updateProfile: async (data: UpdateUserRequest): Promise<User> => {
        const response = await apiClient.patch<User>('/user/me/', data)
        return response.data
    },
}
