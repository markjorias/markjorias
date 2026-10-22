import fs from "node:fs";
import { loadCaseStudies } from "@/lib/case-studies";
import type { GitHubRepo } from "@/lib/types";
import { getFeaturedStudy, getWorks } from "@/lib/works";

const fixtureRepos: GitHubRepo[] = JSON.parse(fs.readFileSync("tests/fixtures/github-repos.json", "utf8"));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

test("demo works load without GitHub or content files and contain no live project links", async () => {
  const unavailable = async () => { throw new Error("Real data is unavailable"); };
  const works = await getWorks({ demoMode: true, fetchRepos: unavailable, loadStudies: unavailable });

  expect(works.status).toBe("ok");
  if (works.status !== "ok") throw new Error("Demo works should be available");
  expect(works.isDemo).toBe(true);
  expect(works.featured).toHaveLength(1);
  expect(works.projects).toHaveLength(3);
  for (const study of works.featured) {
    expect(study.isDemo).toBe(true);
    expect(study.repo).toBe("");
    expect(study.demoUrl).toBeNull();
    expect(study.cover).toBeNull();
    expect(study.body).toMatch(/fictional|hypothetical/i);
  }
  for (const project of works.projects) {
    expect(project.repoUrl).toBe("");
    expect(project.demoUrl).toBeNull();
  }
});

test("disabling demo mode preserves public portfolio filtering and featured deduplication", async () => {
  vi.stubEnv("PORTFOLIO_DEMO", "1");
  const works = await getWorks({
    demoMode: false,
    fetchRepos: async () => fixtureRepos,
    loadStudies: () => loadCaseStudies("tests/fixtures/content"),
  });

  expect(works.status).toBe("ok");
  if (works.status !== "ok") throw new Error("Fixture works should be available");
  expect(works.isDemo).not.toBe(true);
  expect(works.featured.map((study) => study.slug)).toEqual(["pylex"]);
  expect(works.projects.map((project) => project.name)).toEqual([
    "ecoUsapan",
    "bare-tagged",
    "a-very-long-repository-name-that-might-overflow-on-small-phones",
  ]);
});

test("the environment flag makes the sample case study available without a network request", async () => {
  vi.stubEnv("PORTFOLIO_DEMO", "1");
  vi.stubGlobal("fetch", async () => { throw new Error("Network is unavailable"); });

  try {
    const study = await getFeaturedStudy("campus-connect");
    expect(study).toMatchObject({ slug: "campus-connect", isDemo: true, cover: null, demoUrl: null });
    expect(study?.body).toMatch(/fictional|hypothetical/i);
    expect(await getFeaturedStudy("missing-study")).toBeNull();
  } finally {
    vi.unstubAllGlobals();
  }
});
