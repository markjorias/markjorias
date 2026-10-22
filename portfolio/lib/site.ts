import path from "node:path";
import { z } from "zod";
import { contentDir, readJsonContent } from "./content";
import type { SiteConfig } from "./types";

const siteSchema = z.object({
  name: z.string().min(1),
  fullName: z.string().min(1),
  role: z.string().min(1),
  intro: z.string().min(1),
  email: z.email(),
  links: z.object({ github: z.url(), linkedin: z.url() }),
  stack: z.object({ code: z.array(z.string()), design: z.array(z.string()) }),
});

export function loadSite(dir: string = contentDir()): Promise<SiteConfig> {
  return readJsonContent(path.join(dir, "site.json"), siteSchema);
}
