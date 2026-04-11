import type { CoreCollectionConfig } from '../types'

// ============================================================
// App
// ============================================================

export const SOFT_DELETE_PURGE_DURATION_DAY = 60

export const BACKEND_URL = 'https://aijot-backend.vercel.app'

// ============================================================
// Core collections
// ============================================================

export const DEFAULT_ALL_COLLECTION: CoreCollectionConfig = {
    name: 'Everything',
    slug: 'all',
    icon: '📦',
    colour: '#d0d0d0',
}

export const DEFAULT_UNTAGGED_COLLECTION: CoreCollectionConfig = {
    name: 'Untagged',
    slug: 'untagged',
    icon: '🏷️',
    colour: '#f5a623',
}

export const DEFAULT_TRASH_COLLECTION: CoreCollectionConfig = {
    name: 'Trash',
    slug: 'trash',
    icon: '🗑️',
    colour: '#c0392b',
}

// ============================================================
// Keyboard shortcuts
// ============================================================

// Format follows Mantine's getHotkeyHandler convention: "mod+key"
// mod = Ctrl on Windows/Linux, Cmd on Mac

export const SHORTCUT_SPOTLIGHT = ['mod+k', 'mod+p']

export const SHORTCUT_ITEM_EDIT = 'mod+e'
export const SHORTCUT_ITEM_TRASH = 'mod+shift+backspace'
export const SHORTCUT_ITEM_RESTORE = 'mod+alt+r'
export const SHORTCUT_ITEM_COPY = 'mod+shift+c'
export const SHORTCUT_ITEM_TOGGLE_COPY_ON_CLICK = 'mod+alt+4'
export const SHORTCUT_ITEM_REFETCH = 'mod+alt+5'
export const SHORTCUT_ITEM_CONVERT_TO_TODO = 'mod+alt+6'

export const SHORTCUT_SAVE_AND_CLOSE = 'mod+s'

export const SHORTCUT_NAV_UP = 'ArrowUp'
export const SHORTCUT_NAV_DOWN = 'ArrowDown'
export const SHORTCUT_NAV_UP_SKIP = 'shift+ArrowUp'
export const SHORTCUT_NAV_DOWN_SKIP = 'shift+ArrowDown'
export const SHORTCUT_NAV_TOP = 'mod+shift+ArrowUp'
export const SHORTCUT_NAV_BOTTOM = 'mod+shift+ArrowDown'
export const SHORTCUT_NAV_SUBMIT = 'Enter'
export const SHORTCUT_NAV_ACTION = 'mod+Enter'

export const COLLECTION_HOTKEY_COUNT = 9
