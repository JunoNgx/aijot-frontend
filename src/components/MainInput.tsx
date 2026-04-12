import { useState, useEffect } from "react"
import { DateTime } from "luxon"
import { useItems } from "@/hooks/useItems"
import useComboboxParser from "@/hooks/useComboboxParser"
import styles from "./MainInput.module.scss"
import type { Item, ParsedComboboxInput } from "@/types"

function buildItem(parsedInputData: ParsedComboboxInput): Item {
    const now = DateTime.now().toISO()
    return {
        id: crypto.randomUUID(),
        createdAt: now,
        jottedAt: now,
        updatedAt: now,
        isDone: false,
        shouldCopyOnClick: false,
        isPinned: false,
        tags: parsedInputData.tags,
        type: parsedInputData.itemType,
        content: parsedInputData.content,
        title: parsedInputData.title,
    }
}

interface Props {
    onParse: (parsedInputData: ParsedComboboxInput) => void
}

export default function MainInput({ onParse }: Props) {
    const [inputValue, setInputValue] = useState("")
    const { createItem } = useItems()
    const parsedInputData = useComboboxParser(inputValue)

    useEffect(() => {
        onParse(parsedInputData)
    }, [parsedInputData])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return
        if (!inputValue.trim()) return
        if (parsedInputData.mode !== "create") return

        createItem.mutate(buildItem(parsedInputData))
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
