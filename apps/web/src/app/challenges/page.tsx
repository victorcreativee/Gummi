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

const sidebarItems = ["All", "Design", "Development", "Content", "Business"];

const challenges = [
  {
    title: "Redesign a confusing dashboard",
    category: "Design",
    level: "Beginner",
    review: "AI + peer review",
    description:
      "Improve a weak dashboard screen and explain your decisions, tradeoffs, and final layout.",
  },
  {
    title: "Fix a broken API workflow",
    category: "Development",
    level: "Intermediate",
    review: "Expert review",
    description:
      "Debug a real endpoint flow, document the issue, provide the fix, and show testing evidence.",
  },
  {
    title: "Turn rough notes into a launch story",
    category: "Content",
    level: "Beginner",
    review: "Peer review",
    description:
      "Write clear product copy from messy founder notes and explain the audience you are writing for.",
  },
  {
    title: "Validate a micro-startup idea",
    category: "Business",
    level: "Intermediate",
    review: "Expert review",
    description:
      "Define the customer, problem, first offer, price, and a simple one-week validation plan.",
  },
];

export default function ChallengesPage() {
  const [user, setUser] = useState<GummiUser | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const storedUser = localStorage.getItem("gummi_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const visibleChallenges =
    activeFilter === "All"
      ? challenges
      : challenges.filter((challenge) => challenge.category === activeFilter);

  return (
    <WorkspaceLayout
      fullName={user?.fullName}
      userId={user?.id || user?.userId}
      activePage="Challenges"
      sidebarTitle="Challenges"
      sidebarItems={sidebarItems}
      activeSidebarItem={activeFilter}
      onSidebarItemClick={setActiveFilter}
      rightPanel={
        <div className="space-y-5">
          <div className="border border-[#DCE7F2] bg-[#F8FAFC] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Verification flow
            </p>
            <h3 className="mt-3 text-lg font-black">Challenge → Proof → Trust</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/55">
              Challenges are the cleanest way for members to prove skill without relying on resumes, followers, or connections.
            </p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Quick actions
            </p>
            <div className="mt-3 grid gap-2">
              <a href="/dashboard" className="border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]">Submit proof</a>
              <a href="/projects" className="border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]">Join project</a>
              <a href="/learn" className="border border-[#DCE7F2] px-4 py-3 text-sm font-black hover:bg-[#F8FAFC]">Find learning</a>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-5">
        <div>
          <p className="text-sm font-bold text-[#102848]/45">GUMMI</p>
          <h1 className="mt-1 text-2xl font-black">Challenges</h1>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-[#102848]/55">
            Practical assessments where members build real evidence, receive feedback, and grow their verification record.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {visibleChallenges.map((challenge) => (
          <article key={challenge.title} className="border border-[#DCE7F2] bg-white p-5 shadow-sm hover:bg-[#F8FAFC]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0890E0]">{challenge.category}</p>
                <h2 className="mt-1 text-lg font-black">{challenge.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-black text-[#102848]/55">
                <span className="border border-[#DCE7F2] bg-white px-3 py-1.5">{challenge.level}</span>
                <span className="border border-[#DCE7F2] bg-white px-3 py-1.5">{challenge.review}</span>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-[#102848]/55">{challenge.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="bg-[#0890E0] px-4 py-2.5 text-sm font-black text-white">Start challenge</button>
              <button className="border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-black text-[#102848]/70">View requirements</button>
            </div>
          </article>
        ))}
      </div>
    </WorkspaceLayout>
  );
}
