import SportallLogo from '../../assets/logo.png'
import DefaultPlayerImage from '../../assets/cards/playerCardImg.png'

const CARD_WIDTH = 1080
const CARD_HEIGHT = 1350

function formatClassYear(value) {
  if (!value) return 'Class year'
  if (value === 'freshman') return 'Freshman'
  if (value === 'sophomore') return 'Sophomore'
  return value
}

function safeNumber(value) {
  if (value === null || value === undefined) return 0
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

export default function PlayerShareCard({ player, scale = 1, className = '' }) {
  const name = player?.fullName || 'Full Name'
  const school = player?.school || 'School / Team'
  const positions = Array.isArray(player?.positions) && player.positions.length > 0
    ? player.positions.join(' / ')
    : 'Positions'
  const classYear = formatClassYear(player?.classYear)

  const stats = {
    games: safeNumber(player?.stats?.games),
    started: safeNumber(player?.stats?.gamesStarted),
    goals: safeNumber(player?.stats?.goals),
    assists: safeNumber(player?.stats?.assists),
    points: safeNumber(player?.stats?.points),
  }
  const gpa = player?.gpa || '—'
  const playerImage = player?.avatarUrl || DefaultPlayerImage

  const scaledWidth = Math.round(CARD_WIDTH * scale)
  const scaledHeight = Math.round(CARD_HEIGHT * scale)
  const shouldScale = scale !== 1

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: scaledWidth, height: scaledHeight }}
    >
      <div
        className="relative h-[1350px] w-[1080px] overflow-hidden rounded-[56px] text-white shadow-[0_40px_90px_rgba(255,110,20,0.45)]"
        style={{
          transform: shouldScale ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
          fontFamily: 'var(--font-body)',
          background: 'linear-gradient(135deg, #ff8a2a 0%, #ff6a00 45%, #f4511e 100%)',
        }}
      >
        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-48 h-[620px] w-[620px] rounded-full bg-white/18 blur-[120px]" />
          <div className="absolute -bottom-60 -right-40 h-[640px] w-[640px] rounded-full bg-white/12 blur-[130px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.35),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_88%,rgba(255,255,255,0.25),transparent_48%)]" />
          <div className="absolute inset-0 opacity-40 mix-blend-soft-light" style={{ backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 45%)' }} />
        </div>

        <svg className="absolute -bottom-[120px] left-[-120px] w-[1400px] opacity-45" viewBox="0 0 1400 500" fill="none">
          <path d="M0 420C320 260 640 200 980 150C1180 120 1300 80 1400 20" stroke="rgba(255,255,255,0.35)" strokeWidth="6" />
          <path d="M0 470C320 320 660 260 980 220C1180 190 1300 150 1400 90" stroke="rgba(255,255,255,0.22)" strokeWidth="4" />
        </svg>

        <div className="absolute inset-[78px] rounded-[56px] border border-white/35 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.08)]" />

        <div className="absolute left-[150px] top-[330px] h-[420px] w-[320px] overflow-hidden rounded-[8px]">
          <img
            src={playerImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 h-full">
          <div className="absolute left-[140px] top-[150px] flex items-center gap-6">
            <div className="grid h-[80px] w-[80px] place-items-center rounded-[20px] bg-white/95">
              <img src={SportallLogo} alt="Sportall" className="h-10 w-10 object-contain" />
            </div>
            <div className="text-[42px] font-semibold tracking-tight">Sportall</div>
          </div>

          <div className="absolute left-[420px] right-[140px] top-[360px] text-center">
            <div className="text-[74px] font-semibold leading-[1.05] tracking-tight">
              {name}
            </div>
            <div className="mt-4 text-[28px] font-medium text-white/85">
              {positions} • {classYear}
            </div>
            <div className="mt-3 text-[30px] font-medium text-white/90">
              {school}
            </div>
          </div>

          <div className="absolute left-[140px] right-[140px] bottom-[280px] rounded-[32px] border border-white/35 bg-white/10">
            <div className="grid grid-cols-2 divide-x divide-white/30">
              <div className="grid grid-rows-3 divide-y divide-white/25">
                {[
                  { label: 'GMS', value: stats.games },
                  { label: 'GLS', value: stats.goals },
                  { label: 'PTS', value: stats.points },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline gap-4 px-10 py-6">
                    <span className="text-[56px] font-semibold leading-none">{item.value}</span>
                    <span className="text-[22px] font-semibold tracking-[0.35em] text-white/85">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-rows-3 divide-y divide-white/25">
                {[
                  { label: 'STR', value: stats.started },
                  { label: 'AST', value: stats.assists },
                  { label: 'GPA', value: gpa },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline gap-4 px-10 py-6">
                    <span className="text-[56px] font-semibold leading-none">{item.value}</span>
                    <span className="text-[22px] font-semibold tracking-[0.35em] text-white/85">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute left-[140px] right-[140px] bottom-[150px] flex items-center gap-5">
            <div className="grid h-[96px] w-[96px] place-items-center rounded-[22px] bg-white/90">
              <img src={SportallLogo} alt="Sportall" className="h-11 w-11 object-contain" />
            </div>
            <div className="text-[26px] font-medium tracking-wide text-white/85">sportall.io</div>
          </div>
        </div>
      </div>
    </div>
  )
}
