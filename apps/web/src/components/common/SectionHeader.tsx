type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0890E0]">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-2xl text-base font-bold leading-8 text-[#102848]/60">
          {description}
        </p>
      )}
    </div>
  );
}
