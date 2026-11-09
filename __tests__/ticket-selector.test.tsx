import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TicketSelector } from "@/app/components/ticket-selector";
import type { TicketType } from "@/types/events";

const mockTicketTypes: TicketType[] = [
  { id: "tt1", name: "Adults", price: 250, quantity: 100, sold: 0, eventId: "e1" },
  { id: "tt2", name: "High School", price: 150, quantity: 50, sold: 0, eventId: "e1" },
];

function getCssVarCount(container: HTMLElement): number {
  const elements = container.querySelectorAll("[class]");
  let count = 0;
  Array.from(elements).forEach(el => {
    const cls = typeof el.className === "string" ? el.className : el.className.baseVal || "";
    if (cls.includes("var(--")) count++;
  });
  return count;
}

describe("TicketSelector — Northwind/Tailwind styling", () => {
  it("should NOT use tier-card CSS class — use Tailwind utilities instead", () => {
    const { container } = render(
      <TicketSelector ticketTypes={mockTicketTypes} selected={[]} onChange={() => {}} />
    );
    const tierCards = container.querySelectorAll(".tier-card");
    expect(tierCards.length).toBe(0);
  });

  it("should NOT use badge CSS class — use Tailwind utilities instead", () => {
    const { container } = render(
      <TicketSelector ticketTypes={mockTicketTypes} selected={[]} onChange={() => {}} />
    );
    const badges = container.querySelectorAll(".badge");
    expect(badges.length).toBe(0);
  });

  it("should NOT use CSS var() in className attributes", () => {
    const { container } = render(
      <TicketSelector ticketTypes={mockTicketTypes} selected={[]} onChange={() => {}} />
    );
    expect(getCssVarCount(container)).toBe(0);
  });

  it("should use Tailwind color tokens (text-foreground, text-muted-foreground, etc.)", () => {
    const { container } = render(
      <TicketSelector ticketTypes={mockTicketTypes} selected={[]} onChange={() => {}} />
    );
    const html = container.innerHTML;
    expect(html).toContain("text-foreground");
    expect(html).not.toContain("var(--foreground)");
  });
});
