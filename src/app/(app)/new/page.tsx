"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/intake/ChatInterface";
import RequirementsReview from "@/components/requirements/RequirementsReview";
import AppPreview from "@/components/preview/AppPreview";
import { MessageSquare, CheckSquare, Rocket, Check } from "lucide-react";
import type { AppBlueprint } from "@/types";

type Step = "intake" | "requirements" | "build";

const STEPS = [
  { key: "intake", label: "Describe your idea", icon: MessageSquare },
  { key: "requirements", label: "Review blueprint", icon: CheckSquare },
  { key: "build", label: "Build & deploy", icon: Rocket },
] as const;

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intake");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<AppBlueprint | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

  const currentStepIdx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen">
      {/* Step progress header */}
      <div className="sticky top-[57px] z-30 bg-ink/80 backdrop-blur-md border-b border-surface-border px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const isComplete = i < currentStepIdx;
              const isCurrent = s.key === step;
              const Icon = s.icon;

              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 text-sm transition-all ${
                      isCurrent
                        ? "text-white"
                        : isComplete
                        ? "text-emerald"
                        : "text-white/30"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isComplete
                          ? "bg-emerald border-emerald"
                          : isCurrent
                          ? "border-violet bg-violet/10"
                          : "border-surface-border"
                      }`}
                    >
                      {isComplete ? (
                        <Check size={12} className="text-ink" />
                      ) : (
                        <Icon size={12} />
                      )}
                    </div>
                    <span className="hidden sm:inline font-medium">
                      {s.label}
                    </span>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-8 h-px transition-colors ${
                        i < currentStepIdx
                          ? "bg-emerald/50"
                          : "bg-surface-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step 1: Intake chat */}
        {step === "intake" && (
          <div className="h-[calc(100vh-160px)] flex flex-col rounded-2xl border border-surface-border bg-surface overflow-hidden">
            <div className="p-4 border-b border-surface-border">
              <h1 className="font-semibold">Tell me about your app</h1>
              <p className="text-sm text-white/50 mt-0.5">
                Answer a few questions — no technical knowledge needed
              </p>
            </div>
            <ChatInterface
              projectId={projectId}
              onProjectCreated={(id) => setProjectId(id)}
              onComplete={(bp) => {
                setBlueprint(bp);
                setStep("requirements");
              }}
            />
          </div>
        )}

        {/* Step 2: Requirements review */}
        {step === "requirements" && projectId && blueprint && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">
                Your App Blueprint
              </h1>
              <p className="text-white/50">
                Here&apos;s what IdeaLaunch will build. Review and approve.
              </p>
            </div>
            <RequirementsReview
              projectId={projectId}
              blueprint={blueprint}
              onApproved={() => setStep("build")}
            />
          </div>
        )}

        {/* Step 3: Build + deploy */}
        {step === "build" && projectId && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">Building your app</h1>
              <p className="text-white/50">
                Sit back — this takes a couple of minutes.
              </p>
            </div>
            <AppPreview
              projectId={projectId}
              onDeployed={(url) => {
                setDeploymentUrl(url);
                // Navigate to project page after a brief delay
                setTimeout(() => router.push(`/projects/${projectId}`), 2000);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
