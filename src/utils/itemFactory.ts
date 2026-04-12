import { DateTime } from "luxon"
import { v4 as uuidv4 } from "uuid"
import type { Item, MainInputCreationData } from "@/types"

export function buildItem(creationData: MainInputCreationData): Item {
    const now = DateTime.now().toISO()
    return {
        id: uuidv4(),
        createdAt: now,
        jottedAt: now,
        updatedAt: now,
        tags: creationData.tags,
        type: creationData.itemType,
        content: creationData.content,
        title: creationData.title,
    }
}
