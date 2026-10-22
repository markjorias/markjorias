import type { GitHubRepo, Project } from "./types";

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

type FetchReposOptions = {
  user?: string;
  token?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
};

export async function fetchPublicRepos(opts: FetchReposOptions = {}): Promise<GitHubRepo[]> {
  const {
    user = "markjorias",
    token = process.env.GITHUB_TOKEN,
    baseUrl = process.env.GITHUB_API_URL ?? "https://api.github.com",
    fetchImpl = fetch,
  } = opts;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const init: RequestInit & { next?: { revalidate: number } } = { headers, next: { revalidate: 3600 } };
  const res = await fetchImpl(`${baseUrl}/users/${user}/repos?type=owner&per_page=100`, init);
  if (!res.ok) {
    throw new GitHubError(`GitHub responded ${res.status} for ${user}'s repos`, res.status);
  }
  return (await res.json()) as GitHubRepo[];
}

export function selectPortfolioRepos(repos: GitHubRepo[]): Project[] {
  return repos
    .filter((r) => !r.private && !r.archived && r.topics.includes("portfolio"))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .map((r) => ({
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      language: r.language,
      topics: r.topics.filter((t) => t !== "portfolio"),
      repoUrl: r.html_url,
      demoUrl: r.homepage || null,
      pushedAt: r.pushed_at,
    }));
}
