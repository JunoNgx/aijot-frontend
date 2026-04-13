import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useParams } from "react-router-dom"
import { useHotkeys } from "react-hotkeys-hook"
import { IconChevronDown } from "@tabler/icons-react"
import { useCollections } from "@/hooks/useCollections"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import { COLLECTION_HOTKEY_COUNT, TRASH_PURGE_DURATION_DAY } from "@/utils/constants"
import styles from "./CollectionDropdown.module.scss"

const HOTKEYS = Array.from({ length: COLLECTION_HOTKEY_COUNT }, (_, i) => `mod+${i + 1}`)

export default function CollectionDropdown() {
    const { slug: activeSlug } = useParams<{ slug: string }>()
    const { collectionsQuery } = useCollections()
    const { navigateToCollection } = useNavigateRoutes()

    const collections = collectionsQuery.data ?? []
    const hotkeyed = collections.slice(0, COLLECTION_HOTKEY_COUNT)
    const currentSlug = activeSlug ?? "all"
    const activeCollection = collections.find((c) => c.slug === currentSlug)

    useHotkeys(HOTKEYS, (e) => {
        const index = parseInt(e.key) - 1
        const target = hotkeyed[index]
        if (target) navigateToCollection(target.slug)
    })

    const trigger = activeCollection ? (
        <>
            <span
                className={styles.CollectionDropdown__ColourDot}
                style={{ backgroundColor: activeCollection.colour }}
            />
            <span>{activeCollection.icon}</span>
            <span>{activeCollection.name}</span>
        </>
    ) : (
        <span>Collections</span>
    )

    const menuItems = collections.map((collection, index) => {
        const hotkeyNum = index < COLLECTION_HOTKEY_COUNT ? index + 1 : null
        const isActive = collection.slug === currentSlug
        const isTrash = collection.coreType === "trash"

        const itemClassName = [
            styles.CollectionDropdown__Item,
            isActive ? styles["CollectionDropdown__Item--Active"] : "",
        ].join(" ")

        return (
            <div key={collection.id}>
                <DropdownMenu.Item
                    className={itemClassName}
                    onSelect={() => navigateToCollection(collection.slug)}
                >
                    <span
                        className={styles.CollectionDropdown__ColourDot}
                        style={{ backgroundColor: collection.colour }}
                    />
                    <span>{collection.icon}</span>
                    <span>{collection.name}</span>
                    {hotkeyNum !== null && (
                        <span className={styles.CollectionDropdown__Hotkey}>{hotkeyNum}</span>
                    )}
                </DropdownMenu.Item>
                {isTrash && (
                    <div className={styles.CollectionDropdown__TrashNotice}>
                        Items older than {TRASH_PURGE_DURATION_DAY}d are permanently deleted
                    </div>
                )}
            </div>
        )
    })

    return (
        <div className={styles.CollectionDropdown}>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className={styles.CollectionDropdown__Trigger}>
                    {trigger}
                    <IconChevronDown
                        size={14}
                        className={styles.CollectionDropdown__TriggerChevron}
                    />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className={styles.CollectionDropdown__Content}
                        align="start"
                        sideOffset={4}
                    >
                        {menuItems}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    )
}
