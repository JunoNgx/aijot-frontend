import type { ComponentType } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { IconSun, IconMoon } from "@tabler/icons-react"
import { useLocalUserSettings } from "@/store/localUserSettings"
import {
    DROPDOWN_OFFSET,
    ICON_PROPS_HEADER,
    ICON_PROPS_NORMAL,
} from "@/utils/constants"
import type { ThemeMode } from "@/types"
import styles from "./ThemeModeDropdown.module.scss"

function ThemeIcon({ mode }: { mode: ThemeMode }) {
    if (mode === "light") return <IconSun {...ICON_PROPS_HEADER} />
    return <IconMoon {...ICON_PROPS_HEADER} />
}

const OPTIONS: {
    value: ThemeMode
    label: string
    Icon: ComponentType<{ size?: number; strokeWidth?: number }>
}[] = [
    { value: "light", label: "Light", Icon: IconSun },
    { value: "dark", label: "Dark", Icon: IconMoon },
]

export default function ThemeModeDropdown() {
    const theme = useLocalUserSettings((s) => s.theme)
    const setTheme = useLocalUserSettings((s) => s.setTheme)

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className={styles.ThemeModeDropdown__Trigger}>
                <ThemeIcon mode={theme} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className={styles.ThemeModeDropdown__Content}
                    align="end"
                    sideOffset={DROPDOWN_OFFSET}
                >
                    {OPTIONS.map((option) => (
                        <DropdownMenu.Item
                            key={option.value}
                            className={styles.ThemeModeDropdown__Item}
                            onSelect={() => {
                                setTheme(option.value)
                            }}
                        >
                            <option.Icon {...ICON_PROPS_NORMAL} />
                            {option.label}
                            {option.value === theme && (
                                <span
                                    className={
                                        styles.ThemeModeDropdown__ActiveDot
                                    }
                                />
                            )}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
