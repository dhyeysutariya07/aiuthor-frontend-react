export type ManuscriptStatus = 'draft' | 'published' | 'archived'

export interface Manuscript {
    id: string
    workspace: string
    owner: string
    title: string
    description?: string
    status: ManuscriptStatus
    chapters: string // API URL for chapters
}

export interface CreateManuscriptRequest {
    workspace: string
    title: string
    description?: string
    status?: ManuscriptStatus
}

export interface UpdateManuscriptRequest {
    title?: string
    description?: string
    status?: ManuscriptStatus
}

export interface Chapter {
    id: string
    manuscript: string
    title: string
    order_index: number
    created_at: string
    updated_at: string
}

export interface CreateChapterRequest {
    title: string
    order_index: number
}

export interface UpdateChapterRequest {
    title?: string
    order_index?: number
}

export interface ChapterDocument {
    id: string
    chapter: string
    current_version: string
    file: string
    document_versions: string // API URL for versions
}

// OnlyOffice Editor Configuration Types
export interface OnlyOfficeConfig {
    document: {
        fileType: string
        key: string
        title: string
        url: string
        permissions?: {
            comment?: boolean
            download?: boolean
            edit?: boolean
            fillForms?: boolean
            modifyContentControl?: boolean
            modifyFilter?: boolean
            print?: boolean
            review?: boolean
        }
    }
    documentType: 'word' | 'cell' | 'slide'
    editorConfig: {
        callbackUrl?: string
        lang?: string
        mode?: 'edit' | 'view'
        user?: {
            id: string
            name: string
        }
        customization?: any
    }
    height?: string
    width?: string
    token?: string
}

