import { useEffect } from "react"

export function useDocumentTitle(title?: string) {
    useEffect(() => {
        document.title = title ? `ai*jot - ${title}` : "ai*jot"
    }, [title])
}
