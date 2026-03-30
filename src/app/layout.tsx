import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const APP_URL = "https://idealaunch-five.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "IdeaLaunch — Turn Any Idea Into a Live App, No Code Required",
    template: "%s | IdeaLaunch",
  },
  description:
    "Describe your app idea in plain English. IdeaLaunch builds it, deploys it, and hands you a live URL — no coding, no developers, no waiting. From idea to live app in under 5 minutes.",
  keywords: [
    "no code app builder",
    "AI app generator",
    "build app without coding",
    "non-technical founder tools",
    "app builder for entrepreneurs",
    "launch app fast",
    "idea to app",
  ],
  authors: [{ name: "IdeaLaunch" }],
  creator: "IdeaLaunch",
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "IdeaLaunch",
    title: "IdeaLaunch — Your Idea. Live This Week.",
    description:
      "Turn any app idea into a real, deployed product in minutes. No code. No developers. Just describe it and go.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IdeaLaunch — Turn Any Idea Into a Live App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeaLaunch — Your Idea. Live This Week.",
    description:
      "Turn any app idea into a real, deployed product in minutes. No code required.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${plusJakarta.variable} ${dmSans.variable}`}>
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
