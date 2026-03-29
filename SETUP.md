# IdeaLaunch — Setup Guide

## Prerequisites

You'll need accounts and API keys for these services:

| Service | Purpose | Free Tier |
|---|---|---|
| [Clerk](https://clerk.com) | Authentication | ✅ Generous |
| [Supabase](https://supabase.com) | Database | ✅ Sufficient for MVP |
| [Anthropic](https://console.anthropic.com) | Claude API (AI) | Pay per use |
| [GitHub](https://github.com/settings/tokens) | Repo creation | ✅ Free |
| [Vercel](https://vercel.com) | Deployment | ✅ Generous |
| [E2B](https://e2b.dev) | Live preview sandbox | Small free tier |
| [Stripe](https://stripe.com) | Payments | ✅ Test mode free |

---

## 1. Clone and install

```bash
cd "Idea Launch"
npm install
```

## 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. See `.env.example` for what each key does.

## 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project URL and keys into `.env.local`

## 4. Set up Clerk

1. Create an app at [clerk.com](https://clerk.com)
2. Copy your publishable and secret keys into `.env.local`
3. In Clerk dashboard → Redirects, set:
   - Sign-in: `/dashboard`
   - Sign-up: `/dashboard`

## 5. Set up GitHub token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Create a **Classic token** with scopes: `repo`, `workflow`
3. Set `GITHUB_ORG` to your GitHub username or org where repos will be created

## 6. Set up Vercel token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create a token
3. If using a Vercel team, also set `VERCEL_TEAM_ID`

## 7. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 8. Deploy IdeaLaunch itself

```bash
# Push to GitHub, then connect to Vercel
vercel --prod
```

Add all `.env.local` variables to your Vercel project environment variables.

---

## Architecture

```
User (Browser)
    ↓
IdeaLaunch (Next.js on Vercel)
    ↓
Orchestration Layer (src/app/api/)
    ↙          ↓           ↘
Claude API   GitHub API   Vercel API
(ideation +  (repo        (deployment)
 code gen)    creation)
    ↓
Supabase (user data, projects, messages)
    ↓
Clerk (authentication)
```

## Go High Level Integration

You have Go High Level — here's how to use it alongside IdeaLaunch:

- **Waitlist / lead capture**: Use a GHL landing page or form to capture waitlist signups before launch
- **Email sequences**: Build an onboarding drip sequence in GHL for new IdeaLaunch users (welcome → day 3 check-in → day 7 "how's your app?")
- **CRM**: Track your beta users and their feedback in GHL pipelines
- **SMS follow-up**: Use GHL's SMS to nudge users who started but didn't finish building their first app

You do NOT need GHL for the core IdeaLaunch app — Clerk handles auth, Supabase handles data. GHL is your marketing and retention layer.

## Hostinger

Your Hostinger Business plan can host IdeaLaunch if you prefer over Vercel:

1. Hostinger supports Node.js — you can deploy Next.js there
2. However, **Vercel is strongly recommended for IdeaLaunch** because the app itself uses the Vercel API to deploy *user* apps, and using the same platform simplifies the setup
3. Best use for Hostinger: host your **marketing site** or **blog** separately from the main app
