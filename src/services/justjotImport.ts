import { storage } from "@/db"
import type { Collection, Item, ItemType } from "@/types"

// ============================================================
// JustJot types
// ============================================================

export interface JustJotCollection {
    id: string
    name: string
    slug: string
    sortOrder: number
    created: string
    updated: string
}

export interface JustJotItem {
    id: string
    collection: string
    title: string
    content: string
    type: ItemType
    shouldCopyOnClick: boolean
    isTodoDone: boolean
    faviconUrl: string
    isTrashed: boolean
    trashedDateTime: string
    created: string
    updated: string
}

export interface JustJotExportData {
    exportedAt: string
    user: {
        id: string
        email: string
        username: string
        displayName: string
        userType: string
    }
    itemCollections: JustJotCollection[]
    items: JustJotItem[]
}

// ============================================================
// Parser
// ============================================================

export async function parseJustJotFile(file: File): Promise<JustJotExportData> {
    const text = await file.text()
    const data = JSON.parse(text) as JustJotExportData

    if (!Array.isArray(data.itemCollections) || !Array.isArray(data.items)) {
        throw new Error("Invalid JustJot export file")
    }

    return data
}
