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
import { DateTime } from "luxon"
import { useItems } from "@/hooks/useItems"
import { openItemDialog } from "@/utils/openItemDialog"
import styles from "./JotItemContextMenu.module.scss"
import type { Item } from "@/types"

const ICON_SIZE = 14

interface Props {
    item: Item
}

export default function JotItemContextMenu({ item }: Props) {
    const {
        updateItemMutation,
        softDeleteItemMutation,
        untrashItemMutation,
        hardDeleteItemMutation,
    } = useItems()

    const isInTrash = !!item.trashedAt

    const handleCopy = () => navigator.clipboard.writeText(item.content)
    const handleEdit = () => openItemDialog(item)
    const handleTrash = () => softDeleteItemMutation.mutate(item)
    const handleRestore = () => untrashItemMutation.mutate(item)
    const handleHardDelete = () => hardDeleteItemMutation.mutate(item)

    const handlePin = () =>
        updateItemMutation.mutate({
            ...item,
            isPinned: true,
            updatedAt: DateTime.now().toISO(),
        })
    const handleUnpin = () =>
        updateItemMutation.mutate({
            ...item,
            isPinned: undefined,
            updatedAt: DateTime.now().toISO(),
        })
    const handleConvertToTodo = () =>
        updateItemMutation.mutate({
            ...item,
            type: "todo",
            title: undefined,
            updatedAt: DateTime.now().toISO(),
        })
    const handleToggleCopyOnClick = () =>
        updateItemMutation.mutate({
            ...item,
            shouldCopyOnClick: item.shouldCopyOnClick ? undefined : true,
            updatedAt: DateTime.now().toISO(),
        })

    const secondaryItems = (
        <>
            {item.isPinned ? (
                <ContextMenu.Item className={styles.JotItemContextMenu__Item} onClick={handleUnpin}>
                    <IconPinnedOff size={ICON_SIZE} />
                    Unpin
                </ContextMenu.Item>
            ) : (
                <ContextMenu.Item className={styles.JotItemContextMenu__Item} onClick={handlePin}>
                    <IconPin size={ICON_SIZE} />
                    Pin
                </ContextMenu.Item>
            )}
            {item.type === "text" && (
                <ContextMenu.Item
                    className={styles.JotItemContextMenu__Item}
                    onClick={handleConvertToTodo}
                >
                    <IconSquareCheck size={ICON_SIZE} />
                    Convert to Todo
                </ContextMenu.Item>
            )}
            <ContextMenu.Item
                className={styles.JotItemContextMenu__Item}
                onClick={handleToggleCopyOnClick}
            >
                <IconCursorText size={ICON_SIZE} />
                {item.shouldCopyOnClick ? "Disable copy on click" : "Copy on click"}
            </ContextMenu.Item>
            {item.type === "link" && (
                <ContextMenu.Item
                    className={styles.JotItemContextMenu__Item}
                    onClick={() => {
                        /* task 26 */
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
            <ContextMenu.Item className={styles.JotItemContextMenu__Item} onClick={handleRestore}>
                <IconArrowBackUp size={ICON_SIZE} />
                Restore
            </ContextMenu.Item>
            <ContextMenu.Item
                className={`${styles.JotItemContextMenu__Item} ${styles["JotItemContextMenu__Item--Destructive"]}`}
                onClick={handleHardDelete}
            >
                <IconTrashX size={ICON_SIZE} />
                Permanently delete
            </ContextMenu.Item>
        </>
    ) : (
        <ContextMenu.Item
            className={`${styles.JotItemContextMenu__Item} ${styles["JotItemContextMenu__Item--Destructive"]}`}
            onClick={handleTrash}
        >
            <IconTrash size={ICON_SIZE} />
            Trash
        </ContextMenu.Item>
    )

    return (
        <ContextMenu.Portal>
            <ContextMenu.Content className={styles.JotItemContextMenu}>
                <ContextMenu.Item className={styles.JotItemContextMenu__Item} onClick={handleCopy}>
                    <IconCopy size={ICON_SIZE} />
                    Copy
                </ContextMenu.Item>
                <ContextMenu.Item className={styles.JotItemContextMenu__Item} onClick={handleEdit}>
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
