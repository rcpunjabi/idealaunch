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
