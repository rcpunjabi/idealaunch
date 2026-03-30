"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Plan } from "@/lib/stripe";

export default function UpgradePrompt({ plan }: { plan: Plan }) {
  const [loading, setLoading] = useState(false);

  const isStarter = plan === "starter";
  const targetPlan = isStarter ? "pro" : "starter";

  const heading =
    plan === "free"
      ? "You've used your free build"
      : plan === "starter"
      ? "You've used all 5 builds this month"
      : "You've reached your monthly limit";

  const body =
    plan === "free"
      ? "Upgrade to Starter to build up to 5 apps per month, get private GitHub repos, and custom domain support."
      : plan === "starter"
      ? "Upgrade to Pro for 30 builds/month, team collaboration, white-label deployments, and API access."
      : "You've hit the Pro soft cap. Reach out if you need a custom limit.";

  const ctaLabel =
    plan === "free"
      ? "Upgrade to Starter — $49/mo"
      : plan === "starter"
      ? "Upgrade to Pro — $149/mo"
      : "Contact us";

  async function handleUpgrade() {
    if (plan === "pro") {
      window.location.href = "mailto:hello@idealaunuch.com?subject=Custom+limit+request";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 p-6 rounded-2xl bg-navy border border-navy/80 text-white relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #D4973A44 0%, transparent 70%)" }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={15} className="text-gold" />
            <span className="text-sm font-semibold text-gold">
              {heading}
            </span>
          </div>
          <p className="text-sm text-white/60">{body}</p>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="flex items-center gap-2 shrink-0 bg-terra hover:bg-terra-light text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
          style={{ boxShadow: "0 4px 16px rgba(196,105,59,0.35)" }}
        >
          {loading ? "Redirecting..." : ctaLabel}
          {!loading && <ArrowRight size={15} />}
        </button>
      </div>
    </div>
  );
}
