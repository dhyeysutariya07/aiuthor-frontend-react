import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersApi } from './api'
import { CreateUserRequest, UpdateUserRequest, InviteUserRequest } from './types'

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: string) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
}

export function useUsers() {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: usersApi.getUsers,
    })
}

export function useUser(id: string) {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => usersApi.getUser(id),
        enabled: !!id,
    })
}

export function useCreateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
        onSuccess: () => {
            toast.success('User created successfully')
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create user')
        },
    })
}

export function useUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
            usersApi.updateUser(id, data),
        onSuccess: (data) => {
            toast.success('User updated successfully')
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update user')
        },
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => usersApi.deleteUser(id),
        onSuccess: () => {
            toast.success('User deleted successfully')
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete user')
        },
    })
}

export function useInviteUser() {
    return useMutation({
        mutationFn: (data: InviteUserRequest) => usersApi.inviteUser(data),
        onSuccess: () => {
            toast.success('Invitation sent successfully')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send invitation')
        },
    })
}

export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateUserRequest) => usersApi.updateProfile(data),
        onSuccess: () => {
            toast.success('Profile updated successfully')
            // Also invalidate auth current user query if it exists
            queryClient.invalidateQueries({ queryKey: ['auth', 'currentUser'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        },
    })
}
