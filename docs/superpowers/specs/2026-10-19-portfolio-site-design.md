# Portfolio site: design

**Owner:** Joseph Orias (GitHub `markjorias`)
**Date:** 2026-10-19
**Status:** draft, awaiting owner approval

## Intent

Joseph is a computer science student at Camarines Sur Polytechnic Colleges (CSPC) who also does graphic design (Committee on Creatives, JPCS CSPC chapter). He wants a personal portfolio site, hosted on Vercel, that gets **tech recruiters and internship hiring managers** to contact him.

The visitor should come away knowing three things, in this order:

1. **Who he is:** a CS student who codes and also designs.
2. **His experience:** education and roles.
3. **His work:** code projects from GitHub.

Success means a recruiter lands, understands who Joseph is within about 30 seconds, sees real public work, and contacts him.

## Goals

- A single, fast, polished site in a **drafting-vellum blueprint** style (details below) with smooth, purposeful motion.
- A Works section that **updates itself from GitHub**, so Joseph never has to edit site code to show a newly published repo.
- Content Joseph will keep changing (experience entries, featured write-ups, resume) lives in **simple content files** he can edit without touching components.
- Contacting Joseph takes one click.

## Non-goals (for this version)

- **Design portfolio gallery.** Graphic design work is a planned later phase. The site mentions that he designs (intro line), but launch has no gallery. The structure should leave room to add a Design section later without a redesign.
- **Private projects.** Only public repos appear. No write-ups of private work (including the thesis and `klaro-dashboard`), even without code links.
- **Contact form.** No form or email backend at launch.
- Blog, CMS, analytics dashboards, i18n, auth.

## Anti-goals (failure even if it works)

- Looks like a generic dev-portfolio template (dark mode with neon accent, identical rounded SaaS cards, fade-up on every section).
- Motion that gets in the way: slow scroll-jacking, animations that delay reading, or effects that fire on every section.
- A Works section that shows stale or private material, or that breaks or empties the page when GitHub is slow or rate-limited.
- Hard for Joseph to update: if adding an experience entry or a resume means editing JSX, the design failed.

## Audience

Tech recruiters and internship hiring managers, mostly skimming, often on a laptop and sometimes on a phone. They want proof of real work (repo links, live demos, stack) and an easy way to get in touch.

## Page structure

A single long page, top to bottom:

1. **Intro (hero):** name, one-line identity ("Computer science student and designer"), a short sentence (current draft: "I build web apps in Python and Flask, and I design the screens they run on."), and a photo. The photo frame is drawn as a blueprint placeholder box (rectangle with dashed diagonals) and shows the real photo when one is provided. The primary contact action is visible here.
2. **Experience:** a list or timeline of entries read from a content file. Initial entries:
   - Computer Science student, Camarines Sur Polytechnic Colleges
   - Committee on Creatives, JPCS – CSPC Chapter

   Joseph has no further entries yet and will add them later by editing the content file.
3. **Works:**
   - **Featured case studies** (zero to three) appear first. Each is a hand-written content file: problem, what he built, screenshots, his role, and what he learned, plus repo and live-demo links. Each featured study must point at a **public** repo. A featured study gets its own detail view (see Motion).
   - **All public projects** below that, pulled from GitHub automatically (see GitHub data).
4. **Contact:** email and LinkedIn, plus the resume download when it exists. Contact also appears as a persistent, low-key action (for example in the header) so it's reachable from anywhere.

Navigation: a small header with section links and the contact action. When Design is added later it becomes another top-level section.

## Content

From Joseph's GitHub profile README:

- **Name shown:** Joseph Orias. Full name Mark Joseph Orias for metadata and SEO.
- **Email:** oriasmjc@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/mark-joseph-orias-142043388/
- **GitHub:** https://github.com/markjorias
- **Stack** (can appear in the intro or near Works): Python, HTML, CSS, Java, Flask, MySQL, PostgreSQL, Supabase. Design tools: Figma, Photoshop, Illustrator, Premiere, After Effects.
- **Resume:** none yet. The site shows a "Download resume" action **only if** a resume PDF exists at a known path in the project. Adding it later means dropping the file in, with no code change.
- **Photo:** none provided yet. Use the blueprint placeholder until one is added.

Facebook is in the README but is left out of the recruiter-facing site (builder's call; easy to add).

## GitHub data (Works)

- **Rule for what appears:** public, non-archived repos owned by `markjorias` that have the GitHub topic **`portfolio`**. Joseph publishes a project by making the repo public and adding that topic. Removing the topic removes it from the site.
- **Fields shown per project:** name, description, primary language, topics (minus `portfolio`), homepage/live-demo URL if set, and repo link. Several current public repos already have homepage URLs (`ecousapan.vercel.app`, `pylex-flex.vercel.app`) and topics.
- **Freshness:** data is fetched at build time and refreshed on a schedule. *(Builder's call: about once an hour is plenty.)* A new tag doesn't need to appear instantly.
- **Failure behaviour:** if GitHub is unavailable or rate-limited, keep serving the last good data. Never show an empty or broken Works section because of an API error.
- **Auth:** the builder may use a GitHub token stored as a Vercel environment variable to avoid unauthenticated rate limits. It only needs to read public repo data.
- **Ordering:** featured case studies first in their own block, then the rest ordered by most recently updated. *(Builder's call.)*
- **Current state:** at the time of writing, no repo has the `portfolio` topic yet. The public repos are `ecoUsapan`, `fullshot`, `PyLex`, `Lakb.ai` (a fork) and `markjorias`. Joseph will tag the ones he wants. The Works section needs a sensible empty state until he does, for example "Projects are on the way" with a link to his GitHub profile. It should never show a blank area.

## Visual design: drafting vellum

Joseph chose this from three blueprint directions (a cyanotype sheet, drafting vellum, and blueprint with green markups). The mockup he picked is saved at `.superpowers/brainstorm/*/content/blueprint-direction-v2.html` (option B).

- **Paper:** cool off-white drafting sheet `#EDF1F2` with a light blue grid `#C8D6EC` (about 48px cells). It shouldn't look warm or cream.
- **Ink:** deep blueprint blue `#1C4596` for text, lines and borders; `#163A82` for headings; a softer `#2D4F8F` for secondary text. The palette is essentially one ink on one paper.
- **Type:** a condensed face for headings, in the spirit of technical-drawing lettering, and a plain readable sans for body text. The mockup used **Archivo Narrow** and **Archivo**. *(Builder may substitute if there's a good reason; keep the condensed-heading, plain-body pairing.)*
- **Drawing language:** dimension lines, crop or registration marks, and dashed construction lines frame content and encode structure. They aren't scattered decoration. Photos and screenshots get drawing-style frames.
- **Accent green:** Joseph's existing `#75ff73` is **not** part of this palette. *(Open: it may come back sparingly later, for example an "open to internships" status marker. Don't add it at launch.)*
- **Light theme only** at launch. The vellum look is the identity. *(Builder's call whether to add an alternative dark "cyanotype" theme later; not required.)*
- Must be responsive down to phone width, keep text contrast accessible, and show visible keyboard focus.

## Motion

- **One signature moment:** on first load of the home page, the hero's line work draws itself in (stroke animation), then the name and intro text fade in. It runs once per visit and should finish in about 2 seconds or less. Content must never wait on it to be readable.
- **Responsive motion only, after that:** no section-by-section fade-ups on scroll. Motion answers the visitor's actions:
  - Hovering or focusing a project traces or emphasises its drawn outline.
  - Opening a featured case study expands it from its card into a detail view, like zooming into a detail on a drawing. Closing reverses it. The detail view has its own URL so it can be shared or linked directly.
  - Page and route changes use smooth transitions.
- **Reduced motion:** when the visitor's OS asks for reduced motion, all animation is off and content appears immediately.

## Platform and code

- **Hosting:** Vercel (Joseph's choice).
- **Framework:** Next.js. *(My call, not something Joseph asked for. It's the natural fit for Vercel and supports scheduled re-fetching of GitHub data.)* Libraries for animation and styling are the builder's choice, within the motion rules above.
- **Repository:** the site is built in this repo (`markjorias`, Joseph's GitHub profile repo) on the **`portfolio`** branch Joseph created for it. The existing `README.md` must stay intact because it renders on his GitHub profile.
- **Domain:** the default `*.vercel.app` URL at launch. *(My call; a custom domain can come later.)*
- **Deploys:** the `portfolio` branch gets Vercel preview deployments while the site is being built. Production comes from `main` once Joseph merges. *(My call.)*
- **Featured case studies at launch:** zero. No repo is tagged yet and Joseph hasn't written any. The featured block is built and tested with sample content but hidden when empty. *(My call.)*
- **Non-featured projects** have no detail page on the site. Their cards link out to the GitHub repo and the live demo. *(My call.)*
- `.superpowers/` (brainstorm mockups) must be git-ignored.

## Left to the builder

- Component structure, styling approach, animation library.
- Exact content-file format for experience entries and featured case studies, as long as Joseph can edit them as plain data or Markdown without touching components.
- Exact type scale, spacing and grid details within the visual rules.
- SEO metadata, Open Graph image (ideally in the blueprint style), favicon.
- Revalidation interval and GitHub API details within the rules above.
- Whether to include a "skills/stack" block, and where.
