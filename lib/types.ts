export type SiteConfig = {
  name: string;
  fullName: string;
  role: string;
  intro: string;
  email: string;
  links: { github: string; linkedin: string };
  stack: { code: string[]; design: string[] };
};

export type ExperienceEntry = { title: string; org: string; orgUrl?: string; period?: string; summary?: string };

export type GitHubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  html_url: string;
  homepage: string | null;
  private: boolean;
  archived: boolean;
  fork: boolean;
  pushed_at: string;
};

export type Project = {
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  topics: string[];
  repoUrl: string;
  demoUrl: string | null;
  pushedAt: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  repo: string; // "owner/name"
  demoUrl: string | null;
  role: string;
  cover: string | null;
  order: number;
  body: string;
};

export type Works =
  | { status: "ok"; featured: CaseStudy[]; projects: Project[] }
  | { status: "unavailable" };
