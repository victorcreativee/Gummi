"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type WorkspaceTopbarProps = {
  fullName?: string;
  userId?: string;
  onNewProof?: () => void;
};

export default function WorkspaceTopbar({
  fullName,
  userId,
  onNewProof,
}: WorkspaceTopbarProps) {
  const router = useRouter();
  const [openAccount, setOpenAccount] = useState(false);
  const [openNew, setOpenNew] = useState(false);

  function handleLogout() {
    localStorage.removeItem("gummi_token");
    localStorage.removeItem("gummi_user");
    router.push("/login");
  }

  const initials = fullName
    ? fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "G";

  return (
    <header className="sticky top-0 z-50 border-b border-[#DCE7F2] bg-[#07111F] text-white">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <a href="/dashboard" className="text-xl font-black tracking-tight">
            GUMMI
          </a>

          <nav className="hidden items-center gap-6 text-sm font-bold lg:flex">
            <a
              className="border-b-2 border-[#0890E0] py-5 text-white"
              href="/dashboard"
            >
              Workspace
            </a>

            <a className="py-5 text-white/65 hover:text-white" href="#">
              Discover
            </a>

            <a className="py-5 text-white/65 hover:text-white" href="#">
              Sprints
            </a>

            <a className="py-5 text-white/65 hover:text-white" href="#">
              Sandbox
            </a>

            <a className="py-5 text-white/65 hover:text-white" href="#">
              Opportunities
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 lg:flex">
            <span className="text-white/40">⌕</span>
            <input
              placeholder="Search builders, proofs, projects..."
              className="ml-2 w-72 bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/35"
            />
            <span className="rounded border border-white/10 px-1.5 py-0.5 text-xs text-white/35">
              ⌘K
            </span>
          </div>

          <div className="relative hidden md:block">
            <button
              onClick={() => setOpenNew((current) => !current)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-black text-white/80 hover:bg-white/10"
            >
              + New
            </button>

            {openNew && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#07111F] p-2 shadow-2xl">
                <button
                  onClick={() => {
                    onNewProof?.();
                    setOpenNew(false);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                >
                  Submit proof
                </button>

                <a
                  href="#"
                  className="block rounded-lg px-3 py-2 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                >
                  Start sprint
                </a>

                <a
                  href="#"
                  className="block rounded-lg px-3 py-2 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                >
                  Find collaborators
                </a>
              </div>
            )}
          </div>

          <button className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 md:flex">
            ⚙
          </button>

          <div className="relative">
            <button
              onClick={() => setOpenAccount((current) => !current)}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 hover:bg-white/10"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0890E0] text-xs font-black text-white">
                {initials}
              </div>

              <div className="hidden text-left md:block">
                <p className="max-w-36 truncate text-sm font-black">
                  {fullName || "GUMMI Builder"}
                </p>
                <p className="text-xs font-bold text-white/45">
                  Personal account
                </p>
              </div>

              <span className="text-xs text-white/45">⌄</span>
            </button>

            {openAccount && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#07111F] shadow-2xl">
                <div className="border-b border-white/10 p-4">
                  <p className="text-sm font-black">
                    {fullName || "GUMMI Builder"}
                  </p>
                  <p className="mt-1 text-xs font-bold text-white/45">
                    Personal account
                  </p>
                </div>

                <div className="p-2">
                  <a
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    My workspace
                  </a>

                  <a
                    href="#"
                    className="block rounded-lg px-3 py-2 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    Public profile
                  </a>

                  <a
                    href={userId ? `/profile/${userId}` : "/dashboard"}
                    className="block rounded-lg px-3 py-2 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    Account settings
                  </a>

                  <a
                    href="#"
                    className="block rounded-lg px-3 py-2 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    Verification
                  </a>

                  <a
                    href="#"
                    className="block rounded-lg px-3 py-2 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    Help & feedback
                  </a>
                </div>

                <div className="border-t border-white/10 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-black text-red-400 hover:bg-red-500/10"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
