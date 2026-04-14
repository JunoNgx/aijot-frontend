import { DateTime } from "luxon"
import { toast } from "sonner"
import { useItems } from "@/hooks/useItems"
import { openItemDialog } from "@/utils/openItemDialog"
import { buildItem } from "@/utils/itemFactory"
import { parseCreationData } from "@/hooks/useMainInputParser"
import type { Item } from "@/types"

export function useItemActions() {
    const {
        createItemMutation,
        updateItemMutation,
        trashItemMutation,
        untrashItemMutation,
        softDeleteItemMutation,
        refetchLinkMetaMutation,
    } = useItems()

    const createItem = (inputValue: string) => {
        const creationData = parseCreationData(inputValue)
        createItemMutation.mutate(buildItem(creationData))
    }

    const copyContent = (item: Item) => {
        navigator.clipboard.writeText(item.content)
        toast("Item content copied")
    }

    const editItem = (item: Item) => openItemDialog(item)

    const toggleTodo = (item: Item) => {
        updateItemMutation.mutate({
            ...item,
            isDone: !item.isDone,
            updatedAt: DateTime.now().toISO(),
        })
    }

    const pinItem = (item: Item) => {
        updateItemMutation.mutate({
            ...item,
            isPinned: true,
            updatedAt: DateTime.now().toISO(),
        })
    }

    const unpinItem = (item: Item) => {
        updateItemMutation.mutate({
            ...item,
            isPinned: undefined,
            updatedAt: DateTime.now().toISO(),
        })
    }

    const convertToTodo = (item: Item) => {
        updateItemMutation.mutate({
            ...item,
            type: "todo",
            title: undefined,
            updatedAt: DateTime.now().toISO(),
        })
    }

    const toggleCopyOnClick = (item: Item) => {
        updateItemMutation.mutate({
            ...item,
            shouldCopyOnClick: item.shouldCopyOnClick ? undefined : true,
            updatedAt: DateTime.now().toISO(),
        })
    }

    const refetchLinkMeta = (item: Item) => {
        refetchLinkMetaMutation.mutate(item, {
            onError: (error) => toast.error(error.message),
        })
    }

    const trashItem = (item: Item) => {
        trashItemMutation.mutate(item)
    }

    const restoreItem = (item: Item) => {
        untrashItemMutation.mutate(item)
    }

    const softDeleteItem = (item: Item) => {
        softDeleteItemMutation.mutate(item)
    }

    const triggerPrimaryAction = (item: Item) => {
        if (item.shouldCopyOnClick) {
            copyContent(item)
            return
        }
        if (item.type === "link") {
            window.open(item.content, "_blank")
            return
        }
        if (item.type === "text") {
            openItemDialog(item)
            return
        }
        if (item.type === "todo") {
            toggleTodo(item)
        }
    }

    return {
        createItem,
        triggerPrimaryAction,
        copyContent,
        editItem,
        toggleTodo,
        pinItem,
        unpinItem,
        convertToTodo,
        toggleCopyOnClick,
        refetchLinkMeta,
        trashItem,
        restoreItem,
        softDeleteItem,
    }
}
