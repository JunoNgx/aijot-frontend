import { useQuery } from "@tanstack/react-query"
import { storage } from "@/db"
import { queryKeys } from "@/db/queryKeys"
import { sortItems } from "@/utils/helpers"

export function useItemsQuery() {
    const itemsQuery = useQuery({
        queryKey: queryKeys.items,
        queryFn: async () => {
            const allItems = await storage.getItems()
            const activeItems = allItems
                .filter((item) => !item.trashedAt && !item.deletedAt)
                .sort((a, b) => b.jottedAt.localeCompare(a.jottedAt))
            return sortItems(activeItems)
        },
    })

    const trashedItemsQuery = useQuery({
        queryKey: queryKeys.trashedItems,
        queryFn: async () => {
            const allItems = await storage.getItems()
            return allItems
                .filter((item) => !!item.trashedAt && !item.deletedAt)
                .sort((a, b) => b.trashedAt!.localeCompare(a.trashedAt!))
        },
    })

    return { itemsQuery, trashedItemsQuery }
}
