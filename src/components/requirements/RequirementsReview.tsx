"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2, ChevronRight } from "lucide-react";
import type { Requirement, AppBlueprint } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  feature: "Features",
  design: "Design",
  data: "Data",
  auth: "Auth",
  integration: "Integrations",
};

const CATEGORY_COLORS: Record<string, string> = {
  feature: "text-violet",
  design: "text-emerald",
  data: "text-blue-400",
  auth: "text-orange-400",
  integration: "text-pink-400",
};

interface RequirementsReviewProps {
  projectId: string;
  blueprint: AppBlueprint;
  onApproved: () => void;
}

export default function RequirementsReview({
  projectId,
  blueprint,
  onApproved,
}: RequirementsReviewProps) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadRequirements() {
      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      setRequirements(data.requirements ?? []);
      setLoading(false);
    }
    loadRequirements();
  }, [projectId]);

  function toggleRequirement(id: string) {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  }

  async function handleApprove() {
    setSaving(true);
    await fetch("/api/requirements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, requirements }),
    });
    setSaving(false);
    onApproved();
  }

  const approvedCount = requirements.filter((r) => r.approved).length;

  // Group by category
  const grouped = requirements.reduce<Record<string, Requirement[]>>(
    (acc, req) => {
      if (!acc[req.category]) acc[req.category] = [];
      acc[req.category].push(req);
      return acc;
    },
    {}
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 size={24} className="text-violet animate-spin" />
        <p className="text-white/50 text-sm">
          Building your app blueprint...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-violet/10 border border-violet/20">
        <h2 className="text-lg font-semibold mb-1">
          Your App Blueprint
        </h2>
        <p className="text-white/60 text-sm">
          Here&apos;s exactly what IdeaLaunch will build. Review each item and
          uncheck anything you don&apos;t want. When you&apos;re happy, hit
          &ldquo;Build my app&rdquo;.
        </p>
      </div>

      {/* Blueprint summary */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <p className="text-xs text-white/40 mb-1">App name</p>
          <p className="font-semibold">{blueprint.appName}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <p className="text-xs text-white/40 mb-1">Built for</p>
          <p className="font-semibold">{blueprint.targetUser}</p>
        </div>
      </div>

      {/* Requirements by category */}
      {Object.entries(grouped).map(([category, reqs]) => (
        <div key={category}>
          <h3
            className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
              CATEGORY_COLORS[category] ?? "text-white/50"
            }`}
          >
            {CATEGORY_LABELS[category] ?? category}
          </h3>
          <div className="space-y-2">
            {reqs.map((req) => (
              <button
                key={req.id}
                onClick={() => toggleRequirement(req.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  req.approved
                    ? "bg-surface border-surface-border hover:border-violet/30"
                    : "bg-surface/50 border-surface-border/50 opacity-50"
                }`}
              >
                <div
                  className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-colors ${
                    req.approved
                      ? "bg-emerald border-emerald"
                      : "border-surface-border"
                  }`}
                >
                  {req.approved ? (
                    <Check size={12} className="text-ink" />
                  ) : (
                    <X size={12} className="text-white/30" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{req.title}</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {req.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Approve button */}
      <button
        onClick={handleApprove}
        disabled={approvedCount === 0 || saving}
        className="w-full flex items-center justify-center gap-2 bg-violet hover:bg-violet-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
      >
        {saving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            Build my app ({approvedCount} features)
            <ChevronRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}
