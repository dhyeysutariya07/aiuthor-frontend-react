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
