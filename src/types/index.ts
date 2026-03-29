// ─────────────────────────────────────────────
//  IdeaLaunch — Core Types
// ─────────────────────────────────────────────

export type ProjectStatus =
  | "intake"
  | "requirements"
  | "generating"
  | "preview"
  | "deploying"
  | "live"
  | "error";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface AppBlueprint {
  appName: string;
  purpose: string;
  targetUser: string;
  coreFeatures: string[];
  tone: string;
  constraints: string[];
  techStack?: string;
  pages: string[];
  dataModels: string[];
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  category: "feature" | "design" | "data" | "auth" | "integration";
  approved: boolean;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  blueprint: AppBlueprint | null;
  requirements: Requirement[];
  generatedFiles: GeneratedFile[];
  githubRepoUrl: string | null;
  previewUrl: string | null;
  deploymentUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IntakeResponse {
  message: string;
  isComplete: boolean;
  blueprint?: AppBlueprint;
}

export interface DeploymentResult {
  success: boolean;
  githubRepoUrl?: string;
  previewUrl?: string;
  deploymentUrl?: string;
  error?: string;
}

export interface PricingTier {
  name: string;
  price: number;
  priceId: string;
  features: string[];
  limit: string;
  cta: string;
  highlighted?: boolean;
}
