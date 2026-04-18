import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProfileSettingsStore } from "@/types"
import { DEFAULT_USERNAME } from "@/utils/constants"

const detectUse24HourClock = () => {
    const { hourCycle } = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
    }).resolvedOptions()
    return hourCycle === "h23" || hourCycle === "h24"
}

export const useProfileSettings = create<ProfileSettingsStore>()(
    persist(
        (set) => ({
            userDisplayName: DEFAULT_USERNAME,
            shouldApplyTagsOfCurrCollection: true,
            defaultCollectionSlug: "all",
            is24HourClock: detectUse24HourClock(),
            shouldCustomSortCollections: true,
            setUserDisplayName: (userDisplayName) => set({ userDisplayName }),
            setShouldApplyTagsOfCurrCollection: (value) =>
                set({ shouldApplyTagsOfCurrCollection: value }),
            setDefaultCollectionSlug: (slug) =>
                set({ defaultCollectionSlug: slug }),
            setIs24HourClock: (value) => set({ is24HourClock: value }),
            setShouldCustomSortCollections: (value) =>
                set({ shouldCustomSortCollections: value }),
        }),
        { name: "profileSettings" },
    ),
)
