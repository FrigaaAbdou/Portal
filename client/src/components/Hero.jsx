export default function Hero({ onJoinPlayer, onJoinRecruiter }) {
  return (
    <section className="relative overflow-hidden bg-gray-900 text-white">
      <BackgroundImage />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-14 text-center sm:px-6 md:py-24 md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-6xl md:leading-tight">
          Connect Talent with Opportunity
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-100 sm:mt-4 sm:text-base md:text-lg">
          The premier platform connecting soccer players with college recruiters. Showcase your skills, discover opportunities, and take your game to the next level.
        </p>
        <div className="mt-6 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-7 sm:flex-row sm:items-center sm:gap-4 md:w-auto">
          <button
            type="button"
            onClick={onJoinPlayer}
            className="w-full rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 sm:w-auto sm:px-5 sm:py-2.5"
          >
            Join as Player
          </button>
          <button
            type="button"
            onClick={onJoinRecruiter}
            className="w-full rounded-md border border-white/60 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur hover:bg-white/20 sm:w-auto sm:px-5 sm:py-2.5"
          >
            Join as Recruiter
          </button>
        </div>
      </div>
    </section>
  )
}

function BackgroundImage() {
  return (
    <div aria-hidden className="absolute inset-0">
      <img
        src={new URL('../assets/hero.png', import.meta.url).href}
        alt=""
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gray-900/50" />
    </div>
  )
}
