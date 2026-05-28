async function getApiHealth() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/health`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const apiHealth = await getApiHealth();

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <header className="fixed left-0 top-0 z-20 w-full border-b border-[#DCE7F2] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="/" className="text-xl font-black tracking-tight">
            GUMMI
          </a>

          <nav className="hidden items-center gap-8 text-sm font-bold md:flex">
            <a className="text-[#102848]/65">Explore</a>
            <a className="text-[#102848]/65">Learning</a>
            <a className="text-[#102848]/65">Proof</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-full border border-[#DCE7F2] px-5 py-3 text-sm font-black text-[#102848]"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-full bg-[#0890E0] px-5 py-3 text-sm font-black text-white"
            >
              Create account
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-screen max-w-7xl gap-12 px-6 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="w-fit rounded-full border border-[#DCE7F2] bg-white px-4 py-2 text-sm font-black text-[#0890E0]">
            Built for hidden talent
          </p>

          <p className="mt-6 text-sm font-bold text-[#102848]/45">
            API status:{" "}
            <span
              className={apiHealth?.success ? "text-[#0890E0]" : "text-red-500"}
            >
              {apiHealth?.success ? "Connected" : "Not connected"}
            </span>
          </p>

          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Talent should not depend on connections.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#102848]/65 md:text-xl">
            GUMMI helps skilled people prove what they can do, learn from real
            professionals, build projects together, and get discovered through
            work — not noise.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/register"
              className="rounded-full bg-[#0890E0] px-7 py-4 text-center font-black text-white transition hover:scale-[1.02]"
            >
              Start your proof profile
            </a>

            <a
              href="/login"
              className="rounded-full border border-[#DCE7F2] bg-white px-7 py-4 text-center font-black text-[#102848] transition hover:bg-[#EEF5FB]"
            >
              Login
            </a>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-[#DCE7F2] bg-white p-5 shadow-xl">
          <div className="rounded-[2rem] bg-[#F8FAFC] p-6 ring-1 ring-[#DCE7F2]">
            <p className="text-sm font-black uppercase tracking-wide text-[#102848]/40">
              Proof card
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight">
              A real project says more than a perfect bio.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#102848]/65">
              Skill: Product Design · Evidence: Practical work · Status:
              building proof
            </p>

            <div className="mt-6 rounded-[1.5rem] bg-[#102848] p-5 text-white">
              <p className="text-sm font-bold text-[#72C7F4]">
                What GUMMI values
              </p>

              <p className="mt-2 text-xl font-black leading-tight">
                Clear thinking. Real execution. Work people can verify.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
