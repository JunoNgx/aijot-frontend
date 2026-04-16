import { useEffect } from "react"
import { purgeExpiredItems } from "@/db"

export default function PurgeManager() {
    useEffect(() => {
        purgeExpiredItems()

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                purgeExpiredItems()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () =>
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            )
    }, [])

    return null
}
