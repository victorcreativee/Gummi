"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../../components/auth/AuthGuard";
import { getUserProfile, saveUserProfile } from "../../../lib/api";
import { getCurrentUser } from "../../../lib/auth";

type OnboardingGoal = "LEARN" | "PROVE" | "COLLABORATE" | "OPPORTUNITY";

type ProfileForm = {
  headline: string;
  location: string;
  availability: string;
  buildingNow: string;
  story: string;
};

const initialForm: ProfileForm = {
  headline: "",
  location: "",
  availability: "",
  buildingNow: "",
  story: "",
};

const goalMessages: Record<
  OnboardingGoal,
  {
    title: string;
    description: string;
  }
> = {
  LEARN: {
    title: "Build a profile that supports your learning",
    description:
      "Help mentors and collaborators understand what you want to learn and where you are starting from.",
  },
  PROVE: {
    title: "Introduce the person behind your work",
    description:
      "Your proof will show what you can do. Your profile helps people understand your direction and motivation.",
  },
  COLLABORATE: {
    title: "Help the right people understand you",
    description:
      "Good collaboration begins when people know what you care about, what you are building, and how you can contribute.",
  },
  OPPORTUNITY: {
    title: "Prepare to be discovered for the right reasons",
    description:
      "Give organizations and experts useful context before they explore your skills and proof of work.",
  },
};

export default function OnboardingProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [goal, setGoal] = useState<OnboardingGoal>("LEARN");

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || currentUser?.userId;

  const firstName = currentUser?.fullName?.trim().split(/\s+/)[0] || "Builder";

  const goalMessage = goalMessages[goal];

  const storyCharactersRemaining = useMemo(
    () => 500 - form.story.length,
    [form.story.length]
  );

  const canContinue =
    form.headline.trim().length >= 5 &&
    form.location.trim().length >= 2 &&
    form.availability.trim().length > 0 &&
    form.story.trim().length >= 20;

  useEffect(() => {
    const searchParameters = new URLSearchParams(window.location.search);
    const requestedGoal = searchParameters.get("goal");

    const validGoals: OnboardingGoal[] = [
      "LEARN",
      "PROVE",
      "COLLABORATE",
      "OPPORTUNITY",
    ];

    if (requestedGoal && validGoals.includes(requestedGoal as OnboardingGoal)) {
      setGoal(requestedGoal as OnboardingGoal);
    }

    if (!currentUserId) {
      setIsLoadingProfile(false);
      return;
    }

    getUserProfile(currentUserId)
      .then((profile) => {
        if (!profile) {
          return;
        }

        setForm({
          headline: profile.headline || "",
          location: profile.location || "",
          availability: profile.availability || "",
          buildingNow: profile.buildingNow || "",
          story: profile.story || "",
        });
      })
      .catch(() => {
        setMessage(
          "We could not load your existing profile, but you can still continue."
        );
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  }, [currentUserId]);

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentUserId || !canContinue || isSaving) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      await saveUserProfile({
        userId: currentUserId,
        headline: form.headline.trim(),
        location: form.location.trim(),
        availability: form.availability,
        buildingNow: form.buildingNow.trim(),
        story: form.story.trim(),
      });

      const encodedGoal = encodeURIComponent(goal);

      router.push(`/onboarding/skills?goal=${encodedGoal}`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not save your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    router.push("/onboarding");
  }

  function handleFinishLater() {
    router.replace("/dashboard");
  }

  if (isLoadingProfile) {
    return (
      <AuthGuard>
        <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-6">
          <div className="text-center">
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#DCE7F2] border-t-[#0890E0]"
              aria-hidden="true"
            />

            <p className="mt-4 text-sm font-bold text-[#102848]/60">
              Preparing your profile…
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
                  Build your starting profile
                </p>
              </div>
            </div>
            <p className="text-sm font-bold text-[#102848]/55">Step 2 of 4</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
          <section>
            <button
              type="button"
              onClick={handleBack}
              className="text-sm font-bold text-[#102848]/55 transition hover:text-[#102848]"
            >
              ← Back to your direction
            </button>

            <p className="mt-8 text-sm font-bold text-[#0890E0]">
              Introduce yourself, {firstName}
            </p>

            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
              {goalMessage.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#102848]/65">
              {goalMessage.description}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-9 border border-[#DCE7F2] bg-white"
            >
              <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-7">
                <h2 className="text-lg font-black">Your starting profile</h2>

                <p className="mt-1 text-sm leading-6 text-[#102848]/55">
                  Use clear, honest language. You can improve everything later
                  as your journey grows.
                </p>
              </div>

              <div className="space-y-7 px-5 py-7 sm:px-7">
                <div>
                  <label
                    htmlFor="headline"
                    className="block text-sm font-black"
                  >
                    What should people know about your direction?
                  </label>

                  <p className="mt-1 text-sm text-[#102848]/55">
                    Describe what you do or what you are becoming in one clear
                    sentence.
                  </p>

                  <input
                    id="headline"
                    name="headline"
                    type="text"
                    required
                    minLength={5}
                    maxLength={100}
                    value={form.headline}
                    onChange={(event) =>
                      updateField("headline", event.target.value)
                    }
                    placeholder="Example: Frontend developer building accessible digital products"
                    className="mt-3 w-full border border-[#C9D8E6] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#102848]/35 focus:border-[#0890E0] focus:ring-2 focus:ring-[#0890E0]/15"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-black"
                    >
                      Where are you based?
                    </label>

                    <p className="mt-1 text-sm text-[#102848]/55">
                      City and country are enough.
                    </p>

                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      maxLength={100}
                      value={form.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      placeholder="Kigali, Rwanda"
                      className="mt-3 w-full border border-[#C9D8E6] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#102848]/35 focus:border-[#0890E0] focus:ring-2 focus:ring-[#0890E0]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="availability"
                      className="block text-sm font-black"
                    >
                      What are you currently open to?
                    </label>

                    <p className="mt-1 text-sm text-[#102848]/55">
                      This helps people approach you appropriately.
                    </p>

                    <select
                      id="availability"
                      name="availability"
                      required
                      value={form.availability}
                      onChange={(event) =>
                        updateField("availability", event.target.value)
                      }
                      className="mt-3 w-full border border-[#C9D8E6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0890E0] focus:ring-2 focus:ring-[#0890E0]/15"
                    >
                      <option value="">Select your availability</option>
                      <option value="OPEN_TO_COLLABORATION">
                        Open to collaboration
                      </option>
                      <option value="OPEN_TO_MENTORSHIP">
                        Looking for mentorship
                      </option>
                      <option value="OPEN_TO_PROJECTS">
                        Open to project opportunities
                      </option>
                      <option value="OPEN_TO_WORK">
                        Open to work opportunities
                      </option>
                      <option value="LEARNING_ONLY">
                        Focused on learning for now
                      </option>
                      <option value="NOT_AVAILABLE">
                        Not currently available
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="buildingNow"
                    className="block text-sm font-black"
                  >
                    What are you working on now?
                  </label>

                  <p className="mt-1 text-sm text-[#102848]/55">
                    This is optional. It can be a project, challenge, skill, or
                    idea.
                  </p>

                  <input
                    id="buildingNow"
                    name="buildingNow"
                    type="text"
                    maxLength={160}
                    value={form.buildingNow}
                    onChange={(event) =>
                      updateField("buildingNow", event.target.value)
                    }
                    placeholder="Example: Improving my React skills by building a community platform"
                    className="mt-3 w-full border border-[#C9D8E6] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#102848]/35 focus:border-[#0890E0] focus:ring-2 focus:ring-[#0890E0]/15"
                  />
                </div>

                <div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <label
                        htmlFor="story"
                        className="block text-sm font-black"
                      >
                        Tell us briefly about your journey
                      </label>

                      <p className="mt-1 text-sm text-[#102848]/55">
                        What motivates you, and what are you trying to become
                        better at?
                      </p>
                    </div>

                    <p
                      className={`shrink-0 text-xs font-bold ${
                        storyCharactersRemaining < 0
                          ? "text-red-600"
                          : "text-[#102848]/40"
                      }`}
                    >
                      {storyCharactersRemaining} left
                    </p>
                  </div>

                  <textarea
                    id="story"
                    name="story"
                    required
                    minLength={20}
                    maxLength={500}
                    rows={6}
                    value={form.story}
                    onChange={(event) =>
                      updateField("story", event.target.value)
                    }
                    placeholder="Share the experience, curiosity, or ambition that brought you here."
                    className="mt-3 w-full resize-y border border-[#C9D8E6] bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#102848]/35 focus:border-[#0890E0] focus:ring-2 focus:ring-[#0890E0]/15"
                  />
                </div>

                {message ? (
                  <div
                    role="status"
                    className="border border-[#F0C9C9] bg-[#FFF7F7] px-4 py-3 text-sm font-medium text-[#9A3030]"
                  >
                    {message}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#DCE7F2] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <button
                  type="button"
                  onClick={handleFinishLater}
                  className="px-4 py-3 text-sm font-bold text-[#102848]/55 transition hover:text-[#102848]"
                >
                  I will finish later
                </button>

                <button
                  type="submit"
                  disabled={!canContinue || isSaving}
                  className="min-w-44 bg-[#0890E0] px-5 py-3 text-sm font-black text-white transition hover:bg-[#077FC6] disabled:cursor-not-allowed disabled:bg-[#B6C9D8]"
                >
                  {isSaving ? "Saving your profile…" : "Save and continue"}
                </button>
              </div>
            </form>
          </section>

          <aside className="h-fit border border-[#DCE7F2] bg-white p-6 lg:sticky lg:top-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#102848]/40">
              Why this matters
            </p>

            <h2 className="mt-4 text-lg font-black">
              Context helps your work speak clearly
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#102848]/60">
              Proof shows what you can do. Your profile explains what direction
              you are taking and how others can work with you.
            </p>

            <div className="mt-6 border-t border-[#DCE7F2] pt-5">
              <p className="text-sm font-black">This is not a résumé</p>

              <p className="mt-2 text-sm leading-6 text-[#102848]/60">
                You do not need prestigious titles or perfect experience. Be
                honest about where you are and what you are building.
              </p>
            </div>

            <ol className="mt-7 space-y-5">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7EEF5] text-xs font-black text-[#102848]/55">
                  ✓
                </span>

                <div>
                  <p className="text-sm font-black">Direction selected</p>
                  <p className="mt-1 text-xs leading-5 text-[#102848]/50">
                    You told GUMMI what would help you first.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0890E0] text-xs font-black text-white">
                  2
                </span>

                <div>
                  <p className="text-sm font-black">Starting profile</p>
                  <p className="mt-1 text-xs leading-5 text-[#102848]/50">
                    Give people useful context about your journey.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7EEF5] text-xs font-black text-[#102848]/55">
                  3
                </span>

                <div>
                  <p className="text-sm font-black">Skills</p>
                  <p className="mt-1 text-xs leading-5 text-[#102848]/50">
                    Choose abilities you can contribute and develop.
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
          </aside>
        </div>
      </main>
    </AuthGuard>
  );
}
