import { useQuery } from "@tanstack/react-query"
import { storage } from "@/db"
import { queryKeys } from "@/db/queryKeys"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import { buildCoreCollection } from "@/utils/helpers"
import type { Collection } from "@/types"

export function useCollectionsQuery() {
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

    return { collectionsQuery }
}
