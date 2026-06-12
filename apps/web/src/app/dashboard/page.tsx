"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addBuilderSkill,
  getBuilderSkills,
  getUserProfile,
  saveUserProfile,
  createProof,
  getUserProofs,
} from "../../lib/api";
import WorkspaceTopbar from "../../components/workspace/WorkspaceTopbar";

type GummiUser = {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
};

type BuilderSkill = {
  id: string;
  userId: string;
  skillName: string;
  status: string;
  createdAt: string;
};

type ProofSubmission = {
  id: string;
  userId: string;
  title: string;
  careerCategory: string;
  proofType: string;
  description: string;
  proofLink?: string;
  mediaUrl?: string;
  toolsUsed?: string;
  status: string;
  verificationScore: number;
  createdAt: string;
  reviewStatus?: string;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  challenge?: string;
  process?: string;
  outcome?: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<GummiUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [skills, setSkills] = useState<BuilderSkill[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [skillMessage, setSkillMessage] = useState("");
  const [savingSkill, setSavingSkill] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");

  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [buildingNow, setBuildingNow] = useState("");
  const [story, setStory] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const [proofs, setProofs] = useState<ProofSubmission[]>([]);
  const [showProofForm, setShowProofForm] = useState(false);
  const [savingProof, setSavingProof] = useState(false);
  const [proofMessage, setProofMessage] = useState("");

  const [proofTitle, setProofTitle] = useState("");
  const [careerCategory, setCareerCategory] = useState("TECH_BUILDER");
  const [proofType, setProofType] = useState("PROJECT");
  const [proofDescription, setProofDescription] = useState("");
  const [challenge, setChallenge] = useState("");
  const [process, setProcess] = useState("");
  const [outcome, setOutcome] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");

  function getCurrentUserId() {
    return user?.id || user?.userId;
  }
  function formatLabel(value?: string) {
    if (!value) return "Not set";
    return value.replaceAll("_", " ").toLowerCase();
  }

  function getReviewedProofsCount() {
    return proofs.filter(
      (proof) => proof.reviewStatus && proof.reviewStatus !== "PENDING"
    ).length;
  }

  function getAverageVerificationScore() {
    if (proofs.length === 0) return 0;

    const total = proofs.reduce((sum, proof) => {
      return sum + (proof.verificationScore || 0);
    }, 0);

    return Math.round(total / proofs.length);
  }

  function getLatestProof() {
    return proofs[0];
  }

  useEffect(() => {
    const token = localStorage.getItem("gummi_token");
    const storedUser = localStorage.getItem("gummi_user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const currentUserId = parsedUser.id || parsedUser.userId;

    setUser(parsedUser);

    Promise.all([
      getBuilderSkills(currentUserId).catch(() => []),
      getUserProfile(currentUserId).catch(() => null),
      getUserProofs(currentUserId).catch(() => []),
    ])
      .then(([loadedSkills, loadedProfile, loadedProofs]) => {
        setSkills(loadedSkills);
        setProofs(loadedProofs);

        if (loadedProfile) {
          setHeadline(loadedProfile.headline || "");
          setLocation(loadedProfile.location || "");
          setAvailability(loadedProfile.availability || "");
          setBuildingNow(loadedProfile.buildingNow || "");
          setStory(loadedProfile.story || "");
          setEditingProfile(false);
        } else {
          setEditingProfile(true);
        }
      })
      .finally(() => setCheckingAuth(false));
  }, [router]);

  async function handleAddSkill(skillName: string) {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    setSavingSkill(true);
    setSkillMessage("");

    try {
      const savedSkill = await addBuilderSkill({
        userId: currentUserId,
        skillName,
      });
      setSkills((current) => [savedSkill, ...current]);
      setSkillMessage(`${skillName} added.`);
    } catch (error) {
      setSkillMessage(
        error instanceof Error ? error.message : "Could not add skill"
      );
    } finally {
      setSavingSkill(false);
    }
  }

  async function handleCustomSkillSubmit(event: FormEvent) {
    event.preventDefault();

    const cleanSkill = customSkill.trim();
    if (!cleanSkill) return;

    await handleAddSkill(cleanSkill);
    setCustomSkill("");
  }

  async function handleSaveProfile(event: FormEvent) {
    event.preventDefault();

    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    setSavingProfile(true);
    setProfileMessage("");

    try {
      await saveUserProfile({
        userId: currentUserId,
        headline,
        location,
        availability,
        buildingNow,
        story,
      });

      setProfileMessage("Profile saved.");
      setEditingProfile(false);
    } catch (error) {
      setProfileMessage(
        error instanceof Error ? error.message : "Could not save profile"
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleCreateProof(event: FormEvent) {
    event.preventDefault();

    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    setSavingProof(true);
    setProofMessage("");

    try {
      const savedProof = await createProof({
        userId: currentUserId,
        title: proofTitle,
        careerCategory,
        proofType,
        description: proofDescription,
        challenge,
        process,
        outcome,
        proofLink,
        toolsUsed,
      });

      setProofs((current) => [savedProof, ...current]);
      setProofMessage("Proof added.");

      setProofTitle("");
      setCareerCategory("TECH_BUILDER");
      setProofType("PROJECT");
      setProofDescription("");
      setChallenge("");
      setProcess("");
      setOutcome("");
      setProofLink("");
      setToolsUsed("");
      setShowProofForm(false);
    } catch (error) {
      setProofMessage(
        error instanceof Error ? error.message : "Could not submit proof"
      );
    } finally {
      setSavingProof(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-[#102848]">
        <p className="text-sm font-bold text-[#102848]/60">
          Opening your GUMMI workspace...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <WorkspaceTopbar
        fullName={user?.fullName}
        userId={getCurrentUserId()}
        onNewProof={() => setShowProofForm(true)}
      />

      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[248px_1fr]">
        <aside className="hidden border-r border-[#DCE7F2] bg-white/80 px-4 py-5 lg:block">
          <div className="flex items-center gap-3 px-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0890E0] text-sm font-black text-white">
              G
            </div>
            <div>
              <p className="text-sm font-black">GUMMI</p>
              <p className="text-xs font-bold text-[#102848]/45">
                Builder workspace
              </p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {[
              "Overview",
              "Proof-of-Work",
              "Case Studies",
              "Execution Logs",
              "Skills",
              "Collaborations",
              "Verification",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActiveSection(item)}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold ${
                  activeSection === item
                    ? "bg-[#EAF3FF] text-[#0890E0]"
                    : "text-[#102848]/65 hover:bg-[#F8FAFC]"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-8 border-t border-[#DCE7F2] pt-5">
            <p className="px-3 text-xs font-black uppercase tracking-[0.16em] text-[#102848]/35">
              Momentum
            </p>
            <div className="mt-3 px-3">
              <p className="text-2xl font-black">
                {proofs.length + skills.length}
              </p>
              <p className="text-xs font-bold text-[#102848]/45">
                signals collected
              </p>
            </div>
          </div>
        </aside>

        <section className="bg-[radial-gradient(#DCE7F2_0.8px,transparent_0.8px)] bg-[length:18px_18px] p-5">
          <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[1fr_330px]">
            <section className="space-y-5">
              <div className="border border-[#DCE7F2] bg-white/95 p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
                      {activeSection}
                    </p>
                    <h1 className="mt-3 text-3xl font-black">
                      {user?.fullName || "GUMMI Builder"}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-[#102848]/60">
                      {headline ||
                        "Complete your profile so your work can speak clearly."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#EAF3FF] px-3 py-1.5 text-xs font-black text-[#0890E0]">
                        {location || "Location not added"}
                      </span>
                      <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-black text-[#102848]/55 ring-1 ring-[#DCE7F2]">
                        {availability || "Availability not added"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`/profile/${getCurrentUserId()}`}
                      className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-black"
                    >
                      Public profile
                    </a>
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="rounded-xl bg-[#102848] px-4 py-2.5 text-sm font-black text-white"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                <div className="border border-[#DCE7F2] bg-white/95 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#102848]/35">
                    Submitted Proof
                  </p>
                  <p className="mt-3 text-3xl font-black">{proofs.length}</p>
                  <p className="mt-1 text-xs font-bold text-[#102848]/45">
                    real work records
                  </p>
                </div>

                <div className="border border-[#DCE7F2] bg-white/95 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#102848]/35">
                    Skills Claimed
                  </p>
                  <p className="mt-3 text-3xl font-black">{skills.length}</p>
                  <p className="mt-1 text-xs font-bold text-[#102848]/45">
                    builder capabilities
                  </p>
                </div>

                <div className="border border-[#DCE7F2] bg-white/95 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#102848]/35">
                    Reviewed
                  </p>
                  <p className="mt-3 text-3xl font-black">
                    {getReviewedProofsCount()}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#102848]/45">
                    checked signals
                  </p>
                </div>

                <div className="border border-[#DCE7F2] bg-white/95 p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#102848]/35">
                    Trust Score
                  </p>
                  <p className="mt-3 text-3xl font-black">
                    {getAverageVerificationScore()}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#102848]/45">
                    average verification
                  </p>
                </div>
              </div>

              <div className="border border-[#DCE7F2] bg-white/95 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">Professional activity</h2>
                  <p className="text-xs font-bold text-[#102848]/45">
                    Proof activity map
                  </p>
                </div>

                <div
                  className="mt-5 grid gap-1"
                  style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
                >
                  {Array.from({ length: 98 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-3 ${
                        index % 5 === 0
                          ? "bg-[#0890E0]"
                          : index % 3 === 0
                          ? "bg-[#72C7F4]"
                          : "bg-[#DCE7F2]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="border border-[#DCE7F2] bg-white/95 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#DCE7F2] px-5 py-4">
                  <div>
                    <h2 className="text-lg font-black">Proof-of-Work Ledger</h2>
                    <p className="text-sm font-bold text-[#102848]/50">
                      Every project, sprint, case study, and execution signal
                      you submit.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowProofForm((current) => !current)}
                    className="rounded-xl bg-[#0890E0] px-4 py-2.5 text-sm font-black text-white"
                  >
                    {showProofForm ? "Close" : "Submit proof"}
                  </button>
                </div>

                {showProofForm && (
                  <form
                    onSubmit={handleCreateProof}
                    className="border-b border-[#DCE7F2] p-5"
                  >
                    <div className="grid gap-3">
                      <input
                        value={proofTitle}
                        onChange={(e) => setProofTitle(e.target.value)}
                        required
                        placeholder="Proof title"
                        className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                      />

                      <div className="grid gap-3 md:grid-cols-2">
                        <select
                          value={careerCategory}
                          onChange={(e) => setCareerCategory(e.target.value)}
                          className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none"
                        >
                          <option value="TECH_BUILDER">Tech Builder</option>
                          <option value="CREATIVE_DESIGNER">
                            Creative Designer
                          </option>
                          <option value="VISUAL_MEDIA_CREATOR">
                            Visual Creator
                          </option>
                          <option value="CONTENT_DIGITAL_MARKETER">
                            Marketing & Content
                          </option>
                        </select>

                        <select
                          value={proofType}
                          onChange={(e) => setProofType(e.target.value)}
                          className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none"
                        >
                          <option value="PROJECT">Project</option>
                          <option value="CASE_STUDY">Case Study</option>
                          <option value="PORTFOLIO_LINK">Portfolio Link</option>
                          <option value="CHALLENGE_SUBMISSION">
                            Challenge Submission
                          </option>
                          <option value="COLLABORATION_WORK">
                            Collaboration Work
                          </option>
                        </select>
                      </div>

                      <textarea
                        value={proofDescription}
                        onChange={(e) => setProofDescription(e.target.value)}
                        required
                        rows={3}
                        placeholder="What did you do?"
                        className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none"
                      />

                      <textarea
                        value={challenge}
                        onChange={(e) => setChallenge(e.target.value)}
                        rows={2}
                        placeholder="Challenge"
                        className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none"
                      />

                      <textarea
                        value={process}
                        onChange={(e) => setProcess(e.target.value)}
                        rows={3}
                        placeholder="Approach / execution"
                        className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none"
                      />

                      <textarea
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                        rows={2}
                        placeholder="Outcome"
                        className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none"
                      />

                      <input
                        value={proofLink}
                        onChange={(e) => setProofLink(e.target.value)}
                        placeholder="GitHub, live URL, Behance, YouTube, Drive..."
                        className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none"
                      />

                      <input
                        value={toolsUsed}
                        onChange={(e) => setToolsUsed(e.target.value)}
                        placeholder="Tools used"
                        className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none"
                      />

                      <button
                        disabled={savingProof}
                        className="w-fit rounded-xl bg-[#102848] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
                      >
                        {savingProof ? "Submitting..." : "Submit proof"}
                      </button>
                    </div>

                    {proofMessage && (
                      <p className="mt-4 text-sm font-bold text-[#102848]/60">
                        {proofMessage}
                      </p>
                    )}
                  </form>
                )}

                <div>
                  {proofs.length === 0 ? (
                    <div className="p-6">
                      <h3 className="text-lg font-black">
                        No proof submitted yet
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[#102848]/60">
                        Start with one real thing you built, designed, edited,
                        filmed, written, marketed, or contributed to.
                      </p>
                    </div>
                  ) : (
                    proofs.map((proof) => (
                      <div
                        key={proof.id}
                        className="grid gap-4 border-b border-[#DCE7F2] px-5 py-4 last:border-b-0 md:grid-cols-[1fr_160px_140px]"
                      >
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0890E0]">
                            {proof.careerCategory.replaceAll("_", " ")}
                          </p>
                          <h3 className="mt-1 text-base font-black">
                            {proof.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[#102848]/60">
                            {proof.description}
                          </p>
                        </div>

                        <div className="text-sm font-bold text-[#102848]/55">
                          {proof.proofType.replaceAll("_", " ")}
                        </div>

                        <div className="flex items-start gap-2 md:justify-end">
                          <a
                            href={`/proofs/${proof.id}`}
                            className="rounded-lg bg-[#EAF3FF] px-3 py-2 text-xs font-black text-[#0890E0]"
                          >
                            Details
                          </a>

                          {proof.proofLink && (
                            <a
                              href={proof.proofLink}
                              target="_blank"
                              className="rounded-lg bg-[#102848] px-3 py-2 text-xs font-black text-white"
                            >
                              Open
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="border border-[#DCE7F2] bg-[#102848] p-5 text-white shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                  CURRENT EXECUTION
                </p>
                <h3 className="mt-4 text-xl font-black">
                  {buildingNow || "Tell people what you are working on"}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/65">
                  {story ||
                    "Add a short human story about your direction and ambition."}
                </p>
              </div>

              <div className="border border-[#DCE7F2] bg-white/95 p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
                  Verification
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Submitted",
                    "Peer Reviewed",
                    "Verified",
                    "Trusted",
                    "Expert",
                  ].map((state, index) => (
                    <div
                      key={state}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-bold text-[#102848]/65">
                        {state}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          index === 0 ? "bg-[#0890E0]" : "bg-[#DCE7F2]"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#DCE7F2] bg-white/95 p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
                  Skills
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.length === 0 ? (
                    <p className="text-sm font-bold text-[#102848]/50">
                      No skills added yet.
                    </p>
                  ) : (
                    skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-black text-[#102848]/65 ring-1 ring-[#DCE7F2]"
                      >
                        {skill.skillName}
                      </span>
                    ))
                  )}
                </div>

                <form
                  onSubmit={handleCustomSkillSubmit}
                  className="mt-4 flex gap-2"
                >
                  <input
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Add skill"
                    className="min-w-0 flex-1 border border-[#DCE7F2] px-3 py-2 text-sm font-bold outline-none"
                  />
                  <button
                    disabled={savingSkill}
                    className="rounded-lg bg-[#0890E0] px-3 py-2 text-sm font-black text-white"
                  >
                    Add
                  </button>
                </form>

                {skillMessage && (
                  <p className="mt-3 text-sm font-bold text-[#102848]/55">
                    {skillMessage}
                  </p>
                )}
              </div>

              {editingProfile && (
                <form
                  onSubmit={handleSaveProfile}
                  className="border border-[#DCE7F2] bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
                    Edit profile
                  </p>

                  <div className="mt-4 grid gap-3">
                    <input
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Headline"
                      className="border border-[#DCE7F2] px-3 py-2 text-sm font-bold outline-none"
                    />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      className="border border-[#DCE7F2] px-3 py-2 text-sm font-bold outline-none"
                    />
                    <input
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      placeholder="Availability"
                      className="border border-[#DCE7F2] px-3 py-2 text-sm font-bold outline-none"
                    />
                    <textarea
                      value={buildingNow}
                      onChange={(e) => setBuildingNow(e.target.value)}
                      placeholder="What are you building?"
                      rows={3}
                      className="border border-[#DCE7F2] px-3 py-2 text-sm font-bold outline-none"
                    />
                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Your story"
                      rows={4}
                      className="border border-[#DCE7F2] px-3 py-2 text-sm font-bold outline-none"
                    />

                    <button
                      disabled={savingProfile}
                      className="rounded-xl bg-[#102848] px-4 py-3 text-sm font-black text-white"
                    >
                      {savingProfile ? "Saving..." : "Save profile"}
                    </button>
                  </div>

                  {profileMessage && (
                    <p className="mt-3 text-sm font-bold text-[#102848]/55">
                      {profileMessage}
                    </p>
                  )}
                </form>
              )}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
