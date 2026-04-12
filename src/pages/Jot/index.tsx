import { useState } from "react"
import { useItems } from "@/hooks/useItems"
import MainInput from "@/components/MainInput"
import JotItem from "@/components/itemComponent/JotItem"
import styles from "./index.module.scss"
import type { MainInputSearchData, Item } from "@/types"

const DEFAULT_SEARCH_DATA: MainInputSearchData = {
    tags: [],
}

function filterItems(items: Item[], searchData: MainInputSearchData): Item[] {
    let result = items

    if (searchData.filterType === "incompleteTodo") {
        result = result.filter(item => item.type === "todo" && !item.isDone)
    } else if (searchData.filterType) {
        result = result.filter(item => item.type === searchData.filterType)
    }

    if (searchData.tags.length > 0) {
        result = result.filter(item =>
            searchData.tags.every(tag => item.tags.includes(tag))
        )
    }

    if (searchData.searchText) {
        const lowerSearch = searchData.searchText.toLowerCase()
        result = result.filter(item =>
            item.content.toLowerCase().includes(lowerSearch)
            || item.title?.toLowerCase().includes(lowerSearch)
        )
    }

    return result
}

export default function Jot() {
    const [searchData, setSearchData] = useState<MainInputSearchData>(DEFAULT_SEARCH_DATA)
    const { itemsQuery } = useItems()

    const visibleItems = filterItems(itemsQuery.data ?? [], searchData)

    const itemList = visibleItems.map((item) => (
        <JotItem key={item.id} item={item} />
    ))

    return (
        <div className={styles.Jot}>
            <MainInput onParse={setSearchData} />
            <div className={styles.Jot__List}>
                {itemList}
            </div>
        </div>
    )
}
