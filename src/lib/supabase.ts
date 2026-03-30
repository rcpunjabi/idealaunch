import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
//  Supabase clients
// ─────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side client (uses anon key + RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (bypasses RLS — server only)
export function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─────────────────────────────────────────────
//  Project helpers
// ─────────────────────────────────────────────

import type { Project, AppBlueprint, Requirement, GeneratedFile } from "@/types";

export async function getProjectsByUser(userId: string): Promise<Project[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function getProject(id: string): Promise<Project | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapRow(data);
}

export async function createProject(
  userId: string,
  name: string,
  description: string
): Promise<Project> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .insert({ user_id: userId, name, description, status: "intake" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateProject(
  id: string,
  updates: Partial<{
    name: string;
    status: string;
    blueprint: AppBlueprint;
    requirements: Requirement[];
    generated_files: GeneratedFile[];
    github_repo_url: string;
    preview_url: string;
    deployment_url: string;
  }>
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────
//  Conversation helpers
// ─────────────────────────────────────────────

export async function saveMessage(
  projectId: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("messages")
    .insert({ project_id: projectId, role, content });
}

export async function getMessages(projectId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

// ─────────────────────────────────────────────
//  Subscription helpers
// ─────────────────────────────────────────────

import type { Plan } from "@/lib/stripe";

export interface UserSubscription {
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  plan: Plan;
  status: string;
  currentPeriodEnd: string | null;
  buildsUsed: number;
  buildsResetAt: string | null;
}

export async function getUserSubscription(
  userId: string
): Promise<UserSubscription> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) {
    return {
      userId,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      plan: "free",
      status: "active",
      currentPeriodEnd: null,
      buildsUsed: 0,
      buildsResetAt: null,
    };
  }

  return {
    userId: data.user_id,
    stripeCustomerId: data.stripe_customer_id ?? null,
    stripeSubscriptionId: data.stripe_subscription_id ?? null,
    stripePriceId: data.stripe_price_id ?? null,
    plan: (data.plan ?? "free") as Plan,
    status: data.status ?? "active",
    currentPeriodEnd: data.current_period_end ?? null,
    buildsUsed: data.builds_used ?? 0,
    buildsResetAt: data.builds_reset_at ?? null,
  };
}

export async function upsertSubscription(
  userId: string,
  fields: Partial<{
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    plan: Plan;
    status: string;
    currentPeriodEnd: string;
    buildsUsed: number;
    buildsResetAt: string;
  }>
): Promise<void> {
  const admin = createAdminClient();
  const row: Record<string, unknown> = {
    user_id: userId,
    updated_at: new Date().toISOString(),
  };
  if (fields.stripeCustomerId !== undefined)
    row.stripe_customer_id = fields.stripeCustomerId;
  if (fields.stripeSubscriptionId !== undefined)
    row.stripe_subscription_id = fields.stripeSubscriptionId;
  if (fields.stripePriceId !== undefined)
    row.stripe_price_id = fields.stripePriceId;
  if (fields.plan !== undefined) row.plan = fields.plan;
  if (fields.status !== undefined) row.status = fields.status;
  if (fields.currentPeriodEnd !== undefined)
    row.current_period_end = fields.currentPeriodEnd;
  if (fields.buildsUsed !== undefined) row.builds_used = fields.buildsUsed;
  if (fields.buildsResetAt !== undefined)
    row.builds_reset_at = fields.buildsResetAt;

  const { error } = await admin
    .from("subscriptions")
    .upsert(row, { onConflict: "user_id" });

  if (error) throw new Error(error.message);
}

export async function incrementBuildsUsed(userId: string): Promise<void> {
  const admin = createAdminClient();
  // Use rpc for atomic increment; fall back to select+update
  const { error } = await admin.rpc("increment_builds_used", {
    p_user_id: userId,
  });
  if (error) {
    // Fallback: read then write
    const sub = await getUserSubscription(userId);
    await upsertSubscription(userId, { buildsUsed: sub.buildsUsed + 1 });
  }
}

// ─────────────────────────────────────────────
//  Row mapper
// ─────────────────────────────────────────────

function mapRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    description: row.description as string,
    status: row.status as Project["status"],
    blueprint: (row.blueprint as AppBlueprint) ?? null,
    requirements: (row.requirements as Requirement[]) ?? [],
    generatedFiles: (row.generated_files as GeneratedFile[]) ?? [],
    githubRepoUrl: (row.github_repo_url as string) ?? null,
    previewUrl: (row.preview_url as string) ?? null,
    deploymentUrl: (row.deployment_url as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
