import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { sendIntakeMessage } from "@/lib/claude";
import {
  createProject,
  getProject,
  saveMessage,
  getMessages,
  updateProject,
} from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, message } = await req.json();

  try {
    // Get or create the project
    let project = projectId ? await getProject(projectId) : null;
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
    }

    return NextResponse.json({
      projectId: project.id,
      message: response.message,
      isComplete: response.isComplete,
      blueprint: response.blueprint ?? null,
    });
  } catch (err) {
    console.error("[intake]", err);
    return NextResponse.json({ error: "Intake failed" }, { status: 500 });
  }
}
