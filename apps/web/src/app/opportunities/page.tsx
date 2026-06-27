"use client";

import { useEffect, useState } from "react";
import WorkspaceLayout from "../../components/workspace/WorkspaceLayout";

type GummiUser = {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  role: string;
};

const opportunityTypes = [
  {
    title: "Jobs",
    description: "Roles connected to verified proof of work.",
    status: "Soon",
  },
  {
    title: "Freelance Work",
    description: "Paid work matched to demonstrated ability.",
    status: "Soon",
  },
  {
    title: "Startup Teams",
    description: "Join serious teams forming around real projects.",
    status: "Soon",
  },
  {
    title: "Mentorship",
    description: "Learn from experts who can help you grow.",
    status: "Soon",
  },
  {
    title: "Funding",
    description: "Support for teams with strong execution.",
    status: "Soon",
  },
  {
    title: "Leadership",
    description: "Earn responsibility through contribution.",
    status: "Soon",
  },
];

const sidebarItems = [
  "All",
  "Jobs",
  "Freelance",
  "Startup Teams",
  "Mentorship",
  "Funding",
];

export default function OpportunitiesPage() {
  const [user, setUser] = useState<GummiUser | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const storedUser = localStorage.getItem("gummi_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const visibleOpportunityTypes =
    activeFilter === "All"
      ? opportunityTypes
      : opportunityTypes.filter((item) => item.title.includes(activeFilter));

  return (
    <WorkspaceLayout
      fullName={user?.fullName}
      userId={user?.id || user?.userId}
      activePage="Opportunities"
      sidebarTitle="Opportunities"
      sidebarItems={sidebarItems}
      activeSidebarItem={activeFilter}
      onSidebarItemClick={setActiveFilter}
      rightPanel={
        <div className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Build readiness
            </p>

            <div className="mt-3 grid gap-2">
              <a
                href="/dashboard"
                className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]"
              >
                My Journey
              </a>
              <a
                href="/projects"
                className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]"
              >
                Projects
              </a>
              <a
                href="/explore"
                className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]"
              >
                Explore
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Opportunity principle
            </p>
            <h3 className="mt-3 text-lg font-black">
              Opportunity should be earned through proof.
            </h3>
            <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/55">
              This page should never become a generic job board. Opportunities
              must connect to demonstrated ability, trust, and contribution.
            </p>
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-5">
        <div>
          <p className="text-sm font-bold text-[#102848]/45">GUMMI</p>
          <h1 className="mt-1 text-2xl font-black">Opportunities</h1>
        </div>

        <a
          href="/dashboard"
          className="rounded-xl bg-[#0890E0] px-4 py-2.5 text-sm font-black text-white"
        >
          Improve My Journey
        </a>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {visibleOpportunityTypes.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black">{item.title}</h2>
              <span className="rounded-full bg-[#F8FAFC] px-2 py-1 text-xs font-black text-[#102848]/45 ring-1 ring-[#DCE7F2]">
                {item.status}
              </span>
            </div>

            <p className="mt-3 text-sm font-bold leading-6 text-[#102848]/55">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DCE7F2] px-5 py-4">
          <div>
            <h2 className="text-lg font-black">Opportunity board</h2>
            <p className="mt-1 text-sm font-bold text-[#102848]/45">
              Opportunities will appear here when they are connected to proof,
              trust, and real contribution.
            </p>
          </div>

          <span className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-black text-[#102848]/45">
            Coming soon
          </span>
        </div>

        <div className="flex min-h-80 flex-col items-center justify-center p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] text-2xl text-[#102848]/45">
            ◇
          </div>

          <h3 className="mt-4 text-lg font-black">
            Opportunities are not generic listings.
          </h3>

          <p className="mt-2 max-w-md text-sm font-bold leading-6 text-[#102848]/50">
            GUMMI opportunities should be unlocked through proof of work,
            collaboration history, consistency, and trust.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <a
              href="/dashboard"
              className="rounded-xl bg-[#0890E0] px-4 py-2.5 text-sm font-black text-white"
            >
              Build proof
            </a>

            <a
              href="/projects"
              className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-black text-[#102848]/70 hover:bg-[#F8FAFC]"
            >
              Join projects
            </a>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
