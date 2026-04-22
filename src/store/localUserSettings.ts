import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LocalUserSettingsStore } from "@/types"

export const useLocalUserSettings = create<LocalUserSettingsStore>()(
    persist(
        (set) => ({
            theme: "JustJot Light",
            setTheme: (theme) => set({ theme }),
            fontFamily: "Space Grotesk",
            setFontFamily: (fontFamily) => set({ fontFamily }),
            fontFamilyMono: "Space Mono",
            setFontFamilyMono: (fontFamilyMono) => set({ fontFamilyMono }),
        }),
        { name: "localUserSettings" },
    ),
)
