"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Globe,
  Github,
  Rocket,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

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
  { key: "preview",    label: "Preparing live preview" },
  { key: "deploying",  label: "Deploying to the web" },
  { key: "live",       label: "Your app is live!" },
];

export default function AppPreview({ projectId, onDeployed }: AppPreviewProps) {
  const [status, setStatus] = useState<PhaseStatus>({ phase: "generating" });

  useEffect(() => {
    runBuildPipeline();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runBuildPipeline() {
    setStatus({ phase: "generating" });
    try {
      // Phase 3: Generate code
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!genRes.ok) throw new Error("Code generation failed");

      const genData = await genRes.json();
      setStatus({ phase: "preview", previewUrl: genData.previewUrl, fileCount: genData.fileCount });

      await new Promise((r) => setTimeout(r, 2000));
      setStatus((prev) => ({ ...prev, phase: "deploying" }));

      // Phase 4+5: GitHub + Vercel deploy
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
    <div className="space-y-6">

      {/* Progress steps */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {PHASE_STEPS.map((step, i) => {
            const isDone = i < currentStepIdx || status.phase === "live";
            const isCurrent = step.key === status.phase && status.phase !== "live";
            const isError = status.phase === "error" && i === currentStepIdx;

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 size={20} className="text-terra" />
                  ) : isError ? (
                    <XCircle size={20} className="text-red-500" />
                  ) : isCurrent ? (
                    <Loader2 size={20} className="text-terra animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDone ? "text-terra" : isCurrent ? "text-navy" : "text-ink-lighter"
                  }`}
                >
                  {step.label}
                </span>
                {isCurrent && status.fileCount && step.key === "preview" && (
                  <span className="ml-auto text-xs text-ink-lighter">
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
        <div className="rounded-2xl overflow-hidden border border-border bg-white shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-cream">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
            </div>
            <div className="flex-1 bg-white border border-border rounded-md px-3 py-1 text-xs text-ink-lighter font-mono truncate">
              {status.previewUrl}
            </div>
            <a
              href={status.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-lighter hover:text-navy transition-colors"
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
        <div className="p-6 rounded-2xl border border-terra/25 bg-terra/5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-terra/10 flex items-center justify-center mx-auto mb-4">
            <Rocket size={26} className="text-terra" />
          </div>
          <h2 className="text-xl font-bold font-heading text-navy mb-1">
            Your app is live!
          </h2>
          <p className="text-ink-lighter text-sm mb-6">
            Share the link below. Your code is yours — export it any time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {status.deploymentUrl && (
              <a
                href={status.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-terra text-white font-semibold px-6 py-3 rounded-xl hover:bg-terra/90 transition-colors"
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
                className="flex items-center justify-center gap-2 bg-white border border-border text-ink font-medium px-6 py-3 rounded-xl hover:border-navy/30 transition-colors"
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
        <div className="p-6 rounded-2xl border border-red-200 bg-red-50 text-center">
          <XCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-navy mb-1">
            Something went wrong
          </h2>
          <p className="text-ink-lighter text-sm mb-4">{status.errorMessage}</p>
          <button
            onClick={runBuildPipeline}
            className="flex items-center justify-center gap-2 mx-auto bg-white border border-border text-ink font-medium px-5 py-2.5 rounded-xl text-sm hover:border-navy/30 transition-colors"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
