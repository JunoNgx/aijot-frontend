import ItemDialog from "@/components/ItemDialog"
import { useDialogStore } from "@/store/dialogStore"
import type { Item } from "@/types"

export function openItemDialog(item: Item) {
    useDialogStore.getState().openDialog({ children: <ItemDialog item={item} /> })
}
