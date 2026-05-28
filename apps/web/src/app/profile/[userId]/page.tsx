import { getBuilderSkills, getUserProfile } from "../../../lib/api";

type PublicProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { userId } = await params;

  const profile = await getUserProfile(userId).catch(() => null);
  const skills = await getBuilderSkills(userId).catch(() => []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <section className="grid min-h-screen grid-cols-1 gap-4 p-4 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-[2.5rem] border border-[#DCE7F2] bg-white p-7 shadow-sm">
          <a href="/dashboard" className="text-sm font-black text-[#0890E0]">
            ← Back to workspace
          </a>

          <div className="mt-12">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#0890E0] text-4xl font-black text-white">
              G
            </div>

            <p className="mt-8 text-sm font-bold uppercase tracking-wide text-[#102848]/40">
              GUMMI profile
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight">
              {profile?.headline || "Untitled GUMMI profile"}
            </h1>

            <div className="mt-8 space-y-4 text-sm font-bold text-[#102848]/60">
              <p>{profile?.location || "Location not added"}</p>
              <p>{profile?.availability || "Availability not added"}</p>
            </div>
          </div>
        </aside>

        <section className="rounded-[2.5rem] border border-[#DCE7F2] bg-white p-6 text-[#102848] shadow-sm md:p-8">
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] bg-[#F8FAFC] p-7 ring-1 ring-[#DCE7F2]">
              <p className="text-sm font-bold uppercase tracking-wide text-[#102848]/40">
                Story
              </p>

              <p className="mt-5 text-xl leading-9 text-[#102848]/65">
                {profile?.story || "This person has not added their story yet."}
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#182838] p-7 text-white">
              <p className="text-sm font-bold uppercase tracking-wide text-[#72C7F4]">
                Building now
              </p>

              <h2 className="mt-5 text-3xl font-black leading-tight">
                {profile?.buildingNow || "No current work added yet."}
              </h2>
            </div>
          </div>

          <div className="mt-5 rounded-[2rem] bg-[#F8FAFC] p-7 ring-1 ring-[#DCE7F2]">
            <p className="text-sm font-bold uppercase tracking-wide text-[#102848]/40">
              Skills
            </p>

            {skills.length === 0 ? (
              <p className="mt-4 text-sm font-bold text-[#102848]/50">
                No skills added yet.
              </p>
            ) : (
              <div className="mt-5 flex flex-wrap gap-3">
                {skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="rounded-full border border-[#0890E0]/25 bg-white px-4 py-2 text-sm font-black text-[#102848]"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] border border-[#DCE7F2] bg-[#EEF5FB] p-7">
              <p className="text-sm font-bold uppercase tracking-wide text-[#102848]/40">
                Profile status
              </p>

              <h3 className="mt-4 text-3xl font-black">Early-stage profile</h3>

              <p className="mt-4 text-sm leading-7 text-[#102848]/55">
                This profile has started collecting skills and identity signals.
                Proof submissions, project history, and verification layers come
                next.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#102848] p-7 text-white">
              <p className="text-sm font-bold uppercase tracking-wide text-[#72C7F4]">
                Next layer
              </p>

              <h3 className="mt-4 text-3xl font-black">
                Work samples are next.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/60">
                GUMMI will soon show real projects, proof cards, peer signals,
                and challenge results here.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
