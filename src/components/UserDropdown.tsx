import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { IconChevronDown } from "@tabler/icons-react"
import { useProfileSettings } from "@/store/profileSettings"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import styles from "./UserDropdown.module.scss"

export default function UserDropdown() {
    const userDisplayName = useProfileSettings((s) => s.userDisplayName)
    const {
        navigateToSettings,
        navigateToCollections,
        navigateToHelp,
        navigateToPrivacy,
        navigateToTerms,
    } = useNavigateRoutes()

    return (
        <div className={styles.UserDropdown}>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className={styles.UserDropdown__Trigger}>
                    {userDisplayName}
                    <IconChevronDown size={14} className={styles.UserDropdown__Chevron} />
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
                            Settings
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToCollections}
                        >
                            Manage Collections
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className={styles.UserDropdown__Separator} />
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToHelp}
                        >
                            Help
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToPrivacy}
                        >
                            Privacy
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToTerms}
                        >
                            Terms
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    )
}
