import WorkspaceTopbar from "../../../components/workspace/WorkspaceTopbar";
import { getProofById } from "../../../lib/api";

type ProofDetailPageProps = {
  params: Promise<{ proofId: string }>;
};

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[#DCE7F2] py-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
        {label}
      </p>
      <h2 className="mt-2 text-xl font-black text-[#102848]">{title}</h2>
      <div className="mt-4 text-sm leading-8 text-[#102848]/70">{children}</div>
    </section>
  );
}

export default async function ProofDetailPage({
  params,
}: ProofDetailPageProps) {
  const { proofId } = await params;
  const proof = await getProofById(proofId).catch(() => null);

  if (!proof) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
        <WorkspaceTopbar />
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-3xl font-black">Proof not found.</h1>
          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-[#0890E0] px-5 py-3 text-sm font-black text-white"
          >
            Back to workspace
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <WorkspaceTopbar />

      <section className="bg-[radial-gradient(#DCE7F2_0.8px,transparent_0.8px)] bg-[length:18px_18px] px-6 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
          <article className="bg-white p-8 shadow-sm ring-1 ring-[#DCE7F2]">
            <a href="/dashboard" className="text-sm font-black text-[#0890E0]">
              ← Back to workspace
            </a>

            <div className="mt-8 border-b border-[#DCE7F2] pb-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0890E0]">
                Proof breakdown
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight">
                {proof.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-[#102848]/70">
                {proof.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#EAF3FF] px-4 py-2 text-xs font-black text-[#0890E0]">
                  {proof.careerCategory?.replaceAll("_", " ")}
                </span>
                <span className="rounded-full bg-[#F8FAFC] px-4 py-2 text-xs font-black text-[#102848]/60 ring-1 ring-[#DCE7F2]">
                  {proof.proofType?.replaceAll("_", " ")}
                </span>
                <span className="rounded-full bg-[#F8FAFC] px-4 py-2 text-xs font-black text-[#102848]/60 ring-1 ring-[#DCE7F2]">
                  {proof.status}
                </span>
              </div>
            </div>

            <Section label="01" title="Challenge">
              {proof.challenge || "No challenge added yet."}
            </Section>

            <Section label="02" title="How it was built">
              {proof.process || "No process added yet."}
            </Section>

            <Section label="03" title="Outcome">
              {proof.outcome || "No outcome added yet."}
            </Section>
            <Section label="04" title="Execution Timeline">
              <div className="space-y-5">
                <div className="border-l-2 border-[#0890E0] pl-4">
                  <p className="text-xs font-black text-[#0890E0]">
                    Project Started
                  </p>
                  <p className="mt-1 text-sm text-[#102848]/70">
                    Initial proof submission and execution planning.
                  </p>
                </div>

                <div className="border-l-2 border-[#DCE7F2] pl-4">
                  <p className="text-xs font-black text-[#102848]/60">
                    Work In Progress
                  </p>
                  <p className="mt-1 text-sm text-[#102848]/70">
                    Future updates, milestones, commits, designs, and
                    deliverables will appear here.
                  </p>
                </div>
              </div>
            </Section>
            <Section label="05" title="Verification">
              This proof is currently{" "}
              <strong>
                {proof.reviewStatus?.replaceAll("_", " ") || "PENDING REVIEW"}
              </strong>
              . Future verification will include peer review, trusted review,
              and expert validation.
            </Section>
          </article>

          <aside className="space-y-4">
            <div className="bg-white p-6 shadow-sm ring-1 ring-[#DCE7F2]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#102848]/40">
                Tools
              </p>
              <p className="mt-4 text-sm font-bold leading-7 text-[#102848]/70">
                {proof.toolsUsed || "No tools added."}
              </p>
            </div>

            <div className="bg-[#102848] p-6 text-white shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
                Original proof
              </p>

              {proof.proofLink ? (
                <a
                  href={proof.proofLink}
                  target="_blank"
                  className="mt-5 inline-block rounded-xl bg-[#0890E0] px-5 py-3 text-sm font-black text-white"
                >
                  Open proof →
                </a>
              ) : (
                <p className="mt-4 text-sm font-bold text-white/60">
                  No external link attached.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
