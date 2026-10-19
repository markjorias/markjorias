import fs from "node:fs";
import { fetchPublicRepos, selectPortfolioRepos } from "@/lib/github";
import type { GitHubRepo } from "@/lib/types";

const repos: GitHubRepo[] = JSON.parse(fs.readFileSync("tests/fixtures/github-repos.json", "utf8"));

test("keeps only public, unarchived, portfolio-tagged repos, newest push first", () => {
  expect(selectPortfolioRepos(repos).map((p) => p.name)).toEqual(
    ["PyLex", "ecoUsapan", "bare-tagged", "a-very-long-repository-name-that-might-overflow-on-small-phones"]); // by pushed_at in fixture
});

test("strips the portfolio topic and normalises empty homepage", () => {
  const bare = selectPortfolioRepos(repos).find((p) => p.name === "bare-tagged")!;
  expect(bare.topics).not.toContain("portfolio");
  expect(bare.demoUrl).toBeNull();
  expect(bare.description).toBeNull();
});

test("sends auth header only when a token is set", async () => {
  const calls: RequestInit[] = [];
  const fetchImpl = async (_u: unknown, init?: RequestInit) => (calls.push(init!), new Response("[]"));
  await fetchPublicRepos({ token: "t", fetchImpl: fetchImpl as typeof fetch, baseUrl: "http://x" });
  await fetchPublicRepos({ token: "", fetchImpl: fetchImpl as typeof fetch, baseUrl: "http://x" });
  expect(new Headers(calls[0].headers).get("authorization")).toBe("Bearer t");
  expect(new Headers(calls[1].headers).get("authorization")).toBeNull();
});

test("non-2xx throws GitHubError with status", async () => {
  const fetchImpl = async () => new Response("rate limited", { status: 403 });
  await expect(fetchPublicRepos({ fetchImpl, baseUrl: "http://x" })).rejects.toMatchObject({ status: 403 });
});
