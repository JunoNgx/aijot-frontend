import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { IconChevronDown, IconSettings, IconStack2, IconHelp } from "@tabler/icons-react"
import { useProfileSettings } from "@/store/profileSettings"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import { DEFAULT_USERNAME } from "@/utils/constants"
import styles from "./UserDropdown.module.scss"

export default function UserDropdown() {
    const userDisplayName = useProfileSettings((s) => s.userDisplayName) || DEFAULT_USERNAME
    const {
        navigateToSettings,
        navigateToCollections,
        navigateToHelp,
    } = useNavigateRoutes()

    return (
        <div className={styles.UserDropdown}>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className={styles.UserDropdown__Trigger}>
                    {userDisplayName}
                    <IconChevronDown
                        size={14}
                        className={styles.UserDropdown__Chevron}
                    />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className={styles.UserDropdown__Content}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToSettings}
                        >
                            <IconSettings size={14} />
                            Settings
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToCollections}
                        >
                            <IconStack2 size={14} />
                            Collections
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator
                            className={styles.UserDropdown__Separator}
                        />
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToHelp}
                        >
                            <IconHelp size={14} />
                            Help
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    )
}
