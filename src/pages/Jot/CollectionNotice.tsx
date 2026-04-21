import DemoDataBanner from "./DemoDataBanner"
import { TRASH_PURGE_DURATION_DAY } from "@/utils/constants"
import type { Collection } from "@/types"
import styles from "./CollectionNotice.module.scss"

interface CollectionNoticeProps {
    shouldShowDemoDataBanner: boolean
    isTrash: boolean
    collection: Collection | undefined
}

export default function CollectionNotice({
    shouldShowDemoDataBanner,
    isTrash,
    collection,
}: CollectionNoticeProps) {
    const displayTags = collection
        ? collection.coreType === "untagged" ? ["[untagged]"] : collection.tags
        : [""];

    return (
        <div className={styles.CollectionNotice}>
            {shouldShowDemoDataBanner && <DemoDataBanner />}
            {isTrash && (
                <p className={styles.CollectionNotice__Text}>
                    Items in trash are automatically deleted after{" "}
                    {TRASH_PURGE_DURATION_DAY} days
                </p>
            )}
            {displayTags.length > 0 && (
                <div className={styles.CollectionNotice__TagsWrapper}>
                    <span className={styles.CollectionNotice__TagsLabel}>
                        Showing tags:
                    </span>{" "}
                    <span className={styles.CollectionNotice__TagsContent}>
                        {displayTags.join(" ")}
                    </span>
                </div>
            )}
        </div>
    )
}
