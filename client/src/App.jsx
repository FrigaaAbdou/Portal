import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import SignupPlayer from './pages/SignupPlayer'
import SignupCoach from './pages/SignupCoach'
import SignupLanding from './pages/SignupLanding'
import Pricing from './pages/Pricing'
import { PrivateRoute, PublicOnlyRoute } from './lib/auth'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import PlayersDirectory from './pages/PlayersDirectory'
import PlayerProfile from './pages/PlayerProfile'
import MyPlayers from './pages/MyPlayers'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignupLanding /></PublicOnlyRoute>} />
          <Route path="/signup/player" element={<PublicOnlyRoute><SignupPlayer /></PublicOnlyRoute>} />
          <Route path="/signup/coach" element={<PublicOnlyRoute><SignupCoach /></PublicOnlyRoute>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/players/directory" element={<PrivateRoute><PlayersDirectory /></PrivateRoute>} />
          <Route path="/players/my" element={<PrivateRoute><MyPlayers /></PrivateRoute>} />
          <Route path="/players/:playerId" element={<PrivateRoute><PlayerProfile /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
