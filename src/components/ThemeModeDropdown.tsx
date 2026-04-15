import type { ComponentType } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { ICON_PROPS_NORMAL } from "@/utils/constants"
import type { ThemeMode } from "@/types"
import styles from "./ThemeModeDropdown.module.scss"


function ThemeIcon({ mode }: { mode: ThemeMode }) {
    if (mode === "light") return <IconSun {...ICON_PROPS_NORMAL} />
    if (mode === "dark") return <IconMoon {...ICON_PROPS_NORMAL} />
    return <IconDeviceDesktop {...ICON_PROPS_NORMAL} />
}

const OPTIONS: {
    value: ThemeMode
    label: string
    Icon: ComponentType<{ size?: number; strokeWidth?: number }>
}[] = [
    { value: "light", label: "Light", Icon: IconSun },
    { value: "dark", label: "Dark", Icon: IconMoon },
    { value: "system", label: "System", Icon: IconDeviceDesktop },
]

export default function ThemeModeDropdown() {
    const themeMode = useLocalUserSettings((s) => s.themeMode)
    const setThemeMode = useLocalUserSettings((s) => s.setThemeMode)

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className={styles.ThemeModeDropdown__Trigger}>
                <ThemeIcon mode={themeMode} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className={styles.ThemeModeDropdown__Content}
                    align="end"
                    sideOffset={4}
                >
                    {OPTIONS.map((option) => (
                        <DropdownMenu.Item
                            key={option.value}
                            className={styles.ThemeModeDropdown__Item}
                            onSelect={() => {
                                setThemeMode(option.value)
                            }}
                        >
                            <option.Icon {...ICON_PROPS_NORMAL} />
                            {option.label}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
