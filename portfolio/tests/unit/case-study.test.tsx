import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CaseStudyModal from "@/components/CaseStudyModal";
import CaseStudyView from "@/components/CaseStudyView";
import { loadCaseStudies } from "@/lib/case-studies";
import type { CaseStudy } from "@/lib/types";

// vi.mock is hoisted above imports, so the spy it returns must be hoisted too.
const { back } = vi.hoisted(() => ({ back: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ back }) }));

let pylexStudy: CaseStudy;

beforeAll(async () => {
  [pylexStudy] = await loadCaseStudies("tests/fixtures/content");
});

test("case study view renders markdown and links", () => {
  render(<CaseStudyView study={pylexStudy} />);
  expect(screen.getByRole("heading", { name: "What I built" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Code" })).toHaveAttribute("href", "https://github.com/markjorias/PyLex");
  expect(screen.getByRole("link", { name: "Live demo" })).toHaveAttribute("href", "https://pylex-flex.vercel.app");
});

test("modal closes on Escape via router.back", async () => {
  render(<CaseStudyModal study={pylexStudy} />);
  expect(screen.getByRole("dialog", { name: pylexStudy.title })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(back).toHaveBeenCalled();
});
