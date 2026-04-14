import { useState, useEffect, useRef } from "react"
import { useParams, Navigate } from "react-router-dom"
import { useHotkeys } from "react-hotkeys-hook"
import { useItemsQuery } from "@/hooks/useItemsQuery"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import { useLocalAppData } from "@/store/localAppData"
import { SHORTCUT_FOCUS_MAIN_INPUT } from "@/utils/constants"
import MainInput from "@/components/MainInput"
import CollectionDropdown from "@/components/CollectionDropdown"
import JotItem from "@/components/itemComponent/JotItem"
import DemoDataBanner from "./DemoDataBanner"
import styles from "./index.module.scss"
import type { MainInputSearchData, Item } from "@/types"

const DEFAULT_SEARCH_DATA: MainInputSearchData = {
    tags: [],
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
    const allSlug = useCoreCollectionSettings((s) => s.all.slug)
    const [searchData, setSearchData] =
        useState<MainInputSearchData>(DEFAULT_SEARCH_DATA)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const { itemsQuery } = useItemsQuery()
    const { shouldShowDemoDataBanner } = useLocalAppData()
    const mainInputRef = useRef<HTMLInputElement>(null)

    if (!collectionsQuery.isPending) {
        const isValidSlug = (collectionsQuery.data ?? []).some(
            (c) => c.slug === slug,
        )
        if (!isValidSlug) return <Navigate to={`/jot/${allSlug}`} replace />
    }

    const visibleItems = filterItems(itemsQuery.data ?? [], searchData)
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

    const itemList = visibleItems.map((item, index) => (
        <JotItem
            key={item.id}
            item={item}
            isSelected={index === selectedIndex}
            itemIndex={index}
        />
    ))

    return (
        <div className={styles.Jot}>
            <CollectionDropdown />
            <div className={styles.Jot__NoticeWrapper}>
                {shouldShowDemoDataBanner && <DemoDataBanner />}
            </div>
            <MainInput
                inputRef={mainInputRef}
                onParse={setSearchData}
                selectedIndex={selectedIndex}
                selectedItem={selectedItem}
                visibleItemCount={visibleItems.length}
                onSelectedIndexChange={setSelectedIndex}
            />
            <div className={styles.Jot__List}>{itemList}</div>
        </div>
    )
}
