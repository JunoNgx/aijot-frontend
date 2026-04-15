import type { CoreCollectionConfig } from "@/types"

// ============================================================
// App
// ============================================================

export const DB_VERSION = 1

export const TRASH_PURGE_DURATION_DAY = 7
export const SOFT_DELETE_PURGE_DURATION_DAY = 60

export const BACKEND_URL = "https://aijot-backend.vercel.app"

export const DEFAULT_USERNAME = "David"

// ============================================================
// Icon props
// ============================================================

export const ICON_PROPS_HEADER = {
    size: 20,
    strokeWidth: 2,
}

export const ICON_PROPS_NORMAL = {
    size: 16,
    strokeWidth: 2,
}

export const ICON_PROPS_ACTION = {
    size: 20,
    strokeWidth: 2,
}

export const ICON_PROPS_BUTTON = {
    size: 20,
    strokeWidth: 2,
}

// ============================================================
// Routes
// ============================================================

export const ROUTE_JOT = "/jot"
export const ROUTE_COLLECTION = "/jot/:slug"
export const ROUTE_COLLECTIONS = "/collections"
export const ROUTE_SETTINGS = "/settings"
export const ROUTE_HELP = "/help"
export const ROUTE_PRIVACY = "/privacy"
export const ROUTE_TERMS = "/terms"

// ============================================================
// Core collections
// ============================================================

export const DEFAULT_ALL_COLLECTION: CoreCollectionConfig = {
    name: "Everything",
    slug: "all",
    icon: "📦",
    colour: "#d0d0d0",
}

export const DEFAULT_UNTAGGED_COLLECTION: CoreCollectionConfig = {
    name: "Untagged",
    slug: "untagged",
    icon: "🏷️",
    colour: "#f5a623",
}

export const DEFAULT_TRASH_COLLECTION: CoreCollectionConfig = {
    name: "Trash",
    slug: "trash",
    icon: "🗑️",
    colour: "#c0392b",
}

// ============================================================
// Keyboard shortcuts
// ============================================================

// Format: "mod+key", "shift+key", "mod+shift+key"
// mod = Ctrl on Windows/Linux, Cmd on Mac

export const SHORTCUT_SPOTLIGHT = ["mod+k", "mod+p"]
export const SHORTCUT_FOCUS_MAIN_INPUT = "mod+f"

export const SHORTCUT_ITEM_EDIT = "mod+e"
export const SHORTCUT_ITEM_TRASH = "mod+shift+backspace"
export const SHORTCUT_ITEM_RESTORE = "mod+alt+r"
export const SHORTCUT_ITEM_COPY = "mod+shift+c"
export const SHORTCUT_ITEM_TOGGLE_COPY_ON_CLICK = "mod+alt+4"
export const SHORTCUT_ITEM_REFETCH = "mod+alt+5"
export const SHORTCUT_ITEM_CONVERT_TO_TODO = "mod+alt+6"

export const SHORTCUT_SAVE_AND_CLOSE = "mod+s"

export const SHORTCUT_NAV_UP = "ArrowUp"
export const SHORTCUT_NAV_DOWN = "ArrowDown"
export const SHORTCUT_NAV_UP_SKIP = "shift+ArrowUp"
export const SHORTCUT_NAV_DOWN_SKIP = "shift+ArrowDown"
export const SHORTCUT_NAV_TOP = "mod+shift+ArrowUp"
export const SHORTCUT_NAV_BOTTOM = "mod+shift+ArrowDown"
export const SHORTCUT_NAV_SUBMIT = "Enter"
export const SHORTCUT_NAV_ACTION = "mod+Enter"

export const COLLECTION_HOTKEY_COUNT = 9

// ============================================================
// Input syntax prefixes
// ============================================================

export const SYNTAX_PREFIX_TODO = ":td:"
export const SYNTAX_PREFIX_LONG_TEXT = ":t:"

// Creation flags (suffixed after content)
export const SYNTAX_FLAG_TAG = "::tg"
export const SYNTAX_FLAG_COLLECTION = "::col"
export const SYNTAX_FLAG_COMMON_PREFIX = "::"

// Browse/filter syntax
export const SYNTAX_FILTER_TYPE_TEXT = "::t::"
export const SYNTAX_FILTER_TYPE_LINK = "::link::"
export const SYNTAX_FILTER_TYPE_TODO = "::td::"
export const SYNTAX_FILTER_TYPE_INCOMPLETE_TODO = "::itd::"
export const SYNTAX_FILTER_TYPE_COMPLETED_TODO = "::ctd::"
export const SYNTAX_SEARCH_TAG_PREFIX = "##"
