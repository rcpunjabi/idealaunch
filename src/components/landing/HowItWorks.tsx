"use client";

import { MessageSquare, CheckSquare, Code2, Globe } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Tell us your idea",
    description:
      "Have a quick conversation with our AI. It asks the right questions to fully understand your vision — no technical knowledge needed.",
    color: "text-violet",
    bg: "bg-violet/10",
  },
  {
    icon: CheckSquare,
    number: "02",
    title: "Approve your blueprint",
    description:
      "We turn your answers into a plain-English app blueprint. Review it, tweak it, approve it. You're in control of exactly what gets built.",
    color: "text-emerald",
    bg: "bg-emerald/10",
  },
  {
    icon: Code2,
    number: "03",
    title: "Watch it get built",
    description:
      "IdeaLaunch generates a complete, real application — not a mockup. Preview it live before it goes anywhere.",
    color: "text-violet-light",
    bg: "bg-violet-light/10",
  },
  {
    icon: Globe,
    number: "04",
    title: "Get your live URL",
    description:
      "Your app is deployed to the web automatically. Share the URL with anyone. You also own the code — export it any time.",
    color: "text-emerald",
    bg: "bg-emerald/10",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            From idea to live app
            <br />
            <span className="gradient-text">in four steps</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            No tutorials. No learning curve. No waiting for a developer to
            respond.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative p-6 rounded-2xl bg-surface border border-surface-border hover:border-violet/30 transition-all duration-300 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Step connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-surface-border z-10" />
              )}

              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${step.bg} mb-4`}
              >
                <step.icon size={22} className={step.color} />
              </div>

              <div className="text-xs font-mono text-white/30 mb-2">
                {step.number}
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                {step.title}
              </h3>

              <p className="text-sm text-white/50 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
