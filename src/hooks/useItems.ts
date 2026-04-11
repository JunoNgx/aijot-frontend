import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { storage } from '@/db'
import { queryKeys } from '@/db/queryKeys'
import type { Item } from '@/types'

function sortItems(items: Item[]): Item[] {
    const pinnedItems = items.filter((item) => item.isPinned)
    const unpinnedItems = items.filter((item) => !item.isPinned)
    return [...pinnedItems, ...unpinnedItems]
}

export function useItems() {
    const queryClient = useQueryClient()

    const itemsQuery = useQuery({
        queryKey: queryKeys.items,
        queryFn: async () => {
            const allItems = await storage.getItems()
            const activeItems = allItems
                .filter((item) => !item.deletedAt)
                .sort((a, b) => b.jottedAt.localeCompare(a.jottedAt))
            return sortItems(activeItems)
        },
    })

    const createItem = useMutation({
        mutationFn: async (item: Item) => {
            await storage.putItem(item)
            return item
        },
        onMutate: async (item) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.items })
            const previousItems = queryClient.getQueryData<Item[]>(queryKeys.items)
            queryClient.setQueryData<Item[]>(queryKeys.items, (prev) =>
                [item, ...(prev ?? [])],
            )
            return { previousItems }
        },
        onError: (_err, _item, context) => {
            queryClient.setQueryData(queryKeys.items, context?.previousItems)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.items })
        },
    })

    return { itemsQuery, createItem }
}
