import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { generateRequirements } from "@/lib/claude";
import { getProject, updateProject } from "@/lib/supabase";
import type { Requirement } from "@/types";

// POST /api/requirements — generate requirements from blueprint
export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await req.json();
  const project = await getProject(projectId);

  if (!project || project.userId !== userId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (!project.blueprint) {
    return NextResponse.json({ error: "Blueprint not ready" }, { status: 400 });
  }

  try {
    const requirements = await generateRequirements(project.blueprint);
    await updateProject(projectId, { requirements });

    return NextResponse.json({ requirements });
  } catch (err) {
    console.error("[requirements]", err);
    return NextResponse.json({ error: "Requirements generation failed" }, { status: 500 });
  }
}

// PATCH /api/requirements — save updated approvals
export async function PATCH(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, requirements }: { projectId: string; requirements: Requirement[] } =
    await req.json();

  const project = await getProject(projectId);
  if (!project || project.userId !== userId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await updateProject(projectId, { requirements, status: "generating" });
  return NextResponse.json({ ok: true });
}
