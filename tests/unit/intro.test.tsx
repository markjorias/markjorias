import fs from "node:fs";
import { render, screen } from "@testing-library/react";
import Intro from "@/components/Intro";
import PhotoFrame from "@/components/PhotoFrame";
import type { SiteConfig } from "@/lib/types";

const fixtureSite: SiteConfig = JSON.parse(fs.readFileSync("tests/fixtures/content/site.json", "utf8"));

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
