import ShortcutDialog from "@/components/ShortcutDialog"
import { useDialogStore } from "@/store/dialogStore"

export function openShortcutDialog() {
    useDialogStore.getState().openDialog({
        children: <ShortcutDialog />,
    })
}
