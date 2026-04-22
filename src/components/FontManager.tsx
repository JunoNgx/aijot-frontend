import { useEffect } from "react"
import { useLocalUserSettings } from "@/store/localUserSettings"

export default function FontManager() {
    const fontFamily = useLocalUserSettings((s) => s.fontFamily)
    const fontFamilyMono = useLocalUserSettings((s) => s.fontFamilyMono)

    useEffect(() => {
        const root = document.documentElement
        root.style.setProperty("--fontFamily", `"${fontFamily}", sans-serif`)
        root.style.setProperty(
            "--fontFamilyMono",
            `"${fontFamilyMono}", monospace`,
        )
    }, [fontFamily, fontFamilyMono])

    return null
}
