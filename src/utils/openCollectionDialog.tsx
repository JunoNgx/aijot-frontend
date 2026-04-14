import CollectionDialog from "@/components/CollectionDialog"
import { useDialogStore } from "@/store/dialogStore"
import type { Collection } from "@/types"

export function openCollectionDialog(collection?: Collection) {
    useDialogStore
        .getState()
        .openDialog({ children: <CollectionDialog collection={collection} /> })
}
