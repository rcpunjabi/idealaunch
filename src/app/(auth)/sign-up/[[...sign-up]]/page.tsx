import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">IdeaLaunch</h1>
          <p className="text-white/50 mt-2">Your idea, live this week</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-surface border border-surface-border shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-white/50",
              formButtonPrimary: "bg-violet hover:bg-violet-dark",
              formFieldInput:
                "bg-surface-raised border-surface-border text-white",
              footerActionLink: "text-violet",
            },
          }}
        />
      </div>
    </div>
  );
}
