import { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from "react"
import * as Accordion from "@radix-ui/react-accordion"
import { DateTime } from "luxon"
import { EditorView, keymap, drawSelection } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { useItems } from "@/hooks/useItems"
import { useDebounced } from "@/hooks/useDebounced"
import { useDialogStore } from "@/store/dialogStore"
import { getHotkeyHandler } from "@/utils/hotkeyHandler"
import { SHORTCUT_SAVE_AND_CLOSE } from "@/utils/constants"
import styles from "./ItemDialog.module.scss"
import type { Item } from "@/types"

const AUTOSAVE_DEBOUNCE_MS = 5000

interface CodeMirrorEditorProps {
    initialValue: string
    onChange: (value: string) => void
    onSaveAndClose: () => void
    isReadOnly?: boolean
}

function CodeMirrorEditor({
    initialValue,
    onChange,
    onSaveAndClose,
    isReadOnly = false,
}: CodeMirrorEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const onChangeRef = useRef(onChange)
    const onSaveAndCloseRef = useRef(onSaveAndClose)
    useLayoutEffect(() => {
        onChangeRef.current = onChange
        onSaveAndCloseRef.current = onSaveAndClose
    })

    useEffect(() => {
        if (!containerRef.current) return
        const view = new EditorView({
            state: EditorState.create({
                doc: initialValue,
                extensions: [
                    history(),
                    drawSelection(),
                    EditorView.editable.of(!isReadOnly),
                    EditorState.readOnly.of(isReadOnly),
                    EditorView.theme({
                        ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--colText)" },
                    }),
                    keymap.of([
                        {
                            key: "Mod-s",
                            run: () => {
                                onSaveAndCloseRef.current()
                                return true
                            },
                        },
                        ...defaultKeymap,
                        ...historyKeymap,
                    ]),
                    EditorView.lineWrapping,
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            onChangeRef.current(update.state.doc.toString())
                        }
                    }),
                ],
            }),
            parent: containerRef.current,
        })
        if (!isReadOnly) view.focus()
        return () => view.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div ref={containerRef} className={styles.ItemDialog__CodeMirror} />
}

interface Props {
    item: Item
}

export default function ItemDialog({ item }: Props) {
    const { updateItemMutation, softDeleteItemMutation } = useItems()
    const closeAllDialogs = useDialogStore((s) => s.closeAllDialogs)

    const [titleVal, setTitleVal] = useState(item.title ?? "")
    const [contentVal, setContentVal] = useState(item.content)
    const [tagStr, setTagStr] = useState(item.tags.join(" "))
    const [jottedAtVal, setJottedAtVal] = useState<string | null>(item.jottedAt)
    const [saveStatusText, setSaveStatusText] = useState(
        `Saved ${DateTime.fromISO(item.updatedAt).toLocaleString(DateTime.TIME_WITH_SECONDS)}`,
    )

    const titleRef = useRef(titleVal)
    const contentRef = useRef(contentVal)
    const tagStrRef = useRef(tagStr)
    const jottedAtRef = useRef(jottedAtVal)
    const hasUnsavedChangesRef = useRef(false)
    const mutateRef = useRef(updateItemMutation.mutate)
    useLayoutEffect(() => {
        mutateRef.current = updateItemMutation.mutate
    })

    useEffect(() => {
        titleRef.current = titleVal
    }, [titleVal])
    useEffect(() => {
        contentRef.current = contentVal
    }, [contentVal])
    useEffect(() => {
        tagStrRef.current = tagStr
    }, [tagStr])
    useEffect(() => {
        jottedAtRef.current = jottedAtVal
    }, [jottedAtVal])

    const buildUpdatedItem = useCallback(
        (): Item => ({
            ...item,
            title: titleRef.current.trim() || undefined,
            content: contentRef.current,
            tags: tagStrRef.current
                .trim()
                .split(" ")
                .filter((t) => t.length > 0),
            jottedAt: jottedAtRef.current ?? item.jottedAt,
            updatedAt: DateTime.now().toISO(),
        }),
        [item],
    )

    const handleSave = useCallback(() => {
        mutateRef.current(buildUpdatedItem())
        setSaveStatusText(`Saved at ${DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS)}`)
        hasUnsavedChangesRef.current = false
    }, [buildUpdatedItem])

    const handleSaveAndClose = useCallback(() => {
        handleSave()
        closeAllDialogs()
    }, [handleSave, closeAllDialogs])

    const saveHotkeyHandler = useMemo(
        // eslint-disable-next-line react-hooks/refs
        () => getHotkeyHandler([[SHORTCUT_SAVE_AND_CLOSE, handleSaveAndClose]]),
        [handleSaveAndClose],
    )

    const debouncedSave = useDebounced(handleSave, AUTOSAVE_DEBOUNCE_MS)

    const markChanged = () => {
        hasUnsavedChangesRef.current = true
        setSaveStatusText("Unsaved changes...")
        debouncedSave()
    }

    const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleVal(e.target.value)
        markChanged()
    }

    const handleContentTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContentVal(e.target.value)
        markChanged()
    }

    const handleCodeMirrorChange = (value: string) => {
        contentRef.current = value
        markChanged()
    }

    const handleTagStrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const collapsed = e.target.value.replace(/  +/g, " ")
        setTagStr(collapsed)
        markChanged()
    }

    const handleJottedAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return
        const isoValue = DateTime.fromISO(e.target.value).toISO()
        if (!isoValue) return
        setJottedAtVal(isoValue)
        markChanged()
    }

    const handleDeleteClick = () => {
        softDeleteItemMutation.mutate(item)
        closeAllDialogs()
    }

    const handleRestoreLastVersion = () => {
        if (!item.previousContent) return
        updateItemMutation.mutate({
            ...item,
            content: item.previousContent,
            previousContent: undefined,
            previousContentRecordedAt: undefined,
            updatedAt: DateTime.now().toISO(),
        })
        closeAllDialogs()
    }

    // Save on unmount if there are unsaved changes the debounce hasn't flushed yet
    useEffect(() => {
        return () => {
            if (!hasUnsavedChangesRef.current) return
            mutateRef.current(buildUpdatedItem())
        }
    }, [buildUpdatedItem])

    const isTextItem = item.type === "text"

    const jottedAtInputVal = jottedAtVal
        ? DateTime.fromISO(jottedAtVal).toLocal().toFormat("yyyy-MM-dd'T'HH:mm")
        : ""

    const contentEditor = isTextItem ? (
        <CodeMirrorEditor
            initialValue={contentVal}
            onChange={handleCodeMirrorChange}
            onSaveAndClose={handleSaveAndClose}
        />
    ) : (
        <div className={styles.ItemDialog__Field}>
            <label className={styles.ItemDialog__Label}>Content</label>
            <textarea
                autoFocus
                className={styles.ItemDialog__Textarea}
                value={contentVal}
                onChange={handleContentTextareaChange}
                onKeyDown={saveHotkeyHandler}
                rows={4}
            />
        </div>
    )

    const lastVersionSection = isTextItem && item.previousContent && (
        <Accordion.Item value="last-version" className={styles.ItemDialog__AccordionItem}>
            <Accordion.Header>
                <Accordion.Trigger className={styles.ItemDialog__AccordionTrigger}>
                    Last version
                </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.ItemDialog__AccordionContent}>
                <div className={styles.ItemDialog__LastVersion}>
                    {item.previousContentRecordedAt && (
                        <span className={styles.ItemDialog__LastVersionDate}>
                            Recorded{" "}
                            {DateTime.fromISO(item.previousContentRecordedAt).toLocaleString(
                                DateTime.DATETIME_MED,
                            )}
                        </span>
                    )}
                    <CodeMirrorEditor
                        initialValue={item.previousContent}
                        onChange={() => {}}
                        onSaveAndClose={() => {}}
                        isReadOnly
                    />
                    <button
                        className={styles.ItemDialog__BtnOutline}
                        onClick={handleRestoreLastVersion}
                    >
                        Restore this version
                    </button>
                </div>
            </Accordion.Content>
        </Accordion.Item>
    )

    return (
        <div className={styles.ItemDialog}>
            <div className={styles.ItemDialog__Field}>
                <label className={styles.ItemDialog__Label}>Title</label>
                <input
                    value={titleVal}
                    onChange={handleTitleInputChange}
                    onKeyDown={saveHotkeyHandler}
                />
            </div>
            {contentEditor}
            <div className={styles.ItemDialog__Field}>
                <label className={styles.ItemDialog__Label}>Tags</label>
                <input
                    value={tagStr}
                    onChange={handleTagStrChange}
                    onKeyDown={saveHotkeyHandler}
                    placeholder="tag1 tag2 tag3"
                />
                <span className={styles.ItemDialog__Description}>Separated by spaces</span>
            </div>
            <Accordion.Root type="multiple" className={styles.ItemDialog__Accordion}>
                <Accordion.Item value="advanced" className={styles.ItemDialog__AccordionItem}>
                    <Accordion.Header>
                        <Accordion.Trigger className={styles.ItemDialog__AccordionTrigger}>
                            More options
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={styles.ItemDialog__AccordionContent}>
                        <div className={styles.ItemDialog__Field}>
                            <label className={styles.ItemDialog__Label}>Jotted at</label>
                            <input
                                type="datetime-local"
                                value={jottedAtInputVal}
                                onChange={handleJottedAtChange}
                            />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                {lastVersionSection}
            </Accordion.Root>
            <div className={styles.ItemDialog__Footer}>
                <span className={styles.ItemDialog__SaveStatus}>{saveStatusText}</span>
                <div className={styles.ItemDialog__Actions}>
                    <button className={styles.ItemDialog__BtnDanger} onClick={handleDeleteClick}>
                        Delete
                    </button>
                    <button className={styles.ItemDialog__BtnPrimary} onClick={handleSaveAndClose}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
