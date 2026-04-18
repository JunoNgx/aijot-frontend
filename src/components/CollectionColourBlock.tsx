import styles from "./CollectionColourBlock.module.scss"

interface CollectionColourBlockProps {
    colour: string
}

export default function CollectionColourBlock({
    colour,
}: CollectionColourBlockProps) {
    return (
        <span
            className={styles.CollectionColourBlock}
            style={{ backgroundColor: colour }}
        />
    )
}
