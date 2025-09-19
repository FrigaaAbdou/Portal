import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Remove splash screen once the app is mounted
requestAnimationFrame(() => {
  const el = document.getElementById('splash')
  if (!el) return
  el.classList.add('hide')
  setTimeout(() => el.remove(), 400)
})
