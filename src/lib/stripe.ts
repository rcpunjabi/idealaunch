import Stripe from "stripe";

// ─────────────────────────────────────────────
//  Stripe client
// ─────────────────────────────────────────────

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

// ─────────────────────────────────────────────
//  Price IDs
//  Set these in Vercel env vars after creating products in Stripe dashboard:
//  STRIPE_PRICE_STARTER  →  Starter plan ($49/mo)
//  STRIPE_PRICE_PRO      →  Pro plan ($149/mo)
// ─────────────────────────────────────────────

export const PRICES = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "",
  pro: process.env.STRIPE_PRICE_PRO ?? "",
} as const;

// ─────────────────────────────────────────────
//  Plan limits
//  free    → 1 build lifetime (no subscription required)
//  starter → 5 builds per billing period
//  pro     → 30 builds per billing period (soft cap to protect API costs)
// ─────────────────────────────────────────────

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 1,
  starter: 5,
  pro: 30,
};

export type Plan = "free" | "starter" | "pro";

// ─────────────────────────────────────────────
//  Map Stripe price ID → plan name
// ─────────────────────────────────────────────

export function planFromPriceId(priceId: string | null | undefined): Plan {
  if (!priceId) return "free";
  if (priceId === PRICES.pro) return "pro";
  if (priceId === PRICES.starter) return "starter";
  return "free";
}
