import { useEffect } from "react"
import AppRoutes from "@/routes"
import Header from "@/components/Header"
import { purgeExpiredItems } from "@/db"
import { useLocalUserSettings } from "@/store/localUserSettings"

function resolveColorScheme(
    themeMode: "system" | "light" | "dark",
): "light" | "dark" {
    if (themeMode !== "system") return themeMode
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
}

export default function App() {
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

    useEffect(() => {
        purgeExpiredItems()

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                purgeExpiredItems()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            )
        }
    }, [])

    return (
        <>
            <Header />
            <AppRoutes />
        </>
    )
}
