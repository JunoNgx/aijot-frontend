import ItemDialog from "@/components/ItemDialog"
import { useDialogStore } from "@/store/dialogStore"
import type { Item } from "@/types"

export function openItemDialog(item: Item) {
    const previousFocus = document.activeElement as HTMLElement | null
    useDialogStore.getState().openDialog({
        children: <ItemDialog item={item} onClose={() => previousFocus?.focus()} />,
    })
}
