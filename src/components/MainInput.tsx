import { useState, useEffect } from "react"
import { useItems } from "@/hooks/useItems"
import { useMainInputParser, parseCreationData } from "@/hooks/useMainInputParser"
import { buildItem } from "@/utils/itemFactory"
import styles from "./MainInput.module.scss"
import type { MainInputSearchData } from "@/types"

interface Props {
    onParse: (searchData: MainInputSearchData) => void
}

export default function MainInput({ onParse }: Props) {
    const [inputValue, setInputValue] = useState("")
    const { createItemMutation } = useItems()
    const searchData = useMainInputParser(inputValue)

    useEffect(() => {
        onParse(searchData)
    }, [searchData])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return
        if (!inputValue.trim()) return
        if (searchData.filterType !== undefined || searchData.tags.length > 0) return

        const creationData = parseCreationData(inputValue)
        createItemMutation.mutate(buildItem(creationData))
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
            />
        </div>
    )
}
