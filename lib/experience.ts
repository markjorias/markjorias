import path from "node:path";
import { z } from "zod";
import { contentDir, readJsonContent } from "./content";
import type { ExperienceEntry } from "./types";

const experienceSchema = z.array(
  z.object({
    title: z.string().min(1),
    org: z.string().min(1),
    orgUrl: z.url().optional(),
    period: z.string().optional(),
    summary: z.string().optional(),
  }),
);

export function loadExperience(dir: string = contentDir()): Promise<ExperienceEntry[]> {
  return readJsonContent(path.join(dir, "experience.json"), experienceSchema);
}
