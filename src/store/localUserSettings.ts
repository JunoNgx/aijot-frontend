import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LocalUserSettingsStore } from "@/types"

const detectUse24HourClock = () => {
    const { hourCycle } = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
    }).resolvedOptions()
    return hourCycle === "h23" || hourCycle === "h24"
}

export const useLocalUserSettings = create<LocalUserSettingsStore>()(
    persist(
        (set) => ({
            theme: "JustJot Light",
            setTheme: (theme) => set({ theme }),
            fontFamily: "Space Grotesk",
            setFontFamily: (fontFamily) => set({ fontFamily }),
            fontFamilyMono: "Space Mono",
            setFontFamilyMono: (fontFamilyMono) => set({ fontFamilyMono }),
            is24HourClock: detectUse24HourClock(),
            setIs24HourClock: (value) => set({ is24HourClock: value }),
        }),
        { name: "localUserSettings" },
    ),
)
