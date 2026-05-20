export default function WorkspaceSidebar() {
  return (
    <aside className="flex h-full flex-col rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-5 text-[#F5F1E8]">
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#C7FF6B] text-2xl font-black text-black">
          G
        </div>

        <div className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F5F1E8]/35">
            Workspace
          </p>

          <h2 className="mt-3 text-2xl font-black leading-tight">GUMMI</h2>

          <p className="mt-3 text-sm leading-7 text-[#F5F1E8]/50">
            Proof-of-work ecosystem for hidden talent.
          </p>
        </div>
      </div>

      <nav className="mt-12 flex flex-1 flex-col gap-2">
        {[
          "Overview",
          "Proofs",
          "Projects",
          "Collaborations",
          "Challenges",
          "Messages",
        ].map((item) => (
          <button
            key={item}
            className="rounded-2xl px-4 py-4 text-left text-sm font-bold text-[#F5F1E8]/65 transition hover:bg-white/5 hover:text-[#F5F1E8]"
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="rounded-[2rem] bg-white/[0.04] p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F5F1E8]/35">
          Momentum
        </p>

        <h3 className="mt-3 text-4xl font-black text-[#C7FF6B]">07</h3>

        <p className="mt-2 text-sm leading-6 text-[#F5F1E8]/50">
          Active contribution days this month.
        </p>
      </div>
    </aside>
  );
}
