import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadCaseStudies } from "@/lib/case-studies";

let tmp: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-work-"));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
  vi.restoreAllMocks();
});

function writeStudy(name: string, front: Record<string, string | number>) {
  fs.mkdirSync(path.join(tmp, "work"), { recursive: true });
  const yaml = Object.entries(front).map(([k, v]) => `${k}: ${v}`).join("\n");
  fs.writeFileSync(path.join(tmp, "work", name), `---\n${yaml}\n---\n\nBody.\n`);
}

const valid = { title: "T", summary: "S", repo: "markjorias/PyLex", role: "Solo" };

test("loads studies sorted by order, skipping _drafts", async () => {
  const s = await loadCaseStudies("tests/fixtures/content");
  expect(s.map((x) => x.slug)).toEqual(["pylex", "klaro"]);
  expect(s[0]).toMatchObject({ repo: "markjorias/PyLex", demoUrl: "https://pylex-flex.vercel.app", cover: null });
  expect(s[0].body).toContain("## What I built");
});

test("empty or missing work dir gives []", async () => {
  expect(await loadCaseStudies(tmp)).toEqual([]);
  fs.mkdirSync(path.join(tmp, "work"));
  expect(await loadCaseStudies(tmp)).toEqual([]);
});

test("bad repo field names file and field", async () => {
  writeStudy("bad.md", { ...valid, repo: "PyLex", order: 1 });
  await expect(loadCaseStudies(tmp)).rejects.toThrow(/work\/bad\.md.*repo/);
});

test("caps at three and warns", async () => {
  ["a", "b", "c", "d"].forEach((slug, i) => writeStudy(`${slug}.md`, { ...valid, order: i + 1 }));
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  expect((await loadCaseStudies(tmp)).map((x) => x.slug)).toEqual(["a", "b", "c"]);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining("d"));
});
