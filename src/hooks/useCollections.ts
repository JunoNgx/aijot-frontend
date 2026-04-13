import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { storage } from "@/db"
import { queryKeys } from "@/db/queryKeys"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import type { Collection, CoreCollectionConfig } from "@/types"

function buildCoreCollection(
    id: string,
    config: CoreCollectionConfig,
    sortOrder: number,
    coreType: Collection["coreType"],
): Collection {
    const now = DateTime.now().toISO()
    return {
        id,
        createdAt: now,
        updatedAt: now,
        name: config.name,
        icon: config.icon,
        colour: config.colour,
        slug: config.slug,
        sortOrder,
        tags: [],
        types: ["text", "todo", "link"],
        coreType,
    }
}

export function useCollections() {
    const queryClient = useQueryClient()
    const { all, untagged, trash } = useCoreCollectionSettings()

    const collectionsQuery = useQuery({
        queryKey: queryKeys.collections,
        queryFn: async () => {
            const userCollections = await storage.getCollections()
            const coreCollections: Collection[] = [
                buildCoreCollection("core-all", all, -3, "all"),
                buildCoreCollection("core-untagged", untagged, -2, "untagged"),
                buildCoreCollection("core-trash", trash, -1, "trash"),
            ]
            return [...coreCollections, ...userCollections]
        },
    })

    const invalidateCollectionQueries = () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.collections })
    }

    const createCollectionMutation = useMutation({
        mutationFn: async (collection: Collection) => {
            await storage.putCollection(collection)
        },
        onMutate: async (collection) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.collections })
            const previousCollections = queryClient.getQueryData<Collection[]>(
                queryKeys.collections,
            )
            queryClient.setQueryData<Collection[]>(queryKeys.collections, (prev) => [
                ...(prev ?? []),
                collection,
            ])
            return { previousCollections }
        },
        onError: (_err, _collection, context) => {
            queryClient.setQueryData(queryKeys.collections, context?.previousCollections)
        },
        onSettled: () => {
            invalidateCollectionQueries()
        },
    })

    const updateCollectionMutation = useMutation({
        mutationFn: async (updatedCollection: Collection) => {
            await storage.putCollection(updatedCollection)
        },
        onMutate: async (updatedCollection) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.collections })
            const previousCollections = queryClient.getQueryData<Collection[]>(
                queryKeys.collections,
            )
            queryClient.setQueryData<Collection[]>(queryKeys.collections, (prev) =>
                (prev ?? []).map((c) => (c.id === updatedCollection.id ? updatedCollection : c)),
            )
            return { previousCollections }
        },
        onError: (_err, _collection, context) => {
            queryClient.setQueryData(queryKeys.collections, context?.previousCollections)
        },
        onSettled: () => {
            invalidateCollectionQueries()
        },
    })

    const deleteCollectionMutation = useMutation({
        mutationFn: async (collection: Collection) => {
            await storage.deleteCollection(collection.id)
        },
        onMutate: async (collection) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.collections })
            const previousCollections = queryClient.getQueryData<Collection[]>(
                queryKeys.collections,
            )
            queryClient.setQueryData<Collection[]>(queryKeys.collections, (prev) =>
                (prev ?? []).filter((c) => c.id !== collection.id),
            )
            return { previousCollections }
        },
        onError: (_err, _collection, context) => {
            queryClient.setQueryData(queryKeys.collections, context?.previousCollections)
        },
        onSettled: () => {
            invalidateCollectionQueries()
        },
    })

    return {
        collectionsQuery,
        createCollectionMutation,
        updateCollectionMutation,
        deleteCollectionMutation,
    }
}
