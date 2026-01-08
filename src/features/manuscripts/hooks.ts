import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { manuscriptApi } from './api'
import {
    CreateChapterRequest,
    CreateManuscriptRequest,
    UpdateChapterRequest,
    UpdateManuscriptRequest,
} from './types'

// Query Keys
export const manuscriptKeys = {
    all: ['manuscripts'] as const,
    lists: (workspaceId?: string) => [...manuscriptKeys.all, 'list', { workspaceId }] as const,
    detail: (id: string) => [...manuscriptKeys.all, 'detail', id] as const,
    chapters: (manuscriptId: string) => [...manuscriptKeys.all, 'chapters', manuscriptId] as const,
    documents: (manuscriptId: string, chapterId: string) => [...manuscriptKeys.all, 'documents', manuscriptId, chapterId] as const,
}

// Queries
export function useManuscripts(workspaceId?: string) {
    return useQuery({
        queryKey: manuscriptKeys.lists(workspaceId),
        queryFn: () => manuscriptApi.getManuscripts(workspaceId!),
        enabled: !!workspaceId,
    })
}

export function useManuscript(id: string) {
    return useQuery({
        queryKey: manuscriptKeys.detail(id),
        queryFn: () => manuscriptApi.getManuscript(id),
        enabled: !!id,
    })
}

export function useChapters(manuscriptId: string) {
    return useQuery({
        queryKey: manuscriptKeys.chapters(manuscriptId),
        queryFn: () => manuscriptApi.getChapters(manuscriptId),
        enabled: !!manuscriptId,
    })
}

export function useChapterDocuments(manuscriptId: string, chapterId: string) {
    return useQuery({
        queryKey: manuscriptKeys.documents(manuscriptId, chapterId),
        queryFn: () => manuscriptApi.getChapterDocuments(manuscriptId, chapterId),
        enabled: !!manuscriptId && !!chapterId,
    })
}

// Mutations
export function useCreateManuscript() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateManuscriptRequest) => manuscriptApi.createManuscript(data),
        onSuccess: (data) => {
            toast.success('Manuscript created successfully')
            queryClient.invalidateQueries({ queryKey: manuscriptKeys.lists(data.workspace) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create manuscript')
        },
    })
}

export function useUpdateManuscript() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateManuscriptRequest }) =>
            manuscriptApi.updateManuscript(id, data),
        onSuccess: (data) => {
            toast.success('Manuscript updated successfully')
            queryClient.invalidateQueries({ queryKey: manuscriptKeys.detail(data.id) })
            queryClient.invalidateQueries({ queryKey: manuscriptKeys.lists(data.workspace) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update manuscript')
        },
    })
}

export function useDeleteManuscript() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id }: { id: string; workspaceId: string }) =>
            manuscriptApi.deleteManuscript(id),
        onSuccess: (_, { workspaceId }) => {
            toast.success('Manuscript deleted successfully')
            queryClient.invalidateQueries({ queryKey: manuscriptKeys.lists(workspaceId) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete manuscript')
        },
    })
}

export function useCreateChapter() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            manuscriptId,
            data,
        }: {
            manuscriptId: string
            data: CreateChapterRequest
        }) => manuscriptApi.createChapter(manuscriptId, data),
        onSuccess: (_, { manuscriptId }) => {
            toast.success('Chapter created successfully')
            queryClient.invalidateQueries({ queryKey: manuscriptKeys.chapters(manuscriptId) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create chapter')
        },
    })
}

export function useUpdateChapter() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            manuscriptId,
            chapterId,
            data,
        }: {
            manuscriptId: string
            chapterId: string
            data: UpdateChapterRequest
        }) => manuscriptApi.updateChapter(manuscriptId, chapterId, data),
        onSuccess: (_, { manuscriptId }) => {
            toast.success('Chapter updated successfully')
            queryClient.invalidateQueries({ queryKey: manuscriptKeys.chapters(manuscriptId) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update chapter')
        },
    })
}

export function useRemoveChapter() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            manuscriptId,
            chapterId,
        }: {
            manuscriptId: string
            chapterId: string
        }) => manuscriptApi.deleteChapter(manuscriptId, chapterId),
        onSuccess: (_, { manuscriptId }) => {
            toast.success('Chapter removed successfully')
            queryClient.invalidateQueries({ queryKey: manuscriptKeys.chapters(manuscriptId) })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to remove chapter')
        },
    })
}
