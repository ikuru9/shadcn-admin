import { describe, expect, it } from "vitest";

import indexCss from "./index.css?raw";
import themeCss from "./theme.css?raw";

describe("Starbucks-inspired design theme", () => {
  it("keeps the effective root palette aligned with DESIGN.md", () => {
    expect(indexCss).toContain("--background: #f2f0eb;");
    expect(indexCss).toContain("--foreground: rgba(0, 0, 0, 0.87);");
    expect(indexCss).toContain("--primary: #00754a;");
    expect(indexCss).toContain("--secondary: #edebe9;");
    expect(indexCss).toContain("--accent: #d4e9e2;");
    expect(indexCss).toContain("--ring: #00754a;");
    expect(indexCss).toContain("--radius: 0.75rem;");
  });

  it("keeps the imported theme mirror in sync with the effective palette", () => {
    for (const token of [
      "--background: #f2f0eb;",
      "--foreground: rgba(0, 0, 0, 0.87);",
      "--primary: #00754a;",
      "--secondary: #edebe9;",
      "--accent: #d4e9e2;",
      "--ring: #00754a;",
      "--radius: 0.75rem;",
    ]) {
      expect(themeCss).toContain(token);
    }
  });

  it("exposes the additional green and reward ceremony tokens", () => {
    for (const token of [
      "--starbucks-green: #006241;",
      "--green-accent: #00754a;",
      "--house-green: #1e3932;",
      "--green-uplift: #2b5148;",
      "--rewards-gold: #cba258;",
      "--card-shadow: 0 0 0.5px rgba(0, 0, 0, 0.14), 0 1px 1px rgba(0, 0, 0, 0.24);",
      "--nav-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 2px 2px rgba(0, 0, 0, 0.06), 0 0 2px rgba(0, 0, 0, 0.07);",
    ]) {
      expect(indexCss).toContain(token);
      expect(themeCss).toContain(token);
    }
  });
});
