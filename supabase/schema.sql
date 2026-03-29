-- ─────────────────────────────────────────────
--  IdeaLaunch — Supabase Schema
--  Run this in the Supabase SQL Editor to set up your database
-- ─────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
--  Projects
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         TEXT NOT NULL,                    -- Clerk user ID
  name            TEXT NOT NULL DEFAULT 'My App',
  description     TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'intake'
                  CHECK (status IN (
                    'intake','requirements','generating',
                    'preview','deploying','live','error'
                  )),
  blueprint       JSONB,
  requirements    JSONB DEFAULT '[]'::jsonb,
  generated_files JSONB DEFAULT '[]'::jsonb,
  github_repo_url TEXT,
  preview_url     TEXT,
  deployment_url  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security — users can only see their own projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own projects"
  ON projects FOR ALL
  USING (auth.uid()::text = user_id);

-- ─────────────────────────────────────────────
--  Messages (conversation history per project)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access messages for their projects"
  ON messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = messages.project_id
      AND p.user_id = auth.uid()::text
    )
  );

-- ─────────────────────────────────────────────
--  Indexes
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);

-- ─────────────────────────────────────────────
--  Auto-update updated_at trigger
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
