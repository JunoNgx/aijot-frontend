import { useEffect } from "react"
import AppRoutes from "@/routes"
import { purgeExpiredItems } from "@/db"

export default function App() {
    useEffect(() => {
        purgeExpiredItems()

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                purgeExpiredItems()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    return <AppRoutes />
}
