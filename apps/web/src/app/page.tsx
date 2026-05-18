async function getApiHealth() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/health`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}
export default async function HomePage() {
  const apiHealth = await getApiHealth();
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F1E8]">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12">
        <p className="mb-6 w-fit rounded-full border border-[#F5F1E8]/20 px-4 py-2 text-sm text-[#C7FF6B]">
          Built for hidden builders
        </p>
        <p className="mb-8 text-sm text-[#F5F1E8]/50">
          API status:{" "}
          <span
            className={apiHealth?.success ? "text-[#C7FF6B]" : "text-red-300"}
          >
            {apiHealth?.success ? "Connected" : "Not connected"}
          </span>
        </p>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Talent should not depend on connections.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#F5F1E8]/70 md:text-xl">
              GUMMI helps skilled people prove what they can do, learn from real
              professionals, build projects together, and get discovered through
              work — not noise.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#"
                className="rounded-full bg-[#C7FF6B] px-7 py-4 text-center font-bold text-black transition hover:scale-[1.02]"
              >
                Show your work
              </a>

              <a
                href="#"
                className="rounded-full border border-[#F5F1E8]/20 px-7 py-4 text-center font-bold text-[#F5F1E8] transition hover:bg-white/10"
              >
                Explore builders
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-2xl">
            <div className="rounded-[1.5rem] bg-[#F5F1E8] p-5 text-black">
              <p className="text-sm font-bold uppercase tracking-wide text-black/50">
                Proof card
              </p>

              <h2 className="mt-4 text-2xl font-black">
                Aisha rebuilt a broken checkout flow.
              </h2>

              <p className="mt-4 text-sm leading-6 text-black/70">
                Skill: UI Design · Verification: Practical challenge · Status:
                reviewed by peers
              </p>

              <div className="mt-6 rounded-2xl bg-black p-4 text-[#F5F1E8]">
                <p className="text-sm text-[#C7FF6B]">What she proved</p>
                <p className="mt-2 text-lg font-bold">
                  Clear thinking. Better layout. Real execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
