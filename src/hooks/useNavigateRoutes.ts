import { useNavigate } from "react-router-dom"

export function useNavigateRoutes() {
    const navigate = useNavigate()
    return {
        navigateToJot: () => navigate("/jot"),
        navigateToCollection: (slug: string) => navigate(`/jot/${slug}`),
        navigateToCollections: () => navigate("/collections"),
        navigateToSettings: () => navigate("/settings"),
        navigateToHelp: () => navigate("/help"),
        navigateToPrivacy: () => navigate("/privacy"),
        navigateToTerms: () => navigate("/terms"),
    }
}
