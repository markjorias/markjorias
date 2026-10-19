import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

test("home has the four sections in order", async () => {
  render(await Home());
  const ids = [...document.querySelectorAll("main > section")].map((s) => s.id);
  expect(ids).toEqual(["intro", "experience", "work", "contact"]);
});
