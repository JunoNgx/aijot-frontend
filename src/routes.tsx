import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Jot from './pages/Jot'
import Collections from './pages/Collections'
import Profile from './pages/Profile'
import Help from './pages/Help'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/jot" element={<Jot />} />
            <Route path="/jot/:slug" element={<Jot />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
        </Routes>
    )
}
