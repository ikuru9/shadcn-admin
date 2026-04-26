import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IconThemeDark } from "./icon-theme-dark";
import { IconThemeLight } from "./icon-theme-light";

describe("theme preview icons", () => {
  it("uses the Starbucks-inspired light theme palette", () => {
    const { container } = render(<IconThemeLight />);
    const markup = container.innerHTML;

    expect(markup).toContain("#f2f0eb");
    expect(markup).toContain("#edebe9");
    expect(markup).toContain("#006241");
    expect(markup).toContain("#00754a");
    expect(markup).not.toContain("#ecedef");
    expect(markup).not.toContain("#c0c4c4");
  });

  it("uses the Starbucks-inspired dark theme palette", () => {
    const { container } = render(<IconThemeDark />);
    const markup = container.innerHTML;

    expect(markup).toContain("#1e3932");
    expect(markup).toContain("#2b5148");
    expect(markup).toContain("#d4e9e2");
    expect(markup).toContain("#cba258");
    expect(markup).not.toContain("#0d1628");
    expect(markup).not.toContain("#2a62bc");
  });
});
