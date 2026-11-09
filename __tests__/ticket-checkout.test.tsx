import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TicketCheckout } from "@/app/components/ticket-checkout";
import type { Event } from "@/types/events";

const mockEvent: Event = {
  id: "helene-bester-konser-2026",
  title: "Kers & Fees met Helene Bester",
  description: "Spesiale konsert",
  date: "2026-12-12T19:00:00.000Z",
  endDate: null,
  location: "Wapadrant Gemeente",
  imageUrl: "/helene-bester-3.jpeg",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ticketTypes: [
    { id: "tt1", name: "Adults", price: 250, quantity: 100, sold: 0, eventId: "e1" },
  ],
};

function getCssVarCount(container: HTMLElement): number {
  const elements = container.querySelectorAll("[class]");
  let count = 0;
  Array.from(elements).forEach(el => {
    const cls = typeof el.className === "string" ? el.className : el.className.baseVal || "";
    if (cls.includes("var(--")) count++;
  });
  return count;
}

describe("TicketCheckout — Northwind/Tailwind styling", () => {
  it("should NOT use btn-wapa CSS class — use Tailwind utilities instead", () => {
    const { container } = render(<TicketCheckout event={mockEvent} />);
    const btnWapa = container.querySelectorAll(".btn-wapa");
    expect(btnWapa.length).toBe(0);
  });

  it("should NOT use input CSS class — use Tailwind utilities instead", () => {
    const { container } = render(<TicketCheckout event={mockEvent} />);
    const openBtn = screen.getByText("Bespreek nou");
    fireEvent.click(openBtn);
    const inputs = container.querySelectorAll(".input");
    expect(inputs.length).toBe(0);
  });

  it("should NOT use CSS var() in className attributes", () => {
    const { container } = render(<TicketCheckout event={mockEvent} />);
    const openBtn = screen.getByText("Bespreek nou");
    fireEvent.click(openBtn);
    expect(getCssVarCount(container)).toBe(0);
  });
});
