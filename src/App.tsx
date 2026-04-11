import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { purgeExpiredItems } from './db'

export default function App() {
    useEffect(() => {
        purgeExpiredItems()

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                purgeExpiredItems()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    return (
        <Routes>
            <Route path="/" element={<div>Landing</div>} />
            <Route path="/jot" element={<div>Jot</div>} />
            <Route path="/jot/:slug" element={<div>Jot Collection</div>} />
            <Route path="/collections" element={<div>Collections</div>} />
            <Route path="/profile" element={<div>Profile</div>} />
            <Route path="/help" element={<div>Help</div>} />
            <Route path="/privacy" element={<div>Privacy</div>} />
            <Route path="/terms" element={<div>Terms</div>} />
        </Routes>
    )
}
