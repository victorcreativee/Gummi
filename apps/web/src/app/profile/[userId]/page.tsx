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
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F1E8]">
      <section className="grid min-h-screen grid-cols-1 gap-4 p-4 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-7">
          <a href="/dashboard" className="text-sm font-black text-[#C7FF6B]">
            ← Back to workspace
          </a>

          <div className="mt-12">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#C7FF6B] text-4xl font-black text-black">
              G
            </div>

            <p className="mt-8 text-sm font-bold uppercase tracking-wide text-[#F5F1E8]/40">
              Proof profile
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight">
              {profile?.headline || "Untitled GUMMI profile"}
            </h1>

            <div className="mt-8 space-y-4 text-sm font-bold text-[#F5F1E8]/60">
              <p>{profile?.location || "Location not added"}</p>
              <p>{profile?.availability || "Availability not added"}</p>
            </div>
          </div>
        </aside>

        <section className="rounded-[2.5rem] bg-[#F5F1E8] p-6 text-black md:p-8">
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] bg-white p-7">
              <p className="text-sm font-bold uppercase tracking-wide text-black/40">
                Story
              </p>

              <p className="mt-5 text-xl leading-9 text-black/65">
                {profile?.story || "This person has not added their story yet."}
              </p>
            </div>

            <div className="rounded-[2rem] bg-black p-7 text-[#F5F1E8]">
              <p className="text-sm font-bold uppercase tracking-wide text-[#C7FF6B]">
                Currently building
              </p>

              <h2 className="mt-5 text-3xl font-black leading-tight">
                {profile?.buildingNow || "No current work added yet."}
              </h2>
            </div>
          </div>

          <div className="mt-5 rounded-[2rem] bg-white p-7">
            <p className="text-sm font-bold uppercase tracking-wide text-black/40">
              Skills
            </p>

            {skills.length === 0 ? (
              <p className="mt-4 text-sm font-bold text-black/50">
                No skills added yet.
              </p>
            ) : (
              <div className="mt-5 flex flex-wrap gap-3">
                {skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-[#C7FF6B] px-4 py-2 text-sm font-black text-black"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] border border-black/10 bg-[#EFEAE2] p-7">
              <p className="text-sm font-bold uppercase tracking-wide text-black/40">
                Proof status
              </p>

              <h3 className="mt-4 text-3xl font-black">Early-stage profile</h3>

              <p className="mt-4 text-sm leading-7 text-black/55">
                This profile has started collecting skills and identity signals.
                Proof challenges, project history, and verification layers come
                next.
              </p>
            </div>

            <div className="rounded-[2rem] bg-black p-7 text-[#F5F1E8]">
              <p className="text-sm font-bold uppercase tracking-wide text-[#C7FF6B]">
                Next proof layer
              </p>

              <h3 className="mt-4 text-3xl font-black">
                Work samples coming next.
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#F5F1E8]/55">
                Soon this profile will show real projects, challenge results,
                peer validations, and proof-of-work submissions.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
