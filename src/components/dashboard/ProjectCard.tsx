"use client";

import Link from "next/link";
import { ExternalLink, Github, Clock, CheckCircle, AlertCircle, Loader2, Rocket } from "lucide-react";
import type { Project } from "@/types";

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  intake: { label: "Intake", icon: Clock, color: "text-white/50" },
  requirements: { label: "Blueprint ready", icon: CheckCircle, color: "text-violet" },
  generating: { label: "Building...", icon: Loader2, color: "text-emerald animate-spin" },
  preview: { label: "Preview ready", icon: CheckCircle, color: "text-emerald" },
  deploying: { label: "Deploying...", icon: Loader2, color: "text-violet animate-spin" },
  live: { label: "Live", icon: Rocket, color: "text-emerald" },
  error: { label: "Error", icon: AlertCircle, color: "text-red-400" },
};

export default function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.intake;
  const StatusIcon = status.icon;

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="p-5 rounded-2xl bg-surface border border-surface-border hover:border-violet/30 transition-all duration-200 group cursor-pointer">
        {/* Name + status */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-base group-hover:text-white transition-colors truncate pr-2">
            {project.name}
          </h3>
          <div className={`flex items-center gap-1.5 text-xs shrink-0 ${status.color}`}>
            <StatusIcon size={13} />
            {status.label}
          </div>
        </div>

        {/* Description */}
        {project.blueprint?.purpose && (
          <p className="text-sm text-white/50 line-clamp-2 mb-4">
            {project.blueprint.purpose}
          </p>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 mt-auto">
          {project.deploymentUrl && (
            <a
              href={project.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-emerald hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
              Live app
            </a>
          )}
          {project.githubRepoUrl && (
            <a
              href={project.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={12} />
              Source
            </a>
          )}
        </div>

        {/* Date */}
        <div className="mt-3 pt-3 border-t border-surface-border text-xs text-white/30">
          {new Date(project.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </Link>
  );
}
