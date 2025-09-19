export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          Connect Talent with Opportunity
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">
          The premier platform connecting football players with college recruiters. Showcase your skills, discover opportunities, and take your game to the next level.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#join-player"
            className="rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
          >
            Join as Player
          </a>
          <a
            href="#join-recruiter"
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
          >
            Join as Recruiter
          </a>
        </div>
      </div>
    </section>
  )
}

