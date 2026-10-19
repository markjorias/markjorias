// Own file: vitest gives each file a fresh module graph, which stands in for a fresh page load.
import { render } from "@testing-library/react";
import IntroLines from "@/components/IntroLines";

test("line drawing animates on first mount only", () => {
  const first = render(<IntroLines />);
  expect(first.container.querySelector("svg")).toHaveClass("animate");
  first.unmount();
  const second = render(<IntroLines />);
  expect(second.container.querySelector("svg")).not.toHaveClass("animate");
});
