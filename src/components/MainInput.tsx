import { useState, useEffect } from "react"
import { DateTime } from "luxon"
import { useItems } from "@/hooks/useItems"
import { useComboboxParser, parseCreationData } from "@/hooks/useComboboxParser"
import styles from "./MainInput.module.scss"
import type { ComboboxCreationData, ComboboxSearchData, Item } from "@/types"

function buildItem(creationData: ComboboxCreationData): Item {
    const now = DateTime.now().toISO()
    return {
        id: crypto.randomUUID(),
        createdAt: now,
        jottedAt: now,
        updatedAt: now,
        isDone: false,
        shouldCopyOnClick: false,
        isPinned: false,
        tags: creationData.tags,
        type: creationData.itemType,
        content: creationData.content,
        title: creationData.title,
    }
}

interface Props {
    onParse: (searchData: ComboboxSearchData) => void
}

export default function MainInput({ onParse }: Props) {
    const [inputValue, setInputValue] = useState("")
    const { createItem } = useItems()
    const searchData = useComboboxParser(inputValue)

    useEffect(() => {
        onParse(searchData)
    }, [searchData])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return
        if (!inputValue.trim()) return
        if (searchData.filterType !== undefined || searchData.tags.length > 0) return

        createItem.mutate(buildItem(parseCreationData(inputValue)))
        setInputValue("")
    }

    return (
        <div className={styles.MainInput}>
            <input
                className={styles.MainInput__Input}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Jot something..."
                autoFocus
            />
        </div>
    )
}
