import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { storage } from "@/db"
import { queryKeys } from "@/db/queryKeys"
import type { Item } from "@/types"

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

    const createItemMutation = useMutation({
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

    const updateItemMutation = useMutation({
        mutationFn: async (updatedItem: Item) => {
            const existingItem = await storage.getItemById(updatedItem.id)
            const shouldSavePreviousContent = !!existingItem
                && updatedItem.type === "text"
                && existingItem.content !== updatedItem.content

            const itemToStore = shouldSavePreviousContent
                ? {
                    ...updatedItem,
                    previousContent: existingItem!.content,
                    previousContentRecordedAt: DateTime.now().toISO(),
                }
                : updatedItem

            await storage.putItem(itemToStore)
        },
        onMutate: async (updatedItem) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.items })
            const previousItems = queryClient.getQueryData<Item[]>(queryKeys.items)
            queryClient.setQueryData<Item[]>(queryKeys.items, (prev) =>
                (prev ?? []).map((i) => i.id === updatedItem.id ? updatedItem : i),
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

    const softDeleteItemMutation = useMutation({
        mutationFn: async (item: Item) => {
            const now = DateTime.now().toISO()
            await storage.putItem({ ...item, deletedAt: now, updatedAt: now })
        },
        onMutate: async (item) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.items })
            const previousItems = queryClient.getQueryData<Item[]>(queryKeys.items)
            queryClient.setQueryData<Item[]>(queryKeys.items, (prev) =>
                (prev ?? []).filter((i) => i.id !== item.id),
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

    const restoreItemMutation = useMutation({
        mutationFn: async (item: Item) => {
            const { deletedAt: _deletedAt, ...restoredItem } = item
            await storage.putItem({ ...restoredItem, updatedAt: DateTime.now().toISO() })
        },
        onMutate: async (item) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.items })
            const previousItems = queryClient.getQueryData<Item[]>(queryKeys.items)
            const { deletedAt: _deletedAt, ...restoredItem } = item
            queryClient.setQueryData<Item[]>(queryKeys.items, (prev) =>
                sortItems(
                    [...(prev ?? []), restoredItem]
                        .sort((a, b) => b.jottedAt.localeCompare(a.jottedAt))
                ),
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

    const hardDeleteItemMutation = useMutation({
        mutationFn: async (itemId: string) => {
            await storage.deleteItem(itemId)
        },
        onMutate: async (itemId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.items })
            const previousItems = queryClient.getQueryData<Item[]>(queryKeys.items)
            queryClient.setQueryData<Item[]>(queryKeys.items, (prev) =>
                (prev ?? []).filter((i) => i.id !== itemId),
            )
            return { previousItems }
        },
        onError: (_err, _itemId, context) => {
            queryClient.setQueryData(queryKeys.items, context?.previousItems)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.items })
        },
    })

    return {
        itemsQuery,
        createItemMutation,
        updateItemMutation,
        softDeleteItemMutation,
        restoreItemMutation,
        hardDeleteItemMutation,
    }
}
