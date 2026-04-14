import { DateTime } from "luxon"
import type { Item } from "@/types"

export function generateSlug(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

export function formatJottedAt(isoString: string): string {
    const date = DateTime.fromISO(isoString)
    const now = DateTime.now()
    if (now.diff(date, "hours").hours < 24) return date.toFormat("HH:mm")
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
