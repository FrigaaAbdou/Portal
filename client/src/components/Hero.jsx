export default function Hero({ onJoinPlayer, onJoinRecruiter }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 md:py-20">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-6xl md:leading-tight">
          Connect Talent with Opportunity
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base md:text-lg">
          The premier platform connecting football players with college recruiters. Showcase your skills, discover opportunities, and take your game to the next level.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-7 sm:flex-row sm:items-center sm:gap-4">
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
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:w-auto sm:px-5 sm:py-2.5"
          >
            Join as Recruiter
          </button>
        </div>
      </div>
    </section>
  )
}
