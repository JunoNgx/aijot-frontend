import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useParams } from "react-router-dom"
import { useHotkeys } from "react-hotkeys-hook"
import { IconChevronDown } from "@tabler/icons-react"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import {
    COLLECTION_HOTKEY_COUNT,
    DROPDOWN_OFFSET,
    ICON_PROPS_NORMAL,
} from "@/utils/constants"
import styles from "./CollectionDropdown.module.scss"
import CollectionColourBlock from "./CollectionColourBlock"

const HOTKEYS = Array.from(
    { length: COLLECTION_HOTKEY_COUNT },
    (_, i) => `mod+${i + 1}`,
)

export default function CollectionDropdown() {
    const { slug: activeSlug } = useParams<{ slug: string }>()
    const { collectionsQuery } = useCollectionsQuery()
    const { navigateToCollection } = useNavigateRoutes()

    const collections = collectionsQuery.data ?? []
    const hotkeyed = collections.slice(0, COLLECTION_HOTKEY_COUNT)
    const currentSlug = activeSlug ?? "all"
    const currCollection = collections.find((c) => c.slug === currentSlug)

    useHotkeys(HOTKEYS, (e) => {
        const index = parseInt(e.key) - 1
        const target = hotkeyed[index]
        if (target) navigateToCollection(target.slug)
    })

    const trigger = currCollection ? (
        <>
            <CollectionColourBlock colour={currCollection.colour} />
            <span>{currCollection.icon}</span>
            <span className={styles.CollectionDropdown__TriggerLabel}>
                {currCollection.name}
            </span>
        </>
    ) : (
        <span>Collections</span>
    )

    const menuItems = collections.map((collection, index) => {
        const hotkeyNum = index < COLLECTION_HOTKEY_COUNT ? index + 1 : null
        const isActive = collection.slug === currentSlug

        const itemClassName = [
            styles.CollectionItem,
            isActive ? styles["CollectionItem--Active"] : "",
        ].join(" ")

        return (
            <div key={collection.id}>
                <DropdownMenu.Item
                    className={itemClassName}
                    onSelect={() => navigateToCollection(collection.slug)}
                >
                    <CollectionColourBlock colour={collection.colour} />
                    <span>{collection.icon}</span>
                    <span className={styles.CollectionItem__Label}>
                        {collection.name}
                    </span>
                    {hotkeyNum !== null && (
                        <kbd className={styles.CollectionItem__Hotkey}>
                            {hotkeyNum}
                        </kbd>
                    )}
                </DropdownMenu.Item>
            </div>
        )
    })

    return (
        <div className={styles.CollectionDropdown}>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    className={styles.CollectionDropdown__Trigger}
                >
                    {trigger}
                    <IconChevronDown
                        {...ICON_PROPS_NORMAL}
                        className={styles.CollectionDropdown__TriggerChevron}
                    />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className={styles.CollectionDropdown__Content}
                        align="start"
                        sideOffset={DROPDOWN_OFFSET}
                    >
                        {menuItems}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    )
}
