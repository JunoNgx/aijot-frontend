import { useState, useRef, useLayoutEffect, useEffect } from "react"
import { Command } from "cmdk"
import * as Dialog from "@radix-ui/react-dialog"
import { useHotkeys } from "react-hotkeys-hook"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import { useLocation } from "react-router-dom"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { useProfileSettings } from "@/store/profileSettings"
import { openCollectionDialog } from "@/utils/openCollectionDialog"
import { themes } from "@/utils/themes"
import type { ThemeName } from "@/utils/themes"
import styles from "./CommandPalette.module.scss"
import { ICON_PROPS_NORMAL, ROUTE_JOT } from "@/utils/constants"
import {
    IconWritingSign,
    IconStack2,
    IconSettings,
    IconHelp,
    IconPalette,
    IconCheck,
    IconPlus,
} from "@tabler/icons-react"

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
    const [searchText, setSearchText] = useState("")
    const currentTheme = useLocalUserSettings((s) => s.theme)
    const setTheme = useLocalUserSettings((s) => s.setTheme)
    const originalThemeRef = useRef(currentTheme)
    const {
        navigateToJot,
        navigateToCollection,
        navigateToCollections,
        navigateToSettings,
        navigateToHelp,
    } = useNavigateRoutes()

    const location = useLocation()
    const pathParts = location.pathname.split("/")
    const isInJot = location.pathname.startsWith(ROUTE_JOT)
    const currentSlug = isInJot && pathParts[2] ? pathParts[2] : null
    const defaultCollectionSlug = useProfileSettings(
        (s) => s.defaultCollectionSlug,
    )
    const setDefaultCollectionSlug = useProfileSettings(
        (s) => s.setDefaultCollectionSlug,
    )
    const { collectionsQuery } = useCollectionsQuery()
    const collections = collectionsQuery.data ?? []

    const isMainMode = mode === "main"
    const isThemeMode = mode === "theme"
    const searchPlaceholder = isThemeMode ? "Search theme..." : "Search..."
    const shouldFilter = isMainMode

    const isInCollection = isInJot && currentSlug
    const shouldIncludeSetDefaultAction =
        isInCollection && defaultCollectionSlug !== currentSlug

    const handleNavigation = (action: () => void) => {
        action()
        onClose()
    }

    const handleThemeSelect = (themeName: ThemeName) => {
        setTheme(themeName)
        onClose()
    }

    const revertThemePreview = () => {
        if (mode !== "theme") return
        setTheme(originalThemeRef.current)
    }

    useLayoutEffect(() => {
        if (mode !== "theme") return
        originalThemeRef.current = currentTheme
    }, [])

    useEffect(() => {
        if (mode === "theme") {
            revertThemePreview()
        }
    }, [mode])

    useHotkeys("Escape", () => {
        revertThemePreview()
        onClose()
    })

    const collectionsGroup = (
        <Command.Group
            heading="Collections"
            className={styles.CommandPalette__Group}
        >
            {collections.map((collection) => (
                <Command.Item
                    key={collection.slug}
                    value={`${collection.name} ${collection.slug}`}
                    className={styles.CommandPalette__Item}
                    onSelect={() =>
                        handleNavigation(() =>
                            navigateToCollection(collection.slug),
                        )
                    }
                >
                    <span>{collection.icon}</span>
                    <div className={styles.CommandPalette__ItemContent}>
                        <span className={styles.CommandPalette__LabelLine}>
                            <span
                                className={styles.CommandPalette__ColourBlock}
                                style={{ backgroundColor: collection.colour }}
                            />
                            {collection.name}
                        </span>
                        <span className={styles.CommandPalette__SubLabel}>
                            /{collection.slug}
                        </span>
                    </div>
                </Command.Item>
            ))}
        </Command.Group>
    )

    const createCollectionItem = (
        <Command.Item
            value="create collection"
            className={styles.CommandPalette__Item}
            onSelect={() => handleNavigation(() => openCollectionDialog())}
        >
            <IconPlus {...ICON_PROPS_NORMAL} />
            <div className={styles.CommandPalette__ItemContent}>
                <span className={styles.CommandPalette__LabelLine}>
                    Create new collection
                </span>
            </div>
        </Command.Item>
    )

    const setDefaultItem = shouldIncludeSetDefaultAction && (
        <Command.Item
            value={`set ${currentSlug} as default`}
            className={styles.CommandPalette__Item}
            onSelect={() =>
                handleNavigation(() => setDefaultCollectionSlug(currentSlug!))
            }
        >
            <IconCheck {...ICON_PROPS_NORMAL} />
            <div className={styles.CommandPalette__ItemContent}>
                <span className={styles.CommandPalette__LabelLine}>
                    Set "{currentSlug}" as default
                </span>
            </div>
        </Command.Item>
    )

    const editCollectionItem = isInCollection && (
        <Command.Item
            value="edit current collection"
            className={styles.CommandPalette__Item}
            onSelect={() => {
                const collection = collections.find(
                    (c) => c.slug === currentSlug,
                )
                if (collection) {
                    handleNavigation(() => openCollectionDialog(collection))
                }
            }}
        >
            <IconSettings {...ICON_PROPS_NORMAL} />
            <div className={styles.CommandPalette__ItemContent}>
                <span className={styles.CommandPalette__LabelLine}>
                    Edit current collection
                </span>
            </div>
        </Command.Item>
    )

    const collectionActionsGroup = (
        <Command.Group
            heading="Collection Actions"
            className={styles.CommandPalette__Group}
        >
            {createCollectionItem}
            {setDefaultItem}
            {editCollectionItem}
        </Command.Group>
    )

    const goToJotItem = (
        <Command.Item
            value="go to jot"
            className={styles.CommandPalette__Item}
            onSelect={() => handleNavigation(navigateToJot)}
        >
            <IconWritingSign {...ICON_PROPS_NORMAL} />
            <div className={styles.CommandPalette__ItemContent}>
                <span className={styles.CommandPalette__LabelLine}>
                    Go to Jot
                </span>
            </div>
        </Command.Item>
    )

    const goToCollectionsItem = (
        <Command.Item
            value="go to collections"
            className={styles.CommandPalette__Item}
            onSelect={() => handleNavigation(navigateToCollections)}
        >
            <IconStack2 {...ICON_PROPS_NORMAL} />
            <div className={styles.CommandPalette__ItemContent}>
                <span className={styles.CommandPalette__LabelLine}>
                    Go to Collections
                </span>
            </div>
        </Command.Item>
    )

    const goToSettingsItem = (
        <Command.Item
            value="go to settings"
            className={styles.CommandPalette__Item}
            onSelect={() => handleNavigation(navigateToSettings)}
        >
            <IconSettings {...ICON_PROPS_NORMAL} />
            <div className={styles.CommandPalette__ItemContent}>
                <span className={styles.CommandPalette__LabelLine}>
                    Go to Settings
                </span>
            </div>
        </Command.Item>
    )

    const helpGuideItem = (
        <Command.Item
            value="help guide"
            className={styles.CommandPalette__Item}
            onSelect={() => handleNavigation(navigateToHelp)}
        >
            <IconHelp {...ICON_PROPS_NORMAL} />
            <div className={styles.CommandPalette__ItemContent}>
                <span className={styles.CommandPalette__LabelLine}>
                    Help Guide
                </span>
            </div>
        </Command.Item>
    )

    const navigationGroup = (
        <Command.Group
            heading="Navigation"
            className={styles.CommandPalette__Group}
        >
            {goToJotItem}
            {goToCollectionsItem}
            {goToSettingsItem}
            {helpGuideItem}
        </Command.Group>
    )

    const changeThemeItem = (
        <Command.Item
            value="change theme"
            className={styles.CommandPalette__Item}
            onSelect={() => onModeChange("theme")}
        >
            <IconPalette {...ICON_PROPS_NORMAL} />
            <div className={styles.CommandPalette__ItemContent}>
                <span className={styles.CommandPalette__LabelLine}>
                    Change Theme...
                </span>
            </div>
        </Command.Item>
    )

    const actionsGroup = (
        <Command.Group
            heading="Actions"
            className={styles.CommandPalette__Group}
        >
            {changeThemeItem}
        </Command.Group>
    )

    const handleThemePreview = (themeName: ThemeName) => {
        if (mode !== "theme") return
        setTheme(themeName)
    }

    const themeGroup = (
        <Command.Group heading="Theme" className={styles.CommandPalette__Group}>
            {themes.map((theme) => (
                <Command.Item
                    key={theme.name}
                    value={theme.name}
                    className={styles.CommandPalette__Item}
                    onMouseEnter={() =>
                        handleThemePreview(theme.name as ThemeName)
                    }
                    onFocus={() => handleThemePreview(theme.name as ThemeName)}
                    onSelect={() => handleThemeSelect(theme.name as ThemeName)}
                >
                    <div className={styles.CommandPalette__ItemContent}>
                        <span className={styles.CommandPalette__LabelLine}>
                            {theme.name.charAt(0).toUpperCase() +
                                theme.name.slice(1)}
                        </span>
                    </div>
                    {theme.name === originalThemeRef.current && (
                        <span className={styles.CommandPalette__Check}>
                            <IconCheck {...ICON_PROPS_NORMAL} />
                        </span>
                    )}
                </Command.Item>
            ))}
        </Command.Group>
    )

    return (
        <Dialog.Content
            className={styles.CommandPalette__Content}
            aria-describedby={undefined}
            onInteractOutside={revertThemePreview}
        >
            <Dialog.Title className="VisuallyHidden">
                Command Palette
            </Dialog.Title>
            <Command
                label="Command palette"
                shouldFilter={shouldFilter}
                value={searchText}
                onValueChange={(value) => setSearchText(value)}
            >
                <Command.Input
                    className={styles.CommandPalette__Input}
                    placeholder={searchPlaceholder}
                    autoFocus
                />
                <Command.List className={styles.CommandPalette__List}>
                    <Command.Empty className={styles.CommandPalette__Empty}>
                        No results found.
                    </Command.Empty>

                    {isMainMode ? (
                        <>
                            {collectionsGroup}
                            {collectionActionsGroup}
                            {navigationGroup}
                            {actionsGroup}
                        </>
                    ) : (
                        themeGroup
                    )}
                </Command.List>
            </Command>
        </Dialog.Content>
    )
}
