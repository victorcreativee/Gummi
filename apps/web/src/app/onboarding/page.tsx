"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../components/auth/AuthGuard";
import { getCurrentUser } from "../../lib/auth";

type OnboardingGoal = "LEARN" | "PROVE" | "COLLABORATE" | "OPPORTUNITY";

type GoalOption = {
  id: OnboardingGoal;
  title: string;
  description: string;
  nextStep: string;
};

const goalOptions: GoalOption[] = [
  {
    id: "LEARN",
    title: "Learn practical skills",
    description:
      "Build useful skills through challenges, feedback, and real practice.",
    nextStep: "We will help you choose the skills you want to develop.",
  },
  {
    id: "PROVE",
    title: "Build proof of work",
    description:
      "Turn your existing ability into visible evidence that others can trust.",
    nextStep: "We will help you identify the first work you can demonstrate.",
  },
  {
    id: "COLLABORATE",
    title: "Find collaborators",
    description:
      "Meet people with complementary skills and contribute to meaningful projects.",
    nextStep: "We will help you describe what you can contribute to a team.",
  },
  {
    id: "OPPORTUNITY",
    title: "Discover opportunities",
    description:
      "Prepare your GUMMI journey for jobs, projects, mentorship, and other opportunities.",
    nextStep:
      "We will help you build the profile and proof needed to be discovered.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();

  const [selectedGoal, setSelectedGoal] = useState<OnboardingGoal | null>(null);

  const currentUser = getCurrentUser();
  const firstName = currentUser?.fullName?.trim().split(/\s+/)[0] || "Builder";

  const selectedOption = goalOptions.find(
    (option) => option.id === selectedGoal
  );

  function handleContinue() {
    if (!selectedGoal) {
      return;
    }

    /*
     * The next onboarding task will save this goal through the backend.
     * For now, we pass it to the next screen through the URL so that
     * this page can be tested without creating fake permanent storage.
     */
    const goal = encodeURIComponent(selectedGoal);

    router.push(`/onboarding/profile?goal=${goal}`);
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
                  Start your journey
                </p>
              </div>
            </div>

            <p className="hidden text-sm font-medium text-[#102848]/55 sm:block">
              Step 1 of 4
            </p>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-16">
          <section>
            <p className="text-sm font-bold text-[#0890E0]">
              Welcome, {firstName}
            </p>

            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
              What would make GUMMI useful to you first?
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#102848]/65">
              You are joining as a Member. Choose the result you want to work
              toward first. This will help GUMMI guide your next steps without
              limiting what you can become later.
            </p>

            <div
              className="mt-9 grid gap-3 sm:grid-cols-2"
              role="radiogroup"
              aria-label="Choose your first GUMMI goal"
            >
              {goalOptions.map((option) => {
                const isSelected = selectedGoal === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedGoal(option.id)}
                    className={`min-h-40 border p-5 text-left transition ${
                      isSelected
                        ? "border-[#0890E0] bg-[#EDF7FD] shadow-[0_0_0_1px_#0890E0]"
                        : "border-[#DCE7F2] bg-white hover:border-[#9ECFEC]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-base font-black">{option.title}</h2>

                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-[#0890E0] bg-[#0890E0]"
                            : "border-[#AFC2D5] bg-white"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected ? (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        ) : null}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#102848]/65">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#DCE7F2] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => router.replace("/dashboard")}
                className="px-4 py-3 text-sm font-bold text-[#102848]/60 hover:text-[#102848]"
              >
                I will finish later
              </button>

              <button
                type="button"
                disabled={!selectedGoal}
                onClick={handleContinue}
                className="min-w-40 bg-[#0890E0] px-5 py-3 text-sm font-black text-white transition hover:bg-[#077FC6] disabled:cursor-not-allowed disabled:bg-[#B6C9D8]"
              >
                Continue
              </button>
            </div>
          </section>

          <aside className="h-fit border border-[#DCE7F2] bg-white p-6 lg:sticky lg:top-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#102848]/40">
              Your GUMMI journey
            </p>

            <ol className="mt-5 space-y-5">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0890E0] text-xs font-black text-white">
                  1
                </span>

                <div>
                  <p className="text-sm font-black">Choose your direction</p>
                  <p className="mt-1 text-sm leading-5 text-[#102848]/55">
                    Tell GUMMI what would help you most right now.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7EEF5] text-xs font-black text-[#102848]/55">
                  2
                </span>

                <div>
                  <p className="text-sm font-black">Introduce yourself</p>
                  <p className="mt-1 text-sm leading-5 text-[#102848]/55">
                    Create a useful starting profile, not a traditional résumé.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7EEF5] text-xs font-black text-[#102848]/55">
                  3
                </span>

                <div>
                  <p className="text-sm font-black">Choose skills</p>
                  <p className="mt-1 text-sm leading-5 text-[#102848]/55">
                    Select what you can contribute and what you want to grow.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-7 border-t border-[#DCE7F2] pt-5">
              <p className="text-sm font-black">
                {selectedOption
                  ? selectedOption.title
                  : "Choose one starting direction"}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#102848]/60">
                {selectedOption
                  ? selectedOption.nextStep
                  : "Your answer will personalize the next onboarding steps. It will not restrict your future journey."}
              </p>
            </div>
          </aside>
        </div>
      </main>
    </AuthGuard>
  );
}
