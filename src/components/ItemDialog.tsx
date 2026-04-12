import {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useRef,
} from "react"
import { modals } from "@mantine/modals"
import { useDebouncedCallback, getHotkeyHandler } from "@mantine/hooks"
import { TextInput, Textarea, Button, Accordion } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { DateTime } from "luxon"
import { EditorView, keymap, drawSelection } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { useItems } from "@/hooks/useItems"
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
    }, [])

    return <div ref={containerRef} className={styles.ItemDialog__CodeMirror} />
}

interface Props {
    item: Item
}

export default function ItemDialog({ item }: Props) {
    const { updateItemMutation, softDeleteItemMutation } = useItems()

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
        modals.closeAll()
    }, [handleSave])

    const debouncedSave = useDebouncedCallback(handleSave, AUTOSAVE_DEBOUNCE_MS)

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

    const handleJottedAtChange = (value: string | null) => {
        if (!value) return
        setJottedAtVal(value)
        markChanged()
    }

    const handleDeleteClick = () => {
        softDeleteItemMutation.mutate(item)
        modals.closeAll()
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
        modals.closeAll()
    }

    // Save on unmount if there are unsaved changes the debounce hasn't flushed yet
    useEffect(() => {
        return () => {
            if (!hasUnsavedChangesRef.current) return
            mutateRef.current(buildUpdatedItem())
        }
    }, [buildUpdatedItem])

    const isTextItem = item.type === "text"

    const contentEditor = isTextItem ? (
        <CodeMirrorEditor
            initialValue={contentVal}
            onChange={handleCodeMirrorChange}
            onSaveAndClose={handleSaveAndClose}
        />
    ) : (
        <Textarea
            data-autofocus
            label="Content"
            value={contentVal}
            onChange={handleContentTextareaChange}
            onKeyDown={getHotkeyHandler([[SHORTCUT_SAVE_AND_CLOSE, handleSaveAndClose]])}
            rows={4}
            resize="none"
        />
    )

    const lastVersionSection = isTextItem && item.previousContent && (
        <Accordion.Item value="last-version">
            <Accordion.Control>Last version</Accordion.Control>
            <Accordion.Panel>
                <div className={styles.ItemDialog__LastVersion}>
                    {item.previousContentRecordedAt && (
                        <span className={styles.ItemDialog__LastVersionDate}>
                            Recorded{" "}
                            {DateTime.fromISO(
                                item.previousContentRecordedAt,
                            ).toLocaleString(DateTime.DATETIME_MED)}
                        </span>
                    )}
                    <CodeMirrorEditor
                        initialValue={item.previousContent}
                        onChange={() => {}}
                        onSaveAndClose={() => {}}
                        isReadOnly
                    />
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={handleRestoreLastVersion}
                    >
                        Restore this version
                    </Button>
                </div>
            </Accordion.Panel>
        </Accordion.Item>
    )

    return (
        <div className={styles.ItemDialog}>
            <TextInput
                label="Title"
                value={titleVal}
                onChange={handleTitleInputChange}
                onKeyDown={getHotkeyHandler([[SHORTCUT_SAVE_AND_CLOSE, handleSaveAndClose]])}
            />
            {contentEditor}
            <TextInput
                label="Tags"
                value={tagStr}
                onChange={handleTagStrChange}
                onKeyDown={getHotkeyHandler([[SHORTCUT_SAVE_AND_CLOSE, handleSaveAndClose]])}
                placeholder="tag1 tag2 tag3"
                description="Separated by spaces"
            />
            <Accordion>
                <Accordion.Item value="advanced">
                    <Accordion.Control>More options</Accordion.Control>
                    <Accordion.Panel>
                        <DateTimePicker
                            label="Jotted at"
                            value={jottedAtVal}
                            onChange={handleJottedAtChange}
                        />
                    </Accordion.Panel>
                </Accordion.Item>
                {lastVersionSection}
            </Accordion>
            <div className={styles.ItemDialog__Footer}>
                <span className={styles.ItemDialog__SaveStatus}>{saveStatusText}</span>
                <div className={styles.ItemDialog__Actions}>
                    <Button variant="subtle" color="red" size="sm" onClick={handleDeleteClick}>
                        Delete
                    </Button>
                    <Button size="sm" onClick={handleSaveAndClose}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}
