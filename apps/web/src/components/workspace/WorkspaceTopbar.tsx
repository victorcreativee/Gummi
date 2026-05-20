type WorkspaceTopbarProps = {
  fullName?: string;
};

export default function WorkspaceTopbar({ fullName }: WorkspaceTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#DCE7F2] bg-white px-6 text-[#102848]">
      <div className="flex items-center gap-10">
        <a href="/dashboard" className="text-lg font-black tracking-tight">
          GUMMI
        </a>

        <nav className="hidden items-center gap-8 text-sm font-bold md:flex">
          <a className="text-[#0890E0]">Profile</a>
          <a className="text-[#102848]/65">Explore</a>
          <a className="text-[#102848]/65">Micro-Academy</a>
          <a className="text-[#102848]/65">Projects</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <input
          placeholder="Search builders, proofs, projects..."
          className="hidden w-80 rounded-full border border-[#DCE7F2] bg-[#F8FAFC] px-5 py-3 text-sm font-bold outline-none placeholder:text-[#102848]/35 focus:border-[#0890E0] lg:block"
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0890E0] text-sm font-black text-white">
          {fullName?.[0]?.toUpperCase() || "G"}
        </div>
      </div>
    </header>
  );
}
