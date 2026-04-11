import { DateTime } from "luxon"

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
    const isOlderThanOneYear = DateTime.now().diff(date, "years").years >= 1
    const format = isOlderThanOneYear ? "MMM d, yyyy" : "MMM d"
    return date.toFormat(format)
}

const HEX_COLOUR_REGEX = /#[A-Fa-f0-9]{6}$/

export function isValidHexColourCode(str: string): boolean {
    return HEX_COLOUR_REGEX.test(str.slice(-7))
}
