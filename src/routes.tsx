import { Routes, Route, Navigate } from "react-router-dom"
import Landing from "@/pages/Landing"
import Jot from "@/pages/Jot"
import Collections from "@/pages/Collections"
import Settings from "@/pages/Settings"
import Help from "@/pages/Help"
import Privacy from "@/pages/Privacy"
import Terms from "@/pages/Terms"
import AppLayout from "@/components/AppLayout"
import { useProfileSettings } from "@/store/profileSettings"
import {
    ROUTE_JOT,
    ROUTE_COLLECTION,
    ROUTE_COLLECTIONS,
    ROUTE_SETTINGS,
    ROUTE_HELP,
    ROUTE_PRIVACY,
    ROUTE_TERMS,
} from "@/utils/constants"

function JotRedirect() {
    const defaultCollectionSlug = useProfileSettings(
        (s) => s.defaultCollectionSlug,
    )
    return <Navigate to={`${ROUTE_JOT}/${defaultCollectionSlug}`} replace />
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<AppLayout />}>
                <Route path={ROUTE_JOT} element={<JotRedirect />} />
                <Route path={ROUTE_COLLECTION} element={<Jot />} />
                <Route path={ROUTE_COLLECTIONS} element={<Collections />} />
                <Route path={ROUTE_SETTINGS} element={<Settings />} />
                <Route path={ROUTE_HELP} element={<Help />} />
                <Route path={ROUTE_PRIVACY} element={<Privacy />} />
                <Route path={ROUTE_TERMS} element={<Terms />} />
            </Route>
        </Routes>
    )
}
