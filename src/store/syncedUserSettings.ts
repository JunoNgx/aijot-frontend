import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SyncedUserSettingsStore } from "@/types"
import { DEFAULT_USERNAME } from "@/config/constants"

export const useSyncedUserSettings = create<SyncedUserSettingsStore>()(
    persist(
        (set) => ({
            userDisplayName: DEFAULT_USERNAME,
            shouldApplyTagsOfCurrCollection: true,
            defaultCollectionSlug: "all",
            shouldCustomSortCollections: true,
            shouldShowJotItemExtraInfo: false,
            setUserDisplayName: (userDisplayName) => set({ userDisplayName }),
            setShouldApplyTagsOfCurrCollection: (value) =>
                set({ shouldApplyTagsOfCurrCollection: value }),
            setDefaultCollectionSlug: (slug) =>
                set({ defaultCollectionSlug: slug }),
            setShouldCustomSortCollections: (value) =>
                set({ shouldCustomSortCollections: value }),
            setShouldShowJotItemExtraInfo: (value) =>
                set({ shouldShowJotItemExtraInfo: value }),
        }),
        { name: "syncedUserSettings" },
    ),
)
