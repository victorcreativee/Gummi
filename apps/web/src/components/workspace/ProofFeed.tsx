export default function ProofFeed() {
  return (
    <div className="rounded-[2.5rem] bg-white p-6 text-black">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
            Recent proofs
          </p>

          <h2 className="mt-3 text-3xl font-black">Your work activity</h2>
        </div>

        <button className="rounded-full border border-black/10 px-5 py-3 text-sm font-black text-black/60">
          View all
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {[
          "Landing page redesign",
          "Brand identity exploration",
          "Portfolio motion graphics",
        ].map((proof) => (
          <div
            key={proof}
            className="rounded-[2rem] border border-black/10 p-5"
          >
            <p className="text-lg font-black">{proof}</p>

            <p className="mt-2 text-sm leading-7 text-black/55">
              Early-stage proof submission. Full verification layer coming next.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
