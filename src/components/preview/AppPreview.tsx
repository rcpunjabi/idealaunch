"use client";

import { useState, useEffect } from "react";
import { Loader2, Globe, Github, Rocket, CheckCircle, XCircle, ExternalLink } from "lucide-react";

interface AppPreviewProps {
  projectId: string;
  onDeployed: (deploymentUrl: string) => void;
}

type Phase = "generating" | "preview" | "deploying" | "live" | "error";

interface PhaseStatus {
  phase: Phase;
  previewUrl?: string;
  deploymentUrl?: string;
  githubRepoUrl?: string;
  fileCount?: number;
  errorMessage?: string;
}

const PHASE_STEPS = [
  { key: "generating", label: "Generating your app" },
  { key: "preview", label: "Preparing live preview" },
  { key: "deploying", label: "Deploying to the web" },
  { key: "live", label: "Your app is live!" },
];

export default function AppPreview({ projectId, onDeployed }: AppPreviewProps) {
  const [status, setStatus] = useState<PhaseStatus>({ phase: "generating" });

  useEffect(() => {
    runBuildPipeline();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runBuildPipeline() {
    // Phase 3: Generate code
    try {
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!genRes.ok) throw new Error("Code generation failed");

      const genData = await genRes.json();
      setStatus({
        phase: "preview",
        previewUrl: genData.previewUrl,
        fileCount: genData.fileCount,
      });

      // Small pause so user can see the preview
      await new Promise((r) => setTimeout(r, 2000));
      setStatus((prev) => ({ ...prev, phase: "deploying" }));

      // Phases 4+5: GitHub + Vercel deploy
      const deployRes = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!deployRes.ok) throw new Error("Deployment failed");

      const deployData = await deployRes.json();
      setStatus({
        phase: "live",
        previewUrl: genData.previewUrl,
        deploymentUrl: deployData.deploymentUrl,
        githubRepoUrl: deployData.githubRepoUrl,
        fileCount: genData.fileCount,
      });

      onDeployed(deployData.deploymentUrl);
    } catch (err) {
      setStatus({
        phase: "error",
        errorMessage: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }

  const currentStepIdx = PHASE_STEPS.findIndex((s) => s.key === status.phase);

  return (
    <div className="space-y-8">
      {/* Progress steps */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border">
        <div className="space-y-4">
          {PHASE_STEPS.map((step, i) => {
            const isDone = i < currentStepIdx || status.phase === "live";
            const isCurrent =
              step.key === status.phase && status.phase !== "live";
            const isError = status.phase === "error" && i === currentStepIdx;

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle size={20} className="text-emerald" />
                  ) : isError ? (
                    <XCircle size={20} className="text-red-400" />
                  ) : isCurrent ? (
                    <Loader2 size={20} className="text-violet animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-surface-border" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isDone
                      ? "text-emerald"
                      : isCurrent
                      ? "text-white"
                      : "text-white/30"
                  }`}
                >
                  {step.label}
                </span>
                {isCurrent && status.fileCount && step.key === "preview" && (
                  <span className="ml-auto text-xs text-white/40">
                    {status.fileCount} files generated
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live preview iframe */}
      {status.previewUrl && status.phase !== "generating" && (
        <div className="rounded-2xl overflow-hidden border border-surface-border bg-surface">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-border bg-surface-raised">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 bg-surface border border-surface-border rounded-md px-3 py-1 text-xs text-white/40 font-mono truncate">
              {status.previewUrl}
            </div>
            <a
              href={status.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          </div>
          <iframe
            src={status.previewUrl}
            className="w-full h-[500px]"
            title="App preview"
          />
        </div>
      )}

      {/* Success state */}
      {status.phase === "live" && (
        <div className="p-6 rounded-2xl bg-emerald/10 border border-emerald/20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4">
            <Rocket size={24} className="text-emerald" />
          </div>
          <h2 className="text-xl font-bold mb-1">Your app is live!</h2>
          <p className="text-white/60 text-sm mb-6">
            Share the link below. Your code is yours — export it any time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {status.deploymentUrl && (
              <a
                href={status.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald text-ink font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Globe size={16} />
                View live app
              </a>
            )}
            {status.githubRepoUrl && (
              <a
                href={status.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-surface border border-surface-border text-white px-6 py-3 rounded-xl hover:border-violet/30 transition-colors"
              >
                <Github size={16} />
                View source code
              </a>
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {status.phase === "error" && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <XCircle size={32} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">Something went wrong</h2>
          <p className="text-white/60 text-sm mb-4">{status.errorMessage}</p>
          <button
            onClick={runBuildPipeline}
            className="bg-surface border border-surface-border text-white px-5 py-2.5 rounded-xl text-sm hover:border-violet/30 transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
