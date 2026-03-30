-- Run this in your Supabase SQL editor to add subscription tracking
-- Dashboard → SQL Editor → New query → paste this → Run

CREATE TABLE IF NOT EXISTS subscriptions (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                text        NOT NULL UNIQUE,
  stripe_customer_id     text,
  stripe_subscription_id text,
  stripe_price_id        text,
  plan                   text        NOT NULL DEFAULT 'free',
  status                 text        NOT NULL DEFAULT 'active',
  current_period_end     timestamptz,
  builds_used            integer     NOT NULL DEFAULT 0,
  builds_reset_at        timestamptz,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS subscriptions_customer_id_idx ON subscriptions (stripe_customer_id);
