import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy">IdeaLaunch</h1>
          <p className="text-navy/60 mt-2">Your idea, live this week</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white border border-cream-dark shadow-lg rounded-2xl",
              headerTitle: "text-navy font-bold",
              headerSubtitle: "text-navy/60",
              socialButtonsBlockButton:
                "border border-cream-dark text-navy hover:bg-cream transition-colors",
              socialButtonsBlockButtonText: "text-navy font-medium",
              dividerLine: "bg-cream-dark",
              dividerText: "text-navy/40",
              formFieldLabel: "text-navy font-medium",
              formFieldInput:
                "border-cream-dark bg-cream text-navy placeholder:text-navy/40 focus:border-terra focus:ring-terra",
              formButtonPrimary:
                "bg-terra hover:bg-terra/90 text-white font-semibold",
              footerActionText: "text-navy/60",
              footerActionLink: "text-terra hover:text-terra/80 font-medium",
              identityPreviewText: "text-navy",
              identityPreviewEditButton: "text-terra",
              formResendCodeLink: "text-terra",
              otpCodeFieldInput: "border-cream-dark text-navy",
              alertText: "text-navy",
            },
          }}
        />
      </div>
    </div>
  );
}
