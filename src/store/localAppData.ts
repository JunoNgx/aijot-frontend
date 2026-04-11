import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LocalAppDataStore } from "@/types"

export const useLocalAppData = create<LocalAppDataStore>()(
    persist(
        (set) => ({
            shouldShowDemoDataBanner: true,
            setShouldShowDemoDataBanner: (value) => set({ shouldShowDemoDataBanner: value }),
        }),
        { name: "localAppData" },
    ),
)
