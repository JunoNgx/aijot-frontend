import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { IconGripVertical, IconPlus } from "@tabler/icons-react"
import { DateTime } from "luxon"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { useCollectionsMutations } from "@/hooks/useCollectionsMutations"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import { useProfileSettings } from "@/store/profileSettings"
import { openCollectionDialog } from "@/utils/openCollectionDialog"
import styles from "./index.module.scss"
import { ICON_PROPS_BUTTON, ICON_PROPS_NORMAL } from "@/utils/constants"
import BackBtn from "@/components/BackBtn"
import CollectionColourBlock from "@/components/CollectionColourBlock"
import type { Collection } from "@/types"
import type { DropResult } from "@hello-pangea/dnd"

export default function Collections() {
    const { collectionsQuery } = useCollectionsQuery()
    const { updateCollectionMutation } = useCollectionsMutations()
    const { setAll, setUntagged, setTrash, all, untagged, trash } =
        useCoreCollectionSettings()
    const defaultCollectionSlug = useProfileSettings(
        (s) => s.defaultCollectionSlug,
    )

    const sortedCollections = (collectionsQuery.data ?? [])
        .map((c) => {
            if (c.coreType === "all") return { ...c, sortOrder: all.sortOrder }
            if (c.coreType === "untagged")
                return { ...c, sortOrder: untagged.sortOrder }
            if (c.coreType === "trash")
                return { ...c, sortOrder: trash.sortOrder }
            return c
        })
        .sort((a, b) => a.sortOrder - b.sortOrder)

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return
        if (result.source.index === result.destination.index) return

        const reorderedItems = [...sortedCollections]
        const [draggedItem] = reorderedItems.splice(result.source.index, 1)
        reorderedItems.splice(result.destination.index, 0, draggedItem)

        const itemBefore = reorderedItems[result.destination.index - 1]
        const itemAfter = reorderedItems[result.destination.index + 1]

        let newSortOrder: number
        if (!itemBefore) newSortOrder = (itemAfter?.sortOrder ?? 0) - 1000
        else if (!itemAfter) newSortOrder = itemBefore.sortOrder + 1000
        else newSortOrder = (itemBefore.sortOrder + itemAfter.sortOrder) / 2

        if (draggedItem.coreType === "all") {
            setAll({
                sortOrder: newSortOrder,
                updatedAt: DateTime.now().toISO(),
            })
            return
        }
        if (draggedItem.coreType === "untagged") {
            setUntagged({
                sortOrder: newSortOrder,
                updatedAt: DateTime.now().toISO(),
            })
            return
        }
        if (draggedItem.coreType === "trash") {
            setTrash({
                sortOrder: newSortOrder,
                updatedAt: DateTime.now().toISO(),
            })
            return
        }

        updateCollectionMutation.mutate({
            ...draggedItem,
            sortOrder: newSortOrder,
            updatedAt: DateTime.now().toISO(),
        })
    }

    const draggableRows = sortedCollections.map((collection, index) => (
        <Draggable
            key={collection.id}
            draggableId={collection.id}
            index={index}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={[
                        styles.CollectionItem,
                        snapshot.isDragging
                            ? styles["CollectionItem--Dragging"]
                            : "",
                    ].join(" ")}
                >
                    <button
                        className={styles.CollectionItem__TriggerBtn}
                        onClick={() => openCollectionDialog(collection)}
                    >
                        <CollectionRow
                            collection={collection}
                            isDefault={
                                collection.slug === defaultCollectionSlug
                            }
                        />
                    </button>
                    <span
                        className={styles.CollectionItem__DragHandle}
                        {...provided.dragHandleProps}
                    >
                        <IconGripVertical {...ICON_PROPS_NORMAL} />
                    </span>
                </div>
            )}
        </Draggable>
    ))

    return (
        <div className={styles.Collections}>
            <BackBtn />
            <div className={styles.Collections__Header}>
                <h1 className={styles.Collections__Title}>Collections</h1>
                <button
                    className={styles.Collections__BtnNew}
                    onClick={() => openCollectionDialog()}
                >
                    <IconPlus {...ICON_PROPS_BUTTON} />
                    New
                </button>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="collections">
                    {(provided) => (
                        <div
                            className={styles.Collections__List}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {draggableRows}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

interface CollectionRowProps {
    collection: Collection
    isDefault: boolean
}

function CollectionRow({ collection, isDefault }: CollectionRowProps) {
    return (
        <>
            <span className={styles.CollectionItem__Icon}>
                {collection.icon}
            </span>
            <CollectionColourBlock colour={collection.colour} />
            <span className={styles.CollectionItem__Name}>
                {collection.name}
            </span>
            {collection.tags.length > 0 && (
                <span className={styles.CollectionItem__Tags}>
                    {collection.tags.join(" ")}
                </span>
            )}
            {collection.coreType && (
                <span className={styles.CollectionItem__CoreBadge}>
                    [{collection.coreType}]
                </span>
            )}
            <span className={styles.CollectionItem__Indicators}>
                {isDefault && (
                    <span className={styles.CollectionItem__DefaultBadge}>
                        [default]
                    </span>
                )}
            </span>
        </>
    )
}
