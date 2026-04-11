import { useState } from "react"
import { useItems } from "@/hooks/useItems"
import MainInput from "@/components/MainInput"
import JotItem from "@/components/itemComponent/JotItem"
import styles from "./index.module.scss"
import type { Item } from "@/types"

function filterItems(items: Item[], query: string): Item[] {
    if (!query) return items
    const lowerQuery = query.toLowerCase()
    return items.filter((item) =>
        item.content.toLowerCase().includes(lowerQuery)
        || item.title?.toLowerCase().includes(lowerQuery),
    )
}

export default function Jot() {
    const [inputValue, setInputValue] = useState("")
    const { itemsQuery } = useItems()

    const visibleItems = filterItems(itemsQuery.data ?? [], inputValue)

    const itemList = visibleItems.map((item) => (
        <JotItem key={item.id} item={item} />
    ))

    return (
        <div className={styles.Jot}>
            <MainInput value={inputValue} onChange={setInputValue} />
            <div className={styles.Jot__List}>
                {itemList}
            </div>
        </div>
    )
}
