import { useState } from "react"
import { useItems } from "@/hooks/useItems"
import MainInput from "@/components/MainInput"
import JotItem from "@/components/itemComponent/JotItem"
import styles from "./index.module.scss"
import type { Item, ParsedComboboxInput } from "@/types"

const DEFAULT_PARSED_INPUT_DATA: ParsedComboboxInput = {
    mode: "create",
    itemType: "text",
    content: "",
    tags: [],
}

function filterItems(items: Item[], parsedInputData: ParsedComboboxInput): Item[] {
    let result = items

    if (parsedInputData.filterType === "incompleteTodo") {
        result = result.filter(item => item.type === "todo" && !item.isDone)
    } else if (parsedInputData.filterType) {
        result = result.filter(item => item.type === parsedInputData.filterType)
    }

    if (parsedInputData.tags.length > 0) {
        result = result.filter(item =>
            parsedInputData.tags.every(tag => item.tags.includes(tag))
        )
    }

    if (parsedInputData.searchText) {
        const lowerSearch = parsedInputData.searchText.toLowerCase()
        result = result.filter(item =>
            item.content.toLowerCase().includes(lowerSearch)
            || item.title?.toLowerCase().includes(lowerSearch)
        )
    }

    return result
}

export default function Jot() {
    const [parsedInputData, setParsedInputData] = useState<ParsedComboboxInput>(DEFAULT_PARSED_INPUT_DATA)
    const { itemsQuery } = useItems()

    const visibleItems = filterItems(itemsQuery.data ?? [], parsedInputData)

    const itemList = visibleItems.map((item) => (
        <JotItem key={item.id} item={item} />
    ))

    return (
        <div className={styles.Jot}>
            <MainInput onParse={setParsedInputData} />
            <div className={styles.Jot__List}>
                {itemList}
            </div>
        </div>
    )
}
