type JourneyStatCardProps = {
  label: string;
  value: string | number;
  note: string;
};

export default function JourneyStatCard({
  label,
  value,
  note,
}: JourneyStatCardProps) {
  return (
    <div className="border border-[#DCE7F2] bg-white/95 p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#102848]/35">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold text-[#102848]/45">{note}</p>
    </div>
  );
}
