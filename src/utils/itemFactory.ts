import { DateTime } from "luxon"
import { generateId } from "@/utils/uuid"
import type { Item, MainInputCreationData } from "@/types"

export function buildItem(creationData: MainInputCreationData): Item {
    const now = DateTime.now().toISO()
    return {
        id: generateId(),
        createdAt: now,
        jottedAt: now,
        updatedAt: now,
        tags: creationData.tags,
        type: creationData.itemType,
        content: creationData.content,
        title: creationData.title,
    }
}
