import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { IconGripVertical, IconPencil } from "@tabler/icons-react"
import { DateTime } from "luxon"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { useCollectionsMutations } from "@/hooks/useCollectionsMutations"
import { useProfileSettings } from "@/store/profileSettings"
import { openCollectionDialog } from "@/utils/openCollectionDialog"
import styles from "./index.module.scss"
import type { Collection } from "@/types"
import type { DropResult } from "@hello-pangea/dnd"

export default function Collections() {
    const { collectionsQuery } = useCollectionsQuery()
    const { updateCollectionMutation } = useCollectionsMutations()
    const defaultCollectionSlug = useProfileSettings((s) => s.defaultCollectionSlug)

    const allCollections = collectionsQuery.data ?? []
    const userCollections = allCollections.filter((c) => !c.coreType)
    const trashCollection = allCollections.find((c) => c.coreType === "trash")

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return
        if (result.source.index === result.destination.index) return

        const reordered = [...userCollections]
        const [moved] = reordered.splice(result.source.index, 1)
        reordered.splice(result.destination.index, 0, moved)

        const prev = reordered[result.destination.index - 1]
        const next = reordered[result.destination.index + 1]

        let newSortOrder: number
        if (!prev) newSortOrder = (next?.sortOrder ?? 0) - 1000
        else if (!next) newSortOrder = prev.sortOrder + 1000
        else newSortOrder = (prev.sortOrder + next.sortOrder) / 2

        updateCollectionMutation.mutate({
            ...moved,
            sortOrder: newSortOrder,
            updatedAt: DateTime.now().toISO(),
        })
    }

    const draggableRows = userCollections.map((collection, index) => (
        <Draggable key={collection.id} draggableId={collection.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={[
                        styles.Collections__Row,
                        snapshot.isDragging ? styles["Collections__Row--Dragging"] : "",
                    ].join(" ")}
                >
                    <span className={styles.Collections__DragHandle} {...provided.dragHandleProps}>
                        <IconGripVertical size={16} />
                    </span>
                    <CollectionRow
                        collection={collection}
                        isDefault={collection.slug === defaultCollectionSlug}
                        onEdit={() => openCollectionDialog(collection)}
                    />
                </div>
            )}
        </Draggable>
    ))

    const trashRow = trashCollection && (
        <div className={styles.Collections__TrashRow}>
            <span className={styles.Collections__Icon}>{trashCollection.icon}</span>
            <span
                className={styles.Collections__ColourDot}
                style={{ backgroundColor: trashCollection.colour }}
            />
            <span className={styles.Collections__Name}>{trashCollection.name}</span>
        </div>
    )

    return (
        <div className={styles.Collections}>
            <div className={styles.Collections__Header}>
                <h1 className={styles.Collections__Title}>Collections</h1>
                <button
                    className={styles.Collections__BtnNew}
                    onClick={() => openCollectionDialog()}
                >
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
            {trashCollection && (
                <>
                    <div className={styles.Collections__TrashSeparator} />
                    {trashRow}
                </>
            )}
        </div>
    )
}

interface CollectionRowProps {
    collection: Collection
    isDefault: boolean
    onEdit: () => void
}

function CollectionRow({ collection, isDefault, onEdit }: CollectionRowProps) {
    return (
        <>
            <span className={styles.Collections__Icon}>{collection.icon}</span>
            <span
                className={styles.Collections__ColourDot}
                style={{ backgroundColor: collection.colour }}
            />
            <span className={styles.Collections__Name}>{collection.name}</span>
            {isDefault && (
                <span className={styles.Collections__DefaultBadge}>default</span>
            )}
            <button className={styles.Collections__BtnEdit} onClick={onEdit}>
                <IconPencil size={15} />
            </button>
        </>
    )
}
