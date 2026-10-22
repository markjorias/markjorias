import fs from "node:fs";
import { render, screen } from "@testing-library/react";
import Experience from "@/components/Experience";
import ProjectCard from "@/components/ProjectCard";
import Works from "@/components/Works";
import { loadCaseStudies } from "@/lib/case-studies";
import { selectPortfolioRepos } from "@/lib/github";
import type { CaseStudy, ExperienceEntry, GitHubRepo } from "@/lib/types";

const fixtureExperience: ExperienceEntry[] = JSON.parse(fs.readFileSync("tests/fixtures/content/experience.json", "utf8"));
const projects = selectPortfolioRepos(JSON.parse(fs.readFileSync("tests/fixtures/github-repos.json", "utf8")) as GitHubRepo[]);
const bareProject = projects.find((p) => p.name === "bare-tagged")!;
const ecoProject = projects.find((p) => p.name === "ecoUsapan")!;
let pylexStudy: CaseStudy;

beforeAll(async () => {
  [pylexStudy] = await loadCaseStudies("tests/fixtures/content");
});

test("experience renders entries in order with org links", () => {
  render(<Experience entries={fixtureExperience} />);
  const items = screen.getAllByRole("listitem");
  expect(items[0]).toHaveTextContent("Camarines Sur Polytechnic Colleges");
  expect(screen.getByRole("link", { name: "Camarines Sur Polytechnic Colleges" })).toHaveAttribute("href", "https://cspc.edu.ph/");
});

test("project card hides null fields and empty demo", () => {
  render(<ProjectCard project={{ ...bareProject, description: null, language: null, demoUrl: null }} />);
  expect(screen.queryByText(/null/)).toBeNull();
  expect(screen.queryByRole("link", { name: /Live demo/ })).toBeNull();
  expect(screen.getByRole("link", { name: `Code for ${bareProject.name}` })).toHaveAttribute("href", bareProject.repoUrl);
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
  expect(screen.getByRole("link", { name: "Read case study: PyLex" })).toHaveAttribute("href", "/work/pylex");
});
