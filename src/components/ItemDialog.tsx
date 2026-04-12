import { useState, useEffect, useRef } from "react"
import { modals } from "@mantine/modals"
import { useDebouncedCallback, getHotkeyHandler } from "@mantine/hooks"
import { TextInput, Textarea, Button } from "@mantine/core"
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
}

function CodeMirrorEditor({ initialValue, onChange, onSaveAndClose }: CodeMirrorEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const onChangeRef = useRef(onChange)
    const onSaveAndCloseRef = useRef(onSaveAndClose)
    onChangeRef.current = onChange
    onSaveAndCloseRef.current = onSaveAndClose

    useEffect(() => {
        if (!containerRef.current) return
        const view = new EditorView({
            state: EditorState.create({
                doc: initialValue,
                extensions: [
                    history(),
                    drawSelection(),
                    EditorView.theme({
                        ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--colText)" },
                    }),
                    keymap.of([
                        { key: "Mod-s", run: () => { onSaveAndCloseRef.current(); return true } },
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
        view.focus()
        return () => view.destroy()
    }, [])

    return <div ref={containerRef} className={styles.ItemDialog__CodeMirror} />
}

interface Props {
    item: Item
}

export function openItemDialog(item: Item) {
    modals.open({
        children: <ItemDialog item={item} />,
    })
}

export default function ItemDialog({ item }: Props) {
    const { updateItemMutation, softDeleteItemMutation } = useItems()

    const [titleVal, setTitleVal] = useState(item.title ?? "")
    const [contentVal, setContentVal] = useState(item.content)
    const [tagStr, setTagStr] = useState(item.tags.join(" "))
    const [saveStatusText, setSaveStatusText] = useState(
        `Saved ${DateTime.fromISO(item.updatedAt).toLocaleString(DateTime.TIME_WITH_SECONDS)}`
    )

    const titleRef = useRef(titleVal)
    const contentRef = useRef(contentVal)
    const tagStrRef = useRef(tagStr)
    const hasUnsavedChangesRef = useRef(false)
    const mutateRef = useRef(updateItemMutation.mutate)
    mutateRef.current = updateItemMutation.mutate

    useEffect(() => { titleRef.current = titleVal }, [titleVal])
    useEffect(() => { contentRef.current = contentVal }, [contentVal])
    useEffect(() => { tagStrRef.current = tagStr }, [tagStr])

    const buildUpdatedItem = (): Item => ({
        ...item,
        title: titleRef.current.trim() || undefined,
        content: contentRef.current,
        tags: tagStrRef.current.trim().split(" ").filter((t) => t.length > 0),
        updatedAt: DateTime.now().toISO(),
    })

    const handleSave = () => {
        mutateRef.current(buildUpdatedItem())
        setSaveStatusText(`Saved at ${DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS)}`)
        hasUnsavedChangesRef.current = false
    }

    const handleSaveAndClose = () => {
        handleSave()
        modals.closeAll()
    }

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

    const handleDeleteClick = () => {
        softDeleteItemMutation.mutate(item)
        modals.closeAll()
    }

    // Save on unmount if there are unsaved changes the debounce hasn't flushed yet
    useEffect(() => {
        return () => {
            if (!hasUnsavedChangesRef.current) return
            mutateRef.current(buildUpdatedItem())
        }
    }, [])

    const isTextItem = item.type === "text"

    const contentEditor = isTextItem
        ? (
            <CodeMirrorEditor
                initialValue={contentVal}
                onChange={handleCodeMirrorChange}
                onSaveAndClose={handleSaveAndClose}
            />
        )
        : (
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
            <div className={styles.ItemDialog__Footer}>
                <span className={styles.ItemDialog__SaveStatus}>{saveStatusText}</span>
                <div className={styles.ItemDialog__Actions}>
                    <Button
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>
                    <Button size="sm" onClick={handleSaveAndClose}>Save</Button>
                </div>
            </div>
        </div>
    )
}
