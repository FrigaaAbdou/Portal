import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import logo from '../assets/logo.png'
import playerImg from '../player-img.jpg'
import coachImg from '../coach-img.jpg'

function RoleCard({ title, subtitle, image, bullets, cta, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white/80 p-4 text-left shadow-sm transition hover:border-orange-200 hover:bg-white hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <img src={image} alt="" className="h-16 w-16 rounded-xl object-cover" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-600">Get started</span>
          </div>
          <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-1 text-xs text-slate-600">
        {bullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
            <span className="leading-5">{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-xs font-semibold text-orange-600 group-hover:text-orange-700">
        {cta}
      </div>
    </button>
  )
}

export default function SignupLanding() {
  const navigate = useNavigate()

  const side = (
    <div className="flex h-full flex-col justify-between gap-10">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <img src={logo} className="h-10 w-10 rounded-xl object-cover" alt="Sportall logo" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Sportall</p>
            <p className="text-sm text-slate-600">Reliability-first recruiting.</p>
          </div>
        </div>
        <div>
          <h2 className="auth-display text-4xl font-semibold text-slate-900 sm:text-5xl">
            Build your recruiting profile.
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Players surface their story. Coaches find verified talent. Pick your role and start in minutes.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Verified onboarding', desc: 'Email verification protects roster data. Phone verification can be added later.' },
            { title: 'Role-based access', desc: 'Player and coach workflows stay separated.' },
            { title: 'Recruiter visibility', desc: 'Profiles rank higher with completed data.' },
            { title: 'Admin controls', desc: 'Invites and audits keep access safe.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-orange-200/60 bg-orange-50/80 p-4 text-sm text-orange-900 shadow-sm">
        <p className="font-semibold">Need help choosing?</p>
        <p className="mt-1 text-xs text-orange-700">Reach out to your Sportall admin and we will guide you.</p>
      </div>
    </div>
  )

  return (
    <AuthShell
      eyebrow="Sportall Sign Up"
      title="Choose your account type"
      subtitle="Select the role that matches your recruiting journey."
      side={side}
      footer="By creating an account you agree to Sportall terms and acknowledge our privacy policy."
    >
      <div className="space-y-5">
        <RoleCard
          title="I am a Player"
          subtitle="Create a profile, showcase highlights, and get discovered."
          image={playerImg}
          bullets={[
            'Create a full recruiting profile with stats and video.',
            'Showcase academics, highlights, and availability.',
            'Get notified when recruiters express interest.',
          ]}
          cta="Continue as Player"
          onClick={() => navigate('/signup/player')}
        />
        <RoleCard
          title="I am a Coach / Recruiter"
          subtitle="Search talent, organize prospects, and recruit smarter."
          image={coachImg}
          bullets={[
            'Access advanced filters for GPA, stats, and budget.',
            'Save favorites and manage recruiting pipelines.',
            'Coordinate with JUCO programs and admin workflows.',
          ]}
          cta="Continue as Coach"
          onClick={() => navigate('/signup/coach')}
        />
      </div>

      <p className="mt-6 text-center text-xs text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-orange-600 hover:text-orange-700">Log in</Link>
      </p>
    </AuthShell>
  )
}
