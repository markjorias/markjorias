# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Joseph Orias's recruiter-facing portfolio, a single-page Next.js site on Vercel in a drafting-vellum blueprint style. Its Works section fills itself from public GitHub repos tagged `portfolio`.

**Architecture:** A Next.js 16 App Router site at the root of the `markjorias` repo. `app/page.tsx` is a server component that loads every piece of data (content files, GitHub repos, the existence of `public/` files) and passes plain props to synchronous section components, so sections are unit-testable. GitHub data uses ISR (`revalidate = 3600`). If a refresh errors at runtime, Next keeps serving the last good page. An error during the build falls back to an "unavailable" state that links to GitHub. Featured case studies are Markdown files. Their detail view is an intercepted route (a modal over the home page with a shared-layout expand) plus a full page at the same URL for direct visits.

**Tech Stack:** Node 26, pnpm 12, Next.js 16.4.2, React 19.3.1, TypeScript 7.0.2, CSS Modules plus global CSS custom properties, `motion` 14.4.0 (only for the case-study expand), `gray-matter` 4.0.3, `react-markdown` 10.1.0, `zod` 4.6.7, Vitest 5.0.5 with jsdom 30.1.3 and Testing Library 16.3.3, Playwright 1.64.1.

**Spec:** `docs/superpowers/specs/2026-10-19-portfolio-site-design.md`

## Global Constraints

- Don't overwrite or modify `README.md` at the repo root. It renders on Joseph's GitHub profile. **Don't run `create-next-app`** here, because it writes its own README. Scaffold by hand (Task 1).
- Work on the `portfolio` branch. Never push, or create a Vercel project, without the user's explicit go-ahead in that moment (Task 11).
- Palette (exact): paper `#EDF1F2`, grid `#C8D6EC` at 48px cells, ink `#1C4596`, heading ink `#163A82`, secondary ink `#2D4F8F`. No `#75ff73` green anywhere. Light theme only.
- Type: Archivo Narrow (600) for headings and Archivo (400/500) for body, both through `next/font/google`.
- Motion: exactly one non-user-triggered animation, the hero intro line-draw (about 2s or less, once per page load). Text must be readable within about 0.6s. No scroll-triggered fade-ups. Under `prefers-reduced-motion: reduce`, all animation and transitions are off.
- Copy is sentence case. No all-caps labels. Buttons say what they do: "Email me", "Copy email" (becomes "Copied"), "Download resume".
- Only **public, non-archived** repos owned by `markjorias` appear, and only when tagged with the `portfolio` topic. A featured case study appears only if its `repo` is a public, non-archived `markjorias` repo.
- The GitHub token is optional, read from `process.env.GITHUB_TOKEN`, and only used as a `Authorization: Bearer` header.
- Content Joseph edits (`content/site.json`, `content/experience.json`, `content/work/*.md`, `public/resume.pdf`, `public/photo.jpg`) needs no component changes. Invalid content fails the build with an error naming the file and field.
- Responsive down to 360px wide with no horizontal page scroll. Keyboard focus is always visible.
- When writing Next.js-specific code, the implementer should load the `vercel:nextjs` skill for current Next 16 APIs (async `params`, intercepting routes, `next/og`).

## Review Focus

1. **GitHub fails or rate-limits.** At runtime the last good page keeps serving. During a build, Works shows "unavailable" with a GitHub link and is never blank. Tests are in Task 5.
2. **Repo fields that are null or empty.** A `null` description or language, or `homepage` set to `""` or `null`, renders cleanly: no "null" text and no empty demo link. Tests are in Tasks 3 and 8.
3. **A featured case study pointing at a private, missing or archived repo** (for example `klaro-dashboard`) never renders, which protects private work. Tests are in Tasks 4 and 5.
4. **Malformed content files** (bad JSON or a missing required field) fail with a message naming the file and field, not a stack trace from deep in a component. Tests are in Tasks 2 and 4.
5. **Phone width (360px) with a very long repo name or many topics** causes no horizontal page scroll. The test is in Task 10.

---

## File structure

```
package.json · pnpm-lock.yaml · tsconfig.json · next.config.ts · eslint.config.mjs
vitest.config.ts · vitest.setup.ts · playwright.config.ts · .gitignore (modify)
app/
  layout.tsx · globals.css · page.tsx · not-found.tsx · icon.svg · opengraph-image.tsx
  work/[slug]/page.tsx                 full-page case study (direct visits)
  @modal/default.tsx                   renders null
  @modal/(.)work/[slug]/page.tsx       intercepted modal over home
lib/
  types.ts         shared types (below)
  content.ts       contentDir(), ContentError, readJsonContent()
  site.ts          loadSite()
  experience.ts    loadExperience()
  public-file.ts   publicFileExists()
  github.ts        fetchPublicRepos(), selectPortfolioRepos(), GitHubError
  case-studies.ts  loadCaseStudies()
  works.ts         getWorks()
components/        each with a sibling *.module.css
  Header · ContactActions · Intro · IntroLines · PhotoFrame · Experience
  Works · ProjectCard · FeaturedCard · CaseStudyView · CaseStudyModal · Contact
content/
  site.json · experience.json · work/.gitkeep · README.md (Joseph's editing guide)
tests/
  unit/*.test.ts(x)
  fixtures/github-repos.json
  fixtures/content/{site.json, experience.json, work/pylex.md, work/_draft.md, work/klaro.md}
  e2e/mock-github.mjs · e2e/*.spec.ts
```

## Shared types (`lib/types.ts`, created in Task 2 and extended by later tasks)

```ts
export type SiteConfig = {
  name: string;            // "Joseph Orias"
  fullName: string;        // "Mark Joseph Orias"
  role: string;            // "Computer science student and designer"
  intro: string;
  email: string;
  links: { github: string; linkedin: string };
  stack: { code: string[]; design: string[] };
};
export type ExperienceEntry = { title: string; org: string; orgUrl?: string; period?: string; summary?: string };
export type GitHubRepo = {
  name: string; full_name: string; description: string | null; language: string | null;
  topics: string[]; html_url: string; homepage: string | null;
  private: boolean; archived: boolean; fork: boolean; pushed_at: string;
};
export type Project = {
  name: string; fullName: string; description: string | null; language: string | null;
  topics: string[]; repoUrl: string; demoUrl: string | null; pushedAt: string;
};
export type CaseStudy = {
  slug: string; title: string; summary: string; repo: string; // "owner/name"
  demoUrl: string | null; role: string; cover: string | null; order: number; body: string;
};
export type Works =
  | { status: "ok"; featured: CaseStudy[]; projects: Project[] }
  | { status: "unavailable" };
```

---

### Task 1: Scaffold Next.js, tooling, and the vellum paper

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `tests/unit/smoke.test.tsx`
- Modify: `.gitignore` (currently only `.superpowers/`)

**Interfaces:**
- Produces: the scripts `pnpm dev | build | start | test | e2e | lint | typecheck`; path alias `@/*` → repo root; CSS variables `--paper --grid --ink --ink-heading --ink-soft --font-display --font-body` in `app/globals.css`; `app/page.tsx` renders `<main>` with empty `<section id="intro">`, `#experience`, `#work`, `#contact` placeholders that later tasks fill.

- [ ] **Step 1: Write `package.json` by hand** (name `markjorias-portfolio`, `"private": true`, `"type": "module"`). Dependencies: `next@16.4.2 react@19.3.1 react-dom@19.3.1 motion@14.4.0 gray-matter@4.0.3 react-markdown@10.1.0 zod@4.6.7`. Dev dependencies: `typescript@7.0.2 @types/react@19.3.0 @types/react-dom@19.3.0 @types/node@26.6.5 vitest@5.0.5 @vitejs/plugin-react@6.1.2 jsdom@30.1.3 @testing-library/react@16.3.3 @testing-library/user-event@14.6.8 @testing-library/jest-dom@7.0.1 @playwright/test@1.64.1 eslint-config-next@16.4.2`, plus the `eslint` major that `eslint-config-next@16.4.2`'s peerDependencies accept. Scripts: `test` = `vitest run`, `e2e` = `playwright test`, `lint` = `eslint .`, `typecheck` = `tsc --noEmit`. Run `pnpm install`.
  - If `next build` rejects TypeScript 7, pin the newest 6.x and note it in the commit message.
- [ ] **Step 2: Add the config files.** `tsconfig.json` uses Next's standard App Router settings with `"paths": {"@/*": ["./*"]}` and excludes `.superpowers`. `vitest.config.ts` uses `@vitejs/plugin-react`, `environment: "jsdom"`, `include: ["tests/unit/**/*.test.{ts,tsx}"]`, `setupFiles: ["./vitest.setup.ts"]` (which imports `@testing-library/jest-dom/vitest`) and the same `@` alias. `eslint.config.mjs` uses the flat config from `eslint-config-next` and ignores `.next`, `.superpowers` and `playwright-report`.
- [ ] **Step 3: Append to `.gitignore`:** `node_modules/`, `.next/`, `out/`, `.vercel/`, `next-env.d.ts`, `.env*.local`, `test-results/`, `playwright-report/`.
- [ ] **Step 4: Write the failing smoke test** `tests/unit/smoke.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
test("home has the four sections in order", async () => {
  render(await Home());
  const ids = [...document.querySelectorAll("main > section")].map((s) => s.id);
  expect(ids).toEqual(["intro", "experience", "work", "contact"]);
});
```

- [ ] **Step 5:** Run `pnpm test`. Expected: FAIL (cannot resolve `@/app/page`).
- [ ] **Step 6: Implement.** `app/page.tsx` is `export default async function Home()` returning the four empty sections. `app/layout.tsx` loads `Archivo_Narrow({weight:"600"})` and `Archivo({weight:["400","500"]})` from `next/font/google` as CSS variables `--font-display` and `--font-body`, sets `<html lang="en">`, and sets `metadata.title` = "Joseph Orias, computer science student and designer" plus a description built from the spec intro. In `app/globals.css`, the `:root` tokens use the exact Global Constraints hexes. `body` has `background-color: var(--paper)` and the 48px grid drawn with two `linear-gradient` layers in `var(--grid)` (as in the chosen mockup). `color: var(--ink)`, `h1–h3` use `var(--font-display)` in `var(--ink-heading)`, `:focus-visible` gets a 2px `var(--ink)` outline with offset, and there's a global `@media (prefers-reduced-motion: reduce)` block that sets `animation: none !important; transition: none !important` on `*`.
- [ ] **Step 7:** Run `pnpm test && pnpm typecheck && pnpm build`. Expected: PASS, and the build succeeds.
- [ ] **Step 8:** Run `git status` and check that `README.md` is unmodified. Then commit: `git add -A && git commit -m "chore: scaffold Next.js portfolio site"`

---

### Task 2: Content loaders for site, experience, and public files

**Files:**
- Create: `lib/types.ts` (the shared types above), `lib/content.ts`, `lib/site.ts`, `lib/experience.ts`, `lib/public-file.ts`, `content/site.json`, `content/experience.json`, `tests/fixtures/content/site.json`, `tests/fixtures/content/experience.json`, `tests/unit/content.test.ts`

**Interfaces:**
- Produces:
  - `contentDir(): string`, which returns `process.env.PORTFOLIO_CONTENT_DIR` (resolved from cwd) or `<cwd>/content`
  - `class ContentError extends Error`, whose message starts with the path relative to cwd
  - `loadSite(dir?: string): Promise<SiteConfig>`
  - `loadExperience(dir?: string): Promise<ExperienceEntry[]>` (file order preserved)
  - `publicFileExists(relPath: string): boolean` (checks `<cwd>/public/<relPath>`)

- [ ] **Step 1: Write `content/site.json`** using the spec's real values: name "Joseph Orias", fullName "Mark Joseph Orias", role "Computer science student and designer", intro "I build web apps in Python and Flask, and I design the screens they run on.", email `oriasmjc@gmail.com`, links to github `https://github.com/markjorias` and linkedin `https://www.linkedin.com/in/mark-joseph-orias-142043388/`, stack.code `["Python","HTML","CSS","Java","Flask","MySQL","PostgreSQL","Supabase"]` and stack.design `["Figma","Photoshop","Illustrator","Premiere","After Effects"]`. Write `content/experience.json` with two entries: `{title:"Computer Science student", org:"Camarines Sur Polytechnic Colleges", orgUrl:"https://cspc.edu.ph/"}` and `{title:"Committee on Creatives", org:"JPCS – CSPC Chapter", orgUrl:"https://facebook.com/jpcscspc"}`. Copy both files into `tests/fixtures/content/`.
- [ ] **Step 2: Write the failing tests** in `tests/unit/content.test.ts`, using a temp dir (`fs.mkdtempSync`) for the bad cases:

```ts
test("loads the real site config", async () => {
  const s = await loadSite("tests/fixtures/content");
  expect(s.name).toBe("Joseph Orias");
  expect(s.email).toBe("oriasmjc@gmail.com");
});
test("experience keeps file order", async () => {
  const e = await loadExperience("tests/fixtures/content");
  expect(e.map((x) => x.org)).toEqual(["Camarines Sur Polytechnic Colleges", "JPCS – CSPC Chapter"]);
});
test("invalid JSON names the file", async () => {
  // write "{ nope" to <tmp>/experience.json
  await expect(loadExperience(tmp)).rejects.toThrow(/experience\.json/);
});
test("missing field names the file and field", async () => {
  // write [{"org":"X"}] to <tmp>/experience.json
  await expect(loadExperience(tmp)).rejects.toThrow(/experience\.json.*title/);
});
test("site email must be an email", async () => {
  // write site.json with "email":"nope"
  await expect(loadSite(tmp)).rejects.toThrow(/site\.json.*email/);
});
test("publicFileExists reflects public/", () => {
  expect(publicFileExists("definitely-not-here.pdf")).toBe(false);
});
```

- [ ] **Step 3:** Run `pnpm test tests/unit/content.test.ts`. Expected: FAIL (modules missing).
- [ ] **Step 4: Implement** the zod schemas and loaders. The shared helper `readJsonContent<T>(file, schema)` in `lib/content.ts` wraps both `JSON.parse` failures and zod issues in a `ContentError` with the message `` `${relPath}: ${issue.path.join(".")} ${issue.message}` ``. `dir` defaults to `contentDir()`.
- [ ] **Step 5:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 6:** Commit with `git commit -m "feat: content loaders for site and experience"`.

---

### Task 3: GitHub client and portfolio selection

**Files:**
- Create: `lib/github.ts`, `tests/fixtures/github-repos.json`, `tests/unit/github.test.ts`

**Interfaces:**
- Consumes: `GitHubRepo` and `Project` from `lib/types.ts`
- Produces:
  - `class GitHubError extends Error { status: number }`
  - `fetchPublicRepos(opts?: { user?: string; token?: string; baseUrl?: string; fetchImpl?: typeof fetch }): Promise<GitHubRepo[]>`. Defaults: user `"markjorias"`, token `process.env.GITHUB_TOKEN`, baseUrl `process.env.GITHUB_API_URL ?? "https://api.github.com"`. It calls `GET {baseUrl}/users/{user}/repos?type=owner&per_page=100` with headers `Accept: application/vnd.github+json` and `X-GitHub-Api-Version: 2022-11-28`, plus `Authorization: Bearer <token>` only when a token is set, and fetch option `next: { revalidate: 3600 }`. A non-2xx response throws `GitHubError`.
  - `selectPortfolioRepos(repos: GitHubRepo[]): Project[]` keeps `!private && !archived && topics.includes("portfolio")`, strips `"portfolio"` from topics, maps `homepage` `""` or `null` to `demoUrl: null`, and sorts by `pushed_at` descending.

- [ ] **Step 1: Write `tests/fixtures/github-repos.json`** with seven repos covering:
  - `ecoUsapan`: tagged, full fields, homepage `https://ecousapan.vercel.app`, pushed 2026-09-01
  - `PyLex`: tagged, homepage `https://pylex-flex.vercel.app`, pushed 2026-10-01
  - `bare-tagged`: tagged, `description: null`, `language: null`, `homepage: ""`
  - `fullshot`: untagged
  - `old-archived`: tagged, `archived: true`
  - `klaro-dashboard`: tagged, `private: true` (defensive)
  - `a-very-long-repository-name-that-might-overflow-on-small-phones`: tagged, with 12 topics
- [ ] **Step 2: Write the failing tests:**

```ts
const repos = JSON.parse(fs.readFileSync("tests/fixtures/github-repos.json", "utf8"));
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
  const fetchImpl = async (_u: any, init: any) => (calls.push(init), new Response("[]"));
  await fetchPublicRepos({ token: "t", fetchImpl, baseUrl: "http://x" });
  await fetchPublicRepos({ token: "", fetchImpl, baseUrl: "http://x" });
  expect(new Headers(calls[0].headers).get("authorization")).toBe("Bearer t");
  expect(new Headers(calls[1].headers).get("authorization")).toBeNull();
});
test("non-2xx throws GitHubError with status", async () => {
  const fetchImpl = async () => new Response("rate limited", { status: 403 });
  await expect(fetchPublicRepos({ fetchImpl, baseUrl: "http://x" })).rejects.toMatchObject({ status: 403 });
});
```

(Set the fixture `pushed_at` values so the expected order above holds.)
- [ ] **Step 3:** Run `pnpm test tests/unit/github.test.ts`. Expected: FAIL.
- [ ] **Step 4: Implement** `lib/github.ts` to the Interfaces above.
- [ ] **Step 5:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 6:** Commit with `git commit -m "feat: GitHub repo fetch and portfolio selection"`.

---

### Task 4: Case study loader

**Files:**
- Create: `lib/case-studies.ts`, `tests/fixtures/content/work/pylex.md`, `tests/fixtures/content/work/_draft.md`, `tests/fixtures/content/work/klaro.md`, `content/work/.gitkeep`, `tests/unit/case-studies.test.ts`

**Interfaces:**
- Consumes: `CaseStudy`, `ContentError`, `contentDir()`
- Produces: `loadCaseStudies(dir?: string): Promise<CaseStudy[]>`, which reads `<dir>/work/*.md` and skips files starting with `_` and `README.md`. `slug` is the filename without `.md`. Front matter fields: `title`, `summary`, `repo` (must match `/^[\w.-]+\/[\w.-]+$/`), `role`, `order` (integer) and optional `demo` and `cover`. `body` is the Markdown content. Results are sorted by `order` and capped at 3. If there are more than 3, it logs `console.warn` naming the dropped slugs.

- [ ] **Step 1: Write the fixtures.**
  - `pylex.md`: repo `markjorias/PyLex`, demo `https://pylex-flex.vercel.app`, order 1. The body has `## The problem`, `## What I built` and `## What I learned` sections, and an image `![Lexer output](/work/pylex/output.png)`.
  - `klaro.md`: repo `markjorias/klaro-dashboard`, order 2. It's valid but points at a private repo, which Task 5 must hide.
  - `_draft.md`: a valid file that must be ignored.
- [ ] **Step 2: Write the failing tests:**

```ts
test("loads studies sorted by order, skipping _drafts", async () => {
  const s = await loadCaseStudies("tests/fixtures/content");
  expect(s.map((x) => x.slug)).toEqual(["pylex", "klaro"]);
  expect(s[0]).toMatchObject({ repo: "markjorias/PyLex", demoUrl: "https://pylex-flex.vercel.app", cover: null });
  expect(s[0].body).toContain("## What I built");
});
test("empty or missing work dir gives []", async () => {
  expect(await loadCaseStudies(emptyTmpDir)).toEqual([]);
});
test("bad repo field names file and field", async () => {
  // <tmp>/work/bad.md with repo: "PyLex"
  await expect(loadCaseStudies(tmp)).rejects.toThrow(/work\/bad\.md.*repo/);
});
test("caps at three and warns", async () => {
  // <tmp>/work/{a,b,c,d}.md with orders 1..4
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  expect((await loadCaseStudies(tmp)).map((x) => x.slug)).toEqual(["a", "b", "c"]);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining("d"));
});
```

- [ ] **Step 3:** Run the tests. Expected: FAIL.
- [ ] **Step 4: Implement** with `gray-matter` and a zod schema, reusing the `ContentError` message format from Task 2.
- [ ] **Step 5:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 6:** Commit with `git commit -m "feat: featured case study loader"`.

---

### Task 5: `getWorks`, combining GitHub data and featured studies safely

**Files:**
- Create: `lib/works.ts`, `tests/unit/works.test.ts`

**Interfaces:**
- Consumes: `fetchPublicRepos`, `selectPortfolioRepos`, `loadCaseStudies`, `GitHubError`
- Produces: `getWorks(deps?: { fetchRepos?: () => Promise<GitHubRepo[]>; loadStudies?: () => Promise<CaseStudy[]>; isBuildPhase?: boolean }): Promise<Works>`. `isBuildPhase` defaults to `process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD` (from `next/constants`). Rules:
  - `featured` are studies whose `repo` matches, case-insensitively, the `full_name` of a repo in the fetched list that is `!private && !archived` (it doesn't need the `portfolio` tag).
  - `projects` are `selectPortfolioRepos(repos)` minus any repo already featured.
  - If fetching fails during the build phase, it returns `{ status: "unavailable" }`.
  - If fetching fails at runtime, it **rethrows**, so ISR keeps serving the last good page.
  - Content errors from `loadStudies` always propagate.

- [ ] **Step 1: Write the failing tests** (using the fixtures from Tasks 3 and 4):

```ts
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
```

- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement** `lib/works.ts`.
- [ ] **Step 4:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 5:** Commit with `git commit -m "feat: getWorks with build fallback and private-repo guard"`.

---

### Task 6: Header, contact actions, and the Contact section

**Files:**
- Create: `components/Header.tsx`, `components/ContactActions.tsx` (`"use client"`), `components/Contact.tsx` and their `.module.css` files, `tests/unit/contact.test.tsx`
- Modify: `app/layout.tsx` (make it `async`, load `site` and `hasResume`, render `<Header>`), `app/page.tsx` (load `site`, compute `hasResume = publicFileExists("resume.pdf")`, and render `<Contact>` into `#contact`)
- Delete: `tests/unit/smoke.test.tsx`. Once `Home` loads data it's no longer a pure render, and section order is covered by e2e in Task 10.

**Interfaces:**
- Consumes: `SiteConfig`, `loadSite`, `publicFileExists`
- Produces:
  - `ContactActions({ email, hasResume, compact? }: { email: string; hasResume: boolean; compact?: boolean })` renders an "Email me" link (`mailto:`), a "Copy email" button that copies with `navigator.clipboard.writeText` and shows "Copied" for 2s (announced through an `aria-live="polite"` region), and a "Download resume" link to `/resume.pdf` with a `download` attribute, **only if** `hasResume` is true. `compact` hides the copy button (used in the header).
  - `Header({ site, hasResume })` shows the name (linking to `#intro`), section links to Experience (`#experience`), Work (`#work`) and Contact (`#contact`), and `<ContactActions compact>`.
  - `Contact({ site, hasResume })` has the heading "Contact", one sentence of copy ("I'm looking for software engineering internships. Email is the fastest way to reach me."), `<ContactActions>`, and LinkedIn and GitHub links.

- [ ] **Step 1: Write the failing tests:**

```tsx
test("email link and copy feedback", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  render(<ContactActions email="oriasmjc@gmail.com" hasResume={false} />);
  expect(screen.getByRole("link", { name: "Email me" })).toHaveAttribute("href", "mailto:oriasmjc@gmail.com");
  await userEvent.click(screen.getByRole("button", { name: "Copy email" }));
  expect(writeText).toHaveBeenCalledWith("oriasmjc@gmail.com");
  expect(await screen.findByText("Copied")).toBeInTheDocument();
});
test("resume link only when the PDF exists", () => {
  const { rerender } = render(<ContactActions email="a@b.co" hasResume={false} />);
  expect(screen.queryByRole("link", { name: "Download resume" })).toBeNull();
  rerender(<ContactActions email="a@b.co" hasResume />);
  expect(screen.getByRole("link", { name: "Download resume" })).toHaveAttribute("href", "/resume.pdf");
});
test("contact section links LinkedIn and GitHub", () => {
  render(<Contact site={fixtureSite} hasResume={false} />);
  expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute("href", fixtureSite.links.linkedin);
});
```

- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement.** Style buttons as drawn outlines (1.5px `var(--ink)` border, square corners, no shadow). The header sits on paper with a bottom rule and wraps to two rows under 480px.
- [ ] **Step 4:** Run `pnpm test && pnpm build`. Expected: PASS.
- [ ] **Step 5:** Commit with `git commit -m "feat: header and contact actions"`.

---

### Task 7: Intro (hero) with the once-per-load line drawing

**Files:**
- Create: `components/Intro.tsx`, `components/IntroLines.tsx` (`"use client"`), `components/PhotoFrame.tsx` and their `.module.css` files, `tests/unit/intro.test.tsx`
- Modify: `app/page.tsx` (render `<Intro site hasPhoto={publicFileExists("photo.jpg")} hasResume>` into `#intro`)

**Interfaces:**
- Consumes: `SiteConfig`, `ContactActions`
- Produces:
  - `Intro({ site, hasPhoto, hasResume })` contains an `<h1>` with `site.name`, `site.role`, `site.intro`, a short stack line, `<ContactActions>`, `<PhotoFrame>` and `<IntroLines>`.
  - `PhotoFrame({ hasPhoto, alt })` shows `next/image` of `/photo.jpg` when `hasPhoto` is true. Otherwise it shows the blueprint placeholder: a rectangle with dashed diagonals and the caption "Photo, 1:1" (from mockup B).
  - `IntroLines()` is a decorative SVG (`aria-hidden`) of dimension lines around the name and photo. It has the class `animate` only on the first mount per page load, tracked with a module-level `let hasPlayed = false` that's read in the `useState` initialiser and set in `useEffect`.
- Animation spec: the CSS `stroke-dashoffset` draw runs in about 1.8s with stagger and total time of 2s or less. The text fades from opacity 0 to 1, starting at 0.15s and lasting 0.45s. Fade it only when `IntroLines` has `animate`, using a parent `data-intro="play"` attribute so it never fades on remount. The `prefers-reduced-motion` rule from Task 1 covers it.

- [ ] **Step 1: Write the failing tests:**

```tsx
test("shows name, role, intro, and placeholder photo", () => {
  render(<Intro site={fixtureSite} hasPhoto={false} hasResume={false} />);
  expect(screen.getByRole("heading", { level: 1, name: "Joseph Orias" })).toBeInTheDocument();
  expect(screen.getByText("Computer science student and designer")).toBeInTheDocument();
  expect(screen.getByText("Photo, 1:1")).toBeInTheDocument();
});
test("real photo replaces placeholder", () => {
  render(<PhotoFrame hasPhoto alt="Joseph Orias" />);
  expect(screen.getByRole("img", { name: "Joseph Orias" })).toBeInTheDocument();
  expect(screen.queryByText("Photo, 1:1")).toBeNull();
});
test("line drawing animates on first mount only", () => {
  const first = render(<IntroLines />);
  expect(first.container.querySelector("svg")).toHaveClass("animate");
  first.unmount();
  const second = render(<IntroLines />);
  expect(second.container.querySelector("svg")).not.toHaveClass("animate");
});
```

- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement.** Layout follows mockup B: the name and copy are left-aligned on the left, and the photo frame is on the right. Below 720px everything stacks into one column, with the photo above the name at 160px. The `<h1>` uses `clamp(2.75rem, 8vw, 4.5rem)` with a line height of 0.95.
- [ ] **Step 4:** Run `pnpm test && pnpm build`. Expected: PASS.
- [ ] **Step 5:** Commit with `git commit -m "feat: intro with once-per-load line drawing"`.

---

### Task 8: Experience and Works sections

**Files:**
- Create: `components/Experience.tsx`, `components/Works.tsx`, `components/ProjectCard.tsx`, `components/FeaturedCard.tsx` (`"use client"`) and their `.module.css` files, `tests/unit/sections.test.tsx`
- Modify: `app/page.tsx` (add `export const revalidate = 3600`, load `loadExperience()` and `getWorks()`, render into `#experience` and `#work`)

**Interfaces:**
- Consumes: `ExperienceEntry`, `Works`, `Project`, `CaseStudy`, `SiteConfig`
- Produces:
  - `Experience({ entries })` renders an `<ol>` timeline in file order with the title, org (linked when `orgUrl` is set), and `period` or `summary` when present.
  - `Works({ works, githubUrl })` renders the following:
    - `status: "unavailable"`: "Projects couldn't be loaded right now." plus a link "See my projects on GitHub" to `githubUrl`.
    - `ok` with no featured and no projects: "Projects are on the way." plus the same GitHub link.
    - Otherwise: a featured list of `<FeaturedCard>` (only when non-empty), then a grid of `<ProjectCard>`.
  - `ProjectCard({ project })` has a heading with the name, then the description (omitted when `null`), language (omitted when `null`), and topics as plain text tags. It links to "Code" (`repoUrl`) and to "Live demo" (`demoUrl`) **only when it's non-null**. The card outline is an SVG rect that traces on `:hover` and `:focus-within` with a CSS `stroke-dashoffset` transition. Long names wrap with `overflow-wrap: anywhere`.
  - `FeaturedCard({ study })` is a `motion.article` with `layoutId={"study-" + study.slug}`, showing the title, summary and cover (when set), and linking to `/work/${slug}` ("Read case study").

- [ ] **Step 1: Write the failing tests:**

```tsx
test("experience renders entries in order with org links", () => {
  render(<Experience entries={fixtureExperience} />);
  const items = screen.getAllByRole("listitem");
  expect(items[0]).toHaveTextContent("Camarines Sur Polytechnic Colleges");
  expect(screen.getByRole("link", { name: "Camarines Sur Polytechnic Colleges" })).toHaveAttribute("href", "https://cspc.edu.ph/");
});
test("project card hides null fields and empty demo", () => {
  render(<ProjectCard project={{ ...bareProject, description: null, language: null, demoUrl: null }} />);
  expect(screen.queryByText(/null/)).toBeNull();
  expect(screen.queryByRole("link", { name: "Live demo" })).toBeNull();
  expect(screen.getByRole("link", { name: "Code" })).toHaveAttribute("href", bareProject.repoUrl);
});
test("empty works shows on-the-way state with GitHub link", () => {
  render(<Works works={{ status: "ok", featured: [], projects: [] }} githubUrl="https://github.com/markjorias" />);
  expect(screen.getByText("Projects are on the way.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "See my projects on GitHub" })).toBeInTheDocument();
});
test("unavailable works is never blank", () => {
  render(<Works works={{ status: "unavailable" }} githubUrl="https://github.com/markjorias" />);
  expect(screen.getByText("Projects couldn't be loaded right now.")).toBeInTheDocument();
});
test("featured block appears only when there are featured studies", () => {
  render(<Works works={{ status: "ok", featured: [pylexStudy], projects: [ecoProject] }} githubUrl="x" />);
  expect(screen.getByRole("link", { name: "Read case study" })).toHaveAttribute("href", "/work/pylex");
});
```

- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement.** Use the section heading "Experience" and the Works heading "Work". The project grid is `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))`. Cards have square corners and a drawn border, with no shadows. Vary the hierarchy: featured cards are wider, with a cover in a drawing-style frame with crop marks.
- [ ] **Step 4:** Run `pnpm test && pnpm build`. Expected: PASS. The build log must not show a GitHub error. A missing `GITHUB_TOKEN` is fine.
- [ ] **Step 5:** Commit with `git commit -m "feat: experience and works sections"`.

---

### Task 9: Case study detail as a modal over home plus a full page

**Files:**
- Create: `components/CaseStudyView.tsx`, `components/CaseStudyModal.tsx` (`"use client"`) and their `.module.css` files, `app/work/[slug]/page.tsx`, `app/@modal/default.tsx`, `app/@modal/(.)work/[slug]/page.tsx`, `app/not-found.tsx`, `tests/unit/case-study.test.tsx`
- Modify: `app/layout.tsx` (accept and render the `modal` parallel-route slot, wrap children in `<MotionConfig reducedMotion="user">` through a small client wrapper)

**Interfaces:**
- Consumes: `CaseStudy`, `getWorks`, `FeaturedCard`'s `layoutId` format `"study-" + slug`
- Produces:
  - `CaseStudyView({ study })` renders the title, summary, a meta line (role, "Code" link to `https://github.com/${repo}`, and "Live demo" when set), the cover, and `body` through `react-markdown` (images render in drawing frames).
  - `CaseStudyModal({ study })` is a `motion.div` with the same `layoutId`. It's a dialog (`role="dialog"`, `aria-modal`, labelled by the title) that traps focus, closes on Escape, backdrop click or the "Close" button through `router.back()`, and returns focus to the originating card.
  - Both routes use `generateStaticParams()` over the featured slugs from `getWorks()` (or `[]` when unavailable) and `notFound()` for unknown slugs **or** slugs not in `featured` (so a private-repo study is never reachable by URL). `params` is a `Promise<{ slug: string }>` (Next 16).
  - `app/work/[slug]/page.tsx` sets `generateMetadata` (title = study title + " · Joseph Orias"), has a "Back to all work" link to `/#work`, and fades in with a CSS animation.

- [ ] **Step 1: Write the failing tests:**

```tsx
test("case study view renders markdown and links", () => {
  render(<CaseStudyView study={pylexStudy} />);
  expect(screen.getByRole("heading", { name: "What I built" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Code" })).toHaveAttribute("href", "https://github.com/markjorias/PyLex");
  expect(screen.getByRole("link", { name: "Live demo" })).toHaveAttribute("href", "https://pylex-flex.vercel.app");
});
test("modal closes on Escape via router.back", async () => {
  const back = vi.fn();
  vi.mock("next/navigation", () => ({ useRouter: () => ({ back }) }));
  render(<CaseStudyModal study={pylexStudy} />);
  expect(screen.getByRole("dialog", { name: pylexStudy.title })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(back).toHaveBeenCalled();
});
```

- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3: Implement** the components and routes to the Interfaces above.
- [ ] **Step 4:** Run `pnpm test && pnpm build`. Expected: PASS, and the build lists `/work/[slug]` (with zero static params against real data, which is fine).
- [ ] **Step 5:** Commit with `git commit -m "feat: case study modal and detail page"`.

---

### Task 10: Metadata, OG image, editing guide, and end-to-end checks

**Files:**
- Create: `app/opengraph-image.tsx`, `app/icon.svg`, `content/README.md`, `playwright.config.ts`, `tests/e2e/mock-github.mjs`, `tests/e2e/home.spec.ts`, `tests/e2e/case-study.spec.ts`

**Interfaces:**
- Consumes: everything above. The env overrides are `GITHUB_API_URL` and `PORTFOLIO_CONTENT_DIR`.
- Produces:
  - `opengraph-image.tsx` uses `next/og` `ImageResponse`, 1200×630, vellum paper `#EDF1F2` with the grid, "Joseph Orias" and the role in ink `#1C4596`.
  - `icon.svg` is a "JO" monogram in ink on paper.
  - `content/README.md` is Joseph's plain-language guide covering how to show a repo (make it public and add the `portfolio` topic, then wait about an hour), add experience (edit `experience.json`, with an example), add a resume (put `resume.pdf` in `public/`), add a photo (`public/photo.jpg`, square), and write a featured case study (copy the template front matter into `content/work/<slug>.md`, put images in `public/work/<slug>/`, max 3, and the repo must be public). It also explains that files starting with `_` are drafts.

- [ ] **Step 1: Write `tests/e2e/mock-github.mjs`.** It's a Node `http` server on port 4010 that answers `GET /users/markjorias/repos` with `tests/fixtures/github-repos.json` and returns 404 for everything else.
- [ ] **Step 2: Write `playwright.config.ts`.**
  - `webServer` is an array:
    - the mock server
    - `pnpm build && pnpm start -p 3100` with env `GITHUB_API_URL=http://localhost:4010` and `PORTFOLIO_CONTENT_DIR=tests/fixtures/content`, plus `timeout: 240_000`
  - `baseURL: "http://localhost:3100"`
  - projects: `desktop` (Chrome 1280×800) and `phone` (360×740)
  - Run `pnpm exec playwright install chromium`.
- [ ] **Step 3: Write the e2e tests:**

```ts
// home.spec.ts
test("sections in order and projects from GitHub", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Joseph Orias" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Email me" }).first()).toHaveAttribute("href", "mailto:oriasmjc@gmail.com");
  await expect(page.locator("#work")).toContainText("ecoUsapan");
  await expect(page.locator("#work")).not.toContainText("klaro");
  await expect(page.locator("#work")).not.toContainText("old-archived");
});
test("no horizontal scroll", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
test("reduced motion: content visible immediately", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  const opacity = await page.getByRole("heading", { level: 1 }).evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
});
test("keyboard focus is visible", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe("none");
});

// case-study.spec.ts
test("featured card opens modal with its own URL, Escape returns home", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Read case study" }).click();
  await expect(page).toHaveURL(/\/work\/pylex$/);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/$/);
});
test("direct visit renders full page; private study 404s", async ({ page }) => {
  await page.goto("/work/pylex");
  await expect(page.getByRole("heading", { level: 1, name: "PyLex" })).toBeVisible();
  const res = await page.goto("/work/klaro");
  expect(res?.status()).toBe(404);
});
```

- [ ] **Step 4:** Run `pnpm e2e`. Expected: all tests pass on both `desktop` and `phone`. Fix any failures in the owning component, not in the test.
- [ ] **Step 5:** Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` against real content and the real GitHub API. Expected: all pass. Run `pnpm start`, visually check `/` at 1280px and 360px, and compare it against mockup B in `.superpowers/brainstorm/*/content/blueprint-direction-v2.html`.
- [ ] **Step 6:** Commit with `git commit -m "feat: metadata, OG image, editing guide, e2e tests"`.

---

### Task 11: Deploy to Vercel (preview from `portfolio`)

**Files:** none (or `vercel.json` only if a setting can't be made in the dashboard; none is expected).

- [ ] **Step 1: Stop and ask the user** for the go-ahead to push the `portfolio` branch to GitHub. Pushing is outward-facing. Only after a yes, run `git push -u origin portfolio`.
- [ ] **Step 2: Connect Vercel.** Either the user imports `markjorias/markjorias` at vercel.com/new, or they run `! pnpm dlx vercel@latest link` in this session. Use framework preset Next.js and root directory `.`. Keep the Production Branch as `main`, so `portfolio` deploys as a preview.
- [ ] **Step 3 (optional, recommended): Add a GitHub token.** Create a fine-grained GitHub token with **public repositories read-only** access and add it as the Vercel env var `GITHUB_TOKEN` (Production and Preview). Redeploy.
- [ ] **Step 4: Verify the preview URL.** The page loads, the hero animation plays once, Works shows "Projects are on the way." (no repos tagged yet) or tagged repos, and `/work/anything` returns 404.
- [ ] **Step 5:** Tell the user the preview URL and the next steps for them: tag repos with `portfolio`, add `public/resume.pdf` and `public/photo.jpg`, and merge to `main` to go live.
