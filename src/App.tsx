import AppRoutes from "@/routes"
import PurgeManager from "@/components/PurgeManager"
import SyncManager from "@/components/SyncManager"
import ThemeManager from "@/components/ThemeManager"

export default function App() {
    return (
        <>
            <ThemeManager />
            <PurgeManager />
            <SyncManager />
            <AppRoutes />
        </>
    )
}
