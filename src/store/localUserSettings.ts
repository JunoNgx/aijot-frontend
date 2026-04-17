import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LocalUserSettingsStore } from "@/types"

export const useLocalUserSettings = create<LocalUserSettingsStore>()(
    persist(
        (set) => ({
            theme: "light",
            setTheme: (theme) => set({ theme }),
        }),
        { name: "localUserSettings" },
    ),
)
