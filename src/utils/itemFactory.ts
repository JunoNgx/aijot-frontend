import { DateTime } from "luxon"
import type { Item, MainInputCreationData } from "@/types"

export function buildItem(creationData: MainInputCreationData): Item {
    const now = DateTime.now().toISO()
    return {
        id: crypto.randomUUID(),
        createdAt: now,
        jottedAt: now,
        updatedAt: now,
        isDone: false,
        shouldCopyOnClick: false,
        isPinned: false,
        tags: creationData.tags,
        type: creationData.itemType,
        content: creationData.content,
        title: creationData.title,
    }
}
