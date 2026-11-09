"use client";

import { useMemo } from "react";
import { Minus, Plus, Ticket } from "lucide-react";
import { formatZAR } from "@/lib/date-format";
import type { TicketType } from "@/types/events";

export interface SelectedTicket {
  ticketTypeId: string;
  quantity: number;
}

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  selected: SelectedTicket[];
  onChange: (selected: SelectedTicket[]) => void;
}

export function TicketSelector({ ticketTypes, selected, onChange }: TicketSelectorProps) {
  const totals = useMemo(() => {
    return ticketTypes.map((tt) => {
      const qty = selected.find((s) => s.ticketTypeId === tt.id)?.quantity || 0;
      const available = tt.quantity - (tt.sold || 0);
      return { ...tt, qty, available, subtotal: qty * Number(tt.price) };
    });
  }, [ticketTypes, selected]);

  const grandTotal = totals.reduce((sum, t) => sum + t.subtotal, 0);
  const totalSelected = totals.reduce((sum, t) => sum + t.qty, 0);

  function updateQuantity(ticketTypeId: string, quantity: number) {
    const next = selected.filter((s) => s.ticketTypeId !== ticketTypeId);
    if (quantity > 0) {
      next.push({ ticketTypeId, quantity });
    }
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {totals.map((tt) => {
        const isSoldOut = tt.available <= 0;
        const canIncrement = tt.qty < tt.available;
        return (
          <div
            key={tt.id}
            className="tier-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold font-[var(--font-heading)]">{tt.name}</span>
                {isSoldOut ? (
                  <span className="badge badge-primary bg-[var(--destructive)] text-white border-[var(--destructive)]">
                    Uitverkoop
                  </span>
                ) : tt.available <= 5 ? (
                  <span className="badge">{tt.available} oor</span>
                ) : null}
              </div>
              <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                {formatZAR(tt.price)} elk · {tt.available} van {tt.quantity} beskikbaar
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--background)]">
                <button
                  type="button"
                  className="w-9 h-9 rounded-lg border-r border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white transition disabled:opacity-30 flex items-center justify-center"
                  disabled={tt.qty <= 0 || isSoldOut}
                  onClick={() => updateQuantity(tt.id, tt.qty - 1)}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-medium text-[var(--foreground)]">
                  {tt.qty}
                </span>
                <button
                  type="button"
                  className="w-9 h-9 rounded-lg border-l border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white transition disabled:opacity-30 flex items-center justify-center"
                  disabled={isSoldOut || !canIncrement}
                  onClick={() => updateQuantity(tt.id, tt.qty + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="min-w-[5.5rem] text-right text-sm font-semibold text-[var(--foreground)]">
                {formatZAR(tt.subtotal)}
              </div>
            </div>
          </div>
        );
      })}
      {ticketTypes.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--border)] bg-[var(--secondary)]/50 p-4 text-sm text-[var(--muted-foreground)]">
          <Ticket className="h-4 w-4" />
          Geen kaartjie tipes vir hierdie geleentheid nie.
        </div>
      )}
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
        <span className="text-sm text-[var(--muted-foreground)]">
          {totalSelected} kaartjie{totalSelected !== 1 ? "s" : ""} gekies
        </span>
        <span className="font-semibold text-lg text-[var(--foreground)]">
          Totaal: {formatZAR(grandTotal)}
        </span>
      </div>
    </div>
  );
}
