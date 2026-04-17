import { useEffect } from "react"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { themes } from "@/utils/themes"

function applyThemeColors(colors: (typeof themes)[number]) {
    const root = document.documentElement
    root.style.setProperty("--colBg", colors.colBg)
    root.style.setProperty("--colMain", colors.colMain)
    root.style.setProperty("--colSub", colors.colSub)
    root.style.setProperty("--colBgSub", colors.colBgSub)
    root.style.setProperty("--colText", colors.colText)
    root.style.setProperty("--colDanger", colors.colDanger)
}

export default function ThemeManager() {
    const theme = useLocalUserSettings((s) => s.theme)

    useEffect(() => {
        const foundTheme = themes.find((t) => t.name === theme)
        if (foundTheme) {
            applyThemeColors(foundTheme)
        }
    }, [theme])

    return null
}
