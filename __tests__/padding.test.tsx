import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TicketSelector } from "@/app/components/ticket-selector";
import { TicketCheckout } from "@/app/components/ticket-checkout";
import type { TicketType, Event } from "@/types/events";

const mockTicketTypes: TicketType[] = [
  { id: "tt1", name: "Adults", price: 250, quantity: 100, sold: 0, eventId: "e1" },
];

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
  ticketTypes: mockTicketTypes,
};

describe("Padding — TicketSelector modal content", () => {
  it("tier cards should have at least p-5 padding (increased from p-4)", () => {
    const { container } = render(
      <TicketSelector ticketTypes={mockTicketTypes} selected={[]} onChange={() => {}} />
    );
    const tierCards = container.querySelectorAll("[class*=rounded-xl][class*=border-border][class*=bg-card]");
    expect(tierCards.length).toBeGreaterThan(0);
    tierCards.forEach(card => {
      const cls = typeof card.className === "string" ? card.className : card.className.baseVal || "";
      // Must have p-5 or greater (p-5, p-6, p-8)
      expect(cls).toMatch(/\bp-[5-8]\b/);
    });
  });

  it("modal container should have at least p-8 padding (increased from p-6)", () => {
    const { container } = render(<TicketCheckout event={mockEvent} />);
    fireEvent.click(screen.getByText("Bespreek nou"));
    const modal = container.querySelector(".rounded-2xl.bg-card");
    expect(modal).toBeTruthy();
    const cls = typeof modal!.className === "string" ? modal!.className : modal!.className.baseVal || "";
    expect(cls).toMatch(/\bp-[8-9]\b|bp-\d{2}\b/);
  });
});
