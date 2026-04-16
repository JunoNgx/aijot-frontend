import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { DateTime } from "luxon"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { HexColorPicker } from "react-colorful"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"
import { useCollectionsMutations } from "@/hooks/useCollectionsMutations"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import { useDialogStore } from "@/store/dialogStore"
import { useProfileSettings } from "@/store/profileSettings"
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
    const {
        createCollectionMutation,
        updateCollectionMutation,
        deleteCollectionMutation,
    } = useCollectionsMutations()
    const { setAll, setUntagged, setTrash } = useCoreCollectionSettings()
    const closeAllDialogs = useDialogStore((s) => s.closeAllDialogs)
    const defaultCollectionSlug = useProfileSettings(
        (s) => s.defaultCollectionSlug,
    )
    const setDefaultCollectionSlug = useProfileSettings(
        (s) => s.setDefaultCollectionSlug,
    )

    const isEditing = !!collection

    const [nameVal, setNameVal] = useState(collection?.name ?? "")
    const [slugVal, setSlugVal] = useState(collection?.slug ?? "")
    const [iconVal, setIconVal] = useState(collection?.icon ?? "")
    const [colourVal, setColourVal] = useState(collection?.colour ?? "#d0d0d0")
    const [typesVal, setTypesVal] = useState<ItemType[]>(
        collection?.types ?? ALL_TYPES,
    )
    const [tagStr, setTagStr] = useState(collection?.tags.join(" ") ?? "")
    const [saveError, setSaveError] = useState<string | null>(null)
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
    const [isColourPickerOpen, setIsColourPickerOpen] = useState(false)
    const isDefault = isEditing && collection.slug === defaultCollectionSlug

    const isSlugManuallyEditedRef = useRef(isEditing)
    const emojiBtnRef = useRef<HTMLButtonElement>(null)
    const emojiPortalRef = useRef<HTMLDivElement>(null)
    const colourPickerRef = useRef<HTMLDivElement>(null)
    const [emojiPickerPos, setEmojiPickerPos] = useState<{
        top: number
        left: number
    } | null>(null)

    useEffect(() => {
        if (!isEmojiPickerOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node
            if (
                !emojiBtnRef.current?.contains(target) &&
                !emojiPortalRef.current?.contains(target)
            ) {
                setIsEmojiPickerOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [isEmojiPickerOpen])

    useEffect(() => {
        if (!isColourPickerOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (!colourPickerRef.current?.contains(e.target as Node)) {
                setIsColourPickerOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [isColourPickerOpen])


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

    const handleEmojiSelect = (emoji: { native: string }) => {
        setIconVal(emoji.native)
        setIsEmojiPickerOpen(false)
        setEmojiPickerPos(null)
    }

    const handleEmojiBtnClick = () => {
        if (isEmojiPickerOpen) {
            setIsEmojiPickerOpen(false)
            setEmojiPickerPos(null)
            return
        }
        const rect = emojiBtnRef.current?.getBoundingClientRect()
        if (rect) {
            setEmojiPickerPos({ top: rect.bottom + 4, left: rect.right })
        }
        setIsEmojiPickerOpen(true)
    }

    const handleTypeToggle = (type: ItemType) => {
        setTypesVal((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type],
        )
    }

    const handleSave = () => {
        if (!nameVal.trim()) {
            setSaveError("Name is required.")
            return
        }
        if (!slugVal.trim()) {
            setSaveError("Slug is required.")
            return
        }
        setSaveError(null)

        const now = DateTime.now().toISO()
        const tags = tagStr
            .trim()
            .split(" ")
            .filter((t) => t.length > 0)

        const newSlug = slugVal.trim()

        if (isEditing && collection.slug === defaultCollectionSlug) {
            setDefaultCollectionSlug(newSlug)
        }

        if (isEditing && collection.coreType) {
            const coreConfig = {
                name: nameVal.trim(),
                slug: newSlug,
                icon: iconVal,
                colour: colourVal,
                updatedAt: now,
            }
            if (collection.coreType === "all") setAll(coreConfig)
            if (collection.coreType === "untagged") setUntagged(coreConfig)
            if (collection.coreType === "trash") setTrash(coreConfig)
            closeAllDialogs()
            return
        }

        if (isEditing) {
            updateCollectionMutation.mutate({
                ...collection,
                name: nameVal.trim(),
                slug: newSlug,
                icon: iconVal,
                colour: colourVal,
                types: typesVal,
                tags,
                updatedAt: now,
            })
            closeAllDialogs()
            return
        }

        const userCollections = (collectionsQuery.data ?? []).filter(
            (c) => !c.coreType,
        )
        const maxSortOrder =
            userCollections.length > 0
                ? Math.max(...userCollections.map((c) => c.sortOrder))
                : 0

        createCollectionMutation.mutate({
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
            name: nameVal.trim(),
            slug: newSlug,
            icon: iconVal,
            colour: colourVal,
            types: typesVal,
            tags,
            sortOrder: maxSortOrder + 1000,
        })

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
            <div className="FlexRow">
                <div className={styles.CollectionDialog__Field}>
                    <label className={styles.CollectionDialog__Label}>
                        Name
                    </label>
                    <input
                        className="Dialog__Input"
                        autoFocus
                        value={nameVal}
                        onChange={handleNameChange}
                    />
                </div>
                <div className={styles.CollectionDialog__FieldAuto}>
                    <label className={styles.CollectionDialog__Label}>
                        Icon
                    </label>
                    <div className={styles.CollectionDialog__EmojiField}>
                        <button
                            ref={emojiBtnRef}
                            type="button"
                            className={styles.CollectionDialog__EmojiBtn}
                            onClick={handleEmojiBtnClick}
                        >
                            {iconVal || "..."}
                        </button>
                        {isEmojiPickerOpen &&
                            emojiPickerPos &&
                            createPortal(
                                <div
                                    ref={emojiPortalRef}
                                    className={
                                        styles.CollectionDialog__EmojiPicker
                                    }
                                    style={{
                                        top: emojiPickerPos.top,
                                        left: emojiPickerPos.left,
                                    }}
                                >
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                        theme="auto"
                                    />
                                </div>,
                                document.body,
                            )}
                    </div>
                </div>
            </div>
            <div className="FlexRow">
                <div className={styles.CollectionDialog__Field}>
                    <label className={styles.CollectionDialog__Label}>
                        Slug
                    </label>
                    <input
                        className="Dialog__Input"
                        value={slugVal}
                        onChange={handleSlugChange}
                    />
                </div>
                <div className={styles.CollectionDialog__Field}>
                    <label className={styles.CollectionDialog__Label}>
                        Colour
                    </label>
                    <div
                        className={styles.CollectionDialog__ColourField}
                        ref={colourPickerRef}
                    >
                        <div className={styles.CollectionDialog__ColourRow}>
                            <input
                                className="Dialog__Input"
                                value={colourVal}
                                onChange={(e) => setColourVal(e.target.value)}
                                placeholder="#rrggbb"
                            />
                            <button
                                type="button"
                                className={
                                    styles.CollectionDialog__ColourPreviewBlock
                                }
                                style={{ backgroundColor: swatchColour }}
                                onClick={() =>
                                    setIsColourPickerOpen((prev) => !prev)
                                }
                            />
                        </div>
                        {isColourPickerOpen && (
                            <div
                                className={
                                    styles.CollectionDialog__ColourPicker
                                }
                            >
                                <HexColorPicker
                                    color={
                                        isColourValid ? colourVal : "#d0d0d0"
                                    }
                                    onChange={setColourVal}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {!collection?.coreType && (
                <div className={styles.CollectionDialog__Field}>
                    <label className={styles.CollectionDialog__Label}>
                        Types
                    </label>
                    <span className={styles.CollectionDialog__Description}>
                        Items of selected types appear in this collection
                    </span>
                    <div className={styles.CollectionDialog__TypesRow}>
                        {typeCheckboxes}
                    </div>
                </div>
            )}
            <div className={styles.CollectionDialog__Field}>
                <label className={styles.CollectionDialog__Label}>Tags</label>
                <span className={styles.CollectionDialog__Description}>
                    Separated by spaces
                </span>
                <input
                    className="Dialog__Input"
                    value={tagStr}
                    onChange={handleTagStrChange}
                    placeholder="tag1 tag2 tag3"
                />
            </div>
            {/* TODO: don't stretch this button fully wide */}
            {isEditing && (
                <div className={styles.CollectionDialog__Field}>
                    {isDefault ? (
                        <span
                            className={
                                styles.CollectionDialog__DefaultIndicator
                            }
                        >
                            This is currently your default collection
                        </span>
                    ) : (
                        <button
                            className={styles.CollectionDialog__BtnSetDefault}
                            type="button"
                            onClick={() =>
                                setDefaultCollectionSlug(collection.slug)
                            }
                        >
                            Set as default collection
                        </button>
                    )}
                </div>
            )}
            {saveError && (
                <p className={styles.CollectionDialog__Error}>{saveError}</p>
            )}
            <div className={styles.CollectionDialog__Footer}>
                <div>
                    {isEditing && !collection.coreType && (
                        <button
                            className={styles.CollectionDialog__BtnDelete}
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>
                <div className={styles.CollectionDialog__Actions}>
                    <button
                        className={styles.CollectionDialog__BtnSave}
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
