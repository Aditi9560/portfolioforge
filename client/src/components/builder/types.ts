export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Cloud & DevOps'
  | 'Tools'
  | 'Other';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0-100
}

export interface Project {
  id: string;
  title: string;
  description: string;
  live_url: string;
  github_url: string;
  tech_stack: string[];
  image_url: string;
  featured: boolean;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  from_month: string;
  from_year: string;
  to_month: string;
  to_year: string;
  current: boolean;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  grad_year: string;
  description: string;
}

export interface CertEntry {
  id: string;
  name: string;
  issuer: string;
  year: string;
  cred_url: string;
}

// The fields managed by RHF useForm
export interface AboutValues {
  name: string;
  title: string;
  phone: string;
  location: string;
  bio: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  website_url: string;
  photo_url: string;
  theme: 'dark' | 'light';
  accent_color: string;
}

// Resume style / PDF options
export type TemplateChoice  = 'Classic' | 'Modern' | 'Sidebar';
export type PaperSizeChoice = 'A4' | 'Letter';

export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  Frontend:        'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Backend:         'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Database:        'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Cloud & DevOps':'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Tools:           'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  Other:           'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

export const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

export const YEARS_PAST = Array.from({ length: 11 }, (_, i) => String(2015 + i)); // 2015-2025
export const YEARS_FUTURE = Array.from({ length: 16 }, (_, i) => String(2015 + i)); // 2015-2030
