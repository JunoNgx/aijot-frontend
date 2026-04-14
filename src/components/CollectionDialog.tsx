import { useState, useRef } from "react"
import { DateTime } from "luxon"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { useCollectionsMutations } from "@/hooks/useCollectionsMutations"
import { useDialogStore } from "@/store/dialogStore"
import { generateSlug, isValidHexColourCode } from "@/utils/helpers"
import styles from "./CollectionDialog.module.scss"
import type { Collection, ItemType } from "@/types"

const ALL_TYPES: ItemType[] = ["text", "todo", "link"]
const TYPE_LABELS: Record<ItemType, string> = {
    text: "Text",
    todo: "Todo",
    link: "Link",
}

interface Props {
    collection?: Collection
}

export default function CollectionDialog({ collection }: Props) {
    const { collectionsQuery } = useCollectionsQuery()
    const { createCollectionMutation, updateCollectionMutation, deleteCollectionMutation } =
        useCollectionsMutations()
    const closeAllDialogs = useDialogStore((s) => s.closeAllDialogs)

    const isEditing = !!collection

    const [nameVal, setNameVal] = useState(collection?.name ?? "")
    const [slugVal, setSlugVal] = useState(collection?.slug ?? "")
    const [iconVal, setIconVal] = useState(collection?.icon ?? "")
    const [colourVal, setColourVal] = useState(collection?.colour ?? "#d0d0d0")
    const [typesVal, setTypesVal] = useState<ItemType[]>(collection?.types ?? ALL_TYPES)
    const [tagStr, setTagStr] = useState(collection?.tags.join(" ") ?? "")

    const isSlugManuallyEditedRef = useRef(isEditing)

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameVal(e.target.value)
        if (!isSlugManuallyEditedRef.current) {
            setSlugVal(generateSlug(e.target.value))
        }
    }

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isSlugManuallyEditedRef.current = true
        setSlugVal(e.target.value)
    }

    const handleTagStrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const collapsed = e.target.value.replace(/  +/g, " ")
        setTagStr(collapsed)
    }

    const handleTypeToggle = (type: ItemType) => {
        setTypesVal((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
        )
    }

    const handleSave = () => {
        const now = DateTime.now().toISO()
        const tags = tagStr
            .trim()
            .split(" ")
            .filter((t) => t.length > 0)

        if (isEditing) {
            updateCollectionMutation.mutate({
                ...collection,
                name: nameVal.trim(),
                slug: slugVal.trim(),
                icon: iconVal,
                colour: colourVal,
                types: typesVal,
                tags,
                updatedAt: now,
            })
        } else {
            const userCollections = (collectionsQuery.data ?? []).filter((c) => !c.coreType)
            const maxSortOrder =
                userCollections.length > 0
                    ? Math.max(...userCollections.map((c) => c.sortOrder))
                    : 0

            createCollectionMutation.mutate({
                id: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now,
                name: nameVal.trim(),
                slug: slugVal.trim(),
                icon: iconVal,
                colour: colourVal,
                types: typesVal,
                tags,
                sortOrder: maxSortOrder + 1000,
            })
        }

        closeAllDialogs()
    }

    const handleDelete = () => {
        if (!collection) return
        deleteCollectionMutation.mutate(collection)
        closeAllDialogs()
    }

    const isColourValid = isValidHexColourCode(colourVal)
    const swatchColour = isColourValid ? colourVal : "transparent"

    const typeCheckboxes = ALL_TYPES.map((type) => (
        <label key={type} className={styles.CollectionDialog__TypeLabel}>
            <input
                type="checkbox"
                checked={typesVal.includes(type)}
                onChange={() => handleTypeToggle(type)}
            />
            {TYPE_LABELS[type]}
        </label>
    ))

    return (
        <div className={styles.CollectionDialog}>
            <div className={styles.CollectionDialog__Field}>
                <label className={styles.CollectionDialog__Label}>Name</label>
                <input autoFocus value={nameVal} onChange={handleNameChange} />
            </div>
            <div className={styles.CollectionDialog__Field}>
                <label className={styles.CollectionDialog__Label}>Slug</label>
                <input value={slugVal} onChange={handleSlugChange} />
            </div>
            <div className={styles.CollectionDialog__Field}>
                <label className={styles.CollectionDialog__Label}>Icon</label>
                <input value={iconVal} onChange={(e) => setIconVal(e.target.value)} />
            </div>
            <div className={styles.CollectionDialog__Field}>
                <label className={styles.CollectionDialog__Label}>Colour</label>
                <div className={styles.CollectionDialog__ColourRow}>
                    <input
                        value={colourVal}
                        onChange={(e) => setColourVal(e.target.value)}
                        placeholder="#rrggbb"
                    />
                    <div
                        className={styles.CollectionDialog__ColourSwatch}
                        style={{ backgroundColor: swatchColour }}
                    />
                </div>
            </div>
            <div className={styles.CollectionDialog__Field}>
                <label className={styles.CollectionDialog__Label}>Types</label>
                <div className={styles.CollectionDialog__TypesRow}>{typeCheckboxes}</div>
                <span className={styles.CollectionDialog__Description}>
                    Items of selected types appear in this collection
                </span>
            </div>
            <div className={styles.CollectionDialog__Field}>
                <label className={styles.CollectionDialog__Label}>Tags</label>
                <input value={tagStr} onChange={handleTagStrChange} placeholder="tag1 tag2 tag3" />
                <span className={styles.CollectionDialog__Description}>Separated by spaces</span>
            </div>
            <div className={styles.CollectionDialog__Footer}>
                <div>
                    {isEditing && (
                        <button
                            className={styles.CollectionDialog__BtnDanger}
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>
                <div className={styles.CollectionDialog__Actions}>
                    <button className={styles.CollectionDialog__BtnPrimary} onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
