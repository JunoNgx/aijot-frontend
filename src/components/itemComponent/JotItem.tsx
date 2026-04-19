import { useState, type MouseEvent } from "react"
import * as ContextMenu from "@radix-ui/react-context-menu"
import {
    IconNote,
    IconLink,
    IconWorld,
    IconSquare,
    IconCheckbox,
    IconClipboard,
    IconHourglassLow,
    IconPinFilled,
} from "@tabler/icons-react"
import { isValidHexColourCode, formatDatetime } from "@/utils/helpers"
import { DateTime } from "luxon"
import {
    ICON_PROPS_ITEM_ICON,
    ICON_PROPS_ITEM_STATUS,
    ICON_PROPS_NORMAL,
} from "@/utils/constants"
import { useProfileSettings } from "@/store/profileSettings"
import { useItemActions } from "@/hooks/useItemActions"
import JotItemContextMenu from "./JotItemContextMenu"
import type { Item } from "@/types"
import styles from "./JotItem.module.scss"

interface Props {
    item: Item
    isSelected: boolean
    itemIndex: number
    isExpandedInfoMode: boolean
    id?: string
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
    if (item.isFetchingLinkMeta) {
        return <IconHourglassLow {...ICON_PROPS_ITEM_ICON} />
    }

    if (item.type === "todo") {
        return item.isDone ? (
            <IconCheckbox {...ICON_PROPS_ITEM_ICON} />
        ) : (
            <IconSquare {...ICON_PROPS_ITEM_ICON} />
        )
    }
    if (item.type === "link") {
        if (item.faviconUrl) return <FaviconIcon url={item.faviconUrl} />
        return <IconWorld {...ICON_PROPS_ITEM_ICON} />
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

function formatDetailedDatetime(isoString: string, is24HourClock = true) {
    const date = DateTime.fromISO(isoString)
    return date.toFormat(
        is24HourClock ? "MMM d, yyyy HH:mm" : "MMM d, yyyy h:mm a",
    )
}

export default function JotItem({
    item,
    isSelected,
    itemIndex,
    isExpandedInfoMode,
    id,
}: Props) {
    const { triggerPrimaryAction } = useItemActions()
    const is24HourClock = useProfileSettings((s) => s.is24HourClock)
    const isPrimaryTextTitle = item.type !== "todo" && item.title !== undefined
    const primaryText = isPrimaryTextTitle ? item.title! : item.content
    const secondaryText = isPrimaryTextTitle ? item.content : null
    const datetime = formatDatetime(item.jottedAt, is24HourClock)
    const detailedDatetime = formatDetailedDatetime(
        item.jottedAt,
        is24HourClock,
    )

    const secondaryTextEl = secondaryText && (
        <span className={styles.JotItem__SecondaryText}>{secondaryText}</span>
    )

    const rootClassName = [
        styles.JotItem,
        isSelected ? styles["JotItem--Selected"] : "",
        isExpandedInfoMode ? styles["JotItem--Expanded"] : "",
    ].join(" ")

    const getAccessibleLabel = () => {
        const truncateText = (text: string, maxLength: number) => {
            if (text.length <= maxLength) return text
            return text.slice(0, maxLength).trim() + "..."
        }

        const typeLabel =
            item.type === "todo"
                ? item.isDone
                    ? "Completed todo"
                    : "Todo"
                : item.type === "link"
                  ? "Link"
                  : "Text"

        return [typeLabel, truncateText(primaryText, 100)]
            .filter(Boolean)
            .join(": ")
    }

    const wrapperProps =
        item.type === "link"
            ? {
                  as: "a" as const,
                  href: item.content,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  tabIndex: -1,
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
                <span
                    className={styles.JotItem__StatusIcon}
                    aria-label="Auto-copy on click"
                >
                    <IconClipboard {...ICON_PROPS_ITEM_STATUS} />
                </span>
            )}
            {item.isPinned && (
                <span
                    className={`
                        ${styles.JotItem__StatusIcon}
                        ${styles["JotItem__StatusIcon--Pin"]}
                    `}
                    aria-label="Pinned"
                >
                    <IconPinFilled {...ICON_PROPS_ITEM_STATUS} />
                </span>
            )}
        </div>
    )

    const itemBody = (
        <div className={styles.JotItem__Body}>
            <span
                className={[
                    styles.JotItem__PrimaryText,
                    item.isDone ? styles["JotItem__PrimaryText--TodoDone"] : "",
                    isPrimaryTextTitle
                        ? styles["JotItem__PrimaryText--Title"]
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

    const tagsEl = (
        <span className={styles.JotItem__Tags}>
            {item.tags.length > 0 ? item.tags.join(" ") : "[untagged]"}
        </span>
    )

    const compactDatetimeEl = (
        <span className={styles.JotItem__Datetime}>{datetime}</span>
    )

    const expandedDatetimeEl = (
        <span className={styles.JotItem__Datetime}>{detailedDatetime}</span>
    )

    const compactContent = (
        <>
            {itemIcon}
            {itemBody}
            {itemIndicators}
            {compactDatetimeEl}
        </>
    )

    const expandedRow1 = (
        <div className={styles.JotItem__ExpandedRow1}>
            {itemIcon}
            <span
                className={[
                    styles.JotItem__PrimaryText,
                    item.isDone ? styles["JotItem__PrimaryText--TodoDone"] : "",
                    isPrimaryTextTitle
                        ? styles["JotItem__PrimaryText--Title"]
                        : "",
                ].join(" ")}
            >
                {primaryText}
            </span>
            {itemIndicators}
        </div>
    )

    const expandedRow2 = (
        <div className={styles.JotItem__ExpandedRow2}>
            {tagsEl}
            <span className={styles.JotItem__ExpandedRow2Right}>
                {expandedDatetimeEl}
            </span>
        </div>
    )

    const expandedContent = (
        <>
            {expandedRow1}
            {expandedRow2}
        </>
    )

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger asChild>
                <Tag
                    className={rootClassName}
                    data-item-index={itemIndex}
                    id={id}
                    role="option"
                    aria-selected={isSelected}
                    aria-label={getAccessibleLabel()}
                    {...rest}
                >
                    {isExpandedInfoMode ? expandedContent : compactContent}
                </Tag>
            </ContextMenu.Trigger>
            <JotItemContextMenu item={item} />
        </ContextMenu.Root>
    )
}
