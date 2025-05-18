
-- Create a table to cache LinkedIn trends data
CREATE TABLE IF NOT EXISTS public.linkedin_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trends JSONB NOT NULL,
  hashtags JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Allow public read access to linkedin_trends
ALTER TABLE public.linkedin_trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to linkedin_trends"
  ON public.linkedin_trends
  FOR SELECT
  USING (true);
  
CREATE POLICY "Allow service role to insert linkedin_trends"
  ON public.linkedin_trends
  FOR INSERT
  WITH CHECK (true);
