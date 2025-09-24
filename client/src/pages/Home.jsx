import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import Dialog from '../components/ui/Dialog'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <main>
        <Hero
          onJoinRecruiter={() => navigate('/signup/coach')}
          onJoinPlayer={() => navigate('/signup/player')}
        />

        {/* Features */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard title="Player Profiles" icon={<span className="text-xl">👤</span>}>
                Create comprehensive profiles with stats, videos, and academic information to showcase your potential.
              </FeatureCard>
              <FeatureCard title="Smart Search" icon={<span className="text-xl">🔍</span>}>
                Advanced filtering helps recruiters find the perfect candidates based on position, stats, and location.
              </FeatureCard>
              <FeatureCard title="Direct Connect" icon={<span className="text-xl">⚡</span>}>
                Streamlined communication tools to connect players and recruiters efficiently and professionally.
              </FeatureCard>
            </div>
            <div className="mt-6 text-center text-xs text-gray-500">
              API base: {API_BASE || 'dev proxy (/api)'}
            </div>
          </div>
        </section>
      </main>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Recruiter Sign Up"
        size="md"
        footer={(
          <>
            <button onClick={() => setDialogOpen(false)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50">Close</button>
            <button onClick={() => setDialogOpen(false)} className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600">Continue</button>
          </>
        )}
      >
        Thanks for your interest! This is a demo dialog triggered by “Join as Recruiter”. Replace this content with your recruiter sign-up flow when ready.
      </Dialog>
    </>
  )
}
