"use client";

import { useEffect, useState } from "react";
import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";
import { getProjects, GummiProject } from "../../lib/api";

type GummiUser = {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  role: string;
};

const sidebarItems = ["All", "Open", "Looking for members", "My projects"];

export default function ProjectsPage() {
  const [user, setUser] = useState<GummiUser | null>(null);
  const [projects, setProjects] = useState<GummiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const storedUser = localStorage.getItem("gummi_user");
    if (storedUser) setUser(JSON.parse(storedUser));

    getProjects()
      .then(setProjects)
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not load projects"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleProjects =
    activeFilter === "All"
      ? projects
      : activeFilter === "Looking for members"
      ? projects.filter((project) => project.status === "LOOKING_FOR_MEMBERS")
      : activeFilter === "Open"
      ? projects.filter(
          (project) =>
            !project.status ||
            project.status === "OPEN" ||
            project.status === "LOOKING_FOR_MEMBERS"
        )
      : [];

  return (
    <WorkspaceLayout
      fullName={user?.fullName}
      userId={user?.id || user?.userId}
      activePage="Projects"
      sidebarTitle="Projects"
      sidebarItems={sidebarItems}
      activeSidebarItem={activeFilter}
      onSidebarItemClick={setActiveFilter}
      rightPanel={
        <div className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Quick actions
            </p>

            <div className="mt-3 grid gap-2">
              <a
                href="/projects/new"
                className="rounded-xl bg-[#0890E0] px-4 py-3 text-sm font-black text-white"
              >
                Start project
              </a>

              <a
                href="/explore"
                className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]"
              >
                Explore
              </a>

              <a
                href="/opportunities"
                className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]"
              >
                Opportunities
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Project principle
            </p>

            <h3 className="mt-3 text-lg font-black">
              Projects turn learning into proof.
            </h3>

            <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/55">
              A project should help members build real work, collaborate with
              others, and create evidence that can unlock opportunities.
            </p>
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-5">
        <div>
          <p className="text-sm font-bold text-[#102848]/45">GUMMI</p>
          <h1 className="mt-1 text-2xl font-black">Projects</h1>
        </div>

        <a
          href="/projects/new"
          className="rounded-xl bg-[#0890E0] px-4 py-2.5 text-sm font-black text-white"
        >
          + Start project
        </a>
      </div>

      <div className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DCE7F2] px-5 py-4">
          <div>
            <h2 className="text-lg font-black">Open projects</h2>
            <p className="mt-1 text-sm font-bold text-[#102848]/45">
              Projects looking for members, designers, creators, and marketers.
            </p>
          </div>

          <span className="rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3 py-2 text-xs font-black text-[#102848]/50">
            {visibleProjects.length} shown
          </span>
        </div>

        {loading && (
          <div className="p-6 text-sm font-bold text-[#102848]/55">
            Loading projects...
          </div>
        )}

        {!loading && message && (
          <div className="p-6 text-sm font-bold text-red-600">{message}</div>
        )}

        {!loading && !message && visibleProjects.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] text-2xl text-[#102848]/45">
              ◇
            </div>

            <h3 className="mt-4 text-lg font-black">No projects found</h3>

            <p className="mt-2 max-w-md text-sm font-bold leading-6 text-[#102848]/50">
              Start meaningful work and invite members to build with you.
            </p>

            <a
              href="/projects/new"
              className="mt-5 rounded-xl bg-[#0890E0] px-4 py-2.5 text-sm font-black text-white"
            >
              Start project
            </a>
          </div>
        )}

        {!loading && !message && visibleProjects.length > 0 && (
          <div className="divide-y divide-[#DCE7F2]">
            {visibleProjects.map((project) => (
              <a
                key={project.id}
                href={`/projects/${project.id}`}
                className="grid gap-4 px-5 py-4 hover:bg-[#F8FAFC] md:grid-cols-[minmax(0,1fr)_180px_220px]"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0890E0]">
                    {project.category || "Project"}
                  </p>

                  <h3 className="mt-1 text-base font-black">{project.title}</h3>

                  <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-[#102848]/55">
                    {project.description}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#102848]/35">
                    Status
                  </p>

                  <span className="mt-2 inline-block rounded-full border border-[#DCE7F2] bg-[#F8FAFC] px-3 py-1.5 text-xs font-black text-[#102848]/55">
                    {project.status
                      ? project.status.replaceAll("_", " ")
                      : "Open"}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#102848]/35">
                    Looking for
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#102848]/65">
                    {project.neededRoles || "Collaborators"}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}
