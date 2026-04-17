import { useRef } from "react"
import type { ThemeName } from "@/utils/themes"

interface UseThemePreviewReturn {
    startPreview: (themeName: ThemeName) => void
    revertPreview: () => void
}

export function useThemePreview(
    originalTheme: ThemeName,
    onApplyTheme: (themeName: ThemeName) => void,
): UseThemePreviewReturn {
    const originalThemeRef = useRef(originalTheme)

    const startPreview = (themeName: ThemeName) => {
        originalThemeRef.current = originalTheme
        onApplyTheme(themeName)
    }

    const revertPreview = () => {
        onApplyTheme(originalThemeRef.current)
    }

    return {
        startPreview,
        revertPreview,
    }
}
