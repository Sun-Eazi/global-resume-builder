-- ============================================================
-- GLOBAL RESUME BUILDER — DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For search

-- ============================================================
-- TABLE: profiles (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: templates
-- ============================================================
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,  -- e.g. 'modern', 'minimal', 'professional'
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'general',
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed templates
INSERT INTO public.templates (id, name, description, category, is_premium) VALUES
  ('modern', 'Modern', 'Clean, contemporary design with accent colors and bold typography', 'design', FALSE),
  ('minimal', 'Minimal', 'Simple, distraction-free layout focused on content clarity', 'design', FALSE),
  ('professional', 'Professional', 'Traditional corporate format trusted by Fortune 500 recruiters', 'corporate', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TABLE: resumes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Resume',
  slug TEXT UNIQUE,
  template_id TEXT REFERENCES public.templates(id) DEFAULT 'modern',
  is_public BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: personal_info
-- ============================================================
CREATE TABLE IF NOT EXISTS public.personal_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  linkedin TEXT,
  github TEXT,
  summary TEXT,
  job_title TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: resume_sections
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resume_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('education', 'experience', 'skills', 'projects', 'certifications', 'languages', 'custom')),
  title TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: section_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.section_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_id UUID REFERENCES public.resume_sections(id) ON DELETE CASCADE NOT NULL,
  position INTEGER DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_slug ON public.resumes(slug);
CREATE INDEX IF NOT EXISTS idx_resume_sections_resume_id ON public.resume_sections(resume_id);
CREATE INDEX IF NOT EXISTS idx_section_items_section_id ON public.section_items(section_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- ---- Profiles Policies ----
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by all"
  ON public.profiles FOR SELECT USING (true);

-- ---- Templates Policies (public read) ----
CREATE POLICY "Templates are readable by all"
  ON public.templates FOR SELECT USING (is_active = true);

-- ---- Resumes Policies ----
CREATE POLICY "Users can view their own resumes"
  ON public.resumes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public resumes are viewable by all"
  ON public.resumes FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create their own resumes"
  ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON public.resumes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- ---- Personal Info Policies ----
CREATE POLICY "Users can manage their personal info"
  ON public.personal_info FOR ALL USING (
    EXISTS (SELECT 1 FROM public.resumes WHERE id = resume_id AND user_id = auth.uid())
  );

CREATE POLICY "Public personal info viewable via public resumes"
  ON public.personal_info FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.resumes WHERE id = resume_id AND is_public = true)
  );

-- ---- Resume Sections Policies ----
CREATE POLICY "Users can manage their resume sections"
  ON public.resume_sections FOR ALL USING (
    EXISTS (SELECT 1 FROM public.resumes WHERE id = resume_id AND user_id = auth.uid())
  );

CREATE POLICY "Public sections viewable via public resumes"
  ON public.resume_sections FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.resumes WHERE id = resume_id AND is_public = true)
  );

-- ---- Section Items Policies ----
CREATE POLICY "Users can manage their section items"
  ON public.section_items FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.resume_sections rs
      JOIN public.resumes r ON r.id = rs.resume_id
      WHERE rs.id = section_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Public section items viewable via public resumes"
  ON public.section_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.resume_sections rs
      JOIN public.resumes r ON r.id = rs.resume_id
      WHERE rs.id = section_id AND r.is_public = true
    )
  );

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON public.personal_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate unique slug for resume
CREATE OR REPLACE FUNCTION generate_resume_slug(title TEXT, user_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(TRIM(title), '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
  base_slug := SUBSTRING(base_slug, 1, 50);
  final_slug := base_slug || '-' || SUBSTRING(user_id::TEXT, 1, 8);
  
  WHILE EXISTS (SELECT 1 FROM public.resumes WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || SUBSTRING(user_id::TEXT, 1, 8) || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ language 'plpgsql';
