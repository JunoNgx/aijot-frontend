import { DateTime } from "luxon"
import type { Item, Collection, CoreCollectionConfig } from "@/types"

export function generateSlug(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

export function formatJottedAt(
    isoString: string,
    use24HourClock = true,
): string {
    const date = DateTime.fromISO(isoString)
    const now = DateTime.now()
    if (now.diff(date, "hours").hours < 24) {
        return date.toFormat(use24HourClock ? "HH:mm" : "h:mm a")
    }
    if (now.diff(date, "years").years < 1) return date.toFormat("MMM d")
    return date.toFormat("MMM d, yyyy")
}

const HEX_COLOUR_REGEX = /#[A-Fa-f0-9]{6}$/

export function isValidHexColourCode(str: string): boolean {
    return HEX_COLOUR_REGEX.test(str.slice(-7))
}

export function sortItems(items: Item[]): Item[] {
    const pinnedItems = items.filter((item) => item.isPinned)
    const unpinnedItems = items.filter((item) => !item.isPinned)
    return [...pinnedItems, ...unpinnedItems]
}

export function buildCoreCollection(
    id: string,
    config: CoreCollectionConfig,
    sortOrder: number,
    coreType: Collection["coreType"],
): Collection {
    const now = DateTime.now().toISO()
    return {
        id,
        createdAt: now,
        updatedAt: now,
        name: config.name,
        icon: config.icon,
        colour: config.colour,
        slug: config.slug,
        sortOrder,
        tags: [],
        types: ["text", "todo", "link"],
        coreType,
    }
}
