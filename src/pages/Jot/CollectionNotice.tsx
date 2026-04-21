import DemoDataBanner from "./DemoDataBanner"
import { TRASH_PURGE_DURATION_DAY } from "@/utils/constants"
import styles from "./CollectionNotice.module.scss"

interface CollectionNoticeProps {
    shouldShowDemoDataBanner: boolean
    isTrash: boolean
}

export default function CollectionNotice({
    shouldShowDemoDataBanner,
    isTrash,
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
        </div>
    )
}
