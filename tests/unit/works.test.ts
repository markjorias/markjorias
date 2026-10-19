import fs from "node:fs";
import { loadCaseStudies } from "@/lib/case-studies";
import { ContentError } from "@/lib/content";
import { GitHubError } from "@/lib/github";
import type { GitHubRepo } from "@/lib/types";
import { getWorks } from "@/lib/works";

const fixtureRepos: GitHubRepo[] = JSON.parse(fs.readFileSync("tests/fixtures/github-repos.json", "utf8"));
const repos = () => Promise.resolve(fixtureRepos);
const studies = () => loadCaseStudies("tests/fixtures/content");

test("featured only for public repos; featured repo not duplicated in projects", async () => {
  const w = await getWorks({ fetchRepos: repos, loadStudies: studies, isBuildPhase: false });
  if (w.status !== "ok") throw new Error();
  expect(w.featured.map((s) => s.slug)).toEqual(["pylex"]);           // klaro (private) hidden
  expect(w.projects.map((p) => p.name)).not.toContain("PyLex");
  expect(w.projects.map((p) => p.name)).toContain("ecoUsapan");
});

test("GitHub failure during build → unavailable", async () => {
  const fail = () => Promise.reject(new GitHubError("down", 503));
  expect(await getWorks({ fetchRepos: fail, loadStudies: studies, isBuildPhase: true })).toEqual({ status: "unavailable" });
});

test("GitHub failure at runtime rethrows (ISR keeps last good page)", async () => {
  const fail = () => Promise.reject(new GitHubError("down", 503));
  await expect(getWorks({ fetchRepos: fail, loadStudies: studies, isBuildPhase: false })).rejects.toThrow("down");
});

test("content errors are never swallowed, even at build", async () => {
  const bad = () => Promise.reject(new ContentError("content/work/x.md: repo invalid"));
  await expect(getWorks({ fetchRepos: repos, loadStudies: bad, isBuildPhase: true })).rejects.toThrow(/x\.md/);
});
