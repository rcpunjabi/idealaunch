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
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden bg-cream">
      {/* Warm ambient glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #D4973A22 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #C4693B1A 0%, transparent 70%)" }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-cream/90 backdrop-blur-xl border-b border-border">
        <span className="text-xl font-bold font-heading text-navy">
          Idea<span className="text-terra">Launch</span>
        </span>
        <div className="flex items-center gap-3">
          <SignedOut>
            <button
              onClick={() => router.push("/sign-in")}
              className="text-sm text-ink-light hover:text-navy transition-colors px-3 py-2"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push("/sign-up")}
              className="text-sm btn-primary text-white px-5 py-2.5 rounded-xl"
            >
              Get started free
            </button>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm btn-primary text-white px-5 py-2.5 rounded-xl"
            >
              Dashboard
            </button>
          </SignedIn>
        </div>
      </nav>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terra/8 border border-terra/20 text-sm text-terra font-medium mb-8 animate-fade-up">
        <Sparkles size={13} />
        <span>AI-powered app builder for non-technical founders</span>
      </div>

      {/* Headline */}
      <h1
        className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.1] mb-6 text-navy animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        Your idea.
        <br />
        <span className="gradient-text">Live this week.</span>
      </h1>

      <p
        className="text-lg sm:text-xl text-ink-light max-w-2xl mb-10 leading-relaxed animate-fade-up"
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
          className="group flex items-center gap-2 btn-primary text-white font-semibold px-8 py-4 rounded-xl text-lg"
        >
          Start building free
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
        <span className="text-sm text-ink-lighter">
          No credit card required · First app free
        </span>
      </div>

      {/* Example ideas ticker */}
      <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
        <p className="text-sm text-ink-lighter mb-3">People are building:</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
          {EXAMPLES.map((ex) => (
            <span
              key={ex}
              className="text-sm px-3 py-1.5 rounded-lg bg-white border border-border text-ink-light"
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
            <div className="text-2xl font-bold font-heading gradient-text">{value}</div>
            <div className="text-sm text-ink-lighter mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
