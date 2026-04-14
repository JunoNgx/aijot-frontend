import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProfileSettingsStore } from "@/types"

export const useProfileSettings = create<ProfileSettingsStore>()(
    persist(
        (set) => ({
            userDisplayName: "User",
            shouldApplyTagsOfCurrCollection: true,
            defaultCollectionSlug: "all",
            setUserDisplayName: (userDisplayName) => set({ userDisplayName }),
            setShouldApplyTagsOfCurrCollection: (value) =>
                set({ shouldApplyTagsOfCurrCollection: value }),
            setDefaultCollectionSlug: (slug) => set({ defaultCollectionSlug: slug }),
        }),
        { name: "profileSettings" },
    ),
)
