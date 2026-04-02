import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getProjectsByUser, getUserSubscription } from "@/lib/supabase";
import { PLAN_LIMITS } from "@/lib/stripe";
import ProjectCard from "@/components/dashboard/ProjectCard";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";
import { Plus, Lightbulb, Zap } from "lucide-react";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { upgraded?: string; canceled?: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const isAdmin = ADMIN_USER_IDS.includes(userId);

  const [projects, sub] = await Promise.all([
    getProjectsByUser(userId),
    getUserSubscription(userId),
  ]);

  const limit = PLAN_LIMITS[sub.plan];
  const usedCount = sub.plan === "free" ? projects.length : sub.buildsUsed;
  const atLimit = isAdmin ? false : usedCount >= limit;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Success toast */}
      {searchParams.upgraded && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-terra/10 border border-terra/20 rounded-xl text-sm text-terra font-medium">
          <Zap size={16} />
          You&apos;re upgraded! Your new plan is active.
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-navy">My apps</h1>
          <p className="text-ink-lighter text-sm mt-1">
            {projects.length === 0
              ? "You haven't built anything yet — let's change that."
              : `${projects.length} app${projects.length !== 1 ? "s" : ""} built`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Plan badge */}
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-cream-dark border border-border text-xs font-semibold text-ink-light capitalize">
            {isAdmin
              ? "Admin · Unlimited"
              : `${sub.plan === "free" ? "Free" : sub.plan === "starter" ? "Starter" : "Pro"}\u00a0·\u00a0${usedCount}/${limit === 1 && sub.plan === "free" ? "1 build" : `${limit}/mo`}`}
          </span>

          {!atLimit && (
            <Link
              href="/new"
              className="flex items-center gap-2 btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
            >
              <Plus size={16} />
              New app
            </Link>
          )}
        </div>
      </div>

      {/* Upgrade banner when at limit (never show for admin) */}
      {atLimit && !isAdmin && <UpgradePrompt plan={sub.plan} />}

      {/* Empty state */}
      {projects.length === 0 && !atLimit && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-terra/10 flex items-center justify-center mb-4">
            <Lightbulb size={28} className="text-terra" />
          </div>
          <h2 className="text-xl font-semibold font-heading text-navy mb-2">
            Your idea is waiting
          </h2>
          <p className="text-ink-lighter max-w-sm mb-6">
            Tell IdeaLaunch about your app and it&apos;ll be live before the end
            of the day.
          </p>
          <Link
            href="/new"
            className="flex items-center gap-2 btn-primary text-white font-semibold px-6 py-3 rounded-xl"
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
