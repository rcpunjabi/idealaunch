import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICES } from "@/lib/stripe";
import { getUserSubscription, upsertSubscription } from "@/lib/supabase";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://idealaunch-five.vercel.app";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();
  if (!plan || !["starter", "pro"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = plan === "pro" ? PRICES.pro : PRICES.starter;
  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price IDs not configured — set STRIPE_PRICE_STARTER and STRIPE_PRICE_PRO in Vercel env vars" },
      { status: 500 }
    );
  }

  try {
    // Get or create Stripe customer
    const sub = await getUserSubscription(userId);
    let customerId = sub.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { clerkUserId: userId },
      });
      customerId = customer.id;
      await upsertSubscription(userId, { stripeCustomerId: customerId });
    }

    // If they already have an active paid subscription, redirect to portal instead
    if (sub.plan !== "free" && sub.status === "active") {
      const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${APP_URL}/dashboard`,
      });
      return NextResponse.json({ url: portal.url });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/dashboard?upgraded=1`,
      cancel_url: `${APP_URL}/dashboard?canceled=1`,
      metadata: { clerkUserId: userId, plan },
      subscription_data: {
        metadata: { clerkUserId: userId, plan },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
