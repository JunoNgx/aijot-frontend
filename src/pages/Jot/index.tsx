import { useState, useEffect, useRef } from "react"
import { useParams, Navigate } from "react-router-dom"
import { useHotkeys } from "react-hotkeys-hook"
import { useItemsQuery } from "@/hooks/useItemsQuery"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import { useLocalAppData } from "@/store/localAppData"
import {
    SHORTCUT_FOCUS_MAIN_INPUT,
    SHORTCUT_TOGGLE_JOT_LIST_VIEW,
    ROUTE_JOT,
    TRASH_PURGE_DURATION_DAY,
} from "@/utils/constants"
import { useProfileSettings } from "@/store/profileSettings"
import MainInput from "@/components/MainInput"
import JotItem from "@/components/itemComponent/JotItem"
import DemoDataBanner from "./DemoDataBanner"
import styles from "./index.module.scss"
import type { Collection, MainInputSearchData, Item } from "@/types"

const DEFAULT_SEARCH_DATA: MainInputSearchData = {
    tags: [],
}

function filterByCollection(items: Item[], collection: Collection): Item[] {
    if (collection.coreType === "all") return items
    if (collection.coreType === "untagged") {
        return items.filter((item) => item.tags.length === 0)
    }
    return items.filter(
        (item) =>
            collection.types.includes(item.type) &&
            collection.tags.every((tag) => item.tags.includes(tag)),
    )
}

function filterItems(items: Item[], searchData: MainInputSearchData): Item[] {
    let result = items

    if (searchData.filterType === "incompleteTodo") {
        result = result.filter((item) => item.type === "todo" && !item.isDone)
    } else if (searchData.filterType === "completedTodo") {
        result = result.filter((item) => item.type === "todo" && item.isDone)
    } else if (searchData.filterType) {
        result = result.filter((item) => item.type === searchData.filterType)
    }

    if (searchData.tags.length > 0) {
        result = result.filter((item) =>
            searchData.tags.every((tag) => item.tags.includes(tag)),
        )
    }

    if (searchData.searchText) {
        const lowerSearch = searchData.searchText.toLowerCase()
        result = result.filter(
            (item) =>
                item.content.toLowerCase().includes(lowerSearch) ||
                item.title?.toLowerCase().includes(lowerSearch),
        )
    }

    return result
}

export default function Jot() {
    const { slug } = useParams<{ slug: string }>()
    const { collectionsQuery } = useCollectionsQuery()
    const [searchData, setSearchData] =
        useState<MainInputSearchData>(DEFAULT_SEARCH_DATA)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const { itemsQuery, trashedItemsQuery } = useItemsQuery()
    const { shouldShowDemoDataBanner } = useLocalAppData()
    const mainInputRef = useRef<HTMLInputElement>(null)

    const defaultShouldShowJotItemExtraInfo = useProfileSettings(
        (s) => s.shouldShowJotItemExtraInfo,
    )
    const [isShowingJotItemExtraInfo, setIsShowingJotItemExtraInfo] = useState(
        defaultShouldShowJotItemExtraInfo,
    )

    const collections = collectionsQuery.data ?? []
    const currCollection = collections.find((c) => c.slug === slug)
    const allSlug = useCoreCollectionSettings((s) => s.all.slug)

    const isTrash = currCollection?.coreType === "trash"
    const baseItems = isTrash
        ? (trashedItemsQuery.data ?? [])
        : (itemsQuery.data ?? [])
    const collectionItems = currCollection
        ? filterByCollection(baseItems, currCollection)
        : baseItems
    const visibleItems = filterItems(collectionItems, searchData)
    const selectedItem =
        selectedIndex >= 0 ? visibleItems[selectedIndex] : undefined

    useEffect(() => {
        if (selectedIndex <= 0) {
            window.scrollTo({ top: 0, behavior: "smooth" })
            return
        }
        document
            .querySelector(`[data-item-index="${selectedIndex}"]`)
            ?.scrollIntoView({ block: "nearest" })
    }, [selectedIndex])

    useHotkeys(SHORTCUT_FOCUS_MAIN_INPUT, () => mainInputRef.current?.focus(), {
        enableOnFormTags: true,
        preventDefault: true,
    })

    useHotkeys(
        SHORTCUT_TOGGLE_JOT_LIST_VIEW,
        () => {
            setIsShowingJotItemExtraInfo((prev) => !prev)
        },
        { enableOnFormTags: true },
    )

    if (!collectionsQuery.isPending && !currCollection) {
        return <Navigate to={`${ROUTE_JOT}/${allSlug}`} replace />
    }

    const listboxId = "jot-items-listbox"
    const activeDescendantId =
        selectedIndex >= 0 ? `jot-item-${selectedIndex}` : undefined
    const itemList = visibleItems.map((item, index) => (
        <JotItem
            key={item.id}
            id={`jot-item-${index}`}
            item={item}
            isSelected={index === selectedIndex}
            itemIndex={index}
            isExpandedInfoMode={isShowingJotItemExtraInfo}
        />
    ))

    return (
        <div className={styles.Jot}>
            <div className={styles.Jot__NoticeWrapper}>
                {shouldShowDemoDataBanner && <DemoDataBanner />}
                {isTrash && (
                    <p className={styles.Jot__CollectionNotice}>
                        Items in trash are automatically deleted after{" "}
                        {TRASH_PURGE_DURATION_DAY} days
                    </p>
                )}
            </div>
            <MainInput
                inputRef={mainInputRef}
                onParse={setSearchData}
                selectedIndex={selectedIndex}
                selectedItem={selectedItem}
                visibleItemCount={visibleItems.length}
                onSelectedIndexChange={setSelectedIndex}
                isTrash={isTrash}
                listboxId={listboxId}
                activeDescendantId={activeDescendantId}
            />
            <div
                id={listboxId}
                className={styles.Jot__List}
                role="listbox"
                aria-orientation="vertical"
            >
                {itemList}
            </div>
        </div>
    )
}
