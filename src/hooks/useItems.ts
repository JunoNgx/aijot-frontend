import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { storage } from "@/db"
import { queryKeys } from "@/db/queryKeys"
import { fetchLinkMeta } from "@/services/linkFetch"
import type { Item } from "@/types"
import { toast } from "sonner"

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

    const invalidateItemQueries = () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.items })
        queryClient.invalidateQueries({ queryKey: queryKeys.trashedItems })
    }

    const createItemMutation = useMutation({
        mutationFn: async (item: Item) => {
            await storage.putItem(item)
            return item
        },
        onMutate: async (item) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.items })
            const previousItems = queryClient.getQueryData<Item[]>(queryKeys.items)
            queryClient.setQueryData<Item[]>(queryKeys.items, (prev) => [item, ...(prev ?? [])])
            return { previousItems }
        },
        onError: (_err, _item, context) => {
            queryClient.setQueryData(queryKeys.items, context?.previousItems)
        },
        onSuccess: (item) => {
            if (item.type === "link") {
                refetchLinkMetaMutation.mutate(item)
            }
        },
        onSettled: () => {
            invalidateItemQueries()
        },
    })

    const updateItemMutation = useMutation({
        mutationFn: async (updatedItem: Item) => {
            const existingItem = await storage.getItemById(updatedItem.id)
            const shouldSavePreviousContent =
                !!existingItem &&
                updatedItem.type === "text" &&
                existingItem.content !== updatedItem.content

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
                (prev ?? []).map((i) => (i.id === updatedItem.id ? updatedItem : i)),
            )
            return { previousItems }
        },
        onError: (_err, _item, context) => {
            queryClient.setQueryData(queryKeys.items, context?.previousItems)
        },
        onSettled: () => {
            invalidateItemQueries()
        },
    })

    const trashItemMutation = useMutation({
        mutationFn: async (item: Item) => {
            const now = DateTime.now().toISO()
            await storage.putItem({ ...item, trashedAt: now, updatedAt: now })
        },
        onMutate: async (item) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.items })
            const previousItems = queryClient.getQueryData<Item[]>(queryKeys.items)
            queryClient.setQueryData<Item[]>(queryKeys.items, (prev) =>
                (prev ?? []).filter((i) => i.id !== item.id),
            )
            return { previousItems }
        },
        onSuccess: (_data, item) => {
            toast("Item moved to trash bin", {
                action: {
                    label: "Undo",
                    onClick: () => { untrashItemMutation.mutate(item) },
                }
            })
        },
        onError: (_err, _item, context) => {
            queryClient.setQueryData(queryKeys.items, context?.previousItems)
        },
        onSettled: () => {
            invalidateItemQueries()
        },
    })

    const untrashItemMutation = useMutation({
        mutationFn: async (item: Item) => {
            const { trashedAt: _trashedAt, ...restoredItem } = item
            await storage.putItem({ ...restoredItem, updatedAt: DateTime.now().toISO() })
        },
        onMutate: async (item) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.items })
            const previousItems = queryClient.getQueryData<Item[]>(queryKeys.items)
            const { trashedAt: _trashedAt, ...restoredItem } = item
            queryClient.setQueryData<Item[]>(queryKeys.items, (prev) =>
                sortItems(
                    [...(prev ?? []), restoredItem].sort((a, b) =>
                        b.jottedAt.localeCompare(a.jottedAt),
                    ),
                ),
            )
            return { previousItems }
        },
        onError: (_err, _item, context) => {
            queryClient.setQueryData(queryKeys.items, context?.previousItems)
        },
        onSettled: () => {
            invalidateItemQueries()
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
        onSuccess: (_data, item) => {
            toast("Item has been deleted", {
                action: {
                    label: "Undo",
                    onClick: () => { undeleteItemMutation.mutate(item) }
                }
            })
        },
        onError: (_err, _item, context) => {
            queryClient.setQueryData(queryKeys.items, context?.previousItems)
        },
        onSettled: () => {
            invalidateItemQueries()
        },
    })

    const undeleteItemMutation = useMutation({
        mutationFn: async (item: Item) => {
            const { deletedAt: _deletedAt, ...restoredItem } = item
            await storage.putItem({ ...restoredItem, updatedAt: DateTime.now().toISO() })
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: queryKeys.items })
            const previousItems = queryClient.getQueryData<Item[]>(queryKeys.items)
            return { previousItems }
        },
        onError: (_err, _item, context) => {
            queryClient.setQueryData(queryKeys.items, context?.previousItems)
        },
        onSettled: () => {
            invalidateItemQueries()
        },
    })

    const refetchLinkMetaMutation = useMutation({
        mutationFn: async (item: Item) => {
            if (item.type !== "link") {
                throw new Error("Item is not a link")
            }
            const meta = await fetchLinkMeta(item.content)
            const updatedItem = {
                ...item,
                title: meta.title,
                faviconUrl: meta.faviconUrl,
                updatedAt: DateTime.now().toISO(),
            }
            await storage.putItem(updatedItem)
            return updatedItem
        },
        onSettled: () => {
            invalidateItemQueries()
        },
    })

    return {
        itemsQuery,
        trashedItemsQuery,
        createItemMutation,
        updateItemMutation,
        trashItemMutation,
        untrashItemMutation,
        softDeleteItemMutation,
        undeleteItemMutation,
        refetchLinkMetaMutation,
    }
}
