// ============================================================
// GLOBAL TYPE DEFINITIONS
// ============================================================

// ---- User & Auth ----
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  username?: string;
  created_at: string;
  updated_at: string;
}

// ---- Resume Core ----
export type TemplateId = "modern" | "minimal" | "professional";

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  template_id: TemplateId;
  is_public: boolean;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  sections?: ResumeSection[];
  personal_info?: PersonalInfo;
}

// ---- Personal Info ----
export interface PersonalInfo {
  id: string;
  resume_id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  job_title?: string;
  avatar_url?: string;
}

// ---- Resume Sections ----
export type SectionType =
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "custom";

export interface ResumeSection {
  id: string;
  resume_id: string;
  type: SectionType;
  title: string;
  position: number;
  is_visible: boolean;
  items: ResumeSectionItem[];
}

export interface ResumeSectionItem {
  id: string;
  section_id: string;
  position: number;
  data: EducationItem | ExperienceItem | SkillsItem | ProjectItem | CertificationItem | LanguageItem | CustomItem;
}

// ---- Section Item Types ----
export interface EducationItem {
  institution: string;
  degree: string;
  field?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  description?: string;
  location?: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  location?: string;
  description?: string;
  highlights?: string[];
}

export interface SkillsItem {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category?: string;
}

export interface ProjectItem {
  name: string;
  description?: string;
  url?: string;
  github_url?: string;
  technologies?: string[];
  start_date?: string;
  end_date?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date?: string;
  expiry_date?: string;
  credential_id?: string;
  url?: string;
}

export interface LanguageItem {
  name: string;
  proficiency?: "elementary" | "limited_working" | "professional_working" | "full_professional" | "native";
}

export interface CustomItem {
  title?: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

// ---- Templates ----
export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  colors: string[];
  fonts: string;
  isPremium: boolean;
}

// ---- API Responses ----
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ---- Form State ----
export interface FormState {
  isLoading: boolean;
  error?: string;
  success?: string;
}

// ---- Resume Builder State ----
export interface BuilderState {
  resume: Resume | null;
  activeSection: string | null;
  isDirty: boolean;
  isSaving: boolean;
  previewMode: boolean;
  selectedTemplate: TemplateId;
}
