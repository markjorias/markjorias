import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { ContentError, contentDir, contentErrorFrom, relativePath } from "./content";
import type { CaseStudy } from "./types";

const MAX_FEATURED = 3;

const frontMatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'must look like "owner/name"'),
  role: z.string().min(1),
  order: z.number().int(),
  demo: z.url().optional(),
  cover: z.string().min(1).optional(),
});

async function listStudyFiles(workDir: string): Promise<string[]> {
  try {
    const names = await fs.readdir(workDir);
    return names.filter((n) => n.endsWith(".md") && !n.startsWith("_") && n !== "README.md");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function readStudy(file: string): Promise<CaseStudy> {
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(await fs.readFile(file, "utf8"));
  } catch (err) {
    if (err instanceof Error && err.name === "YAMLException") {
      throw new ContentError(`${relativePath(file)}: invalid front matter (${err.message})`);
    }
    throw err;
  }
  const result = frontMatterSchema.safeParse(parsed.data);
  if (!result.success) throw contentErrorFrom(file, result.error);
  const fm = result.data;
  return {
    slug: path.basename(file, ".md"),
    title: fm.title,
    summary: fm.summary,
    repo: fm.repo,
    demoUrl: fm.demo ?? null,
    role: fm.role,
    cover: fm.cover ?? null,
    order: fm.order,
    body: parsed.content.trim(),
  };
}

export async function loadCaseStudies(dir: string = contentDir()): Promise<CaseStudy[]> {
  const workDir = path.join(dir, "work");
  const files = await listStudyFiles(workDir);
  const studies = await Promise.all(files.map((f) => readStudy(path.join(workDir, f))));
  studies.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  if (studies.length > MAX_FEATURED) {
    const dropped = studies.slice(MAX_FEATURED).map((s) => s.slug);
    console.warn(`Only ${MAX_FEATURED} featured case studies are shown. Not shown: ${dropped.join(", ")}`);
  }
  return studies.slice(0, MAX_FEATURED);
}
