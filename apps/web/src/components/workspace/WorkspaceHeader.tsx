type WorkspaceHeaderProps = {
  fullName?: string;
};

export default function WorkspaceHeader({ fullName }: WorkspaceHeaderProps) {
  return (
    <header className="rounded-[2.5rem] bg-[#F5F1E8] p-6 text-black">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
            Proof workspace
          </p>

          <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-tight">
            Welcome back{fullName ? `, ${fullName}` : ""}.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60">
            Build consistently. Show real work. Let the ecosystem speak for your
            skill.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-black px-6 py-4 text-sm font-black text-[#F5F1E8]">
            Add proof
          </button>

          <button className="rounded-full border border-black/10 px-6 py-4 text-sm font-black text-black/70">
            Find collaborators
          </button>
        </div>
      </div>
    </header>
  );
}
