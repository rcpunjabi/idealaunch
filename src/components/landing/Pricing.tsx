"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Maker",
    price: 0,
    limit: "1 app",
    cta: "Start free",
    features: [
      "1 app build",
      "Live preview",
      "GitHub repo export",
      "Vercel deployment",
      "Community support",
    ],
  },
  {
    name: "Starter",
    price: 49,
    limit: "5 apps / month",
    cta: "Start building",
    highlighted: true,
    features: [
      "5 app builds per month",
      "Live preview on every build",
      "Private GitHub repos",
      "Custom domain support",
      "Email support",
      "App revision (1x per app)",
    ],
  },
  {
    name: "Pro",
    price: 149,
    limit: "Unlimited apps",
    cta: "Go Pro",
    features: [
      "Unlimited app builds",
      "Priority AI generation",
      "Team collaboration (3 seats)",
      "White-label deployments",
      "Priority support",
      "API access",
      "App revision (3x per app)",
    ],
  },
];

export default function Pricing() {
  const router = useRouter();

  return (
    <section className="py-24 px-4 bg-cream-dark">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-terra text-sm font-semibold tracking-widest uppercase mb-3">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold font-heading text-navy mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-ink-light text-lg max-w-lg mx-auto">
            Start for free. Upgrade when you&apos;re ready. No hidden fees, no
            per-seat surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 rounded-2xl border flex flex-col transition-all duration-300 ${
                tier.highlighted
                  ? "bg-navy border-navy shadow-xl scale-[1.02]"
                  : "bg-white border-border hover:border-terra/30 hover:shadow-md"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-terra text-white text-xs font-bold rounded-full tracking-wide">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold font-heading mb-1 ${tier.highlighted ? "text-white" : "text-navy"}`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-bold font-heading ${tier.highlighted ? "text-white" : "text-navy"}`}>
                    ${tier.price}
                  </span>
                  <span className={`text-sm ${tier.highlighted ? "text-white/50" : "text-ink-lighter"}`}>
                    /month
                  </span>
                </div>
                <p className={`text-sm ${tier.highlighted ? "text-white/50" : "text-ink-lighter"}`}>
                  {tier.limit}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      size={16}
                      className={`mt-0.5 shrink-0 ${tier.highlighted ? "text-terra-light" : "text-terra"}`}
                    />
                    <span className={tier.highlighted ? "text-white/80" : "text-ink-light"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push("/sign-up")}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  tier.highlighted
                    ? "bg-terra hover:bg-terra-light text-white"
                    : "btn-ghost text-navy border-border hover:border-navy"
                }`}
                style={tier.highlighted ? { boxShadow: "0 4px 16px rgba(196,105,59,0.35)" } : {}}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-ink-lighter mt-8">
          All plans include SSL, CDN, and 99.9% uptime. Cancel any time.
        </p>
      </div>
    </section>
  );
}
