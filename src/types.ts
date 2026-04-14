import type { ReactNode } from "react"

// ============================================================
// Item
// ============================================================

export type ItemType = "text" | "todo" | "link"
export type FilterType = ItemType | "incompleteTodo" | "completedTodo"

export interface Item {
    id: string
    createdAt: string
    jottedAt: string
    updatedAt: string
    trashedAt?: string
    deletedAt?: string
    title?: string
    content: string
    type: ItemType
    isDone?: boolean
    faviconUrl?: string
    shouldCopyOnClick?: boolean
    isPinned?: boolean
    tags: string[]
    previousContent?: string
    previousContentRecordedAt?: string
}

// Client-only flag used during optimistic creates
export interface PendingItem extends Item {
    isPending: true
}

// ============================================================
// Collection
// ============================================================

export type CoreCollectionType = "all" | "untagged" | "trash"

export interface Collection {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    icon: string
    colour: string
    slug: string
    sortOrder: number
    tags: string[]
    types: ItemType[]
    // Not stored in DB; set on core collections only
    coreType?: CoreCollectionType
}

// ============================================================
// Zustand store shapes
// ============================================================

export type ThemeMode = "system" | "light" | "dark"

export interface LocalUserSettingsStore {
    themeMode: ThemeMode
    setThemeMode: (mode: ThemeMode) => void
}

export interface LocalAppDataStore {
    shouldShowDemoDataBanner: boolean
    setShouldShowDemoDataBanner: (value: boolean) => void
}

export type SyncStatus = "idle" | "syncing" | "error"

export interface AuthToken {
    id: "google"
    accessToken: string
    expiresAt: string
    email: string
}

export interface LocalSyncDataStore {
    authToken?: AuthToken
    driveFolderId?: string
    lastSyncTime?: string
    syncStatus: SyncStatus
    syncError?: string
    setAuthToken: (token: AuthToken | undefined) => void
    setDriveFolderId: (id: string | undefined) => void
    setLastSyncTime: (time: string) => void
    setSyncStatus: (status: SyncStatus) => void
    setSyncError: (error: string | undefined) => void
}

export interface ProfileSettingsStore {
    userDisplayName: string
    shouldApplyTagsOfCurrCollection: boolean
    setUserDisplayName: (name: string) => void
    setShouldApplyTagsOfCurrCollection: (value: boolean) => void
}

export interface CoreCollectionConfig {
    name: string
    slug: string
    icon: string
    colour: string
}

export interface DialogStore {
    isOpen: boolean
    children: ReactNode | null
    openDialog: (options: { children: ReactNode }) => void
    closeAllDialogs: () => void
}

export interface CoreCollectionSettingsStore {
    all: CoreCollectionConfig
    untagged: CoreCollectionConfig
    trash: CoreCollectionConfig
    setAll: (config: Partial<CoreCollectionConfig>) => void
    setUntagged: (config: Partial<CoreCollectionConfig>) => void
    setTrash: (config: Partial<CoreCollectionConfig>) => void
}

// ============================================================
// Main input parser output
// ============================================================

export interface MainInputSearchData {
    filterType?: FilterType
    tags: string[]
    searchText?: string
}

export interface MainInputCreationData {
    itemType: ItemType
    content: string
    title?: string
    tags: string[]
    colSlugs: string[]
}

// ============================================================
// Export / Import
// ============================================================

export interface ExportSettings {
    profile: {
        userDisplayName: string
        shouldApplyTagsOfCurrCollection: boolean
    }
    coreCollections: {
        all: CoreCollectionConfig
        untagged: CoreCollectionConfig
        trash: CoreCollectionConfig
    }
}

export interface ImportSummary {
    newItems: number
    updatedItems: number
    newCollections: number
    updatedCollections: number
}

export interface ExportData {
    version: number
    exportedAt: string
    items: Item[]
    collections: Collection[]
    settings: ExportSettings
}

// ============================================================
// Link fetch
// ============================================================

export interface LinkFetchResult {
    title: string
    faviconUrl: string
}
