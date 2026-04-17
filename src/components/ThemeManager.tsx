import { useEffect } from "react"
import { useLocalUserSettings } from "@/store/localUserSettings"
import type { ThemeMode } from "@/types"

function resolveColorScheme(theme: ThemeMode): "light" | "dark" {
    if (theme !== "system") return theme
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
}

export default function ThemeManager() {
    const theme = useLocalUserSettings((s) => s.theme)

    useEffect(() => {
        const applyColorScheme = () => {
            const colorScheme = resolveColorScheme(theme)
            document.documentElement.setAttribute(
                "data-color-scheme",
                colorScheme,
            )
        }

        applyColorScheme()

        if (theme !== "system") return
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        mediaQuery.addEventListener("change", applyColorScheme)
        return () => mediaQuery.removeEventListener("change", applyColorScheme)
    }, [theme])

    return null
}
