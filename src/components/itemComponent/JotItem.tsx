import type { Item } from '@/types'
import styles from './JotItem.module.scss'

interface Props {
    item: Item
}

export default function JotItem({ item }: Props) {
    return (
        <div className={styles.JotItem}>
            <span className={styles.JotItem__PrimaryText}>{item.title ?? item.content}</span>
            {item.title && <span className={styles.JotItem__SecondaryText}>{item.content}</span>}
            <span className={styles.JotItem__Type}>{item.type}</span>
        </div>
    )
}
