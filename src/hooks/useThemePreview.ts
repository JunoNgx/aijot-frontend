import { useState, useCallback, useRef, useEffect } from "react"
import type { ThemeName } from "@/utils/themes"

const PREVIEW_DELAY_MS = 1000

interface UseThemePreviewReturn {
    previewTheme: ThemeName | null
    startPreview: (themeName: ThemeName) => void
    commitPreview: () => void
    revertPreview: () => void
}

export function useThemePreview(
    currentTheme: ThemeName,
    onApplyTheme: (themeName: ThemeName) => void,
): UseThemePreviewReturn {
    const [previewTheme, setPreviewTheme] = useState<ThemeName | null>(null)
    const originalThemeRef = useRef<ThemeName>(currentTheme)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        originalThemeRef.current = currentTheme
    }, [currentTheme])

    const clearTimeout = useCallback(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    const startPreview = useCallback(
        (themeName: ThemeName) => {
            clearTimeout()
            setPreviewTheme(themeName)

            timeoutRef.current = setTimeout(() => {
                onApplyTheme(themeName)
            }, PREVIEW_DELAY_MS)
        },
        [onApplyTheme, clearTimeout],
    )

    const commitPreview = useCallback(() => {
        clearTimeout()
        if (previewTheme) {
            onApplyTheme(previewTheme)
        }
        setPreviewTheme(null)
    }, [previewTheme, onApplyTheme, clearTimeout])

    const revertPreview = useCallback(() => {
        clearTimeout()
        setPreviewTheme(null)
        onApplyTheme(originalThemeRef.current)
    }, [onApplyTheme, clearTimeout])

    useEffect(() => {
        return () => clearTimeout()
    }, [clearTimeout])

    return {
        previewTheme,
        startPreview,
        commitPreview,
        revertPreview,
    }
}
