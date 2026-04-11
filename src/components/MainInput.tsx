import { DateTime } from 'luxon'
import { useItems } from '@/hooks/useItems'
import styles from './MainInput.module.scss'
import type { Item, ItemType } from '@/types'

function detectItemType(input: string): ItemType {
    try {
        const url = new URL(input)
        if (url.protocol === 'http:' || url.protocol === 'https:') return 'link'
    } catch {
        // not a URL
    }
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
    return { type: detectItemType(raw), content: raw.trim(), title: undefined }
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
