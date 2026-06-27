type ActionCardProps = {
  title: string;
  description: string;
  href?: string;
};

export default function ActionCard({
  title,
  description,
  href,
}: ActionCardProps) {
  const content = (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm transition hover:border-[#0890E0]">
      <h2 className="text-lg font-black">{title}</h2>
      <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/55">
        {description}
      </p>
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}
