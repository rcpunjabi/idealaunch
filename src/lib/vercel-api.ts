// ─────────────────────────────────────────────
//  Vercel API integration — deploy from GitHub
// ─────────────────────────────────────────────

const VERCEL_API = "https://api.vercel.com";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const TEAM_ID = process.env.VERCEL_TEAM_ID;

function headers() {
  return {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function teamQuery() {
  return TEAM_ID ? `?teamId=${TEAM_ID}` : "";
}

export interface VercelDeployment {
  id: string;
  url: string;
  state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED";
}

// ─────────────────────────────────────────────
//  Create a Vercel project linked to a GitHub repo
// ─────────────────────────────────────────────

export async function createVercelProject(
  projectName: string,
  githubRepoFullName: string, // e.g. "myorg/my-repo"
  envVars?: Record<string, string>
): Promise<string> {
  const body: Record<string, unknown> = {
    name: projectName,
    framework: "nextjs",
    gitRepository: {
      type: "github",
      repo: githubRepoFullName,
    },
  };

  const res = await fetch(`${VERCEL_API}/v9/projects${teamQuery()}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Vercel project creation failed: ${JSON.stringify(err)}`);
  }

  const project = await res.json();

  // Inject environment variables if provided
  if (envVars && Object.keys(envVars).length > 0) {
    await addEnvVars(project.id, envVars);
  }

  return project.id;
}

// ─────────────────────────────────────────────
//  Trigger a deployment
// ─────────────────────────────────────────────

export async function triggerDeployment(
  projectId: string,
  githubRepoFullName: string
): Promise<VercelDeployment> {
  const res = await fetch(`${VERCEL_API}/v13/deployments${teamQuery()}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      name: projectId,
      gitSource: {
        type: "github",
        repoId: githubRepoFullName,
        ref: "main",
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Vercel deployment failed: ${JSON.stringify(err)}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────
//  Poll deployment status
// ─────────────────────────────────────────────

export async function waitForDeployment(
  deploymentId: string,
  maxWaitMs = 120_000
): Promise<VercelDeployment> {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(
      `${VERCEL_API}/v13/deployments/${deploymentId}${teamQuery()}`,
      { headers: headers() }
    );
    const deployment: VercelDeployment = await res.json();

    if (deployment.state === "READY" || deployment.state === "ERROR") {
      return deployment;
    }

    await new Promise((r) => setTimeout(r, 3000));
  }

  throw new Error("Deployment timed out");
}

// ─────────────────────────────────────────────
//  Add environment variables to a project
// ─────────────────────────────────────────────

async function addEnvVars(
  projectId: string,
  vars: Record<string, string>
): Promise<void> {
  const envPayload = Object.entries(vars).map(([key, value]) => ({
    key,
    value,
    target: ["production", "preview", "development"],
    type: "plain",
  }));

  await fetch(
    `${VERCEL_API}/v9/projects/${projectId}/env${teamQuery()}`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(envPayload),
    }
  );
}
