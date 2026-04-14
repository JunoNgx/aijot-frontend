import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import Landing from "@/pages/Landing"
import Jot from "@/pages/Jot"
import Collections from "@/pages/Collections"
import Settings from "@/pages/Settings"
import Help from "@/pages/Help"
import Privacy from "@/pages/Privacy"
import Terms from "@/pages/Terms"
import Header from "@/components/Header"
import { useProfileSettings } from "@/store/profileSettings"

function AppLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

function JotRedirect() {
    const defaultCollectionSlug = useProfileSettings(
        (s) => s.defaultCollectionSlug,
    )
    return <Navigate to={`/jot/${defaultCollectionSlug}`} replace />
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<AppLayout />}>
                <Route path="/jot" element={<JotRedirect />} />
                <Route path="/jot/:slug" element={<Jot />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
            </Route>
        </Routes>
    )
}
