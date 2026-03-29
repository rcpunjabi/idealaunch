// ─────────────────────────────────────────────
//  E2B — sandboxed code preview
//  https://e2b.dev
// ─────────────────────────────────────────────

const E2B_API = "https://api.e2b.dev";
const E2B_API_KEY = process.env.E2B_API_KEY!;

export interface SandboxPreview {
  sandboxId: string;
  previewUrl: string;
}

// ─────────────────────────────────────────────
//  Spin up a sandbox with the generated Next.js files
//  and return a live preview URL
// ─────────────────────────────────────────────

export async function createPreviewSandbox(
  files: { path: string; content: string }[]
): Promise<SandboxPreview> {
  // Create a new sandbox using the Next.js template
  const createRes = await fetch(`${E2B_API}/sandboxes`, {
    method: "POST",
    headers: {
      "X-API-Key": E2B_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      templateID: "nextjs",   // E2B Next.js template
      timeout: 300,           // 5 minute timeout
    }),
  });

  if (!createRes.ok) {
    throw new Error(`E2B sandbox creation failed: ${createRes.status}`);
  }

  const { sandboxID } = await createRes.json();

  // Write files to the sandbox
  await writeFilesToSandbox(sandboxID, files);

  // Install dependencies and start the dev server
  await runInSandbox(sandboxID, "npm install && npm run dev &");

  // E2B exposes the preview URL at a known pattern
  const previewUrl = `https://${sandboxID}-3000.e2b.dev`;

  return { sandboxId: sandboxID, previewUrl };
}

// ─────────────────────────────────────────────
//  Write files into a running sandbox
// ─────────────────────────────────────────────

async function writeFilesToSandbox(
  sandboxId: string,
  files: { path: string; content: string }[]
): Promise<void> {
  for (const file of files) {
    await fetch(`${E2B_API}/sandboxes/${sandboxId}/files`, {
      method: "POST",
      headers: {
        "X-API-Key": E2B_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: `/app/${file.path}`,
        content: Buffer.from(file.content).toString("base64"),
      }),
    });
  }
}

// ─────────────────────────────────────────────
//  Run a command inside a sandbox
// ─────────────────────────────────────────────

async function runInSandbox(sandboxId: string, command: string): Promise<void> {
  await fetch(`${E2B_API}/sandboxes/${sandboxId}/process`, {
    method: "POST",
    headers: {
      "X-API-Key": E2B_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cmd: command, cwd: "/app" }),
  });
}

// ─────────────────────────────────────────────
//  Kill a sandbox when done
// ─────────────────────────────────────────────

export async function killSandbox(sandboxId: string): Promise<void> {
  await fetch(`${E2B_API}/sandboxes/${sandboxId}`, {
    method: "DELETE",
    headers: { "X-API-Key": E2B_API_KEY },
  });
}
