export type WorkspaceRole = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'MEMBER'

export interface Workspace {
    id: string
    name: string
    created_by: string
    created_at?: string
    updated_at?: string
    // workspace_memberships URL is returned but we might not need to store it if we fetch members separately
    workspace_memberships?: string
}

export interface CreateWorkspaceRequest {
    name: string
}

export interface UpdateWorkspaceRequest {
    name: string
}

export interface WorkspaceMembership {
    id: string
    user: string // User UUID
    workspace: string // Workspace UUID
    role: WorkspaceRole
    user_details?: { // Optional nested user details if backend provides it, otherwise we join on frontend
        username: string
        email: string
        avatar_url?: string
    }
}

export interface AddMemberRequest {
    user: string // User UUID
    role: WorkspaceRole
}

export interface UpdateMemberRoleRequest {
    role: WorkspaceRole
}

// Manuscript type placeholder for the nested resource
export interface WorkspaceManuscript {
    id: string
    title: string
    // Add other manuscript fields as needed
}
