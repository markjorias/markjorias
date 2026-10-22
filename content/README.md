# Editing the portfolio

Everything on the site that changes over time lives in this folder or in `public/`. You never need to touch the code in `components/` or `app/` to update it.

After you change a file, commit and push. Vercel rebuilds the site on its own.

## Show a project in Work

### Preview with sample data

Run `pnpm dev:demo` to preview a filled Work section with one sample case study and three sample projects. The preview is clearly labeled, needs no GitHub connection, and uses the data in `lib/demo-works.ts`. Sample cards have no pretend repository or live-demo links.

Use `pnpm dev` to return to real GitHub content. For a production preview, set `PORTFOLIO_DEMO=1` when building and running the site; leave it unset for your real portfolio. Demo pages request that search engines do not index them.

### Publish your real work

1. On GitHub, make the repo **public**.
2. Add the topic **`portfolio`** to the repo (the gear icon next to "About" on the repo page).
3. Wait about an hour. The site checks GitHub once an hour.

The card shows the repo's description, main language, topics and, if you set one, the website URL from "About" as a "Live demo" link. To take a project off the site, remove the `portfolio` topic. Archived and private repos never appear.

## Add experience

Edit `experience.json`. Entries show in the order they're written, top first. `title` and `org` are required. `orgUrl`, `period` and `summary` are optional.

```json
{
  "title": "Web developer intern",
  "org": "Example Company",
  "orgUrl": "https://example.com",
  "period": "June to August 2027",
  "summary": "Built the internal booking dashboard in Flask."
}
```

Separate entries with a comma. If the file has a mistake, the build fails with a message naming the file and the field, for example `content/experience.json: 2.title ...`.

## Change your name, intro, email or links

Edit `site.json`.

## Add a resume

Put the PDF at `public/resume.pdf`. A "Download resume" button appears in the header, intro and contact section. Delete the file to remove the button.

## Add a photo

Put a square photo at `public/photo.jpg`. It replaces the desktop monogram in the intro and appears below the introduction on mobile.

## Write a featured case study

Featured case studies sit at the top of Work and open in their own view with a shareable link. You can have up to 3.

1. Create `content/work/<slug>.md`. The slug is the file name and becomes the link, for example `content/work/pylex.md` → `/work/pylex`.
2. Start the file with this front matter, then write the study in Markdown below it:

```markdown
---
title: PyLex
summary: One or two sentences shown on the card.
repo: markjorias/PyLex
role: Solo project. Design, lexer and front end.
order: 1
demo: https://pylex-flex.vercel.app
cover: /work/pylex/cover.png
---

## The problem

## What I built

![Lexer output](/work/pylex/output.png)

## What I learned
```

- `title`, `summary`, `repo`, `role` and `order` are required. `demo` and `cover` are optional.
- `order` sets the position: 1 is first.
- Put images in `public/work/<slug>/` and link them as `/work/<slug>/<file>`.
- The `repo` must be a **public** repo. If it's private, archived or missing, the study is hidden and its link shows "not found". This keeps private work off the site.
- A featured repo doesn't need the `portfolio` topic, and it won't appear twice.

Files that start with `_`, like `_draft.md`, are drafts. The site ignores them.
