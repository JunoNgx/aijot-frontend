import { DateTime } from 'luxon'
import { useItems } from '@/hooks/useItems'
import styles from './MainInput.module.scss'
import type { Item, ItemType } from '@/types'

function isUrl(input: string): boolean {
    try {
        const url = new URL(input)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        // no protocol — try as bare domain
    }
    try {
        const url = new URL(`https://${input}`)
        return url.hostname.includes('.') && !input.includes(' ')
    } catch {
        return false
    }
}

function detectItemType(input: string): ItemType {
    if (isUrl(input)) return 'link'
    if (input.startsWith(':td:')) return 'todo'
    return 'text'
}

function parseInput(raw: string): Pick<Item, 'content' | 'type' | 'title'> {
    if (raw.startsWith(':td:')) {
        return { type: 'todo', content: raw.slice(4).trim(), title: undefined }
    }
    if (raw.startsWith(':t:')) {
        return { type: 'text', content: '', title: raw.slice(3).trim() }
    }
    const trimmed = raw.trim()
    const itemType = detectItemType(trimmed)
    const normalizedContent = itemType === 'link' && !trimmed.startsWith('http')
        ? `https://${trimmed}`
        : trimmed
    return { type: itemType, content: normalizedContent, title: undefined }
}

function buildItem(raw: string): Item {
    const now = DateTime.now().toISO()
    const parsed = parseInput(raw)
    return {
        id: crypto.randomUUID(),
        createdAt: now,
        jottedAt: now,
        updatedAt: now,
        isDone: false,
        shouldCopyOnClick: false,
        isPinned: false,
        tags: [],
        ...parsed,
    }
}

interface Props {
    value: string
    onChange: (value: string) => void
}

export default function MainInput({ value, onChange }: Props) {
    const { createItem } = useItems()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return
        const trimmedValue = value.trim()
        if (!trimmedValue) return

        createItem.mutate(buildItem(trimmedValue))
        onChange('')
    }

    return (
        <div className={styles.MainInput}>
            <input
                className={styles.MainInput__Input}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Jot something..."
                autoFocus
            />
        </div>
    )
}
