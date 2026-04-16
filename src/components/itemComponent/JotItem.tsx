import { useState, type MouseEvent } from "react"
import * as ContextMenu from "@radix-ui/react-context-menu"
import {
    IconNote,
    IconLink,
    IconSquare,
    IconCheckbox,
    IconPin,
    IconClipboard,
} from "@tabler/icons-react"
import { isValidHexColourCode, formatDatetime } from "@/utils/helpers"
import { ICON_PROPS_ITEM_ICON, ICON_PROPS_ITEM_STATUS, ICON_PROPS_NORMAL } from "@/utils/constants"
import { useProfileSettings } from "@/store/profileSettings"
import { useItemActions } from "@/hooks/useItemActions"
import JotItemContextMenu from "./JotItemContextMenu"
import type { Item } from "@/types"
import styles from "./JotItem.module.scss"

interface Props {
    item: Item
    isSelected: boolean
    itemIndex: number
}

function FaviconIcon({ url }: { url: string }) {
    const [hasFailed, setHasFailed] = useState(false)
    if (hasFailed) return <IconLink {...ICON_PROPS_NORMAL} />
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
        return item.isDone ? (
            <IconCheckbox {...ICON_PROPS_ITEM_ICON} />
        ) : (
            <IconSquare {...ICON_PROPS_ITEM_ICON} />
        )
    }
    if (item.type === "link") {
        if (item.faviconUrl) return <FaviconIcon url={item.faviconUrl} />
        return <IconLink {...ICON_PROPS_ITEM_ICON} />
    }
    const lastSevenChars = item.content.slice(-7)
    if (isValidHexColourCode(lastSevenChars)) {
        return (
            <span
                className={styles.JotItem__ColourBlock}
                style={{ backgroundColor: lastSevenChars }}
            />
        )
    }
    return <IconNote {...ICON_PROPS_ITEM_ICON} />
}

export default function JotItem({ item, isSelected, itemIndex }: Props) {
    const { triggerPrimaryAction } = useItemActions()
    const is24HourClock = useProfileSettings((s) => s.is24HourClock)

    const primaryText =
        item.type === "todo" ? item.content : (item.title ?? item.content)
    const secondaryText =
        item.type !== "todo" && item.title ? item.content : null
    const datetime = formatDatetime(item.jottedAt, is24HourClock)

    const secondaryTextEl = secondaryText && (
        <span className={styles.JotItem__SecondaryText}>{secondaryText}</span>
    )

    const rootClassName = [
        styles.JotItem,
        isSelected ? styles["JotItem--Selected"] : "",
    ].join(" ")

    const wrapperProps =
        item.type === "link"
            ? {
                  as: "a" as const,
                  href: item.content,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  tabindex: "-1",
                  onClick: (e: MouseEvent) => {
                      triggerPrimaryAction(item, e)
                  },
              }
            : {
                  as: "div" as const,
                  onClick: (e: MouseEvent) => {
                      triggerPrimaryAction(item, e)
                  },
              }
    const { as: Tag, ...rest } = wrapperProps

    const itemIndicators = (
        <div className={styles.JotItem__StatusWrapper}>
            {item.shouldCopyOnClick && (
                <span className={styles.JotItem__StatusIcon}>
                    <IconClipboard {...ICON_PROPS_ITEM_STATUS} />
                </span>
            )}
            {item.isPinned && (
                <span className={styles.JotItem__StatusIcon}>
                    <IconPin {...ICON_PROPS_ITEM_STATUS} />
                </span>
            )}
        </div>
    )

    const itemBody = (
        <div className={styles.JotItem__Body}>
            <span
                className={[
                    styles.JotItem__PrimaryText,
                    item.isDone
                        ? styles["JotItem__PrimaryText--TodoDone"]
                        : "",
                ].join(" ")}
            >
                {primaryText}
            </span>
            {secondaryTextEl}
        </div>
    )

    const itemIcon = (
        <span className={styles.JotItem__Icon}>
            <ItemIcon item={item} />
        </span>
    )
    const itemDatetime = (
        <span className={styles.JotItem__Datetime}>{datetime}</span>
    )

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger asChild>
                <Tag
                    className={rootClassName}
                    data-item-index={itemIndex}
                    {...rest}
                >
                    {itemIcon}
                    {itemBody}
                    {itemIndicators}
                    {itemDatetime}
                </Tag>
            </ContextMenu.Trigger>
            <JotItemContextMenu item={item} />
        </ContextMenu.Root>
    )
}
