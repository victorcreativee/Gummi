import { GummiProject } from "../../lib/api";

type ProjectPreviewProps = {
  project: GummiProject;
};

export default function ProjectPreview({ project }: ProjectPreviewProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
          Project Preview
        </p>

        <h2 className="mt-3 text-3xl font-black text-[#102848]">
          {project.title}
        </h2>

        <p className="mt-3 text-sm font-bold leading-7 text-[#102848]/60">
          {project.description || "No project description yet."}
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-[#102848]/45">Status</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#102848]/55 ring-1 ring-[#DCE7F2]">
            {project.status || "Open"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-[#102848]/45">
            Looking for
          </span>
          <span className="max-w-[240px] text-right text-sm font-black text-[#102848]/70">
            {project.neededRoles || "Open collaborators"}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
          Why this matters
        </p>

        <p className="mt-3 text-sm font-bold leading-7 text-[#102848]/60">
          Projects are where members move from learning alone to building with
          others. Joining a project helps create proof of work, collaboration
          history, and trust.
        </p>
      </div>

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
          Next steps
        </p>

        <div className="mt-4 grid gap-2">
          <a
            href={`/projects/${project.id}`}
            className="rounded-xl bg-[#0890E0] px-4 py-3 text-center text-sm font-black text-white"
          >
            Open project
          </a>

          <a
            href={`/projects/${project.id}/contribute`}
            className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-center text-sm font-black text-[#102848]/70 hover:bg-[#F8FAFC]"
          >
            Share work
          </a>
        </div>
      </div>
    </div>
  );
}
