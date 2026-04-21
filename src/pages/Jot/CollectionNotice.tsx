import DemoDataBanner from "./DemoDataBanner"
import { TRASH_PURGE_DURATION_DAY } from "@/utils/constants"
import styles from "./CollectionNotice.module.scss"

interface CollectionNoticeProps {
    shouldShowDemoDataBanner: boolean
    isTrash: boolean
    collectionTags: string[]
}

export default function CollectionNotice({
    shouldShowDemoDataBanner,
    isTrash,
    collectionTags,
}: CollectionNoticeProps) {
    return (
        <div className={styles.CollectionNotice}>
            {shouldShowDemoDataBanner && <DemoDataBanner />}
            {isTrash && (
                <p className={styles.CollectionNotice__Text}>
                    Items in trash are automatically deleted after{" "}
                    {TRASH_PURGE_DURATION_DAY} days
                </p>
            )}
            {collectionTags.length > 0 && (
                <div className={styles.CollectionNotice__TagsWrapper}>
                    <span className={styles.CollectionNotice__TagsLabel}>
                        Showing tags:
                    </span>
                    {" "}
                    <span className={styles.CollectionNotice__TagsContent}>
                        {collectionTags.join(" ")}
                    </span>
                </div>
            )}
        </div>
    )
}
