"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WorkspaceTopbar from "../../../components/workspace/WorkspaceTopbar";
import {
  createProjectMilestone,
  getProjectById,
  getProjectMembers,
  getProjectMilestones,
  getProjectProofs,
  joinProject,
  GummiProject,
  ProjectMember,
  ProjectMilestone,
  ProofSubmission,
} from "../../../lib/api";
type GummiUser = {
  id?: string;
  userId?: string;
  fullName: string;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [user, setUser] = useState<GummiUser | null>(null);
  const [project, setProject] = useState<GummiProject | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [contributions, setContributions] = useState<ProofSubmission[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [savingMilestone, setSavingMilestone] = useState(false);
  const [role, setRole] = useState("Contributor");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("gummi_user");
    if (storedUser) setUser(JSON.parse(storedUser));

    Promise.all([
      getProjectById(projectId),
      getProjectMembers(projectId).catch(() => []),
      getProjectProofs(projectId).catch(() => []),
      getProjectMilestones(projectId).catch(() => []),
    ])
      .then(
        ([
          loadedProject,
          loadedMembers,
          loadedContributions,
          loadedMilestones,
        ]) => {
          setProject(loadedProject);
          setMembers(loadedMembers);
          setContributions(loadedContributions);
          setMilestones(loadedMilestones);
        }
      )
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not load project"
        );
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  function getCurrentUserId() {
    return user?.id || user?.userId;
  }
  async function handleCreateMilestone() {
    if (!milestoneTitle.trim()) {
      setMessage("Please write a milestone title.");
      return;
    }

    setSavingMilestone(true);
    setMessage("");

    try {
      const savedMilestone = await createProjectMilestone({
        projectId,
        title: milestoneTitle,
        description: milestoneDescription,
      });

      setMilestones((current) => [savedMilestone, ...current]);
      setMilestoneTitle("");
      setMilestoneDescription("");
      setMessage("Milestone added.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not add milestone"
      );
    } finally {
      setSavingMilestone(false);
    }
  }
  async function handleJoinProject() {
    const userId = getCurrentUserId();

    if (!userId) {
      setMessage("Please login again before joining this project.");
      return;
    }

    try {
      const savedMember = await joinProject({
        projectId,
        userId,
        role,
      });

      setMembers((current) => [savedMember, ...current]);
      setMessage("You joined this project.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not join project"
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
        <WorkspaceTopbar
          fullName={user?.fullName}
          userId={getCurrentUserId()}
        />
        <section className="p-8 text-sm font-bold">Loading project...</section>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
        <WorkspaceTopbar
          fullName={user?.fullName}
          userId={getCurrentUserId()}
        />
        <section className="p-8 text-sm font-bold text-red-600">
          Project not found.
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <WorkspaceTopbar fullName={user?.fullName} userId={getCurrentUserId()} />

      <section className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(#DCE7F2_0.8px,transparent_0.8px)] bg-[length:18px_18px] px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
          <article className="border border-[#DCE7F2] bg-white p-6 shadow-sm">
            <a href="/projects" className="text-sm font-black text-[#0890E0]">
              ← Back to projects
            </a>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
              {project.category}
            </p>

            <h1 className="mt-3 text-4xl font-black">{project.title}</h1>

            <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-[#102848]/65">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#EAF3FF] px-4 py-2 text-xs font-black text-[#0890E0]">
                {project.status?.replaceAll("_", " ").toLowerCase()}
              </span>

              <span className="rounded-full bg-[#F8FAFC] px-4 py-2 text-xs font-black text-[#102848]/60 ring-1 ring-[#DCE7F2]">
                Looking for: {project.neededRoles || "Collaborators"}
              </span>
            </div>

            <div className="mt-10 border-t border-[#DCE7F2] pt-6">
              <h2 className="text-xl font-black">Project mission</h2>
              <p className="mt-3 text-sm leading-7 text-[#102848]/65">
                This project is a collaboration space where members can join,
                contribute, and turn execution into visible proof.
              </p>
            </div>
            <div className="mt-10 border-t border-[#DCE7F2] pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
                    Milestones
                  </p>
                  <h2 className="mt-2 text-xl font-black">
                    What this team is working toward
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[#102848]/60">
                    Milestones help the team turn ideas into clear steps and
                    visible progress.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <input
                  value={milestoneTitle}
                  onChange={(event) => setMilestoneTitle(event.target.value)}
                  placeholder="Add a milestone e.g. Build first prototype"
                  className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                />

                <textarea
                  value={milestoneDescription}
                  onChange={(event) =>
                    setMilestoneDescription(event.target.value)
                  }
                  rows={3}
                  placeholder="Describe what needs to be done and why it matters"
                  className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                />

                <button
                  type="button"
                  onClick={handleCreateMilestone}
                  disabled={savingMilestone}
                  className="w-fit rounded-xl bg-[#102848] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
                >
                  {savingMilestone ? "Adding..." : "Add milestone"}
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {milestones.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#DCE7F2] bg-[#F8FAFC] p-5">
                    <p className="text-sm font-bold text-[#102848]/55">
                      No milestones yet. Add the first clear step for this
                      project.
                    </p>
                  </div>
                ) : (
                  milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-black">
                            {milestone.title}
                          </h3>
                          {milestone.description && (
                            <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/60">
                              {milestone.description}
                            </p>
                          )}
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#102848]/45 ring-1 ring-[#DCE7F2]">
                          {milestone.completed ? "Completed" : "Open"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-10 border-t border-[#DCE7F2] pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
                    Contributions
                  </p>
                  <h2 className="mt-2 text-xl font-black">
                    Proof submitted for this project
                  </h2>
                </div>

                <a
                  href={`/projects/${projectId}/contribute`}
                  className="rounded-xl bg-[#0890E0] px-4 py-3 text-sm font-black text-white"
                >
                  Submit contribution
                </a>
              </div>

              <div className="mt-6 space-y-4">
                {contributions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#DCE7F2] bg-[#F8FAFC] p-6">
                    <p className="text-sm font-bold text-[#102848]/55">
                      No contributions yet. When collaborators submit proof for
                      this project, it will appear here.
                    </p>
                  </div>
                ) : (
                  contributions.map((proof) => (
                    <a
                      key={proof.id}
                      href={`/proofs/${proof.id}`}
                      className="block rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] p-5 transition hover:border-[#0890E0]"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0890E0]">
                        {proof.proofType || "Contribution"}
                      </p>

                      <h3 className="mt-2 text-lg font-black">{proof.title}</h3>

                      <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-[#102848]/60">
                        {proof.description}
                      </p>
                    </a>
                  ))
                )}
              </div>
            </div>
          </article>

          <aside className="space-y-5">
            <div className="border border-[#DCE7F2] bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
                Join project
              </p>

              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Your role"
                className="mt-4 w-full border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none"
              />

              <button
                onClick={handleJoinProject}
                className="mt-3 w-full rounded-xl bg-[#0890E0] px-5 py-3 text-sm font-black text-white"
              >
                Join as collaborator
              </button>

              <a
                href={`/projects/${projectId}/contribute`}
                className="mt-3 block rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-center text-sm font-black text-[#102848]"
              >
                Submit contribution
              </a>

              {message && (
                <p className="mt-3 text-sm font-bold text-[#102848]/60">
                  {message}
                </p>
              )}
            </div>

            <div className="border border-[#DCE7F2] bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
                Members
              </p>

              <div className="mt-4 space-y-3">
                {members.length === 0 ? (
                  <p className="text-sm font-bold text-[#102848]/50">
                    No members yet.
                  </p>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="border border-[#DCE7F2] bg-[#F8FAFC] p-3"
                    >
                      <p className="text-sm font-black">{member.role}</p>
                      <p className="mt-1 text-xs font-bold text-[#102848]/45">
                        {member.userId}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
