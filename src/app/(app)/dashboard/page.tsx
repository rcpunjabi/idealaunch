import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getProjectsByUser } from "@/lib/supabase";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { Plus, Lightbulb } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const projects = await getProjectsByUser(userId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My apps</h1>
          <p className="text-white/50 text-sm mt-1">
            {projects.length === 0
              ? "You haven't built anything yet — let's change that."
              : `${projects.length} app${projects.length !== 1 ? "s" : ""} built`}
          </p>
        </div>

        <Link
          href="/new"
          className="flex items-center gap-2 bg-violet hover:bg-violet-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          New app
        </Link>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet/10 flex items-center justify-center mb-4">
            <Lightbulb size={28} className="text-violet" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your idea is waiting</h2>
          <p className="text-white/50 max-w-sm mb-6">
            Tell IdeaLaunch about your app and it&apos;ll be live before the end
            of the day.
          </p>
          <Link
            href="/new"
            className="flex items-center gap-2 bg-violet hover:bg-violet-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Build my first app
          </Link>
        </div>
      )}

      {/* Projects grid */}
      {projects.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
