import PreviousVersionDialog from "@/components/PreviousVersionDialog"
import { useDialogStore } from "@/store/dialogStore"
import type { Item } from "@/types"

export function openPreviousVersionDialog(item: Item) {
    useDialogStore.getState().openDialog({
        children: <PreviousVersionDialog item={item} />,
    })
}
