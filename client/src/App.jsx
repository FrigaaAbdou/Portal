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
import Players from './pages/Players'
import Recruiters from './pages/Recruiters'
import PlayerProfile from './pages/PlayerProfile'
import MyPlayers from './pages/MyPlayers'
import Announcements from './pages/Announcements'
import BillingSuccess from './pages/BillingSuccess'
import BillingCanceled from './pages/BillingCanceled'
import Billing from './pages/Billing'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<PublicOnlyRoute><Home /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignupLanding /></PublicOnlyRoute>} />
          <Route path="/signup/player" element={<PublicOnlyRoute><SignupPlayer /></PublicOnlyRoute>} />
          <Route path="/signup/coach" element={<PublicOnlyRoute><SignupCoach /></PublicOnlyRoute>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/players" element={<Players />} />
          <Route path="/recruiters" element={<Recruiters />} />
          <Route path="/about" element={<About />} />
          <Route path="/billing/success" element={<PrivateRoute><BillingSuccess /></PrivateRoute>} />
          <Route path="/billing/canceled" element={<BillingCanceled />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="/players/directory" element={<PrivateRoute><PlayersDirectory /></PrivateRoute>} />
          <Route path="/players/my" element={<PrivateRoute><MyPlayers /></PrivateRoute>} />
          <Route path="/players/:playerId" element={<PrivateRoute><PlayerProfile /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
