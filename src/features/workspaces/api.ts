import { apiClient } from '@/lib/api'
import {
    AddMemberRequest,
    CreateWorkspaceRequest,
    UpdateMemberRoleRequest,
    UpdateWorkspaceRequest,
    Workspace,
    WorkspaceManuscript,
    WorkspaceMembership,
} from './types'

export const workspaceApi = {
    // Workspace CRUD
    getWorkspaces: async (): Promise<Workspace[]> => {
        const response = await apiClient.get('/workspaces/')
        return response.data
    },

    getWorkspace: async (id: string): Promise<Workspace> => {
        const response = await apiClient.get(`/workspaces/${id}/`)
        return response.data
    },

    createWorkspace: async (data: CreateWorkspaceRequest): Promise<Workspace> => {
        const response = await apiClient.post('/workspaces/', data)
        return response.data
    },

    updateWorkspace: async (
        id: string,
        data: UpdateWorkspaceRequest
    ): Promise<Workspace> => {
        const response = await apiClient.patch(`/workspaces/${id}/`, data)
        return response.data
    },

    deleteWorkspace: async (id: string): Promise<void> => {
        await apiClient.delete(`/workspaces/${id}/`)
    },

    // Nested Resources
    getWorkspaceManuscripts: async (id: string): Promise<WorkspaceManuscript[]> => {
        const response = await apiClient.get(`/workspaces/${id}/manuscripts/`)
        return response.data
    },

    // Membership Management
    getWorkspaceMembers: async (workspaceId: string): Promise<WorkspaceMembership[]> => {
        const response = await apiClient.get(`/workspaces/${workspaceId}/memberships/`)
        return response.data
    },

    addMember: async (
        workspaceId: string,
        data: AddMemberRequest
    ): Promise<WorkspaceMembership> => {
        const response = await apiClient.post(
            `/workspaces/${workspaceId}/memberships/`,
            data
        )
        return response.data
    },

    updateMemberRole: async (
        workspaceId: string,
        membershipId: string,
        data: UpdateMemberRoleRequest
    ): Promise<WorkspaceMembership> => {
        const response = await apiClient.patch(
            `/workspaces/${workspaceId}/memberships/${membershipId}/`,
            data
        )
        return response.data
    },

    removeMember: async (
        workspaceId: string,
        membershipId: string
    ): Promise<void> => {
        await apiClient.delete(
            `/workspaces/${workspaceId}/memberships/${membershipId}/`
        )
    },
}
