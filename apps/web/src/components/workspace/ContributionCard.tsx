export default function ContributionCard() {
  return (
    <div className="rounded-[2.5rem] bg-black p-6 text-[#F5F1E8]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F5F1E8]/35">
            Contribution
          </p>

          <h2 className="mt-3 text-3xl font-black">Execution streak</h2>
        </div>

        <div className="rounded-2xl bg-[#C7FF6B] px-4 py-3 text-sm font-black text-black">
          7 days
        </div>
      </div>

      <div className="mt-8 grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <div
            key={index}
            className={`aspect-square rounded-lg ${
              index % 3 === 0 ? "bg-[#C7FF6B]" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <p className="mt-5 text-sm leading-7 text-[#F5F1E8]/50">
        Consistency matters more than noise.
      </p>
    </div>
  );
}
