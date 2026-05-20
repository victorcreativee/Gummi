"use client";

import { FormEvent, useState } from "react";
import { loginUser } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await loginUser({ email, password });

      localStorage.setItem("gummi_token", result.token);
      localStorage.setItem("gummi_user", JSON.stringify(result));

      setMessage("Welcome back. You are logged in.");
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
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F1E8]">
      <section className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <a href="/" className="text-sm font-bold text-[#C7FF6B]">
            ← Back to GUMMI
          </a>

          <p className="mt-12 w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-[#C7FF6B]">
            Welcome back builder
          </p>

          <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Come back. Keep building.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#F5F1E8]/65">
            Your work, your proof, your progress — this is where it continues.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
          <div className="rounded-[1.5rem] bg-[#F5F1E8] p-6 text-black md:p-8">
            <p className="text-sm font-bold uppercase tracking-wide text-black/45">
              Log in
            </p>

            <h2 className="mt-3 text-3xl font-black">Enter your workspace.</h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-bold">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="you@gummi.app"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-bold">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                  placeholder="Your password"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-full bg-black px-6 py-4 font-black text-[#F5F1E8] transition hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? "Opening your workspace..." : "Log in"}
              </button>
            </form>

            {message && (
              <p className="mt-5 rounded-2xl bg-black/5 px-4 py-3 text-sm font-bold text-black/70">
                {message}
              </p>
            )}

            <p className="mt-6 text-sm text-black/55">
              New here?{" "}
              <a href="/register" className="font-black text-black">
                Create your proof profile
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
