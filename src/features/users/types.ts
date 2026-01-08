export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended'
export type UserRole = 'superadmin' | 'admin' | 'cashier' | 'manager'

export interface User {
    id: string
    firstName: string
    lastName: string
    username: string
    email: string
    phoneNumber: string
    status: UserStatus
    role: UserRole
    createdAt: string
    updatedAt: string
}

export interface CreateUserRequest {
    firstName: string
    lastName: string
    username: string
    email: string
    phoneNumber: string
    role: UserRole
    password?: string
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
    status?: UserStatus
}

export interface InviteUserRequest {
    email: string
    role: UserRole
}
