import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useParams } from "react-router-dom"
import { useHotkeys } from "react-hotkeys-hook"
import {
    IconCheck,
    IconChevronDown,
    IconPencil,
    IconPlus,
} from "@tabler/icons-react"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import { openCollectionDialog } from "@/utils/openCollectionDialog"
import {
    COLLECTION_HOTKEY_COUNT,
    DROPDOWN_OFFSET,
    ICON_PROPS_NORMAL,
} from "@/config/constants"
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
            <span>{currCollection.icon}</span>
            <CollectionColourBlock colour={currCollection.colour} />
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

        const rightContent = isActive ? (
            <span className={styles.CollectionItem__RightContent}>
                <IconCheck {...ICON_PROPS_NORMAL} />
            </span>
        ) : (
            hotkeyNum !== null && (
                <kbd className={styles.CollectionItem__RightContent}>
                    {hotkeyNum}
                </kbd>
            )
        )

        return (
            <div key={collection.id}>
                <DropdownMenu.Item
                    className={itemClassName}
                    onSelect={() => navigateToCollection(collection.slug)}
                >
                    <span>{collection.icon}</span>
                    <CollectionColourBlock colour={collection.colour} />
                    <span className={styles.CollectionItem__Label}>
                        {collection.name}
                    </span>
                    {rightContent}
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
                        <DropdownMenu.Separator
                            className={styles.CollectionDropdown__Separator}
                        />
                        {currCollection && (
                            <DropdownMenu.Item
                                className={styles.CollectionItem}
                                onSelect={() =>
                                    openCollectionDialog(currCollection)
                                }
                            >
                                <IconPencil {...ICON_PROPS_NORMAL} />
                                <span className={styles.CollectionItem__Label}>
                                    Edit this collection
                                </span>
                            </DropdownMenu.Item>
                        )}
                        <DropdownMenu.Item
                            className={styles.CollectionItem}
                            onSelect={() => openCollectionDialog()}
                        >
                            <IconPlus {...ICON_PROPS_NORMAL} />
                            <span className={styles.CollectionItem__Label}>
                                New collection
                            </span>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    )
}
