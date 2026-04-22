import { storage } from "@/db"
import type { Collection, Item, ItemType } from "@/types"

// ============================================================
// Random icon helper (mirrors CollectionDialog)
// ============================================================

const RANDOM_ICONS = [
    "💼", "🏠", "📚", "🎯", "💡", "✈️", "🍽️", "💰", "🎵", "🎬",
    "🏋️", "🌱", "💻", "🎮", "🛒", "❤️", "📸", "🎓", "🔬", "🎁",
]

function getRandomIcon(): string {
    return RANDOM_ICONS[Math.floor(Math.random() * RANDOM_ICONS.length)]
}

const ALL_TYPES: ItemType[] = ["text", "todo", "link"]

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

// ============================================================
// Collision resolver
// ============================================================

export function resolveSlugCollisions(
    slug: string,
    existingSlugs: Set<string>,
): string {
    if (!existingSlugs.has(slug)) {
        return slug
    }

    let counter = 1
    let candidate = `${slug}-imported`

    while (existingSlugs.has(candidate)) {
        counter += 1
        candidate = `${slug}-imported-${counter}`
    }

    return candidate
}

// ============================================================
// Transformer
// ============================================================

export async function transformJustJotToAijot(
    data: JustJotExportData,
): Promise<{ collections: Collection[]; items: Item[] }> {
    const existingCollections = await storage.getCollections()
    const existingSlugs = new Set(existingCollections.map((c) => c.slug))

    const slugMap = new Map<string, string>()

    const collections: Collection[] = data.itemCollections.map((jc) => {
        const resolvedSlug = resolveSlugCollisions(jc.slug, existingSlugs)
        slugMap.set(jc.id, resolvedSlug)
        existingSlugs.add(resolvedSlug)

        return {
            id: jc.id,
            name: jc.name,
            slug: resolvedSlug,
            sortOrder: jc.sortOrder,
            tags: [resolvedSlug],
            types: [...ALL_TYPES],
            icon: getRandomIcon(),
            colour: "#000000",
            createdAt: jc.created,
            updatedAt: jc.updated,
        }
    })

    const items: Item[] = data.items
        .filter((ji) => !ji.isTrashed)
        .map((ji) => {
            const collectionSlug = slugMap.get(ji.collection) ?? ji.collection

            return {
                id: ji.id,
                title: ji.title.trim() || undefined,
                content: ji.content,
                type: ji.type,
                shouldCopyOnClick: ji.shouldCopyOnClick,
                isDone: ji.isTodoDone,
                faviconUrl: ji.faviconUrl.trim() || undefined,
                tags: [collectionSlug],
                createdAt: ji.created,
                updatedAt: ji.updated,
                jottedAt: ji.created,
            }
        })

    return { collections, items }
}
