-- DevPrep schema — app_id isolated for multi-project reuse
-- Account: Vamsichiguruwada@gmail.com

-- Drop existing tables if re-running
DROP TABLE IF EXISTS recordings CASCADE;
DROP TABLE IF EXISTS questions CASCADE;

-- Questions (user-created per topic)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own questions" ON questions
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX ON questions(app_id, user_id, topic);

-- Recordings (linked to questions, cascades on question delete)
CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own recordings" ON recordings
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX ON recordings(app_id, user_id);
