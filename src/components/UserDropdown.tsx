import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { IconChevronDown, IconSettings, IconStack2, IconHelp, IconWritingSign } from "@tabler/icons-react"
import { useProfileSettings } from "@/store/profileSettings"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import { DEFAULT_USERNAME, ICON_PROPS_NORMAL, ROUTE_COLLECTION, ROUTE_JOT } from "@/utils/constants"
import styles from "./UserDropdown.module.scss"
import { useMatch } from "react-router-dom"
import { useDropdownOffsetCalc } from "@/hooks/useDropdownOffsetCalculation"

export default function UserDropdown() {
    const userDisplayName = useProfileSettings((s) => s.userDisplayName) || DEFAULT_USERNAME
    const {
        navigateToJot,
        navigateToSettings,
        navigateToCollections,
        navigateToHelp,
    } = useNavigateRoutes()

    const isJotRoute = useMatch(ROUTE_JOT)
    const isJotCollectionRoute = useMatch(ROUTE_COLLECTION)
    const shouldShowJotNav = !isJotRoute && !isJotCollectionRoute

    const sideOffsetVal = useDropdownOffsetCalc();

    return (
        <div className={styles.UserDropdown}>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className={styles.UserDropdown__Trigger}>
                    <span className={styles.UserDropdown__TriggerLabel} >
                        {userDisplayName}
                    </span>
                    <IconChevronDown
                        {...ICON_PROPS_NORMAL}
                        className={styles.UserDropdown__Chevron}
                    />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className={styles.UserDropdown__Content}
                        align="end"
                        sideOffset={sideOffsetVal}
                    >
                        {shouldShowJotNav && (<DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToJot}
                        >
                            <IconWritingSign {...ICON_PROPS_NORMAL} />
                            Jot
                        </DropdownMenu.Item>)}
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToSettings}
                        >
                            <IconSettings {...ICON_PROPS_NORMAL} />
                            Settings
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToCollections}
                        >
                            <IconStack2 {...ICON_PROPS_NORMAL} />
                            Collections
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator
                            className={styles.UserDropdown__Separator}
                        />
                        <DropdownMenu.Item
                            className={styles.UserDropdown__Item}
                            onSelect={navigateToHelp}
                        >
                            <IconHelp {...ICON_PROPS_NORMAL} />
                            Help
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    )
}
