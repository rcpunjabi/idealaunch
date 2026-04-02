import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getProject } from "@/lib/supabase";
import { ExternalLink, Github, ArrowLeft, CheckCircle, Clock, Rocket } from "lucide-react";
import Link from "next/link";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const project = await getProject(params.id);
  if (!project || project.userId !== userId) notFound();

  const isLive = project.status === "live";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back nav */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to my apps
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.blueprint?.purpose && (
            <p className="text-white/50 mt-2 max-w-xl">
              {project.blueprint.purpose}
            </p>
          )}
        </div>

        {isLive && project.deploymentUrl && (
          <a
            href={project.deploymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald text-ink font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shrink-0"
          >
            <ExternalLink size={15} />
            View live app
          </a>
        )}
      </div>

      {/* Status card */}
      <div
        className={`p-5 rounded-2xl border mb-6 ${
          isLive
            ? "bg-emerald/10 border-emerald/20"
            : "bg-surface border-surface-border"
        }`}
      >
        <div className="flex items-center gap-3">
          {isLive ? (
            <Rocket size={20} className="text-emerald" />
          ) : project.status === "error" ? (
            <Clock size={20} className="text-red-400" />
          ) : (
            <Clock size={20} className="text-white/50" />
          )}
          <div>
            <p className="font-semibold capitalize">{project.status.replace("-", " ")}</p>
            <p className="text-sm text-white/50">
              Created{" "}
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Blueprint details */}
        {project.blueprint && (
          <div className="p-6 rounded-2xl bg-surface border border-surface-border">
            <h2 className="font-semibold mb-4">App Blueprint</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-white/40 text-xs mb-0.5">Built for</dt>
                <dd className="text-white/80">{project.blueprint.targetUser}</dd>
              </div>
              <div>
                <dt className="text-white/40 text-xs mb-0.5">Tone</dt>
                <dd className="text-white/80 capitalize">{project.blueprint.tone}</dd>
              </div>
              {project.blueprint.coreFeatures.length > 0 && (
                <div>
                  <dt className="text-white/40 text-xs mb-1">Core features</dt>
                  <dd className="space-y-1">
                    {project.blueprint.coreFeatures.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle size={13} className="text-emerald shrink-0" />
                        <span className="text-white/80">{f}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border">
          <h2 className="font-semibold mb-4">Links</h2>
          <div className="space-y-3">
            {project.deploymentUrl ? (
              <a
                href={project.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-raised border border-surface-border hover:border-violet/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <ExternalLink size={15} className="text-emerald" />
                </div>
                <div>
                  <p className="text-sm font-medium">Live app</p>
                  <p className="text-xs text-white/40 truncate max-w-[200px]">
                    {project.deploymentUrl}
                  </p>
                </div>
              </a>
            ) : (
              <div className="p-3 rounded-xl bg-surface-raised border border-surface-border opacity-50">
                <p className="text-sm text-white/50">Not deployed yet</p>
              </div>
            )}

            {project.githubRepoUrl ? (
              <a
                href={project.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-raised border border-surface-border hover:border-violet/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center">
                  <Github size={15} className="text-violet" />
                </div>
                <div>
                  <p className="text-sm font-medium">Source code</p>
                  <p className="text-xs text-white/40 truncate max-w-[200px]">
                    {project.githubRepoUrl}
                  </p>
                </div>
              </a>
            ) : (
              <div className="p-3 rounded-xl bg-surface-raised border border-surface-border opacity-50">
                <p className="text-sm text-white/50">No GitHub repo yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Requirements summary */}
      {project.requirements.length > 0 && (
        <div className="mt-6 p-6 rounded-2xl bg-surface border border-surface-border">
          <h2 className="font-semibold mb-4">
            Approved features ({project.requirements.filter((r) => r.approved).length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {project.requirements
              .filter((r) => r.approved)
              .map((req) => (
                <div
                  key={req.id}
                  className="flex items-start gap-2 text-sm p-2"
                >
                  <CheckCircle size={14} className="text-emerald shrink-0 mt-0.5" />
                  <span className="text-white/70">{req.title}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
