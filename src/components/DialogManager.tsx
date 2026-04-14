import * as Dialog from "@radix-ui/react-dialog"
import { useDialogStore } from "@/store/dialogStore"
import styles from "./DialogManager.module.scss"

export default function DialogManager() {
    const isOpen = useDialogStore((s) => s.isOpen)
    const children = useDialogStore((s) => s.children)
    const closeAllDialogs = useDialogStore((s) => s.closeAllDialogs)

    const handleOpenChange = (open: boolean) => {
        if (!open) closeAllDialogs()
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.DialogManager__Overlay} />
                <Dialog.Content
                    aria-describedby={undefined}
                    className={styles.DialogManager__Content}
                >
                    <Dialog.Title className={styles.DialogManager__Title}>
                        Dialog
                    </Dialog.Title>
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
