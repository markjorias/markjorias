import fs from "node:fs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "@/components/Contact";
import ContactActions from "@/components/ContactActions";
import type { SiteConfig } from "@/lib/types";

const fixtureSite: SiteConfig = JSON.parse(fs.readFileSync("tests/fixtures/content/site.json", "utf8"));

test("email link and copy feedback", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  render(<ContactActions email="oriasmjc@gmail.com" hasResume={false} />);
  expect(screen.getByRole("link", { name: "Email me" })).toHaveAttribute("href", "mailto:oriasmjc@gmail.com");
  await userEvent.click(screen.getByRole("button", { name: "Copy email" }));
  expect(writeText).toHaveBeenCalledWith("oriasmjc@gmail.com");
  expect(await screen.findByText("Copied")).toBeInTheDocument();
});

test("failed copy offers a manual address and clears the error after a successful retry", async () => {
  const writeText = vi.fn()
    .mockRejectedValueOnce(new DOMException("Clipboard denied", "NotAllowedError"))
    .mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  render(<ContactActions email="oriasmjc@gmail.com" hasResume={false} />);

  await userEvent.click(screen.getByRole("button", { name: "Copy email" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("oriasmjc@gmail.com");
  expect(screen.getByRole("link", { name: "Email me" })).toHaveAttribute("href", "mailto:oriasmjc@gmail.com");
  expect(screen.queryByText("Copied")).toBeNull();

  await userEvent.click(screen.getByRole("button", { name: "Copy email" }));

  expect(await screen.findByText("Copied")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).toBeNull();
});

test("copy offers a manual address when the browser has no clipboard API", async () => {
  Object.assign(navigator, { clipboard: undefined });
  render(<ContactActions email="oriasmjc@gmail.com" hasResume={false} />);

  await userEvent.click(screen.getByRole("button", { name: "Copy email" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("oriasmjc@gmail.com");
  expect(screen.queryByText("Copied")).toBeNull();
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
