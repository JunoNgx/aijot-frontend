import { useState, useEffect, useRef } from "react"
import { Command } from "cmdk"
import * as Dialog from "@radix-ui/react-dialog"
import { useHotkeys } from "react-hotkeys-hook"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import { themes } from "@/utils/themes"
import type { ThemeName } from "@/utils/themes"
import styles from "./CommandPalette.module.scss"
import { ICON_PROPS_NORMAL } from "@/utils/constants"
import { IconCheck } from "@tabler/icons-react"

export type CommandPaletteMode = "main" | "theme"

interface CommandPaletteProps {
    mode: CommandPaletteMode
    onModeChange: (mode: CommandPaletteMode) => void
    onClose: () => void
}

export default function CommandPalette({
    mode,
    onModeChange,
    onClose,
}: CommandPaletteProps) {
    const [search, setSearch] = useState("")
    const currentTheme = useLocalUserSettings((s) => s.theme)
    const setTheme = useLocalUserSettings((s) => s.setTheme)
    const originalThemeRef = useRef(currentTheme)
    const {
        navigateToJot,
        navigateToCollections,
        navigateToSettings,
        navigateToHelp,
    } = useNavigateRoutes()

    const handleThemeHover = (themeName: ThemeName) => {
        setTheme(themeName)
    }

    const handleThemeLeave = () => {
        setTheme(originalThemeRef.current)
    }

    const revertTheme = () => {
        setTheme(originalThemeRef.current)
    }

    useEffect(() => {
        if (mode !== "theme") return
        originalThemeRef.current = currentTheme
        setTheme(currentTheme)
    }, [mode, currentTheme, setTheme])

    const handleThemeSelect = (themeName: ThemeName) => {
        setTheme(themeName)
        onClose()
    }

    useHotkeys("Escape", () => {
        if (mode === "theme") {
            revertTheme()
        }
        onClose()
    })

    const handleNavigate = (navigateFn: () => void) => {
        navigateFn()
        onClose()
    }

    const renderMainContent = () => (
        <>
            <div className={styles.CommandPalette__Section}>
                <p className={styles.CommandPalette__SectionLabel}>
                    Navigation
                </p>
                <Command.Item
                    className={styles.CommandPalette__Item}
                    onSelect={() => handleNavigate(navigateToJot)}
                >
                    Go to Jot
                </Command.Item>
                <Command.Item
                    className={styles.CommandPalette__Item}
                    onSelect={() => handleNavigate(navigateToCollections)}
                >
                    Go to Collections
                </Command.Item>
                <Command.Item
                    className={styles.CommandPalette__Item}
                    onSelect={() => handleNavigate(navigateToSettings)}
                >
                    Go to Settings
                </Command.Item>
                <Command.Item
                    className={styles.CommandPalette__Item}
                    onSelect={() => handleNavigate(navigateToHelp)}
                >
                    Help Guide
                </Command.Item>
            </div>
            <div className={styles.CommandPalette__Section}>
                <p className={styles.CommandPalette__SectionLabel}>Actions</p>
                <Command.Item
                    className={styles.CommandPalette__Item}
                    onSelect={() => onModeChange("theme")}
                >
                    Change Theme...
                </Command.Item>
            </div>
        </>
    )

    const renderThemeContent = () => (
        <>
            <div className={styles.CommandPalette__Section}>
                <p className={styles.CommandPalette__SectionLabel}>Theme</p>
                {themes.map((theme) => (
                    <Command.Item
                        key={theme.name}
                        className={styles.CommandPalette__Item}
                        onSelect={() =>
                            handleThemeSelect(theme.name as ThemeName)
                        }
                        onMouseEnter={() =>
                            handleThemeHover(theme.name as ThemeName)
                        }
                        onMouseLeave={handleThemeLeave}
                    >
                        <span>
                            {theme.name.charAt(0).toUpperCase() +
                                theme.name.slice(1)}
                        </span>
                        {theme.name === originalThemeRef.current && (
                            <span className={styles.CommandPalette__Check}>
                                <IconCheck {...ICON_PROPS_NORMAL} />
                            </span>
                        )}
                    </Command.Item>
                ))}
            </div>
        </>
    )

    return (
        <Dialog.Content
            className={styles.CommandPalette__Content}
            aria-describedby={undefined}
            onInteractOutside={() => {
                if (mode === "theme") {
                    revertTheme()
                }
            }}
        >
            <Dialog.Title className="VisuallyHidden">
                Command Palette
            </Dialog.Title>
            <Command
                className={styles.CommandPalette__Command}
                value={search}
                onValueChange={setSearch}
            >
                <Command.Input
                    className={styles.CommandPalette__Input}
                    placeholder={
                        mode === "theme" ? "Search theme..." : "Search..."
                    }
                    autoFocus
                />
                <Command.List className={styles.CommandPalette__List}>
                    <Command.Empty className={styles.CommandPalette__Empty}>
                        No results found.
                    </Command.Empty>
                    {mode === "main" && renderMainContent()}
                    {mode === "theme" && renderThemeContent()}
                </Command.List>
            </Command>
        </Dialog.Content>
    )
}
