"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkspaceLayout from "../../../components/workspace/WorkspaceLayout";
import { createProject } from "../../../lib/api";

type GummiUser = {
  id?: string;
  userId?: string;
  fullName: string;
};

const sidebarItems = ["Project details", "Team needs", "Review"];

export default function NewProjectPage() {
  const router = useRouter();

  const [user, setUser] = useState<GummiUser | null>(null);
  const [activeSection, setActiveSection] = useState("Project details");

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
    <WorkspaceLayout
      fullName={user?.fullName}
      userId={getCurrentUserId()}
      activePage="New Project"
      sidebarTitle="Start project"
      sidebarItems={sidebarItems}
      activeSidebarItem={activeSection}
      onSidebarItemClick={setActiveSection}
      rightPanel={
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#DCE7F2] bg-[#F8FAFC] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Project guide
            </p>

            <h3 className="mt-3 text-lg font-black">
              Start with something real.
            </h3>

            <p className="mt-2 text-sm font-bold leading-6 text-[#102848]/55">
              A good GUMMI project should be clear enough for members to
              understand what is being built, why it matters, and how they can
              contribute.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#102848]/35">
              Checklist
            </p>

            <div className="mt-4 space-y-3">
              {[
                ["Title added", Boolean(title.trim())],
                ["Purpose explained", Boolean(description.trim())],
                ["Category selected", Boolean(category)],
                ["Team needs added", Boolean(neededRoles.trim())],
              ].map(([label, done]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-bold text-[#102848]/60">{label}</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      done ? "bg-[#0890E0]" : "bg-[#DCE7F2]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-5">
          <div>
            <p className="text-sm font-bold text-[#102848]/45">Projects</p>
            <h1 className="mt-1 text-2xl font-black">Start project</h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/projects"
              className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-black text-[#102848]/70 hover:bg-[#F8FAFC]"
            >
              Cancel
            </a>

            <button
              disabled={saving}
              className="rounded-xl bg-[#0890E0] px-4 py-2.5 text-sm font-black text-white disabled:opacity-40"
            >
              {saving ? "Creating..." : "Create project"}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">
          <div className="border-b border-[#DCE7F2] px-5 py-4">
            <h2 className="text-lg font-black">Project details</h2>
            <p className="mt-1 text-sm font-bold text-[#102848]/45">
              Explain what you want to build and who you need to build it with.
            </p>
          </div>

          <div className="grid gap-4 p-5">
            <label className="grid gap-2">
              <span className="text-sm font-black text-[#102848]/60">
                What are you building?
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                placeholder="Example: AI School CMS"
                className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-[#102848]/60">
                Why does it matter?
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={5}
                placeholder="Describe the problem, the idea, and why members should care."
                className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-black text-[#102848]/60">
                  Category
                </span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                >
                  <option value="Software">Software</option>
                  <option value="Design">Design</option>
                  <option value="Media">Media</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Startup">Startup</option>
                  <option value="Research">Research</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-[#102848]/60">
                  Who do you need?
                </span>
                <input
                  value={neededRoles}
                  onChange={(event) => setNeededRoles(event.target.value)}
                  placeholder="Example: UI Designer, Backend Developer, Marketer"
                  className="rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm font-bold outline-none focus:border-[#0890E0]"
                />
              </label>
            </div>

            {message && (
              <p className="text-sm font-bold text-red-600">{message}</p>
            )}
          </div>
        </div>
      </form>
    </WorkspaceLayout>
  );
}
