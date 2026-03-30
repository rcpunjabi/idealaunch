import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

const APP_URL = "https://idealaunch-five.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "IdeaLaunch",
      description:
        "AI-powered app builder for non-technical founders. Turn any idea into a live, deployed product in minutes.",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${APP_URL}?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "IdeaLaunch",
      url: APP_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      description:
        "Describe your app idea in plain English. IdeaLaunch builds, deploys, and hands you a live URL — no coding required.",
      offers: [
        {
          "@type": "Offer",
          name: "Maker (Free)",
          price: "0",
          priceCurrency: "USD",
          description: "1 free app build — includes live preview, GitHub export, and Vercel deployment.",
        },
        {
          "@type": "Offer",
          name: "Starter",
          price: "49",
          priceCurrency: "USD",
          description: "5 app builds per month with private repos, custom domains, and email support.",
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: "149",
          priceCurrency: "USD",
          description: "Unlimited app builds, priority AI generation, team collaboration, and API access.",
        },
      ],
    },
    {
      "@type": "Organization",
      name: "IdeaLaunch",
      url: APP_URL,
      logo: `${APP_URL}/logo.png`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@idealaunuch.com",
        contactType: "customer support",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do I need to know how to code to use IdeaLaunch?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No coding required. Just describe your app in plain English and IdeaLaunch handles everything — design, code, database, and deployment.",
          },
        },
        {
          "@type": "Question",
          name: "How long does it take to build and deploy an app?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Typically under 5 minutes from idea to live URL.",
          },
        },
        {
          "@type": "Question",
          name: "Do I own the code IdeaLaunch generates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Your app is a real Next.js application pushed to your own private GitHub repo. You own it completely.",
          },
        },
        {
          "@type": "Question",
          name: "What kind of apps can IdeaLaunch build?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Booking apps, client portals, task trackers, marketplaces, internal tools, and more — any web application your business needs.",
          },
        },
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-cream overflow-x-hidden">
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <Footer />
      </main>
    </>
  );
}
