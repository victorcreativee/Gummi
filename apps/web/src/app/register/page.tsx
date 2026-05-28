"use client";

import { FormEvent, useState } from "react";
import { registerUser } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await registerUser({ fullName, email, password });

      localStorage.setItem("gummi_token", result.token);
      localStorage.setItem("gummi_user", JSON.stringify(result));

      router.push("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-[#102848] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <a href="/" className="text-xl font-black tracking-tight">
            GUMMI
          </a>

          <div>
            <p className="w-fit rounded-full border border-white/15 px-4 py-2 text-sm font-black text-[#72C7F4]">
              Start your proof profile
            </p>

            <h1 className="mt-8 max-w-xl text-6xl font-black leading-[0.95] tracking-tight">
              Show what you can do.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/60">
              Create your GUMMI identity. Add skills, build projects, submit
              proof, and become easier to discover.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/5 p-6">
            <p className="text-sm font-bold text-[#72C7F4]">
              No fake noise. No empty certificates.
            </p>
            <p className="mt-3 text-2xl font-black leading-tight">
              Your work becomes your signal.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-[2rem] border border-[#DCE7F2] bg-white p-6 shadow-xl md:p-8">
            <a href="/" className="text-sm font-black text-[#0890E0] lg:hidden">
              ← Back to GUMMI
            </a>

            <p className="text-sm font-black uppercase tracking-wide text-[#102848]/40">
              Create account
            </p>

            <h2 className="mt-3 text-4xl font-black leading-tight">
              Build your GUMMI profile.
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-black">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Victor Creative"
                  className="mt-2 w-full rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] px-4 py-4 text-sm font-bold outline-none focus:border-[#0890E0]"
                />
              </div>

              <div>
                <label className="text-sm font-black">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="you@gummi.app"
                  className="mt-2 w-full rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] px-4 py-4 text-sm font-bold outline-none focus:border-[#0890E0]"
                />
              </div>

              <div>
                <label className="text-sm font-black">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="mt-2 w-full rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] px-4 py-4 text-sm font-bold outline-none focus:border-[#0890E0]"
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-full bg-[#0890E0] px-6 py-4 font-black text-white transition hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? "Creating profile..." : "Create proof profile"}
              </button>
            </form>

            {message && (
              <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {message}
              </p>
            )}

            <p className="mt-6 text-sm font-bold text-[#102848]/55">
              Already have an account?{" "}
              <a href="/login" className="text-[#0890E0]">
                Log in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
