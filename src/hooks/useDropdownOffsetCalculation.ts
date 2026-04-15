import { useEffect, useState } from "react"

const OFFSET_DESKTOP = 20
const OFFSET_MOBILE = 16

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(
        () => window.matchMedia(query).matches,
    )

    useEffect(() => {
        const media = window.matchMedia(query)
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
        media.addEventListener("change", listener)
        return () => media.removeEventListener("change", listener)
    }, [query])

    return matches
}

export function useDropdownOffsetCalc() {
    return useMediaQuery("(max-width: 767px)") ? OFFSET_MOBILE : OFFSET_DESKTOP
}
