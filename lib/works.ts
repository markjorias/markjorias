import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { loadCaseStudies } from "./case-studies";
import { fetchPublicRepos, selectPortfolioRepos } from "./github";
import type { CaseStudy, GitHubRepo, Works } from "./types";

type WorksDeps = {
  fetchRepos?: () => Promise<GitHubRepo[]>;
  loadStudies?: () => Promise<CaseStudy[]>;
  isBuildPhase?: boolean;
};

export async function getWorks(deps: WorksDeps = {}): Promise<Works> {
  const {
    fetchRepos = () => fetchPublicRepos(),
    loadStudies = () => loadCaseStudies(),
    isBuildPhase = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
  } = deps;

  // Content errors always surface, so load studies before deciding how to handle GitHub.
  const [studies, fetched] = await Promise.all([loadStudies(), fetchRepos().then(
    (repos) => ({ ok: true as const, repos }),
    (error: unknown) => ({ ok: false as const, error }),
  )]);

  if (!fetched.ok) {
    // At runtime, rethrowing makes ISR keep serving the last good page.
    if (!isBuildPhase) throw fetched.error;
    console.warn("GitHub repos could not be loaded during the build:", fetched.error);
    return { status: "unavailable" };
  }

  const publicRepos = new Set(
    fetched.repos.filter((r) => !r.private && !r.archived).map((r) => r.full_name.toLowerCase()),
  );
  const featured = studies.filter((s) => publicRepos.has(s.repo.toLowerCase()));
  const featuredRepos = new Set(featured.map((s) => s.repo.toLowerCase()));
  const projects = selectPortfolioRepos(fetched.repos).filter((p) => !featuredRepos.has(p.fullName.toLowerCase()));

  return { status: "ok", featured, projects };
}

/** Featured studies are the only ones reachable by URL, so a private-repo study never renders. */
export async function getFeaturedStudy(slug: string): Promise<CaseStudy | null> {
  const works = await getWorks();
  if (works.status !== "ok") return null;
  return works.featured.find((s) => s.slug === slug) ?? null;
}

export async function featuredStudyParams(): Promise<{ slug: string }[]> {
  const works = await getWorks();
  return works.status === "ok" ? works.featured.map((s) => ({ slug: s.slug })) : [];
}
