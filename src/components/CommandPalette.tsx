import { useState, useRef, useLayoutEffect, useEffect } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { useHotkeys } from "react-hotkeys-hook"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { themes } from "@/utils/themes"
import type { ThemeName } from "@/utils/themes"
import styles from "./CommandPalette.module.scss"
import {
    ICON_PROPS_NORMAL,
    SHORTCUT_NAV_UP,
    SHORTCUT_NAV_DOWN,
    SHORTCUT_NAV_SUBMIT,
} from "@/utils/constants"
import { getHotkeyHandler } from "@/utils/hotkeyHandler"
import {
    IconWritingSign,
    IconStack2,
    IconSettings,
    IconHelp,
    IconPalette,
    IconCheck,
} from "@tabler/icons-react"

export type CommandPaletteMode = "main" | "theme"

interface CommandPaletteProps {
    mode: CommandPaletteMode
    onModeChange: (mode: CommandPaletteMode) => void
    onClose: () => void
}

interface NavItem {
    id: string
    label: string | React.ReactNode
    subLabel?: string
    icon: React.ReactNode
    action: () => void
    category?: string
}

export default function CommandPalette({
    mode,
    onModeChange,
    onClose,
}: CommandPaletteProps) {
    const [search, setSearch] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const currentTheme = useLocalUserSettings((s) => s.theme)
    const setTheme = useLocalUserSettings((s) => s.setTheme)
    const originalThemeRef = useRef(currentTheme)
    const inputRef = useRef<HTMLInputElement>(null)
    const {
        navigateToJot,
        navigateToCollection,
        navigateToCollections,
        navigateToSettings,
        navigateToHelp,
    } = useNavigateRoutes()

    const { collectionsQuery } = useCollectionsQuery()
    const collections = collectionsQuery.data ?? []

    const navItems: NavItem[] = [
        {
            id: "jot",
            label: "Go to Jot",
            icon: <IconWritingSign {...ICON_PROPS_NORMAL} />,
            action: () => {
                navigateToJot()
                onClose()
            },
            category: "Navigation",
        },
        {
            id: "collections",
            label: "Go to Collections",
            icon: <IconStack2 {...ICON_PROPS_NORMAL} />,
            action: () => {
                navigateToCollections()
                onClose()
            },
            category: "Navigation",
        },
        {
            id: "settings",
            label: "Go to Settings",
            icon: <IconSettings {...ICON_PROPS_NORMAL} />,
            action: () => {
                navigateToSettings()
                onClose()
            },
            category: "Navigation",
        },
        {
            id: "help",
            label: "Help Guide",
            icon: <IconHelp {...ICON_PROPS_NORMAL} />,
            action: () => {
                navigateToHelp()
                onClose()
            },
            category: "Navigation",
        },
    ]

    const actionItems: NavItem[] = [
        {
            id: "change-theme",
            label: "Change Theme...",
            icon: <IconPalette {...ICON_PROPS_NORMAL} />,
            action: () => onModeChange("theme"),
            category: "Actions",
        },
    ]

    const themeItems: NavItem[] = themes.map((theme) => ({
        id: theme.name,
        label: theme.name.charAt(0).toUpperCase() + theme.name.slice(1),
        subLabel: undefined,
        icon: null,
        action: () => {
            setTheme(theme.name as ThemeName)
            onClose()
        },
        category: "Theme",
    }))

    const collectionNavItems: NavItem[] = collections.map((collection) => ({
        id: collection.slug,
        label: (
            <>
                <span
                    className={styles.CommandPalette__ColourBlock}
                    style={{ backgroundColor: collection.colour }}
                />
                {collection.name}
            </>
        ),
        subLabel: `/${collection.slug}`,
        icon: <span>{collection.icon}</span>,
        action: () => {
            navigateToCollection(collection.slug)
            onClose()
        },
        category: "Collections",
    }))

    const allItems =
        mode === "main"
            ? [...collectionNavItems, ...navItems, ...actionItems]
            : themeItems

    const filteredItems = search
        ? allItems.filter(
              (item) =>
                  String(item.label)
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                  item.subLabel?.toLowerCase().includes(search.toLowerCase()),
          )
        : allItems

    useEffect(() => {
        setSelectedIndex(0)
    }, [mode, search])

    const startThemePreview = (themeName: ThemeName) => {
        setTheme(themeName)
    }

    const revertThemePreview = () => {
        setTheme(originalThemeRef.current)
    }

    const handleThemePreview = (themeName: ThemeName) => {
        if (mode !== "theme") return
        startThemePreview(themeName)
    }

    const handleThemeRevert = () => {
        if (mode !== "theme") return
        revertThemePreview()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        if (mode !== "theme") return
        originalThemeRef.current = currentTheme
    }, [])

    useHotkeys("Escape", () => {
        handleThemeRevert()
        onClose()
    })

    const getNextIndex = (current: number, direction: "up" | "down") => {
        if (direction === "up") {
            return current > 0 ? current - 1 : filteredItems.length - 1
        }
        return current < filteredItems.length - 1 ? current + 1 : 0
    }

    const handleArrowUp = () => {
        if (filteredItems.length === 0) return
        const newIndex = getNextIndex(selectedIndex, "up")
        setSelectedIndex(newIndex)
        handleThemePreview(filteredItems[newIndex].id as ThemeName)
    }

    const handleArrowDown = () => {
        if (filteredItems.length === 0) return
        const newIndex = getNextIndex(selectedIndex, "down")
        setSelectedIndex(newIndex)
        handleThemePreview(filteredItems[newIndex].id as ThemeName)
    }

    const handleEnter = () => {
        const item = filteredItems[selectedIndex]
        if (item) {
            handleThemePreview(item.id as ThemeName)
            item.action()
        }
    }

    const handleKeyDown = getHotkeyHandler([
        [SHORTCUT_NAV_UP, handleArrowUp],
        [SHORTCUT_NAV_DOWN, handleArrowDown],
        [SHORTCUT_NAV_SUBMIT, handleEnter],
    ])

    const placeholder = mode === "theme" ? "Search theme..." : "Search..."
    const isThemeMode = mode === "theme"

    const renderItem = (item: NavItem) => {
        const index = filteredItems.findIndex((i) => i.id === item.id)
        const isSelected = index === selectedIndex

        return (
            <li
                key={item.id}
                className={styles.CommandPalette__Item}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                    handleThemePreview(item.id as ThemeName)
                    item.action()
                }}
                onMouseEnter={() => {
                    setSelectedIndex(index)
                    handleThemePreview(item.id as ThemeName)
                }}
            >
                {item.icon}
                <div className={styles.CommandPalette__ItemContent}>
                    <span className={styles.CommandPalette__LabelLine}>
                        {item.label}
                    </span>
                    {item.subLabel && (
                        <span className={styles.CommandPalette__SubLabel}>
                            {item.subLabel}
                        </span>
                    )}
                </div>
                {isThemeMode && item.id === originalThemeRef.current && (
                    <span className={styles.CommandPalette__Check}>
                        <IconCheck {...ICON_PROPS_NORMAL} />
                    </span>
                )}
            </li>
        )
    }

    const renderGroup = (category: string, items: NavItem[]) => (
        <div key={category}>
            <p className={styles.CommandPalette__SectionLabel}>{category}</p>
            {items.map(renderItem)}
        </div>
    )

    const renderGroupedItems = () => {
        const groupedItems = filteredItems.reduce(
            (acc, item) => {
                const category = item.category || "Other"
                if (!acc[category]) acc[category] = []
                acc[category].push(item)
                return acc
            },
            {} as Record<string, NavItem[]>,
        )

        return Object.entries(groupedItems).map(([category, items]) =>
            renderGroup(category, items),
        )
    }

    return (
        <Dialog.Content
            className={styles.CommandPalette__Content}
            aria-describedby={undefined}
            onInteractOutside={handleThemeRevert}
        >
            <Dialog.Title className="VisuallyHidden">
                Command Palette
            </Dialog.Title>
            <input
                ref={inputRef}
                type="text"
                className={styles.CommandPalette__Input}
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            <ul
                className={styles.CommandPalette__List}
                role="listbox"
                aria-label="Command palette options"
            >
                {filteredItems.length === 0 ? (
                    <li className={styles.CommandPalette__Empty}>
                        No results found.
                    </li>
                ) : (
                    renderGroupedItems()
                )}
            </ul>
        </Dialog.Content>
    )
}
