"use client";

import WorkspaceTopbar from "./WorkspaceTopbar";

type WorkspaceLayoutProps = {
  fullName?: string;
  userId?: string;
  activePage: string;
  sidebarTitle?: string;
  sidebarItems?: string[];
  activeSidebarItem?: string;
  onSidebarItemClick?: (item: string) => void;
  rightPanel?: React.ReactNode;
  onNewProof?: () => void;
  children: React.ReactNode;
};

export default function WorkspaceLayout({
  fullName,
  userId,
  activePage,
  sidebarTitle,
  sidebarItems = [],
  activeSidebarItem,
  onSidebarItemClick,
  rightPanel,
  onNewProof,
  children,
}: WorkspaceLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <WorkspaceTopbar
        fullName={fullName}
        userId={userId}
        onNewProof={onNewProof}
      />

      <div
        className={`grid min-h-[calc(100vh-4rem)] grid-cols-1 ${
          rightPanel
            ? "lg:grid-cols-[260px_1fr_320px]"
            : "lg:grid-cols-[260px_1fr]"
        }`}
      >
        <aside className="hidden border-r border-[#DCE7F2] bg-white px-4 py-5 lg:block">
          <p className="px-3 text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
            {sidebarTitle || activePage}
          </p>

          {sidebarItems.length > 0 && (
            <nav className="mt-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSidebarItemClick?.(item)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold ${
                    activeSidebarItem === item
                      ? "bg-[#EAF3FF] text-[#0890E0]"
                      : "text-[#102848]/60 hover:bg-[#F8FAFC] hover:text-[#102848]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          )}
        </aside>

        <section className="min-w-0 p-5">
          <div className="mx-auto max-w-7xl">{children}</div>
        </section>

        {rightPanel && (
          <aside className="hidden border-l border-[#DCE7F2] bg-white p-5 xl:block">
            {rightPanel}
          </aside>
        )}
      </div>
    </main>
  );
}
