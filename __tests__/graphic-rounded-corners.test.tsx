import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import path from "path";

describe("Issue #2: Graphic rounded corners", () => {
  it("graphic container must have rounded corners class", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const content = fs.readFileSync(pagePath, "utf-8");
    // Check for rounded class on the graphic container
    expect(content).toMatch(/rounded-(xl|2xl|3xl|full|lg|md)/);
  });

  it("graphic container must have overflow-hidden for image clipping", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const content = fs.readFileSync(pagePath, "utf-8");
    expect(content).toContain("overflow-hidden");
  });

  it("graphic image must have object-cover for proper display", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const content = fs.readFileSync(pagePath, "utf-8");
    expect(content).toContain("object-cover");
  });
});
