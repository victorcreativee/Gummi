"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WorkspaceTopbar from "../../../../components/workspace/WorkspaceTopbar";
import { createProof, getProjectById, GummiProject } from "../../../../lib/api";

type GummiUser = {
  id?: string;
  userId?: string;
  fullName: string;
};

export default function ProjectContributionPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [user, setUser] = useState<GummiUser | null>(null);
  const [project, setProject] = useState<GummiProject | null>(null);

  const [title, setTitle] = useState("");
  const [careerCategory, setCareerCategory] = useState("TECH_BUILDER");
  const [proofType] = useState("COLLABORATION_WORK");
  const [description, setDescription] = useState("");
  const [challenge, setChallenge] = useState("");
  const [process, setProcess] = useState("");
  const [outcome, setOutcome] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("gummi_user");
    if (storedUser) setUser(JSON.parse(storedUser));

    getProjectById(projectId)
      .then(setProject)
      .catch(() => setMessage("Could not load project."));
  }, [projectId]);

  function getCurrentUserId() {
    return user?.id || user?.userId;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const userId = getCurrentUserId();

    if (!userId) {
      setMessage("Please login again before submitting contribution.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await createProof({
        userId,
        projectId,
        title,
        careerCategory,
        proofType,
        description,
        challenge,
        process,
        outcome,
        proofLink,
        toolsUsed,
      });

      router.push(`/projects/${projectId}`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not submit contribution"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <WorkspaceTopbar fullName={user?.fullName} userId={getCurrentUserId()} />

      <section className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(#DCE7F2_0.8px,transparent_0.8px)] bg-[length:18px_18px] px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl border border-[#DCE7F2] bg-white p-6 shadow-sm"
        >
          <a
            href={`/projects/${projectId}`}
            className="text-sm font-black text-[#0890E0]"
          >
            ← Back to project
          </a>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
            Project contribution
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Submit proof of your work
          </h1>

          <p className="mt-3 text-sm font-bold leading-7 text-[#102848]/60">
            {project
              ? `You are submitting contribution proof for: ${project.title}`
              : "Your contribution will be attached to this project."}
          </p>

          <div className="mt-8 grid gap-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="Contribution title"
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <select
              value={careerCategory}
              onChange={(event) => setCareerCategory(event.target.value)}
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            >
              <option value="TECH_BUILDER">Tech Builder</option>
              <option value="CREATIVE_DESIGNER">Creative Designer</option>
              <option value="VISUAL_MEDIA_CREATOR">Visual Media Creator</option>
              <option value="CONTENT_DIGITAL_MARKETER">
                Content / Digital Marketer
              </option>
            </select>

            <input
              value="Project Contribution"
              disabled
              className="border border-[#DCE7F2] bg-[#F8FAFC] px-4 py-3 text-sm font-bold text-[#102848]/60 outline-none"
            />

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={4}
              placeholder="What did you contribute?"
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <textarea
              value={challenge}
              onChange={(event) => setChallenge(event.target.value)}
              rows={3}
              placeholder="What challenge did you solve?"
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <textarea
              value={process}
              onChange={(event) => setProcess(event.target.value)}
              rows={3}
              placeholder="How did you do it?"
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <textarea
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
              rows={3}
              placeholder="What was the result?"
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <input
              value={proofLink}
              onChange={(event) => setProofLink(event.target.value)}
              placeholder="Proof link: GitHub, Figma, demo, document..."
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <input
              value={toolsUsed}
              onChange={(event) => setToolsUsed(event.target.value)}
              placeholder="Tools used e.g. Next.js, Figma, Spring Boot"
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <div className="flex items-center gap-3">
              <button
                disabled={saving}
                className="rounded-xl bg-[#0890E0] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                {saving ? "Submitting..." : "Submit contribution"}
              </button>

              <a
                href={`/projects/${projectId}`}
                className="rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-black text-[#102848]"
              >
                Cancel
              </a>
            </div>

            {message && (
              <p className="text-sm font-bold text-red-600">{message}</p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
