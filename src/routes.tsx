import { Routes, Route, Navigate } from "react-router-dom"
import Landing from "@/pages/Landing"
import Jot from "@/pages/Jot"
import Collections from "@/pages/Collections"
import Settings from "@/pages/Settings"
import Help from "@/pages/Help"
import Privacy from "@/pages/Privacy"
import Terms from "@/pages/Terms"
import { useProfileSettings } from "@/store/profileSettings"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery"

function JotRedirect() {
    const defaultCollectionSlug = useProfileSettings((s) => s.defaultCollectionSlug)
    const allSlug = useCoreCollectionSettings((s) => s.all.slug)
    const { collectionsQuery } = useCollectionsQuery()

    if (collectionsQuery.isPending) return null

    const slugExists = (collectionsQuery.data ?? []).some((c) => c.slug === defaultCollectionSlug)
    const target = slugExists ? defaultCollectionSlug : allSlug

    return <Navigate to={`/jot/${target}`} replace />
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/jot" element={<JotRedirect />} />
            <Route path="/jot/:slug" element={<Jot />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
        </Routes>
    )
}
