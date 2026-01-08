import { apiClient } from '@/lib/api'
import {
    Chapter,
    ChapterDocument,
    CreateChapterRequest,
    CreateManuscriptRequest,
    Manuscript,
    UpdateChapterRequest,
    UpdateManuscriptRequest,
} from './types'

export const manuscriptApi = {
    // Manuscript CRUD
    getManuscripts: async (workspaceId: string): Promise<Manuscript[]> => {
        const response = await apiClient.get(`/workspaces/${workspaceId}/manuscripts/`)
        return response.data
    },

    getManuscript: async (id: string): Promise<Manuscript> => {
        const response = await apiClient.get(`/manuscripts/${id}/`)
        return response.data
    },

    createManuscript: async (data: CreateManuscriptRequest): Promise<Manuscript> => {
        const response = await apiClient.post('/manuscripts/', data)
        return response.data
    },

    updateManuscript: async (
        id: string,
        data: UpdateManuscriptRequest
    ): Promise<Manuscript> => {
        const response = await apiClient.patch(`/manuscripts/${id}/`, data)
        return response.data
    },

    deleteManuscript: async (id: string): Promise<void> => {
        await apiClient.delete(`/manuscripts/${id}/`)
    },

    // Chapter CRUD (Nested)
    getChapters: async (manuscriptId: string): Promise<Chapter[]> => {
        const response = await apiClient.get(`/manuscripts/${manuscriptId}/chapters/`)
        return response.data
    },

    createChapter: async (
        manuscriptId: string,
        data: CreateChapterRequest
    ): Promise<Chapter> => {
        const response = await apiClient.post(
            `/manuscripts/${manuscriptId}/chapters/`,
            data
        )
        return response.data
    },

    updateChapter: async (
        manuscriptId: string,
        chapterId: string,
        data: UpdateChapterRequest
    ): Promise<Chapter> => {
        const response = await apiClient.patch(
            `/manuscripts/${manuscriptId}/chapters/${chapterId}/`,
            data
        )
        return response.data
    },

    deleteChapter: async (
        manuscriptId: string,
        chapterId: string
    ): Promise<void> => {
        await apiClient.delete(`/manuscripts/${manuscriptId}/chapters/${chapterId}/`)
    },

    // Chapter Documents
    getChapterDocuments: async (
        manuscriptId: string,
        chapterId: string
    ): Promise<ChapterDocument[]> => {
        const response = await apiClient.get(
            `/manuscripts/${manuscriptId}/chapters/${chapterId}/documents/`
        )
        return response.data
    },

    // OnlyOffice Editor Config
    getDocumentEditorConfig: async (documentId: string): Promise<any> => {
        const response = await apiClient.get(
            `/documents/onlyoffice/config/${documentId}/`
        )
        return response.data
    },
}

