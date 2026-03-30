"use client";

import {
  ShieldCheck,
  Zap,
  GitBranch,
  Eye,
  Layers,
  HeartHandshake,
} from "lucide-react";

const FEATURES = [
  {
    icon: HeartHandshake,
    title: "Built for non-technical founders",
    description:
      "Every word, every prompt, every screen is designed for people who have great ideas but don't write code. No jargon. Ever.",
    accent: "text-terra",
    bg: "bg-terra/8",
  },
  {
    icon: Eye,
    title: "See it before it's live",
    description:
      "A live preview of your app runs inside IdeaLaunch before a single line of code hits the internet. What you see is what gets deployed.",
    accent: "text-gold",
    bg: "bg-gold/8",
  },
  {
    icon: GitBranch,
    title: "You own the code",
    description:
      "Your app is a real Next.js application pushed to your own private GitHub repo. Export it, hand it to a developer, or build on it forever.",
    accent: "text-navy",
    bg: "bg-navy/8",
  },
  {
    icon: Zap,
    title: "Deployed in minutes",
    description:
      "IdeaLaunch connects to Vercel and deploys automatically. Your app gets a live URL — no server setup, no DNS headaches.",
    accent: "text-coral",
    bg: "bg-coral/8",
  },
  {
    icon: Layers,
    title: "Blueprint approval — our moat",
    description:
      "Before anything gets built, you approve a plain-English summary of exactly what's being created. No surprises. Full control.",
    accent: "text-terra",
    bg: "bg-terra/8",
  },
  {
    icon: ShieldCheck,
    title: "Production-grade output",
    description:
      "Authentication, database, responsive design — every app IdeaLaunch generates is a real, deployable product. Not a prototype.",
    accent: "text-gold-dark",
    bg: "bg-gold/8",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-4 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-terra text-sm font-semibold tracking-widest uppercase mb-3">
            What you get
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold font-heading text-navy mb-4">
            Not a mockup.
            <br />
            <span className="gradient-text">A real app.</span>
          </h2>
          <p className="text-ink-light text-lg max-w-xl mx-auto">
            IdeaLaunch generates complete, production-ready applications — the
            kind of thing you&apos;d normally pay $10,000 and wait 3 months for.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="p-6 rounded-2xl bg-white border border-border hover:border-terra/30 hover:shadow-md transition-all duration-300 group"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${feat.bg} mb-4`}>
                <feat.icon size={20} className={feat.accent} />
              </div>
              <h3 className="text-base font-semibold font-heading text-navy mb-2 group-hover:text-terra transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-ink-light leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
