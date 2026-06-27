"use client";

import { useEffect, useState } from "react";
import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";
import PreviewDrawer from "../../components/preview/PreviewDrawer";
import ProjectPreview from "../../components/preview/ProjectPreview";
import { getProjects, GummiProject } from "../../lib/api";

type GummiUser = {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  role: string;
};

const exploreItems = [
  {
    title: "Members",
    description: "People growing through proof of work.",
    count: "Soon",
  },
  {
    title: "Experts",
    description: "Trusted professionals, mentors, and reviewers.",
    count: "Soon",
  },
  {
    title: "Projects",
    description: "Real work members can join and contribute to.",
    count: "Live",
  },
  {
    title: "Organizations",
    description: "Teams creating opportunities for members.",
    count: "Soon",
  },
];

const sidebarItems = ["All", "Members", "Experts", "Projects", "Organizations"];

export default function ExplorePage() {
  const [user, setUser] = useState<GummiUser | null>(null);
  const [projects, setProjects] = useState<GummiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<GummiProject | null>(
    null
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("gummi_user");
    if (storedUser) setUser(JSON.parse(storedUser));

    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects =
    activeFilter === "All" || activeFilter === "Projects" ? projects : [];

  const emptyStateTitle =
    activeFilter === "Members"
      ? "Members discovery is coming soon"
      : activeFilter === "Experts"
      ? "Experts discovery is coming soon"
      : activeFilter === "Organizations"
      ? "Organizations discovery is coming soon"
      : "No projects yet";

  const emptyStateDescription =
    activeFilter === "Members"
      ? "Soon, this space will help you discover members through their proof of work, growth, and collaboration history."
      : activeFilter === "Experts"
      ? "Soon, you will be able to discover verified experts who teach, mentor, review work, and guide members."
      : activeFilter === "Organizations"
      ? "Soon, organizations creating opportunities for members will appear here."
      : "Projects will appear here when members start meaningful work and invite others to join.";

  return (
    <WorkspaceLayout
      fullName={user?.fullName}
      userId={user?.id || user?.userId}
      activePage="Explore"
      sidebarTitle="Explore"
      sidebarItems={sidebarItems}
      activeSidebarItem={activeFilter}
      onSidebarItemClick={setActiveFilter}
      rightPanel={
        <div className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Quick links
            </p>

            <div className="mt-3 grid gap-2">
              <a
                href="/projects"
                className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]"
              >
                Projects
              </a>
              <a
                href="/projects/new"
                className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]"
              >
                Start project
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
              Discovery principle
            </p>
            <h3 className="mt-3 text-lg font-black">
              Find people through work.
            </h3>
            <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/55">
              Explore should help members discover useful people, serious
              projects, and meaningful opportunities.
            </p>
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-5">
        <div>
          <p className="text-sm font-bold text-[#102848]/45">GUMMI</p>
          <h1 className="mt-1 text-2xl font-black">Explore</h1>
        </div>

        <a
          href="/projects/new"
          className="rounded-xl bg-[#0890E0] px-4 py-2.5 text-sm font-black text-white"
        >
          + Start project
        </a>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {exploreItems.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black">{item.title}</h2>
              <span className="rounded-full bg-[#F8FAFC] px-2 py-1 text-xs font-black text-[#102848]/45 ring-1 ring-[#DCE7F2]">
                {item.count}
              </span>
            </div>

            <p className="mt-3 text-sm font-bold leading-6 text-[#102848]/55">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DCE7F2] px-5 py-4">
          <div>
            <h2 className="text-lg font-black">
              {activeFilter === "All" || activeFilter === "Projects"
                ? "Projects you can join"
                : `${activeFilter} are coming soon`}
            </h2>
            <p className="mt-1 text-sm font-bold text-[#102848]/45">
              Real work happening inside the ecosystem.
            </p>
          </div>

          <a
            href="/projects"
            className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-black text-[#102848]/70 hover:bg-[#F8FAFC]"
          >
            View all
          </a>
        </div>

        <div>
          {loading ? (
            <div className="p-5 text-sm font-bold text-[#102848]/45">
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] text-2xl text-[#102848]/45">
                ◇
              </div>
              <h3 className="mt-4 text-lg font-black">{emptyStateTitle}</h3>
              <p className="mt-2 max-w-md text-sm font-bold leading-6 text-[#102848]/50">
                {emptyStateDescription}
              </p>

              {(activeFilter === "All" || activeFilter === "Projects") && (
                <a
                  href="/projects/new"
                  className="mt-5 rounded-xl bg-[#0890E0] px-4 py-2.5 text-sm font-black text-white"
                >
                  Create first project
                </a>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#DCE7F2]">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="grid w-full gap-4 px-5 py-4 text-left hover:bg-[#F8FAFC] md:grid-cols-[minmax(0,1fr)_220px_170px]"
                >
                  <div>
                    <h3 className="font-black">{project.title}</h3>
                    <p className="mt-1 line-clamp-1 text-sm font-bold text-[#102848]/50">
                      {project.description}
                    </p>
                  </div>

                  <div className="text-sm font-bold text-[#102848]/45">
                    {project.neededRoles || "Open roles"}
                  </div>

                  <div className="flex justify-start md:justify-end">
                    <span className="max-w-full rounded-full border border-[#DCE7F2] bg-[#F8FAFC] px-3 py-1.5 text-xs font-black text-[#102848]/55">
                      {project.status
                        ? project.status.replaceAll("_", " ")
                        : "Open"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <PreviewDrawer
        open={Boolean(selectedProject)}
        title="Project"
        onClose={() => setSelectedProject(null)}
      >
        {selectedProject && <ProjectPreview project={selectedProject} />}
      </PreviewDrawer>
    </WorkspaceLayout>
  );
}
