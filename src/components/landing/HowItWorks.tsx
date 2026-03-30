"use client";

import { MessageSquare, CheckSquare, Code2, Globe } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Tell us your idea",
    description:
      "Have a quick conversation with our AI. It asks the right questions to fully understand your vision — no technical knowledge needed.",
    accent: "text-terra",
    bg: "bg-terra/10",
    border: "border-terra/20",
  },
  {
    icon: CheckSquare,
    number: "02",
    title: "Approve your blueprint",
    description:
      "We turn your answers into a plain-English app blueprint. Review it, tweak it, approve it. You're in control of exactly what gets built.",
    accent: "text-gold",
    bg: "bg-gold/10",
    border: "border-gold/20",
  },
  {
    icon: Code2,
    number: "03",
    title: "Watch it get built",
    description:
      "IdeaLaunch generates a complete, real application — not a mockup. Preview it live before it goes anywhere.",
    accent: "text-coral",
    bg: "bg-coral/10",
    border: "border-coral/20",
  },
  {
    icon: Globe,
    number: "04",
    title: "Get your live URL",
    description:
      "Your app is deployed to the web automatically. Share the URL with anyone. You also own the code — export it any time.",
    accent: "text-navy",
    bg: "bg-navy/8",
    border: "border-navy/15",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-cream-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-terra text-sm font-semibold tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold font-heading text-navy mb-4">
            From idea to live app
            <br />
            <span className="gradient-text">in four steps</span>
          </h2>
          <p className="text-ink-light text-lg max-w-xl mx-auto">
            No tutorials. No learning curve. No waiting for a developer to respond.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`relative p-6 rounded-2xl bg-white border ${step.border} hover:shadow-md transition-all duration-300 group`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-border-dark z-10" />
              )}

              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${step.bg} mb-4`}>
                <step.icon size={22} className={step.accent} />
              </div>

              <div className={`text-xs font-bold font-heading tracking-widest mb-2 ${step.accent} opacity-60`}>
                {step.number}
              </div>

              <h3 className="text-base font-semibold font-heading text-navy mb-2 group-hover:text-terra transition-colors">
                {step.title}
              </h3>

              <p className="text-sm text-ink-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
