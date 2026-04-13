import { useQueryClient } from "@tanstack/react-query"
import { useLocalAppData } from "@/store/localAppData"
import { storage } from "@/db"
import { queryKeys } from "@/db/queryKeys"
import { buildDemoCollections, buildDemoItems } from "@/utils/itemFactory"
import styles from "./DemoDataBanner.module.scss"

export default function DemoDataBanner() {
    const { setShouldShowDemoDataBanner } = useLocalAppData()
    const queryClient = useQueryClient()

    const handleDismiss = () => {
        setShouldShowDemoDataBanner(false)
    }

    const handleLoadDemoData = async () => {
        await Promise.all([
            storage.bulkPutItems(buildDemoItems()),
            storage.bulkPutCollections(buildDemoCollections()),
        ])
        queryClient.invalidateQueries({ queryKey: queryKeys.items })
        queryClient.invalidateQueries({ queryKey: queryKeys.collections })
        setShouldShowDemoDataBanner(false)
    }

    return (
        <div className={styles.DemoDataBanner}>
            <div className={styles.DemoDataBanner__Text}>
                <strong>Welcome to ai*jot.</strong> Your jots are stored locally on this device.
            </div>
            <div className={styles.DemoDataBanner__Actions}>
                <button className={styles.DemoDataBanner__BtnSubtle} onClick={handleDismiss}>
                    Dismiss
                </button>
                <button className={styles.DemoDataBanner__BtnOutline} onClick={handleLoadDemoData}>
                    Load demo data
                </button>
            </div>
        </div>
    )
}
