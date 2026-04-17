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

export function formatDatetime(
    isoString: string,
    is24HourClock = true,
): string {
    const date = DateTime.fromISO(isoString)
    const now = DateTime.now()
    if (now.diff(date, "hours").hours < 24) {
        return date.toFormat(is24HourClock ? "HH:mm" : "h:mm a")
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
    return {
        id,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
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

export function parseShortcut(shortcut: string): string[] {
    const isMac = navigator.platform.toLowerCase().includes("mac")

    return shortcut.split(/[+,]/).map((part) => {
        const lower = part.toLowerCase().trim()
        if (lower === "mod") return isMac ? "Cmd" : "Ctrl"
        if (lower === "shift") return "Shift"
        if (lower === "alt") return "Alt"
        // Keep "n" lowercase for collection jump hint, capitalize other single letters
        if (part === "n") return "n"
        if (part.length === 1) return part.toUpperCase()
        // Handle special keys - use symbols for arrows and enter
        if (lower === "arrowup") return "↑"
        if (lower === "arrowdown") return "↓"
        if (lower === "arrowleft") return "←"
        if (lower === "arrowright") return "→"
        if (lower === "backspace") return "BkSp"
        if (lower === "enter") return "↵"
        if (lower === "escape") return "Esc"
        if (lower === "home") return "Home"
        if (lower === "end") return "End"
        // For slash/question, return as-is
        if (part === "/") return "/"
        if (part === "?") return "?"
        return part
    })
}
