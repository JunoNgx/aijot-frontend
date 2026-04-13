import { useState, useEffect, useMemo } from "react"
import { getHotkeyHandler } from "@/utils/hotkeyHandler"
import { useItems } from "@/hooks/useItems"
import { useMainInputParser, parseCreationData } from "@/hooks/useMainInputParser"
import { buildItem } from "@/utils/itemFactory"
import { openItemDialog } from "@/utils/openItemDialog"
import {
    SHORTCUT_NAV_UP,
    SHORTCUT_NAV_DOWN,
    SHORTCUT_NAV_UP_SKIP,
    SHORTCUT_NAV_DOWN_SKIP,
    SHORTCUT_NAV_TOP,
    SHORTCUT_NAV_BOTTOM,
    SHORTCUT_NAV_ACTION,
    SHORTCUT_ITEM_EDIT,
    SHORTCUT_ITEM_COPY,
} from "@/utils/constants"
import styles from "./MainInput.module.scss"
import type { MainInputSearchData, Item } from "@/types"

interface Props {
    inputRef: React.RefObject<HTMLInputElement | null>
    onParse: (searchData: MainInputSearchData) => void
    selectedIndex: number
    selectedItem: Item | undefined
    visibleItemCount: number
    onSelectedIndexChange: (index: number) => void
}

export default function MainInput({
    inputRef,
    onParse,
    selectedIndex,
    selectedItem,
    visibleItemCount,
    onSelectedIndexChange,
}: Props) {
    const [inputValue, setInputValue] = useState("")
    const { createItemMutation } = useItems()
    const searchData = useMainInputParser(inputValue)

    useEffect(() => {
        onParse(searchData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        onSelectedIndexChange(-1)
    }

    const handleSubmit = () => {
        if (!inputValue.trim()) return
        if (searchData.filterType !== undefined || searchData.tags.length > 0) return
        const creationData = parseCreationData(inputValue)
        createItemMutation.mutate(buildItem(creationData))
        setInputValue("")
    }

    const handlePrimaryAction = () => {
        if (selectedIndex < 0) return
        document.querySelector<HTMLElement>(`[data-item-index="${selectedIndex}"]`)?.click()
    }

    const handleCopySelected = () => {
        if (!selectedItem) return
        navigator.clipboard.writeText(selectedItem.content)
    }

    const moveSelection = (delta: number) => {
        if (visibleItemCount === 0) return
        const targetIndex = selectedIndex + delta
        const clampedIndex = Math.max(-1, Math.min(targetIndex, visibleItemCount - 1))
        onSelectedIndexChange(clampedIndex)
    }

    const jumpToTop = () => {
        if (visibleItemCount === 0) return
        onSelectedIndexChange(0)
    }

    const jumpToBottom = () => {
        if (visibleItemCount === 0) return
        onSelectedIndexChange(visibleItemCount - 1)
    }

    const handleEscapePress = () => {
        onSelectedIndexChange(-1)
        inputRef.current?.blur()
    }

    const hotkeyHandler = useMemo(
        () =>
            getHotkeyHandler([
                ["Enter", handleSubmit],
                [SHORTCUT_NAV_ACTION, handlePrimaryAction],
                [SHORTCUT_NAV_DOWN, () => moveSelection(1)],
                [SHORTCUT_NAV_UP, () => moveSelection(-1)],
                [SHORTCUT_NAV_DOWN_SKIP, () => moveSelection(5)],
                [SHORTCUT_NAV_UP_SKIP, () => moveSelection(-5)],
                [SHORTCUT_NAV_TOP, jumpToTop],
                [SHORTCUT_NAV_BOTTOM, jumpToBottom],
                ["Escape", handleEscapePress],
                [SHORTCUT_ITEM_COPY, handleCopySelected],
                [SHORTCUT_ITEM_EDIT, () => selectedItem && openItemDialog(selectedItem)],
            ]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedItem],
    )

    return (
        <div className={styles.MainInput}>
            <input
                ref={inputRef}
                className={styles.MainInput__Input}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={hotkeyHandler}
                placeholder="Jot something..."
            />
        </div>
    )
}
