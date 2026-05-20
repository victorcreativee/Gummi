"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addBuilderSkill,
  getBuilderSkills,
  getUserProfile,
  saveUserProfile,
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

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<GummiUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [skills, setSkills] = useState<BuilderSkill[]>([]);
  const [skillMessage, setSkillMessage] = useState("");
  const [savingSkill, setSavingSkill] = useState(false);
  const [customSkill, setCustomSkill] = useState("");

  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [buildingNow, setBuildingNow] = useState("");
  const [story, setStory] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  function getCurrentUserId() {
    return user?.id || user?.userId;
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
    ])
      .then(([loadedSkills, loadedProfile]) => {
        setSkills(loadedSkills);

        if (loadedProfile) {
          setHeadline(loadedProfile.headline || "");
          setLocation(loadedProfile.location || "");
          setAvailability(loadedProfile.availability || "");
          setBuildingNow(loadedProfile.buildingNow || "");
          setStory(loadedProfile.story || "");
          setProfileSaved(true);
          setEditingProfile(false);
        } else {
          setEditingProfile(true);
        }
      })
      .finally(() => setCheckingAuth(false));
  }, [router]);

  async function handleAddSkill(skillName: string) {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      setSkillMessage("Your session is missing. Please login again.");
      return;
    }

    setSavingSkill(true);
    setSkillMessage("");

    try {
      const savedSkill = await addBuilderSkill({
        userId: currentUserId,
        skillName,
      });

      setSkills((currentSkills) => [savedSkill, ...currentSkills]);
      setSkillMessage(`${skillName} added to your GUMMI profile.`);
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

    if (!cleanSkill) {
      setSkillMessage("Write a skill first.");
      return;
    }

    await handleAddSkill(cleanSkill);
    setCustomSkill("");
  }

  async function handleSaveProfile(event: FormEvent) {
    event.preventDefault();

    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      setProfileMessage("Your session is missing. Please login again.");
      return;
    }

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

      setProfileMessage("Your GUMMI profile has been saved.");
      setProfileSaved(true);
      setEditingProfile(false);
    } catch (error) {
      setProfileMessage(
        error instanceof Error ? error.message : "Could not save profile"
      );
    } finally {
      setSavingProfile(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("gummi_token");
    localStorage.removeItem("gummi_user");
    router.push("/login");
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
      <WorkspaceTopbar fullName={user?.fullName} />

      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-[#DCE7F2] bg-[#EEF5FB] p-5 lg:block">
          <nav className="space-y-3">
            {["Profile", "Learning", "Projects", "Proof Ledger"].map(
              (item, index) => (
                <button
                  key={item}
                  className={`w-full rounded-2xl px-5 py-4 text-left text-sm font-black ${
                    index === 0
                      ? "bg-[#0890E0] text-white"
                      : "text-[#102848]/70 hover:bg-white"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-[55vh] w-full rounded-2xl bg-[#102848] px-5 py-4 text-sm font-black text-white"
          >
            Logout
          </button>
        </aside>

        <section className="bg-[radial-gradient(#DCE7F2_0.8px,transparent_0.8px)] bg-[length:18px_18px] p-6">
          <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_300px]">
            <section>
              <div className="flex flex-col justify-between gap-6 rounded-[2rem] bg-white/90 p-6 shadow-sm ring-1 ring-[#DCE7F2] md:flex-row md:items-center">
                <div className="flex items-center gap-5">
                  <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-[#0890E0] text-4xl font-black text-white shadow-sm">
                    {user?.fullName?.[0]?.toUpperCase() || "G"}
                  </div>

                  <div>
                    <h1 className="text-2xl font-black">
                      {user?.fullName || "GUMMI Talent"}
                    </h1>

                    <p className="mt-1 text-lg font-black text-[#0890E0]">
                      {headline || "Complete your GUMMI profile"}
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#102848]/60">
                      {location || "Location not added"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`/profile/${getCurrentUserId()}`}
                    className="rounded-2xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-black"
                  >
                    View public profile
                  </a>

                  <button
                    onClick={() => setEditingProfile(true)}
                    className="rounded-2xl bg-[#102848] px-5 py-3 text-sm font-black text-white"
                  >
                    Edit profile
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-white/90 p-6 shadow-sm ring-1 ring-[#DCE7F2]">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">GUMMI Activity Map</h2>

                  <div className="flex items-center gap-2 text-sm font-bold text-[#102848]/60">
                    <span>Less</span>
                    <span className="h-4 w-4 rounded bg-[#DCE7F2]" />
                    <span className="h-4 w-4 rounded bg-[#72C7F4]" />
                    <span className="h-4 w-4 rounded bg-[#0890E0]" />
                    <span>More</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-14 gap-2">
                  {Array.from({ length: 98 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-4 rounded ${
                        index % 5 === 0
                          ? "bg-[#0890E0]"
                          : index % 3 === 0
                          ? "bg-[#72C7F4]"
                          : "bg-[#DCE7F2]"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-5 text-sm font-bold text-[#102848]/70">
                  {skills.length * 12 || 0} profile signals collected so far.
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-black">Proof Ledger</h2>

                <div className="mt-4 space-y-4 border-l-2 border-[#0890E0]/25 pl-7">
                  {[
                    {
                      title: "GUMMI identity created",
                      desc: "You started building a profile around skill, work, and proof.",
                      status: "Live",
                    },
                    {
                      title: "Skill signals added",
                      desc: `${skills.length} skills added to your GUMMI profile.`,
                      status: "In Progress",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="relative rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-[#DCE7F2]"
                    >
                      <span className="absolute -left-[37px] top-7 h-4 w-4 rounded-full bg-[#0890E0]" />

                      <div className="flex justify-between gap-4">
                        <h3 className="text-lg font-black">{item.title}</h3>

                        <span className="rounded-full bg-[#EAF3FF] px-4 py-2 text-xs font-black text-[#0890E0]">
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-7 text-[#102848]/70">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#DFF3FF] p-5 text-center">
                  <p className="text-2xl font-black">
                    {profileSaved ? "Active" : "Start"}
                  </p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wide">
                    Profile
                  </p>
                </div>

                <div className="rounded-2xl bg-[#EAF3FF] p-5 text-center">
                  <p className="text-2xl font-black">{skills.length}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wide">
                    Skills
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-[#182838] p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  Building now
                </p>

                <h3 className="mt-4 text-xl font-black">
                  {buildingNow || "Tell people what you are working on"}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  {story ||
                    "Add a short human story so people understand your work, direction, and ambition."}
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white/90 p-6 shadow-sm ring-1 ring-[#DCE7F2]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#102848]/45">
                  Skills
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {skills.length === 0 ? (
                    <p className="text-sm font-bold text-[#102848]/55">
                      No skills added yet.
                    </p>
                  ) : (
                    skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-full border border-[#0890E0]/25 bg-white px-4 py-2 text-sm font-bold"
                      >
                        {skill.skillName}
                      </span>
                    ))
                  )}
                </div>

                <form
                  onSubmit={handleCustomSkillSubmit}
                  className="mt-5 flex gap-2"
                >
                  <input
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Add skill"
                    className="min-w-0 flex-1 rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                  />

                  <button
                    disabled={savingSkill}
                    className="rounded-xl bg-[#0890E0] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
                  >
                    Add
                  </button>
                </form>

                {skillMessage && (
                  <p className="mt-4 text-sm font-bold text-[#102848]/60">
                    {skillMessage}
                  </p>
                )}
              </div>

              {editingProfile && (
                <form
                  onSubmit={handleSaveProfile}
                  className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-[#DCE7F2]"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0890E0]">
                    Edit profile
                  </p>

                  <div className="mt-4 grid gap-3">
                    <input
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Headline"
                      className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                    />

                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                    />

                    <input
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      placeholder="Availability"
                      className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                    />

                    <textarea
                      value={buildingNow}
                      onChange={(e) => setBuildingNow(e.target.value)}
                      placeholder="What are you building?"
                      rows={3}
                      className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                    />

                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Your story"
                      rows={4}
                      className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                    />

                    <button
                      disabled={savingProfile}
                      className="rounded-xl bg-[#102848] px-5 py-3 text-sm font-black text-white"
                    >
                      {savingProfile ? "Saving..." : "Save profile"}
                    </button>
                  </div>

                  {profileMessage && (
                    <p className="mt-4 text-sm font-bold text-[#102848]/60">
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
