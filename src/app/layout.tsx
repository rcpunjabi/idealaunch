import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdeaLaunch — Your Idea, Live This Week",
  description:
    "Turn your app idea into a live, deployed product — no coding required. Describe your idea, approve your blueprint, and watch IdeaLaunch build and deploy it for you.",
  openGraph: {
    title: "IdeaLaunch",
    description: "Your idea. Live this week.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
