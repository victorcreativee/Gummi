"use client";

import { type SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../../components/auth/AuthGuard";
import {
  addMemberInterest,
  getMemberInterests,
  completeOnboarding,
  type MemberInterest,
} from "../../../lib/api";
import { getCurrentUser } from "../../../lib/auth";

type InterestGroup = {
  title: string;
  description: string;
  interests: string[];
};

const interestGroups: InterestGroup[] = [
  {
    title: "Technology and innovation",
    description:
      "Products, tools, and technologies you want to explore or help build.",
    interests: [
      "Artificial Intelligence",
      "Web Development",
      "Mobile Applications",
      "Data and Analytics",
      "Cybersecurity",
      "Open Source",
      "Digital Accessibility",
      "Emerging Technologies",
    ],
  },
  {
    title: "Creative work and media",
    description:
      "Creative fields, storytelling formats, and visual experiences that interest you.",
    interests: [
      "Visual Design",
      "Film and Video",
      "Photography",
      "Music and Audio",
      "Writing and Publishing",
      "Animation",
      "Brand Storytelling",
      "Digital Art",
    ],
  },
  {
    title: "Business and social impact",
    description:
      "Industries and causes where you would like your work to create value.",
    interests: [
      "Entrepreneurship",
      "Product Innovation",
      "Social Impact",
      "Climate Action",
      "Education",
      "Agriculture",
      "Financial Inclusion",
      "Public Service",
    ],
  },
  {
    title: "Community and professional growth",
    description:
      "Ways you want to connect, contribute, and develop with other members.",
    interests: [
      "Collaboration",
      "Mentorship",
      "Career Growth",
      "Remote Work",
      "Community Building",
      "Leadership",
      "Research",
      "Knowledge Sharing",
    ],
  },
];

function normalizeInterestName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function interestKey(value: string) {
  return normalizeInterestName(value).toLowerCase();
}

export default function OnboardingInterestsPage() {
  const router = useRouter();

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || currentUser?.userId;

  const firstName = currentUser?.fullName?.trim().split(/\s+/)[0] || "Builder";

  const [existingInterests, setExistingInterests] = useState<MemberInterest[]>(
    []
  );

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const existingInterestKeys = useMemo(
    () =>
      new Set(
        existingInterests.map((interest) => interestKey(interest.interestName))
      ),
    [existingInterests]
  );

  const selectedInterestKeys = useMemo(
    () => new Set(selectedInterests.map(interestKey)),
    [selectedInterests]
  );

  const totalInterestCount = useMemo(() => {
    const allInterests = new Set<string>();

    existingInterests.forEach((interest) => {
      allInterests.add(interestKey(interest.interestName));
    });

    selectedInterests.forEach((interest) => {
      allInterests.add(interestKey(interest));
    });

    return allInterests.size;
  }, [existingInterests, selectedInterests]);

  const canComplete = totalInterestCount >= 2 && !isSaving;

  useEffect(() => {
    if (!currentUserId) {
      setMessage("We could not identify your account. Please sign in again.");
      setIsLoading(false);
      return;
    }

    getMemberInterests(currentUserId)
      .then((interests) => {
        setExistingInterests(Array.isArray(interests) ? interests : []);
      })
      .catch((error) => {
        setMessage(
          error instanceof Error
            ? error.message
            : "We could not load your interests."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUserId]);

  function isExistingInterest(interestName: string) {
    return existingInterestKeys.has(interestKey(interestName));
  }

  function isSelectedInterest(interestName: string) {
    return selectedInterestKeys.has(interestKey(interestName));
  }

  function toggleInterest(interestName: string) {
    if (isExistingInterest(interestName) || isSaving) {
      return;
    }

    const normalizedInterest = normalizeInterestName(interestName);
    const normalizedKey = interestKey(normalizedInterest);

    setSelectedInterests((currentInterests) => {
      const alreadySelected = currentInterests.some(
        (interest) => interestKey(interest) === normalizedKey
      );

      if (alreadySelected) {
        return currentInterests.filter(
          (interest) => interestKey(interest) !== normalizedKey
        );
      }

      return [...currentInterests, normalizedInterest];
    });

    setMessage("");
  }

  function handleCustomInterestSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedInterest = normalizeInterestName(customInterest);

    if (normalizedInterest.length < 2) {
      setMessage("Enter an interest containing at least two characters.");
      return;
    }

    const normalizedKey = interestKey(normalizedInterest);

    if (
      existingInterestKeys.has(normalizedKey) ||
      selectedInterestKeys.has(normalizedKey)
    ) {
      setMessage(`${normalizedInterest} is already included.`);
      return;
    }

    setSelectedInterests((currentInterests) => [
      ...currentInterests,
      normalizedInterest,
    ]);

    setCustomInterest("");
    setMessage("");
  }

  function removeSelectedInterest(interestName: string) {
    if (isSaving) {
      return;
    }

    const normalizedKey = interestKey(interestName);

    setSelectedInterests((currentInterests) =>
      currentInterests.filter(
        (interest) => interestKey(interest) !== normalizedKey
      )
    );
  }

  async function handleCompleteOnboarding() {
    if (!currentUserId || !canComplete) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    const savedInterests: MemberInterest[] = [];

    try {
      for (const interestName of selectedInterests) {
        const savedInterest = await addMemberInterest({
          userId: currentUserId,
          interestName,
        });

        savedInterests.push(savedInterest);
      }
      await completeOnboarding();
      setExistingInterests((currentInterests) => [
        ...currentInterests,
        ...savedInterests,
      ]);

      setSelectedInterests([]);

      router.replace("/dashboard");
    } catch (error) {
      try {
        const refreshedInterests = await getMemberInterests(currentUserId);

        setExistingInterests(
          Array.isArray(refreshedInterests) ? refreshedInterests : []
        );

        setSelectedInterests((currentSelections) =>
          currentSelections.filter(
            (selectedInterest) =>
              !refreshedInterests.some(
                (savedInterest) =>
                  interestKey(savedInterest.interestName) ===
                  interestKey(selectedInterest)
              )
          )
        );
      } catch {
        // Keep the current screen usable if refreshing also fails.
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "We could not save all your interests. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    const searchParameters = new URLSearchParams(window.location.search);

    const goal = searchParameters.get("goal");

    const destination = goal
      ? `/onboarding/skills?goal=${encodeURIComponent(goal)}`
      : "/onboarding/skills";

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
              Loading your interests…
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
                  Choose your starting interests
                </p>
              </div>
            </div>

            <p className="text-sm font-bold text-[#102848]/55">Step 4 of 4</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
          <section>
            <button
              type="button"
              onClick={handleBack}
              className="text-sm font-bold text-[#102848]/55 transition hover:text-[#102848]"
            >
              ← Back to your skills
            </button>

            <p className="mt-8 text-sm font-bold text-[#0890E0]">
              Final step, {firstName}
            </p>

            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
              What subjects, industries, or causes interest you?
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#102848]/65">
              Select at least two areas you would enjoy learning about,
              contributing to, or building projects around. Interests help GUMMI
              personalize your journey without claiming that you already have
              expertise in those areas.
            </p>

            {existingInterests.length > 0 ? (
              <section className="mt-8 border border-[#B9DBEE] bg-[#F1F9FD] p-5">
                <p className="text-sm font-black">Already on your profile</p>

                <p className="mt-1 text-sm leading-6 text-[#102848]/55">
                  These interests are already saved and will not be added twice.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {existingInterests.map((interest) => (
                    <span
                      key={interest.id}
                      className="border border-[#B9DBEE] bg-white px-3 py-2 text-sm font-bold text-[#102848]/70"
                    >
                      {interest.interestName}

                      <span className="ml-2 text-[#0890E0]" aria-label="Saved">
                        ✓
                      </span>
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-8 space-y-8">
              {interestGroups.map((group) => (
                <section
                  key={group.title}
                  className="border-t border-[#DCE7F2] pt-6"
                >
                  <h2 className="text-lg font-black">{group.title}</h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#102848]/55">
                    {group.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.interests.map((interestName) => {
                      const existing = isExistingInterest(interestName);

                      const selected = isSelectedInterest(interestName);

                      return (
                        <button
                          key={interestName}
                          type="button"
                          disabled={existing || isSaving}
                          aria-pressed={selected || existing}
                          onClick={() => toggleInterest(interestName)}
                          className={`border px-3 py-2 text-sm font-bold transition ${
                            existing
                              ? "cursor-default border-[#B9DBEE] bg-[#F1F9FD] text-[#102848]/60"
                              : selected
                              ? "border-[#0890E0] bg-[#0890E0] text-white"
                              : "border-[#C9D8E6] bg-white text-[#102848]/70 hover:border-[#0890E0] hover:text-[#0890E0]"
                          }`}
                        >
                          {existing ? "✓ " : selected ? "− " : "+ "}
                          {interestName}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-9 border border-[#DCE7F2] bg-white p-5 sm:p-6">
              <h2 className="text-lg font-black">Add another interest</h2>

              <p className="mt-1 text-sm leading-6 text-[#102848]/55">
                Add an area that is not included above, such as “Coffee
                Technology”, “Healthcare Innovation”, or “Sustainable
                Architecture”.
              </p>

              <form
                onSubmit={handleCustomInterestSubmit}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="customInterest" className="sr-only">
                  Custom interest
                </label>

                <input
                  id="customInterest"
                  name="customInterest"
                  type="text"
                  maxLength={120}
                  value={customInterest}
                  disabled={isSaving}
                  onChange={(event) => setCustomInterest(event.target.value)}
                  placeholder="Enter a specific interest"
                  className="min-w-0 flex-1 border border-[#C9D8E6] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#102848]/35 focus:border-[#0890E0] focus:ring-2 focus:ring-[#0890E0]/15 disabled:bg-[#F1F4F7]"
                />

                <button
                  type="submit"
                  disabled={customInterest.trim().length < 2 || isSaving}
                  className="border border-[#0890E0] px-5 py-3 text-sm font-black text-[#0890E0] transition hover:bg-[#EDF7FD] disabled:cursor-not-allowed disabled:border-[#B6C9D8] disabled:text-[#102848]/35"
                >
                  Add interest
                </button>
              </form>
            </section>

            {selectedInterests.length > 0 ? (
              <section className="mt-7 border border-[#DCE7F2] bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-black">Ready to add</h2>

                    <p className="mt-1 text-sm text-[#102848]/55">
                      These interests will be saved when you complete this step.
                    </p>
                  </div>

                  <span className="text-sm font-black text-[#0890E0]">
                    {selectedInterests.length}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedInterests.map((interestName) => (
                    <button
                      key={interestKey(interestName)}
                      type="button"
                      disabled={isSaving}
                      onClick={() => removeSelectedInterest(interestName)}
                      className="border border-[#0890E0] bg-[#EDF7FD] px-3 py-2 text-sm font-bold text-[#087DBF] transition hover:bg-[#DFF2FC] disabled:cursor-not-allowed"
                      aria-label={`Remove ${interestName}`}
                    >
                      {interestName}

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
                disabled={!canComplete}
                onClick={handleCompleteOnboarding}
                className="min-w-48 bg-[#0890E0] px-5 py-3 text-sm font-black text-white transition hover:bg-[#077FC6] disabled:cursor-not-allowed disabled:bg-[#B6C9D8]"
              >
                {isSaving ? "Saving your interests…" : "Complete this step"}
              </button>
            </div>
          </section>

          <aside className="h-fit border border-[#DCE7F2] bg-white p-6 lg:sticky lg:top-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#102848]/40">
              Your starting interests
            </p>

            <div className="mt-5 border-b border-[#DCE7F2] pb-5">
              <p className="text-4xl font-black text-[#0890E0]">
                {totalInterestCount}
              </p>

              <p className="mt-1 text-sm font-bold">
                {totalInterestCount === 1
                  ? "interest selected"
                  : "interests selected"}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#102848]/55">
                Choose at least two. You can update them from your profile
                later.
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
                    You identified what you want from GUMMI.
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
                    You gave members useful context about yourself.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7EEF5] text-xs font-black text-[#102848]/55">
                  ✓
                </span>

                <div>
                  <p className="text-sm font-black">Skills</p>

                  <p className="mt-1 text-xs leading-5 text-[#102848]/50">
                    You selected abilities you can develop and prove.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0890E0] text-xs font-black text-white">
                  4
                </span>

                <div>
                  <p className="text-sm font-black">Interests</p>

                  <p className="mt-1 text-xs leading-5 text-[#102848]/50">
                    Choose topics that should shape your journey.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-7 border-t border-[#DCE7F2] pt-5">
              <p className="text-sm font-black">
                Interests are not skill claims
              </p>

              <p className="mt-2 text-sm leading-6 text-[#102848]/60">
                An interest tells GUMMI where you would like to explore. Your
                proof of work will show what you can actually do.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </AuthGuard>
  );
}
