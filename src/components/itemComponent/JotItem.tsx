import { useState } from "react"
import * as ContextMenu from "@radix-ui/react-context-menu"
import { IconNote, IconLink, IconSquare, IconSquareCheck } from "@tabler/icons-react"
import { isValidHexColourCode, formatJottedAt } from "@/utils/helpers"
import { openItemDialog } from "@/components/ItemDialog"
import JotItemContextMenu from "./JotItemContextMenu"
import type { Item } from "@/types"
import styles from "./JotItem.module.scss"

const ICON_SIZE = 16

interface Props {
    item: Item
    isSelected: boolean
    itemIndex: number
}

function FaviconIcon({ url }: { url: string }) {
    const [hasFailed, setHasFailed] = useState(false)
    if (hasFailed) return <IconLink size={ICON_SIZE} />
    return (
        <img
            src={url}
            onError={() => setHasFailed(true)}
            className={styles.JotItem__Favicon}
            alt=""
        />
    )
}

function ItemIcon({ item }: { item: Item }) {
    if (item.type === "todo") {
        return item.isDone ? <IconSquareCheck size={ICON_SIZE} /> : <IconSquare size={ICON_SIZE} />
    }
    if (item.type === "link") {
        if (item.faviconUrl) return <FaviconIcon url={item.faviconUrl} />
        return <IconLink size={ICON_SIZE} />
    }
    if (isValidHexColourCode(item.content)) {
        return (
            <span
                className={styles.JotItem__ColourSwatch}
                style={{ backgroundColor: item.content }}
            />
        )
    }
    return <IconNote size={ICON_SIZE} />
}

export function triggerItemPrimaryAction(item: Item) {
    if (item.shouldCopyOnClick) {
        navigator.clipboard.writeText(item.content)
        return
    }
    if (item.type === "link") {
        window.open(item.content, "_blank")
        return
    }
    if (item.type === "text") {
        openItemDialog(item)
        return
    }
    // todo: toggle done — task 15b
}

export default function JotItem({ item, isSelected, itemIndex }: Props) {
    const primaryText = item.type === "todo" ? item.content : (item.title ?? item.content)
    const secondaryText = item.type !== "todo" && item.title ? item.content : null
    const datetime = formatJottedAt(item.jottedAt)

    const secondaryTextEl = secondaryText && (
        <span className={styles.JotItem__SecondaryText}>{secondaryText}</span>
    )

    const rootClassName = [styles.JotItem, isSelected ? styles["JotItem--Selected"] : ""].join(" ")

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger asChild>
                <div
                    className={rootClassName}
                    data-item-index={itemIndex}
                    onClick={() => triggerItemPrimaryAction(item)}
                >
                    <span className={styles.JotItem__Icon}>
                        <ItemIcon item={item} />
                    </span>
                    <div className={styles.JotItem__Body}>
                        <div className={styles.JotItem__Header}>
                            <span className={styles.JotItem__PrimaryText}>{primaryText}</span>
                            <span className={styles.JotItem__Datetime}>{datetime}</span>
                        </div>
                        {secondaryTextEl}
                    </div>
                </div>
            </ContextMenu.Trigger>
            <JotItemContextMenu item={item} />
        </ContextMenu.Root>
    )
}
