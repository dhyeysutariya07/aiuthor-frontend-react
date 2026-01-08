import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workspaceApi } from './api'
import {
    AddMemberRequest,
    CreateWorkspaceRequest,
    UpdateMemberRoleRequest,
    UpdateWorkspaceRequest,
} from './types'

// Query Keys
export const workspaceKeys = {
    all: ['workspaces'] as const,
    lists: () => [...workspaceKeys.all, 'list'] as const,
    detail: (id: string) => [...workspaceKeys.all, 'detail', id] as const,
    manuscripts: (id: string) => [...workspaceKeys.detail(id), 'manuscripts'] as const,
    members: (id: string) => [...workspaceKeys.detail(id), 'members'] as const,
}

// Queries
export function useWorkspaces() {
    return useQuery({
        queryKey: workspaceKeys.lists(),
        queryFn: workspaceApi.getWorkspaces,
    })
}

export function useWorkspace(id: string) {
    return useQuery({
        queryKey: workspaceKeys.detail(id),
        queryFn: () => workspaceApi.getWorkspace(id),
        enabled: !!id,
    })
}

export function useWorkspaceManuscripts(id: string) {
    return useQuery({
        queryKey: workspaceKeys.manuscripts(id),
        queryFn: () => workspaceApi.getWorkspaceManuscripts(id),
        enabled: !!id,
    })
}

export function useWorkspaceMembers(id: string) {
    return useQuery({
        queryKey: workspaceKeys.members(id),
        queryFn: () => workspaceApi.getWorkspaceMembers(id),
        enabled: !!id,
    })
}

// Mutations
export function useCreateWorkspace() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateWorkspaceRequest) => workspaceApi.createWorkspace(data),
        onSuccess: () => {
            toast.success('Workspace created successfully')
            queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create workspace')
        },
    })
}

export function useUpdateWorkspace() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateWorkspaceRequest }) =>
            workspaceApi.updateWorkspace(id, data),
        onSuccess: (data) => {
            toast.success('Workspace updated successfully')
            queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
            queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(data.id) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update workspace')
        },
    })
}

export function useDeleteWorkspace() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => workspaceApi.deleteWorkspace(id),
        onSuccess: () => {
            toast.success('Workspace deleted successfully')
            queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete workspace')
        },
    })
}

export function useAddMember() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            workspaceId,
            data,
        }: {
            workspaceId: string
            data: AddMemberRequest
        }) => workspaceApi.addMember(workspaceId, data),
        onSuccess: (_, { workspaceId }) => {
            toast.success('Member added successfully')
            queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add member')
        },
    })
}

export function useUpdateMemberRole() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            workspaceId,
            membershipId,
            data,
        }: {
            workspaceId: string
            membershipId: string
            data: UpdateMemberRoleRequest
        }) => workspaceApi.updateMemberRole(workspaceId, membershipId, data),
        onSuccess: (_, { workspaceId }) => {
            toast.success('Member role updated successfully')
            queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update member role')
        },
    })
}

export function useRemoveMember() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            workspaceId,
            membershipId,
        }: {
            workspaceId: string
            membershipId: string
        }) => workspaceApi.removeMember(workspaceId, membershipId),
        onSuccess: (_, { workspaceId }) => {
            toast.success('Member removed successfully')
            queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to remove member')
        },
    })
}
