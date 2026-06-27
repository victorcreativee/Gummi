"use client";

type PreviewDrawerProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function PreviewDrawer({
  open,
  title,
  onClose,
  children,
}: PreviewDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#102848]/20"
        aria-label="Close preview"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-[#DCE7F2] bg-white shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-[#DCE7F2] px-5">
          <p className="text-sm font-black text-[#102848]/70">
            {title || "Preview"}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#DCE7F2] bg-white px-3 py-2 text-sm font-black text-[#102848]/60 hover:bg-[#F8FAFC]"
          >
            Close
          </button>
        </div>

        <div className="h-[calc(100%-4rem)] overflow-y-auto p-5">
          {children}
        </div>
      </aside>
    </div>
  );
}
