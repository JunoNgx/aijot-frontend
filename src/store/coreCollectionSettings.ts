import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CoreCollectionSettingsStore } from "@/types"
import {
    DEFAULT_ALL_COLLECTION,
    DEFAULT_UNTAGGED_COLLECTION,
    DEFAULT_TRASH_COLLECTION,
} from "@/utils/constants"

export const useCoreCollectionSettings = create<CoreCollectionSettingsStore>()(
    persist(
        (set) => ({
            all: DEFAULT_ALL_COLLECTION,
            untagged: DEFAULT_UNTAGGED_COLLECTION,
            trash: DEFAULT_TRASH_COLLECTION,
            setAll: (config) =>
                set((state) => ({ all: { ...state.all, ...config } })),
            setUntagged: (config) =>
                set((state) => ({
                    untagged: { ...state.untagged, ...config },
                })),
            setTrash: (config) =>
                set((state) => ({ trash: { ...state.trash, ...config } })),
        }),
        { name: "coreCollectionSettings" },
    ),
)
