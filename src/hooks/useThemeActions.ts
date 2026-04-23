import { useCallback } from "react"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { themes } from "@/config/themes"
import type { ThemeName } from "@/config/themes"

export function useThemeActions() {
    const setTheme = useLocalUserSettings((s) => s.setTheme)

    const randomiseTheme = useCallback(() => {
        const currentTheme = useLocalUserSettings.getState().theme
        const availableThemes = themes.filter((t) => t.name !== currentTheme)
        const pool = availableThemes.length > 0 ? availableThemes : themes
        const randomTheme = pool[Math.floor(Math.random() * pool.length)]
        setTheme(randomTheme.name as ThemeName)
    }, [setTheme])

    return { randomiseTheme }
}
