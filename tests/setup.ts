import "@testing-library/jest-dom";
import { vi } from "vitest";

// Radix UI를 위한 HTMLElement 메서드 모킹
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: vi.fn(),
});
