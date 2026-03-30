import { NextRequest, NextResponse } from "next/server";
import { stripe, planFromPriceId } from "@/lib/stripe";
import { upsertSubscription } from "@/lib/supabase";
import type Stripe from "stripe";

// Disable Next.js body parsing — Stripe needs the raw body for signature verification
export const config = { api: { bodyParser: false } };

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.clerkUserId;
        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const priceId = subscription.items.data[0]?.price.id ?? null;
        const plan = planFromPriceId(priceId);
        const periodEnd = new Date(
          subscription.current_period_end * 1000
        ).toISOString();

        await upsertSubscription(userId, {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId ?? undefined,
          plan,
          status: subscription.status,
          currentPeriodEnd: periodEnd,
          buildsUsed: 0,
          buildsResetAt: new Date().toISOString(),
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;
        if (!userId) break;

        const priceId = subscription.items.data[0]?.price.id ?? null;
        const plan = planFromPriceId(priceId);
        const periodEnd = new Date(
          subscription.current_period_end * 1000
        ).toISOString();

        // Reset build counter if billing period renewed
        const prevAttrs = (
          event.data.previous_attributes as Partial<Stripe.Subscription>
        ) ?? {};
        const periodRenewed =
          prevAttrs.current_period_start !== undefined &&
          prevAttrs.current_period_start !== subscription.current_period_start;

        await upsertSubscription(userId, {
          stripePriceId: priceId ?? undefined,
          plan,
          status: subscription.status,
          currentPeriodEnd: periodEnd,
          ...(periodRenewed ? { buildsUsed: 0, buildsResetAt: new Date().toISOString() } : {}),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;
        if (!userId) break;

        await upsertSubscription(userId, {
          stripePriceId: undefined,
          plan: "free",
          status: "canceled",
          currentPeriodEnd: undefined,
        });
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error("[webhook] handler error", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
