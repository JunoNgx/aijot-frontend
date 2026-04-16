import { useEffect } from "react"
import { useLocalUserSettings } from "@/store/localUserSettings"
import type { ThemeMode } from "@/types"

function resolveColorScheme(themeMode: ThemeMode): "light" | "dark" {
    if (themeMode !== "system") return themeMode
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
}

export default function ThemeManager() {
    const themeMode = useLocalUserSettings((s) => s.themeMode)

    useEffect(() => {
        const applyColorScheme = () => {
            const colorScheme = resolveColorScheme(themeMode)
            document.documentElement.setAttribute(
                "data-color-scheme",
                colorScheme,
            )
        }

        applyColorScheme()

        if (themeMode !== "system") return
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        mediaQuery.addEventListener("change", applyColorScheme)
        return () => mediaQuery.removeEventListener("change", applyColorScheme)
    }, [themeMode])

    return null
}
