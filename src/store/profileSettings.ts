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
            use24HourClock: detectUse24HourClock(),
            setUserDisplayName: (userDisplayName) => set({ userDisplayName }),
            setShouldApplyTagsOfCurrCollection: (value) =>
                set({ shouldApplyTagsOfCurrCollection: value }),
            setDefaultCollectionSlug: (slug) =>
                set({ defaultCollectionSlug: slug }),
            setUse24HourClock: (value) => set({ use24HourClock: value }),
        }),
        { name: "profileSettings" },
    ),
)
