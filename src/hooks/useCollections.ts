import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { storage } from '@/db'
import { queryKeys } from '@/db/queryKeys'
import { useCoreCollectionSettings } from '@/store/coreCollectionSettings'
import type { Collection, CoreCollectionConfig } from '@/types'

function buildCoreCollection(
    id: string,
    config: CoreCollectionConfig,
    sortOrder: number,
    coreType: Collection['coreType'],
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
        types: ['text', 'todo', 'link'],
        coreType,
    }
}

export function useCollections() {
    const { all, untagged, trash } = useCoreCollectionSettings()

    const collectionsQuery = useQuery({
        queryKey: queryKeys.collections,
        queryFn: async () => {
            const userCollections = await storage.getCollections()
            const coreCollections: Collection[] = [
                buildCoreCollection('core-all', all, -3, 'all'),
                buildCoreCollection('core-untagged', untagged, -2, 'untagged'),
                buildCoreCollection('core-trash', trash, -1, 'trash'),
            ]
            return [...coreCollections, ...userCollections]
        },
    })

    return { collectionsQuery }
}
