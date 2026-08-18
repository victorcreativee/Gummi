"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../../components/auth/AuthGuard";
import { addBuilderSkill, getBuilderSkills } from "../../../lib/api";
import { getCurrentUser } from "../../../lib/auth";

type BuilderSkill = {
  id: string;
  userId: string;
  skillName: string;
  status?: string;
  createdAt?: string;
};

type SkillGroup = {
  title: string;
  description: string;
  skills: string[];
};

const skillGroups: SkillGroup[] = [
  {
    title: "Software and technology",
    description:
      "Building websites, applications, systems, data tools, and technical products.",
    skills: [
      "Frontend Development",
      "Backend Development",
      "Mobile Development",
      "UI Engineering",
      "DevOps",
      "Data Analysis",
      "Cybersecurity",
      "Quality Assurance",
    ],
  },
  {
    title: "Design and creative work",
    description:
      "Creating visual experiences, stories, interfaces, and digital media.",
    skills: [
      "UI Design",
      "UX Research",
      "Graphic Design",
      "Motion Design",
      "Video Editing",
      "Photography",
      "Illustration",
      "Content Design",
    ],
  },
  {
    title: "Product and business",
    description:
      "Turning ideas into useful products, services, organizations, and strategies.",
    skills: [
      "Product Management",
      "Project Management",
      "Business Analysis",
      "Digital Marketing",
      "Sales",
      "Community Building",
      "Entrepreneurship",
      "Operations",
    ],
  },
  {
    title: "People and communication",
    description:
      "Helping teams communicate, learn, collaborate, and grow effectively.",
    skills: [
      "Technical Writing",
      "Public Speaking",
      "Mentorship",
      "Teaching",
      "Research",
      "Team Leadership",
      "Communication",
      "Facilitation",
    ],
  },
];

function normalizeSkillName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function skillKey(value: string) {
  return normalizeSkillName(value).toLowerCase();
}

export default function OnboardingSkillsPage() {
  const router = useRouter();

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || currentUser?.userId;

  const firstName = currentUser?.fullName?.trim().split(/\s+/)[0] || "Builder";

  const [existingSkills, setExistingSkills] = useState<BuilderSkill[]>([]);

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const existingSkillKeys = useMemo(
    () => new Set(existingSkills.map((skill) => skillKey(skill.skillName))),
    [existingSkills]
  );

  const selectedSkillKeys = useMemo(
    () => new Set(selectedSkills.map(skillKey)),
    [selectedSkills]
  );

  const totalSkillCount = useMemo(() => {
    const allSkills = new Set<string>();

    existingSkills.forEach((skill) => {
      allSkills.add(skillKey(skill.skillName));
    });

    selectedSkills.forEach((skill) => {
      allSkills.add(skillKey(skill));
    });

    return allSkills.size;
  }, [existingSkills, selectedSkills]);

  const canFinish = totalSkillCount >= 2 && !isSaving;

  useEffect(() => {
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    getBuilderSkills(currentUserId)
      .then((skills) => {
        setExistingSkills(Array.isArray(skills) ? skills : []);
      })
      .catch((error) => {
        setMessage(
          error instanceof Error
            ? error.message
            : "We could not load your existing skills."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUserId]);

  function isExistingSkill(skillName: string) {
    return existingSkillKeys.has(skillKey(skillName));
  }

  function isSelectedSkill(skillName: string) {
    return selectedSkillKeys.has(skillKey(skillName));
  }

  function toggleSkill(skillName: string) {
    if (isExistingSkill(skillName) || isSaving) {
      return;
    }

    const normalizedSkill = normalizeSkillName(skillName);
    const normalizedKey = skillKey(normalizedSkill);

    setSelectedSkills((currentSkills) => {
      const alreadySelected = currentSkills.some(
        (skill) => skillKey(skill) === normalizedKey
      );

      if (alreadySelected) {
        return currentSkills.filter(
          (skill) => skillKey(skill) !== normalizedKey
        );
      }

      return [...currentSkills, normalizedSkill];
    });

    setMessage("");
  }

  function handleCustomSkillSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedSkill = normalizeSkillName(customSkill);

    if (normalizedSkill.length < 2) {
      setMessage("Enter a skill containing at least two characters.");
      return;
    }

    const normalizedKey = skillKey(normalizedSkill);

    if (
      existingSkillKeys.has(normalizedKey) ||
      selectedSkillKeys.has(normalizedKey)
    ) {
      setMessage(`${normalizedSkill} is already included.`);
      return;
    }

    setSelectedSkills((currentSkills) => [...currentSkills, normalizedSkill]);

    setCustomSkill("");
    setMessage("");
  }

  function removeSelectedSkill(skillName: string) {
    if (isSaving) {
      return;
    }

    const normalizedKey = skillKey(skillName);

    setSelectedSkills((currentSkills) =>
      currentSkills.filter((skill) => skillKey(skill) !== normalizedKey)
    );
  }

  async function handleContinueToInterests() {
    if (!currentUserId || !canFinish) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    const savedSkills: BuilderSkill[] = [];

    try {
      for (const skillName of selectedSkills) {
        const savedSkill = await addBuilderSkill({
          skillName,
        });

        savedSkills.push(savedSkill);
      }

      setExistingSkills((currentSkills) => [...currentSkills, ...savedSkills]);

      setSelectedSkills([]);

      const searchParameters = new URLSearchParams(window.location.search);

      const goal = searchParameters.get("goal");

      const destination = goal
        ? `/onboarding/interests?goal=${encodeURIComponent(goal)}`
        : "/onboarding/interests";

      router.push(destination);
    } catch (error) {
      try {
        const refreshedSkills = await getBuilderSkills(currentUserId);

        setExistingSkills(
          Array.isArray(refreshedSkills) ? refreshedSkills : []
        );

        setSelectedSkills((currentSelections) =>
          currentSelections.filter(
            (selectedSkill) =>
              !refreshedSkills.some(
                (savedSkill: BuilderSkill) =>
                  skillKey(savedSkill.skillName) === skillKey(selectedSkill)
              )
          )
        );
      } catch {
        // Keep the current screen usable if refreshing also fails.
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "We could not save all your skills. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    const searchParameters = new URLSearchParams(window.location.search);

    const goal = searchParameters.get("goal");

    const destination = goal
      ? `/onboarding/profile?goal=${encodeURIComponent(goal)}`
      : "/onboarding/profile";

    router.push(destination);
  }

  function handleFinishLater() {
    router.replace("/dashboard");
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6">
          <div className="text-center">
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#DCE7F2] border-t-[#0890E0]"
              aria-hidden="true"
            />

            <p className="mt-4 text-sm font-bold text-[#102848]/60">
              Loading your skills…
            </p>
          </div>
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F7F9FC] text-[#102848]">
        <header className="border-b border-[#DCE7F2] bg-white">
          <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0890E0] text-sm font-black text-white">
                G
              </div>

              <div>
                <p className="text-sm font-black tracking-tight">GUMMI</p>

                <p className="text-xs font-medium text-[#102848]/50">
                  Choose your starting skills
                </p>
              </div>
            </div>

            <p className="text-sm font-bold text-[#102848]/55">Step 3 of 4</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
          <section>
            <button
              type="button"
              onClick={handleBack}
              className="text-sm font-bold text-[#102848]/55 transition hover:text-[#102848]"
            >
              ← Back to your profile
            </button>

            <p className="mt-8 text-sm font-bold text-[#0890E0]">
              Build your foundation, {firstName}
            </p>

            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
              Which skills describe what you can build or contribute?
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#102848]/65">
              Choose at least two skills that reflect your current ability. You
              do not need to be an expert. Your future challenges and proof of
              work will show how those skills develop.
            </p>

            {existingSkills.length > 0 ? (
              <section className="mt-8 border border-[#B9DBEE] bg-[#F1F9FD] p-5">
                <p className="text-sm font-black">Already on your profile</p>

                <p className="mt-1 text-sm leading-6 text-[#102848]/55">
                  These skills are already saved and will not be added twice.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {existingSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="border border-[#B9DBEE] bg-white px-3 py-2 text-sm font-bold text-[#102848]/70"
                    >
                      {skill.skillName}
                      <span className="ml-2 text-[#0890E0]" aria-label="Saved">
                        ✓
                      </span>
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-8 space-y-8">
              {skillGroups.map((group) => (
                <section
                  key={group.title}
                  className="border-t border-[#DCE7F2] pt-6"
                >
                  <div>
                    <h2 className="text-lg font-black">{group.title}</h2>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-[#102848]/55">
                      {group.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.skills.map((skillName) => {
                      const existing = isExistingSkill(skillName);

                      const selected = isSelectedSkill(skillName);

                      return (
                        <button
                          key={skillName}
                          type="button"
                          disabled={existing || isSaving}
                          aria-pressed={selected || existing}
                          onClick={() => toggleSkill(skillName)}
                          className={`border px-3 py-2 text-sm font-bold transition ${
                            existing
                              ? "cursor-default border-[#B9DBEE] bg-[#F1F9FD] text-[#102848]/60"
                              : selected
                              ? "border-[#0890E0] bg-[#0890E0] text-white"
                              : "border-[#C9D8E6] bg-white text-[#102848]/70 hover:border-[#0890E0] hover:text-[#0890E0]"
                          }`}
                        >
                          {existing ? "✓ " : selected ? "− " : "+ "}
                          {skillName}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-9 border border-[#DCE7F2] bg-white p-5 sm:p-6">
              <h2 className="text-lg font-black">Add another skill</h2>

              <p className="mt-1 text-sm leading-6 text-[#102848]/55">
                Add a specific skill that is not included above. Use a clear
                name such as “Spring Boot”, “Coffee Agronomy”, or “Sound
                Engineering”.
              </p>

              <form
                onSubmit={handleCustomSkillSubmit}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="customSkill" className="sr-only">
                  Custom skill
                </label>

                <input
                  id="customSkill"
                  name="customSkill"
                  type="text"
                  maxLength={80}
                  value={customSkill}
                  disabled={isSaving}
                  onChange={(event) => setCustomSkill(event.target.value)}
                  placeholder="Enter a specific skill"
                  className="min-w-0 flex-1 border border-[#C9D8E6] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#102848]/35 focus:border-[#0890E0] focus:ring-2 focus:ring-[#0890E0]/15 disabled:bg-[#F1F4F7]"
                />

                <button
                  type="submit"
                  disabled={customSkill.trim().length < 2 || isSaving}
                  className="border border-[#0890E0] px-5 py-3 text-sm font-black text-[#0890E0] transition hover:bg-[#EDF7FD] disabled:cursor-not-allowed disabled:border-[#B6C9D8] disabled:text-[#102848]/35"
                >
                  Add skill
                </button>
              </form>
            </section>

            {selectedSkills.length > 0 ? (
              <section className="mt-7 border border-[#DCE7F2] bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-black">Ready to add</h2>

                    <p className="mt-1 text-sm text-[#102848]/55">
                      These skills will be saved when you finish onboarding.
                    </p>
                  </div>

                  <span className="text-sm font-black text-[#0890E0]">
                    {selectedSkills.length}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedSkills.map((skillName) => (
                    <button
                      key={skillKey(skillName)}
                      type="button"
                      disabled={isSaving}
                      onClick={() => removeSelectedSkill(skillName)}
                      className="border border-[#0890E0] bg-[#EDF7FD] px-3 py-2 text-sm font-bold text-[#087DBF] transition hover:bg-[#DFF2FC] disabled:cursor-not-allowed"
                      aria-label={`Remove ${skillName}`}
                    >
                      {skillName}
                      <span className="ml-2" aria-hidden="true">
                        ×
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {message ? (
              <div
                role="status"
                className="mt-6 border border-[#F0C9C9] bg-[#FFF7F7] px-4 py-3 text-sm font-medium text-[#9A3030]"
              >
                {message}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#DCE7F2] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleFinishLater}
                className="px-4 py-3 text-sm font-bold text-[#102848]/55 transition hover:text-[#102848] disabled:cursor-not-allowed disabled:opacity-50"
              >
                I will finish later
              </button>

              <button
                type="button"
                disabled={!canFinish}
                onClick={handleContinueToInterests}
                className="min-w-48 bg-[#0890E0] px-5 py-3 text-sm font-black text-white transition hover:bg-[#077FC6] disabled:cursor-not-allowed disabled:bg-[#B6C9D8]"
              >
                {isSaving ? "Saving your skills…" : "Continue to interests"}
              </button>
            </div>
          </section>

          <aside className="h-fit border border-[#DCE7F2] bg-white p-6 lg:sticky lg:top-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#102848]/40">
              Your starting foundation
            </p>

            <div className="mt-5 border-b border-[#DCE7F2] pb-5">
              <p className="text-4xl font-black text-[#0890E0]">
                {totalSkillCount}
              </p>

              <p className="mt-1 text-sm font-bold">
                {totalSkillCount === 1 ? "skill selected" : "skills selected"}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#102848]/55">
                Choose at least two. You can add more from your dashboard later.
              </p>
            </div>
            <ol className="mt-6 space-y-5">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7EEF5] text-xs font-black text-[#102848]/55">
                  ✓
                </span>

                <div>
                  <p className="text-sm font-black">Direction selected</p>
                  <p className="mt-1 text-xs leading-5 text-[#102848]/50">
                    You identified what you want from GUMMI first.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7EEF5] text-xs font-black text-[#102848]/55">
                  ✓
                </span>

                <div>
                  <p className="text-sm font-black">Starting profile</p>
                  <p className="mt-1 text-xs leading-5 text-[#102848]/50">
                    You gave people useful context about your journey.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0890E0] text-xs font-black text-white">
                  3
                </span>

                <div>
                  <p className="text-sm font-black">Skills</p>
                  <p className="mt-1 text-xs leading-5 text-[#102848]/50">
                    Choose the abilities you will grow and prove through action.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7EEF5] text-xs font-black text-[#102848]/55">
                  4
                </span>

                <div>
                  <p className="text-sm font-black">Interests</p>
                  <p className="mt-1 text-xs leading-5 text-[#102848]/50">
                    Choose subjects and causes you want to explore.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-7 border-t border-[#DCE7F2] pt-5">
              <p className="text-sm font-black">
                Skills are not automatically verified
              </p>

              <p className="mt-2 text-sm leading-6 text-[#102848]/60">
                Selecting a skill tells GUMMI your starting direction.
                Challenges, projects, feedback, and proof of work will build
                trust around it.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </AuthGuard>
  );
}
