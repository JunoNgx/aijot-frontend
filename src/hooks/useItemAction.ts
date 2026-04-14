import { DateTime } from "luxon"
import { useItems } from "@/hooks/useItems"
import type { Item } from "@/types"
import { toast } from "sonner"

export function useItemAction() {
    const { updateItemMutation } = useItems()

    const toggleTodo = (item: Item) => {
        updateItemMutation.mutate({
            ...item,
            isDone: !item.isDone,
            updatedAt: DateTime.now().toISO(),
        })
    }

    const copyContent = (item: Item) => {
        toast("Item content copied")
        navigator.clipboard.writeText(item.content)
    }

    return { toggleTodo, copyContent }
}
