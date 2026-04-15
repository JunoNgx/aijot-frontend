import type { ComponentType } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { ICON_PROPS_HEADER, ICON_PROPS_NORMAL } from "@/utils/constants"
import type { ThemeMode } from "@/types"
import styles from "./ThemeModeDropdown.module.scss"
import { useDropdownOffsetCalc } from "@/hooks/useDropdownOffsetCalculation"

function ThemeIcon({ mode }: { mode: ThemeMode }) {
    if (mode === "light") return <IconSun {...ICON_PROPS_HEADER} />
    if (mode === "dark") return <IconMoon {...ICON_PROPS_HEADER} />
    return <IconDeviceDesktop {...ICON_PROPS_HEADER} />
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

    const sideOffsetVal = useDropdownOffsetCalc()

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className={styles.ThemeModeDropdown__Trigger}>
                <ThemeIcon mode={themeMode} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className={styles.ThemeModeDropdown__Content}
                    align="end"
                    sideOffset={sideOffsetVal}
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
                            {option.value === themeMode && (
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
