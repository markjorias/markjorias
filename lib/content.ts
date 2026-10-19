import fs from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";

export class ContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentError";
  }
}

export function contentDir(): string {
  const override = process.env.PORTFOLIO_CONTENT_DIR;
  return override ? path.resolve(process.cwd(), override) : path.join(process.cwd(), "content");
}

export function relativePath(file: string): string {
  return path.relative(process.cwd(), file);
}

/** Turns zod issues into a ContentError naming the file and the first bad field. */
export function contentErrorFrom(file: string, error: z.ZodError): ContentError {
  const issue = error.issues[0];
  return new ContentError(`${relativePath(file)}: ${issue.path.join(".")} ${issue.message}`);
}

export async function readJsonContent<T>(file: string, schema: z.ZodType<T>): Promise<T> {
  const raw = await fs.readFile(file, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new ContentError(`${relativePath(file)}: invalid JSON (${(err as Error).message})`);
  }
  const result = schema.safeParse(data);
  if (!result.success) throw contentErrorFrom(file, result.error);
  return result.data;
}
