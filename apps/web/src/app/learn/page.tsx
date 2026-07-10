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

const sidebarItems = ["All", "Workshops", "Mentorship", "Critiques", "Bootcamps"];

const learningPaths = [
  {
    title: "Practical workshops",
    type: "Workshops",
    price: "$1–$10",
    description:
      "Short expert-led sessions where members learn one practical skill and immediately apply it.",
    nextStep: "Join session",
  },
  {
    title: "Live work critiques",
    type: "Critiques",
    price: "$3–$5",
    description:
      "Members submit unfinished work, receive expert feedback, improve it, and turn progress into proof.",
    nextStep: "Submit work",
  },
  {
    title: "Mentorship rooms",
    type: "Mentorship",
    price: "Invite based",
    description:
      "Small rooms where trusted experts guide members through real project decisions and career growth.",
    nextStep: "Request mentor",
  },
  {
    title: "Mini bootcamps",
    type: "Bootcamps",
    price: "$5–$10",
    description:
      "Focused learning sprints that end with a challenge, peer review, and visible proof of work.",
    nextStep: "View bootcamps",
  },
];

export default function LearnPage() {
  const [user, setUser] = useState<GummiUser | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const storedUser = localStorage.getItem("gummi_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const visiblePaths =
    activeFilter === "All"
      ? learningPaths
      : learningPaths.filter((path) => path.type === activeFilter);

  return (
    <WorkspaceLayout
      fullName={user?.fullName}
      userId={user?.id || user?.userId}
      activePage="Learn"
      sidebarTitle="Learn"
      sidebarItems={sidebarItems}
      activeSidebarItem={activeFilter}
      onSidebarItemClick={setActiveFilter}
      rightPanel={
        <div className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Learning flow
            </p>
            <div className="mt-3 border-l border-[#DCE7F2] pl-4 text-sm font-bold leading-7 text-[#102848]/60">
              Expert teaches<br />
              Member builds<br />
              Feedback improves work<br />
              Proof becomes visible
            </div>
          </div>

          <div className="border border-[#DCE7F2] bg-[#F8FAFC] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Principle
            </p>
            <h3 className="mt-3 text-lg font-black">Learning must lead somewhere.</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/55">
              GUMMI learning is not passive content. Every session should help a member build, receive feedback, and move closer to opportunity.
            </p>
          </div>
        </div>
      }
    >
      <div className="border-b border-[#DCE7F2] pb-5">
        <p className="text-sm font-bold text-[#102848]/45">GUMMI</p>
        <h1 className="mt-1 text-2xl font-black">Learn</h1>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-[#102848]/55">
          Practical learning spaces where experts teach, members build, feedback is visible, and growth becomes proof.
        </p>
      </div>

      <div className="mt-6 overflow-hidden border border-[#DCE7F2] bg-white shadow-sm">
        <div className="grid border-b border-[#DCE7F2] bg-[#F8FAFC] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#102848]/35 md:grid-cols-[1fr_140px_130px_130px]">
          <span>Learning space</span>
          <span>Type</span>
          <span>Price</span>
          <span>Next step</span>
        </div>

        <div className="divide-y divide-[#DCE7F2]">
          {visiblePaths.map((path) => (
            <div key={path.title} className="grid gap-4 px-5 py-4 hover:bg-[#F8FAFC] md:grid-cols-[1fr_140px_130px_130px]">
              <div>
                <h2 className="text-base font-black">{path.title}</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/55">{path.description}</p>
              </div>
              <p className="text-sm font-black text-[#102848]/65">{path.type}</p>
              <p className="text-sm font-black text-[#0890E0]">{path.price}</p>
              <button className="h-fit border border-[#DCE7F2] bg-white px-3 py-2 text-left text-sm font-black text-[#102848]/70 hover:bg-[#F8FAFC]">
                {path.nextStep}
              </button>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
