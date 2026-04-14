import * as ContextMenu from "@radix-ui/react-context-menu"
import {
    IconCopy,
    IconEdit,
    IconTrash,
    IconTrashX,
    IconArrowBackUp,
    IconRefresh,
    IconPin,
    IconPinnedOff,
    IconSquareCheck,
    IconCursorText,
} from "@tabler/icons-react"
import { useItemActions } from "@/hooks/useItemActions"
import styles from "./JotItemContextMenu.module.scss"
import type { Item } from "@/types"

const ICON_SIZE = 14

interface Props {
    item: Item
}

export default function JotItemContextMenu({ item }: Props) {
    const {
        copyContent,
        editItem,
        trashItem,
        restoreItem,
        softDeleteItem,
        pinItem,
        unpinItem,
        convertToTodo,
        toggleCopyOnClick,
        refetchLinkMeta,
    } = useItemActions()

    const isInTrash = !!item.trashedAt

    const secondaryItems = (
        <>
            {item.isPinned ? (
                <ContextMenu.Item
                    className={styles.JotItemContextMenu__Item}
                    onClick={() => {
                        unpinItem(item)
                    }}
                >
                    <IconPinnedOff size={ICON_SIZE} />
                    Unpin
                </ContextMenu.Item>
            ) : (
                <ContextMenu.Item
                    className={styles.JotItemContextMenu__Item}
                    onClick={() => {
                        pinItem(item)
                    }}
                >
                    <IconPin size={ICON_SIZE} />
                    Pin
                </ContextMenu.Item>
            )}
            {item.type === "text" && (
                <ContextMenu.Item
                    className={styles.JotItemContextMenu__Item}
                    onClick={() => {
                        convertToTodo(item)
                    }}
                >
                    <IconSquareCheck size={ICON_SIZE} />
                    Convert to Todo
                </ContextMenu.Item>
            )}
            <ContextMenu.Item
                className={styles.JotItemContextMenu__Item}
                onClick={() => {
                    toggleCopyOnClick(item)
                }}
            >
                <IconCursorText size={ICON_SIZE} />
                {item.shouldCopyOnClick ? "Disable copy on click" : "Copy on click"}
            </ContextMenu.Item>
            {item.type === "link" && (
                <ContextMenu.Item
                    className={styles.JotItemContextMenu__Item}
                    onClick={() => {
                        refetchLinkMeta(item)
                    }}
                >
                    <IconRefresh size={ICON_SIZE} />
                    Refetch
                </ContextMenu.Item>
            )}
        </>
    )

    const destructiveItems = isInTrash ? (
        <>
            <ContextMenu.Item
                className={styles.JotItemContextMenu__Item}
                onClick={() => {
                    restoreItem(item)
                }}
            >
                <IconArrowBackUp size={ICON_SIZE} />
                Restore
            </ContextMenu.Item>
            <ContextMenu.Item
                className={`${styles.JotItemContextMenu__Item} ${styles["JotItemContextMenu__Item--Destructive"]}`}
                onClick={() => {
                    softDeleteItem(item)
                }}
            >
                <IconTrashX size={ICON_SIZE} />
                Permanently delete
            </ContextMenu.Item>
        </>
    ) : (
        <ContextMenu.Item
            className={`${styles.JotItemContextMenu__Item} ${styles["JotItemContextMenu__Item--Destructive"]}`}
            onClick={() => {
                trashItem(item)
            }}
        >
            <IconTrash size={ICON_SIZE} />
            Trash
        </ContextMenu.Item>
    )

    return (
        <ContextMenu.Portal>
            <ContextMenu.Content className={styles.JotItemContextMenu}>
                <ContextMenu.Item
                    className={styles.JotItemContextMenu__Item}
                    onClick={() => {
                        copyContent(item)
                    }}
                >
                    <IconCopy size={ICON_SIZE} />
                    Copy
                </ContextMenu.Item>
                <ContextMenu.Item
                    className={styles.JotItemContextMenu__Item}
                    onClick={() => {
                        editItem(item)
                    }}
                >
                    <IconEdit size={ICON_SIZE} />
                    Edit
                </ContextMenu.Item>
                <ContextMenu.Separator className={styles.JotItemContextMenu__Separator} />
                {secondaryItems}
                <ContextMenu.Separator className={styles.JotItemContextMenu__Separator} />
                {destructiveItems}
            </ContextMenu.Content>
        </ContextMenu.Portal>
    )
}
