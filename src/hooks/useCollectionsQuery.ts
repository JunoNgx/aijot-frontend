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
                buildCoreCollection("core-all", all, all.sortOrder, "all"),
                buildCoreCollection(
                    "core-untagged",
                    untagged,
                    untagged.sortOrder,
                    "untagged",
                ),
                buildCoreCollection(
                    "core-trash",
                    trash,
                    trash.sortOrder,
                    "trash",
                ),
            ]
            return [...coreCollections, ...userCollections]
        },
    })

    return { collectionsQuery }
}
