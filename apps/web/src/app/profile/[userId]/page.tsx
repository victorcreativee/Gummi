import WorkspaceTopbar from "../../../components/workspace/WorkspaceTopbar";
import {
  getBuilderSkills,
  getUserProfile,
  getUserProofs,
} from "../../../lib/api";

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
  const proofs = await getUserProofs(userId).catch(() => []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <WorkspaceTopbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <a href="/dashboard" className="text-sm font-black text-[#0890E0]">
          ← Back to workspace
        </a>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <section>
            <div className="flex items-start gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-[#0890E0] text-4xl font-black text-white">
                G
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#102848]/35">
                  GUMMI profile
                </p>

                <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight tracking-tight">
                  {profile?.headline || "Untitled GUMMI profile"}
                </h1>

                <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-[#102848]/60">
                  <span>{profile?.location || "Location not added"}</span>
                  <span>•</span>
                  <span>
                    {profile?.availability || "Availability not added"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#102848]/35">
                Story
              </p>

              <p className="mt-4 text-xl leading-9 text-[#102848]/70">
                {profile?.story || "This person has not added their story yet."}
              </p>
            </div>

            <div className="mt-12">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#102848]/35">
                Skills
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {skills.length === 0 ? (
                  <p className="text-sm font-bold text-[#102848]/50">
                    No skills added yet.
                  </p>
                ) : (
                  skills.map((skill: any) => (
                    <span
                      key={skill.id}
                      className="rounded-full border border-[#DCE7F2] bg-white px-4 py-2 text-sm font-black text-[#102848]"
                    >
                      {skill.skillName}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="mt-14">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#102848]/35">
                  Proof timeline
                </p>

                <span className="rounded-full bg-[#EAF3FF] px-4 py-2 text-xs font-black text-[#0890E0]">
                  {proofs.length} proofs
                </span>
              </div>

              <div className="mt-6 space-y-6 border-l-2 border-[#DCE7F2] pl-7">
                {proofs.length === 0 ? (
                  <div>
                    <h3 className="text-xl font-black">
                      No proof submitted yet.
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[#102848]/60">
                      Proof cards will appear here when this person submits real
                      projects, case studies, challenge work, or portfolio
                      links.
                    </p>
                  </div>
                ) : (
                  proofs.map((proof: any) => (
                    <article key={proof.id} className="relative">
                      <span className="absolute -left-[36px] top-2 h-4 w-4 rounded-full bg-[#0890E0]" />

                      <div className="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-[#DCE7F2]">
                        <div className="flex flex-col justify-between gap-3 md:flex-row">
                          <div>
                            <h3 className="text-xl font-black">
                              {proof.title}
                            </h3>

                            <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#0890E0]">
                              {proof.careerCategory.replaceAll("_", " ")} /{" "}
                              {proof.proofType.replaceAll("_", " ")}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="h-fit rounded-full bg-[#EAF3FF] px-4 py-2 text-xs font-black text-[#0890E0]">
                              {proof.status}
                            </span>

                            <span className="h-fit rounded-full bg-[#F8FAFC] px-4 py-2 text-xs font-black text-[#102848]/60 ring-1 ring-[#DCE7F2]">
                              {proof.reviewStatus?.replaceAll("_", " ") ||
                                "PENDING REVIEW"}
                            </span>
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-[#102848]/70">
                          {proof.description}
                        </p>

                        {proof.reviewNotes && (
                          <div className="mt-4 rounded-2xl bg-[#F8FAFC] px-4 py-3">
                            <p className="text-xs font-black uppercase tracking-wide text-[#102848]/35">
                              Review note
                            </p>
                            <p className="mt-1 text-sm font-bold text-[#102848]/70">
                              {proof.reviewNotes}
                            </p>
                          </div>
                        )}
                        {proof.toolsUsed && (
                          <p className="mt-3 text-sm font-bold text-[#102848]/55">
                            Tools: {proof.toolsUsed}
                          </p>
                        )}

                        {proof.proofLink && (
                          <a
                            href={proof.proofLink}
                            target="_blank"
                            className="mt-4 inline-block text-sm font-black text-[#0890E0]"
                          >
                            Open proof →
                          </a>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[2rem] bg-[#102848] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#72C7F4]">
                Building now
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight">
                {profile?.buildingNow || "No current work added yet."}
              </h2>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#DCE7F2]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#102848]/35">
                Profile signal
              </p>

              <h3 className="mt-4 text-5xl font-black text-[#0890E0]">
                {skills.length + proofs.length}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#102848]/60">
                Visible signals from skills and submitted proof.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#EEF5FB] p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#102848]/35">
                Status
              </p>

              <h3 className="mt-4 text-2xl font-black">Early-stage profile</h3>

              <p className="mt-3 text-sm leading-7 text-[#102848]/60">
                This profile is still growing. Verification, peer review, and
                challenge results will strengthen it over time.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
