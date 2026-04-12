import { useMemo } from "react"
import {
    SYNTAX_PREFIX_TODO,
    SYNTAX_PREFIX_LONG_TEXT,
    SYNTAX_FLAG_TAG,
    SYNTAX_FLAG_COLLECTION,
    SYNTAX_FILTER_TYPE_TEXT,
    SYNTAX_FILTER_TYPE_LINK,
    SYNTAX_FILTER_TYPE_TODO,
    SYNTAX_FILTER_TYPE_INCOMPLETE_TODO,
    SYNTAX_SEARCH_TAG_PREFIX,
} from "@/utils/constants"
import type { FilterType, ParsedComboboxInput } from "@/types"

function isUrl(input: string): boolean {
    try {
        const url = new URL(input)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        // no protocol -- try as bare domain
    }
    try {
        const url = new URL(`https://${input}`)
        return url.hostname.includes(".") && !input.includes(" ")
    } catch {
        return false
    }
}

function detectFilterType(input: string): FilterType | undefined {
    const lower = input.toLowerCase()
    // Check ::itd:: before ::td:: to avoid substring false-match
    if (lower.includes(SYNTAX_FILTER_TYPE_INCOMPLETE_TODO)) return "incompleteTodo"
    if (lower.includes(SYNTAX_FILTER_TYPE_TODO)) return "todo"
    if (lower.includes(SYNTAX_FILTER_TYPE_TEXT)) return "text"
    if (lower.includes(SYNTAX_FILTER_TYPE_LINK)) return "link"
    return undefined
}

function extractTagSearches(input: string): string[] {
    return input
        .split(" ")
        .filter(token => token.startsWith(SYNTAX_SEARCH_TAG_PREFIX))
        .map(token => token.slice(SYNTAX_SEARCH_TAG_PREFIX.length))
        .filter(tag => tag.length > 0)
}

function parseCreationFlags(input: string): {
    content: string
    tags: string[]
    colSlug: string | undefined
} {
    const tgIndex = input.indexOf(SYNTAX_FLAG_TAG)
    const colIndex = input.indexOf(SYNTAX_FLAG_COLLECTION)

    const flagStart = Math.min(
        tgIndex === -1 ? Infinity : tgIndex,
        colIndex === -1 ? Infinity : colIndex,
    )

    if (!isFinite(flagStart)) {
        return { content: input, tags: [], colSlug: undefined }
    }

    const content = input.slice(0, flagStart).trim()
    const flagsStr = input.slice(flagStart)
    const flagSegments = flagsStr.split("::").filter(Boolean)

    const tags: string[] = []
    let colSlug: string | undefined

    for (const segment of flagSegments) {
        const words = segment.trim().split(/\s+/).filter(Boolean)
        if (words.length === 0) continue
        const [flag, ...args] = words
        if (flag === "tg") {
            tags.push(...args)
        } else if (flag === "col" && args.length > 0) {
            colSlug = args[0]
        }
    }

    return { content, tags, colSlug }
}

function parseComboboxInput(raw: string): ParsedComboboxInput {
    const trimmedInputText = raw.trim()

    const filterType = detectFilterType(trimmedInputText)
    const tagSearches = extractTagSearches(trimmedInputText)

    const isSearchMode = filterType !== undefined || tagSearches.length > 0
    if (isSearchMode) {
        let searchText = trimmedInputText
        searchText = searchText
            .replace(SYNTAX_FILTER_TYPE_INCOMPLETE_TODO, "")
            .replace(SYNTAX_FILTER_TYPE_TODO, "")
            .replace(SYNTAX_FILTER_TYPE_TEXT, "")
            .replace(SYNTAX_FILTER_TYPE_LINK, "")
            .trim()

        return {
            mode: "search",
            itemType: "text",
            content: "",
            tags: tagSearches,
            filterType,
            searchText: searchText || undefined,
        }
    }

    const { content: parsedContent, tags, colSlug } = parseCreationFlags(trimmedInputText)

    if (parsedContent.startsWith(SYNTAX_PREFIX_TODO)) {
        const textContent = parsedContent.slice(SYNTAX_PREFIX_TODO.length).trim()
        return {
            mode: "create",
            itemType: "todo",
            content: textContent,
            searchText: textContent || undefined,
            tags,
            colSlug,
        }
    }

    if (parsedContent.startsWith(SYNTAX_PREFIX_LONG_TEXT)) {
        const title = parsedContent.slice(SYNTAX_PREFIX_LONG_TEXT.length).trim()
        return {
            mode: "create",
            itemType: "text",
            content: "",
            title: title || undefined,
            searchText: title || undefined,
            tags,
            colSlug,
        }
    }

    const isUrlInput = isUrl(parsedContent)
    const normalizedContent = isUrlInput && !parsedContent.startsWith("http")
        ? `https://${parsedContent}`
        : parsedContent

    return {
        mode: "create",
        itemType: isUrlInput ? "link" : "text",
        content: normalizedContent,
        searchText: parsedContent || undefined,
        tags,
        colSlug,
    }
}

export default function useComboboxParser(input: string): ParsedComboboxInput {
    return useMemo(() => parseComboboxInput(input), [input])
}
