type JourneyActionCardProps = {
  title: string;
  description: string;
  onClick: () => void;
};

export default function JourneyActionCard({
  title,
  description,
  onClick,
}: JourneyActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] p-5 text-left hover:border-[#0890E0]"
    >
      <h3 className="font-black">{title}</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/55">
        {description}
      </p>
    </button>
  );
}
