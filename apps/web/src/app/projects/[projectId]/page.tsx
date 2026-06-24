"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WorkspaceTopbar from "../../../components/workspace/WorkspaceTopbar";
import {
  getProjectById,
  getProjectMembers,
  joinProject,
  GummiProject,
  ProjectMember,
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
  const [role, setRole] = useState("Contributor");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("gummi_user");
    if (storedUser) setUser(JSON.parse(storedUser));

    Promise.all([
      getProjectById(projectId),
      getProjectMembers(projectId).catch(() => []),
    ])
      .then(([loadedProject, loadedMembers]) => {
        setProject(loadedProject);
        setMembers(loadedMembers);
      })
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
                This project is a collaboration space where builders can join,
                contribute, and turn execution into visible proof.
              </p>
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
