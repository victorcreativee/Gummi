import WorkspaceTopbar from "../../../components/workspace/WorkspaceTopbar";
import { getProofById } from "../../../lib/api";

type ProofDetailPageProps = {
  params: Promise<{
    proofId: string;
  }>;
};

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
          <h1 className="text-4xl font-black">Proof not found.</h1>
          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-[#0890E0] px-6 py-3 text-sm font-black text-white"
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

      <section className="mx-auto max-w-5xl px-6 py-12">
        <a href="/dashboard" className="text-sm font-black text-[#0890E0]">
          ← Back to workspace
        </a>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#DCE7F2]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0890E0]">
            {proof.careerCategory?.replaceAll("_", " ")} /{" "}
            {proof.proofType?.replaceAll("_", " ")}
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            {proof.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-[#EAF3FF] px-4 py-2 text-xs font-black text-[#0890E0]">
              {proof.status}
            </span>

            <span className="rounded-full bg-[#F8FAFC] px-4 py-2 text-xs font-black text-[#102848]/60 ring-1 ring-[#DCE7F2]">
              {proof.reviewStatus?.replaceAll("_", " ") || "PENDING REVIEW"}
            </span>
          </div>

          <p className="mt-8 text-lg leading-9 text-[#102848]/70">
            {proof.description}
          </p>

          {proof.toolsUsed && (
            <div className="mt-8 rounded-[1.5rem] bg-[#F8FAFC] p-5 ring-1 ring-[#DCE7F2]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#102848]/35">
                Tools used
              </p>
              <p className="mt-2 text-sm font-bold text-[#102848]/70">
                {proof.toolsUsed}
              </p>
            </div>
          )}

          {proof.reviewNotes && (
            <div className="mt-5 rounded-[1.5rem] bg-[#EEF5FB] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#102848]/35">
                Review note
              </p>
              <p className="mt-2 text-sm font-bold text-[#102848]/70">
                {proof.reviewNotes}
              </p>
            </div>
          )}

          {proof.proofLink && (
            <a
              href={proof.proofLink}
              target="_blank"
              className="mt-8 inline-block rounded-full bg-[#102848] px-6 py-4 text-sm font-black text-white"
            >
              Open original proof →
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
