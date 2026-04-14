import { DateTime } from "luxon"
import { useItems } from "@/hooks/useItems"
import type { Item } from "@/types"

export function useToggleTodo() {
    const { updateItemMutation } = useItems()

    return (item: Item) => {
        updateItemMutation.mutate({
            ...item,
            isDone: !item.isDone,
            updatedAt: DateTime.now().toISO(),
        })
    }
}
