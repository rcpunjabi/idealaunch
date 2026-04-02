import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { sendIntakeMessage } from "@/lib/claude";
import {
  createProject,
  getProject,
  saveMessage,
  getMessages,
  updateProject,
  getUserSubscription,
  incrementBuildsUsed,
} from "@/lib/supabase";
import { PLAN_LIMITS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, message } = await req.json();

  try {
    // ── Rate limiting ────────────────────────────────────────────────
    // Only check limits when starting a NEW project (no projectId yet)
    if (!projectId) {
      const sub = await getUserSubscription(userId);
      const limit = PLAN_LIMITS[sub.plan];

      // For free tier: lifetime builds across all projects
      if (sub.plan === "free") {
        const { getProjectsByUser } = await import("@/lib/supabase");
        const allProjects = await getProjectsByUser(userId);
        if (allProjects.length >= limit) {
          return NextResponse.json(
            {
              error: "limit_reached",
              plan: sub.plan,
              message:
                "You've used your free build. Upgrade to Starter to build up to 5 apps per month.",
            },
            { status: 402 }
          );
        }
      } else {
        // Paid tiers: builds in current billing period
        if (sub.buildsUsed >= limit) {
          return NextResponse.json(
            {
              error: "limit_reached",
              plan: sub.plan,
              message:
                sub.plan === "starter"
                  ? `You've used all ${limit} builds this month. Upgrade to Pro for 30 builds/month.`
                  : `You've used all ${limit} builds this month. Contact us if you need more.`,
            },
            { status: 402 }
          );
        }
      }
    }

    // ── Get or create the project ────────────────────────────────────
    let project = projectId ? await getProject(projectId) : null;
    const isNewProject = !project;

    if (!project) {
      project = await createProject(userId, "My App", message.slice(0, 60));
    }

    // Get conversation history from DB
    const history = await getMessages(project.id);
    const conversationHistory = history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content as string,
    }));

    // Save the user message
    await saveMessage(project.id, "user", message);

    // Get Claude's response
    const response = await sendIntakeMessage(conversationHistory, message);

    // Save Claude's response
    await saveMessage(project.id, "assistant", response.message);

    // If intake is complete, save the blueprint and advance status
    if (response.isComplete && response.blueprint) {
      await updateProject(project.id, {
        blueprint: response.blueprint,
        name: response.blueprint.appName,
        status: "requirements",
      });

      // Increment build counter when a project is fully spec'd
      await incrementBuildsUsed(userId);
    }

    return NextResponse.json({
      projectId: project.id,
      message: response.message,
      isComplete: response.isComplete,
      blueprint: response.blueprint ?? null,
      isNewProject,
    });
  } catch (err) {
    console.error("[intake]", err);
    return NextResponse.json({ error: "Intake failed" }, { status: 500 });
  }
}
