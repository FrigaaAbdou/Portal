export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 md:py-24">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-6xl">
          Connect Talent with Opportunity
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-gray-600 sm:text-base md:text-lg">
          The premier platform connecting football players with college recruiters. Showcase your skills, discover opportunities, and take your game to the next level.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#join-player"
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 sm:px-5 sm:py-2.5"
          >
            Join as Player
          </a>
          <a
            href="#join-recruiter"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:px-5 sm:py-2.5"
          >
            Join as Recruiter
          </a>
        </div>
      </div>
    </section>
  )
}
