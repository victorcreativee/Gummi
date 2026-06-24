"use client";

import { useEffect, useState } from "react";
import WorkspaceTopbar from "../../components/workspace/WorkspaceTopbar";
import { getProjects, GummiProject } from "../../lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<GummiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not load projects"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <WorkspaceTopbar />

      <section className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(#DCE7F2_0.8px,transparent_0.8px)] bg-[length:18px_18px] px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-6 border border-[#DCE7F2] bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
                Projects
              </p>
              <h1 className="mt-3 text-3xl font-black">
                Build with other people
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-[#102848]/60">
                Start projects, find collaborators, join teams, and turn your
                skills into visible proof.
              </p>
            </div>

            <a
              href="/projects/new"
              className="rounded-xl bg-[#0890E0] px-5 py-3 text-sm font-black text-white"
            >
              Start project
            </a>
          </div>

          <div className="mt-6 border border-[#DCE7F2] bg-white shadow-sm">
            <div className="border-b border-[#DCE7F2] px-5 py-4">
              <h2 className="text-lg font-black">Open projects</h2>
              <p className="mt-1 text-sm font-bold text-[#102848]/50">
                Projects looking for builders, designers, creators, and
                marketers.
              </p>
            </div>

            {loading && (
              <div className="p-6 text-sm font-bold text-[#102848]/55">
                Loading projects...
              </div>
            )}

            {!loading && message && (
              <div className="p-6 text-sm font-bold text-red-600">
                {message}
              </div>
            )}

            {!loading && !message && projects.length === 0 && (
              <div className="p-6">
                <h3 className="text-lg font-black">No projects yet</h3>
                <p className="mt-2 text-sm leading-7 text-[#102848]/60">
                  Be the first to start a project and invite collaborators.
                </p>
              </div>
            )}

            {!loading &&
              !message &&
              projects.map((project) => (
                <a
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="grid gap-4 border-b border-[#DCE7F2] px-5 py-4 last:border-b-0 hover:bg-[#F8FAFC] md:grid-cols-[1fr_160px_180px]"
                >
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0890E0]">
                      {project.category || "Project"}
                    </p>
                    <h3 className="mt-1 text-base font-black">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#102848]/60">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#102848]/35">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#102848]/65">
                      {project.status?.replaceAll("_", " ").toLowerCase()}
                    </p>
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
        </div>
      </section>
    </main>
  );
}
