"use client";

import { useRouter } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Sparkles } from "lucide-react";

const EXAMPLES = [
  "A booking app for my dog grooming business",
  "A client portal for my freelance design studio",
  "A task tracker for my remote team",
  "A recipe sharing app for home cooks",
];

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-violet/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald/5 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-surface-border/50">
        <span className="text-xl font-bold gradient-text">IdeaLaunch</span>
        <div className="flex items-center gap-4">
          <SignedOut>
            <button
              onClick={() => router.push("/sign-in")}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push("/sign-up")}
              className="text-sm bg-violet hover:bg-violet-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get started free
            </button>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm bg-violet hover:bg-violet-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              Dashboard
            </button>
          </SignedIn>
        </div>
      </nav>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-violet mb-8 animate-fade-up">
        <Sparkles size={14} />
        <span>AI-powered app builder for non-technical founders</span>
      </div>

      {/* Headline */}
      <h1
        className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        Your idea.
        <br />
        <span className="gradient-text">Live this week.</span>
      </h1>

      <p
        className="text-lg sm:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        Describe your app idea in plain English. IdeaLaunch builds it, deploys
        it, and hands you a live URL — no coding, no developers, no waiting.
      </p>

      {/* CTA */}
      <div
        className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <button
          onClick={() => router.push("/sign-up")}
          className="group flex items-center gap-2 bg-violet hover:bg-violet-dark text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg shadow-violet/25"
        >
          Start building free
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
        <span className="text-sm text-white/40">
          No credit card required · First app free
        </span>
      </div>

      {/* Example ideas ticker */}
      <div
        className="animate-fade-up"
        style={{ animationDelay: "0.4s" }}
      >
        <p className="text-sm text-white/40 mb-3">People are building:</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
          {EXAMPLES.map((ex) => (
            <span
              key={ex}
              className="text-sm px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-white/70"
            >
              &ldquo;{ex}&rdquo;
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div
        className="mt-20 grid grid-cols-3 gap-8 max-w-lg w-full animate-fade-up"
        style={{ animationDelay: "0.5s" }}
      >
        {[
          { value: "< 5 min", label: "Idea to live app" },
          { value: "Zero", label: "Coding required" },
          { value: "100%", label: "You own the code" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-2xl font-bold gradient-text">{value}</div>
            <div className="text-sm text-white/50 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
