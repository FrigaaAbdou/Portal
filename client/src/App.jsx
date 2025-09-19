import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeatureCard from './components/FeatureCard'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main>
        <Hero />

        {/* Features */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                title="Player Profiles"
                icon={<span className="text-xl">👤</span>}
              >
                Create comprehensive profiles with stats, videos, and academic information to showcase your potential.
              </FeatureCard>
              <FeatureCard
                title="Smart Search"
                icon={<span className="text-xl">🔍</span>}
              >
                Advanced filtering helps recruiters find the perfect candidates based on position, stats, and location.
              </FeatureCard>
              <FeatureCard
                title="Direct Connect"
                icon={<span className="text-xl">⚡</span>}
              >
                Streamlined communication tools to connect players and recruiters efficiently and professionally.
              </FeatureCard>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
