"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkspaceTopbar from "../../../components/workspace/WorkspaceTopbar";
import { createProject } from "../../../lib/api";

type GummiUser = {
  id?: string;
  userId?: string;
  fullName: string;
};

export default function NewProjectPage() {
  const router = useRouter();

  const [user, setUser] = useState<GummiUser | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Software");
  const [neededRoles, setNeededRoles] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("gummi_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function getCurrentUserId() {
    return user?.id || user?.userId;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const ownerId = getCurrentUserId();

    if (!ownerId) {
      setMessage("Please login again before creating a project.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const savedProject = await createProject({
        ownerId,
        title,
        description,
        category,
        neededRoles,
      });

      router.push(`/projects/${savedProject.id}`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not create project"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#102848]">
      <WorkspaceTopbar fullName={user?.fullName} userId={getCurrentUserId()} />

      <section className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(#DCE7F2_0.8px,transparent_0.8px)] bg-[length:18px_18px] px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl border border-[#DCE7F2] bg-white p-6 shadow-sm"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0890E0]">
            Start project
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Turn an idea into a working team
          </h1>

          <p className="mt-3 text-sm font-bold leading-7 text-[#102848]/60">
            Create a project, describe what you are building, and invite people
            with the skills you need.
          </p>

          <div className="mt-8 grid gap-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="Project title"
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={5}
              placeholder="What are you building? Why does it matter?"
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            >
              <option value="Software">Software</option>
              <option value="Design">Design</option>
              <option value="Media">Media</option>
              <option value="Marketing">Marketing</option>
              <option value="Startup">Startup</option>
              <option value="Research">Research</option>
            </select>

            <input
              value={neededRoles}
              onChange={(event) => setNeededRoles(event.target.value)}
              placeholder="Needed roles e.g. UI Designer, Backend Developer, Marketer"
              className="border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
            />

            <div className="flex items-center gap-3">
              <button
                disabled={saving}
                className="rounded-xl bg-[#0890E0] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                {saving ? "Creating..." : "Create project"}
              </button>

              <a
                href="/projects"
                className="rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-black text-[#102848]"
              >
                Cancel
              </a>
            </div>

            {message && (
              <p className="text-sm font-bold text-red-600">{message}</p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
