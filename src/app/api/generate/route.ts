import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { generateCode } from "@/lib/claude";
import { createPreviewSandbox } from "@/lib/e2b";
import { getProject, updateProject } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await req.json();
  const project = await getProject(projectId);

  if (!project || project.userId !== userId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (!project.blueprint || project.requirements.length === 0) {
    return NextResponse.json({ error: "Blueprint or requirements missing" }, { status: 400 });
  }

  try {
    // Update status to generating
    await updateProject(projectId, { status: "generating" });

    // Generate code via Claude
    const files = await generateCode(project.blueprint, project.requirements);

    // Save generated files
    await updateProject(projectId, {
      generated_files: files,
      status: "preview",
    });

    // Spin up E2B preview sandbox
    let previewUrl: string | null = null;
    try {
      const sandbox = await createPreviewSandbox(files);
      previewUrl = sandbox.previewUrl;
      await updateProject(projectId, { preview_url: previewUrl });
    } catch (e2bErr) {
      // Preview is a bonus — don't fail the whole flow
      console.warn("[e2b] Preview sandbox failed:", e2bErr);
    }

    return NextResponse.json({
      files,
      previewUrl,
      fileCount: files.length,
    });
  } catch (err) {
    console.error("[generate]", err);
    await updateProject(projectId, { status: "error" });
    return NextResponse.json({ error: "Code generation failed" }, { status: 500 });
  }
}
