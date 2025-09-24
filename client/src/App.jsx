import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import SignupPlayer from './pages/SignupPlayer'
import SignupCoach from './pages/SignupCoach'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/player" element={<SignupPlayer />} />
          <Route path="/signup/coach" element={<SignupCoach />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
