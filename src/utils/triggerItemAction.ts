import { openItemDialog } from "@/utils/openItemDialog"
import type { Item } from "@/types"

export function triggerItemAction(item: Item) {
    if (item.shouldCopyOnClick) {
        navigator.clipboard.writeText(item.content)
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
        return
    }
}
