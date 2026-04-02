import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createRepoAndPushFiles, sanitizeRepoName } from "@/lib/github";
import {
  createVercelProject,
  triggerDeployment,
  waitForDeployment,
} from "@/lib/vercel-api";
import { getProject, updateProject } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await req.json();
  const project = await getProject(projectId);

  if (!project || project.userId !== userId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (!project.generatedFiles || project.generatedFiles.length === 0) {
    return NextResponse.json({ error: "No generated files found" }, { status: 400 });
  }

  try {
    await updateProject(projectId, { status: "deploying" });

    const repoName = sanitizeRepoName(
      `idealanunch-${project.blueprint?.appName ?? project.name}-${projectId.slice(0, 6)}`
    );
    const githubOrg = process.env.GITHUB_ORG!;

    // Phase 4 — Create GitHub repo and push files
    const githubRepoUrl = await createRepoAndPushFiles(
      repoName,
      project.blueprint?.purpose ?? project.description,
      project.generatedFiles
    );

    await updateProject(projectId, { github_repo_url: githubRepoUrl });

    // Phase 5 — Create Vercel project and deploy
    const vercelProjectId = await createVercelProject(
      repoName,
      `${githubOrg}/${repoName}`,
      {
        // Inject minimal env vars the generated app needs
        NEXT_PUBLIC_APP_NAME: project.blueprint?.appName ?? project.name,
      }
    );

    const deployment = await triggerDeployment(
      vercelProjectId,
      `${githubOrg}/${repoName}`
    );

    const finalDeployment = await waitForDeployment(deployment.id);

    if (finalDeployment.state !== "READY") {
      throw new Error("Deployment ended in non-ready state: " + finalDeployment.state);
    }

    const deploymentUrl = `https://${finalDeployment.url}`;
    await updateProject(projectId, {
      deployment_url: deploymentUrl,
      status: "live",
    });

    return NextResponse.json({
      success: true,
      githubRepoUrl,
      deploymentUrl,
    });
  } catch (err) {
    console.error("[deploy]", err);
    await updateProject(projectId, { status: "error" });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Deployment failed" },
      { status: 500 }
    );
  }
}
