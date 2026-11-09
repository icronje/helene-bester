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
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold font-heading">{tt.name}</span>
                {isSoldOut ? (
                  <span className="inline-flex items-center rounded-md bg-destructive px-2.5 py-0.5 text-xs font-medium text-destructive-foreground">
                    Uitverkoop
                  </span>
                ) : tt.available <= 5 ? (
                  <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {tt.available} oor
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {formatZAR(tt.price)} elk · {tt.available} van {tt.quantity} beskikbaar
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border bg-background">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border-r border-border bg-secondary text-foreground transition hover:bg-primary hover:text-white disabled:opacity-30"
                  disabled={tt.qty <= 0 || isSoldOut}
                  onClick={() => updateQuantity(tt.id, tt.qty - 1)}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-medium text-foreground">
                  {tt.qty}
                </span>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border-l border-border bg-secondary text-foreground transition hover:bg-primary hover:text-white disabled:opacity-30"
                  disabled={isSoldOut || !canIncrement}
                  onClick={() => updateQuantity(tt.id, tt.qty + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="min-w-[5.5rem] text-right text-sm font-semibold text-foreground">
                {formatZAR(tt.subtotal)}
              </div>
            </div>
          </div>
        );
      })}
      {ticketTypes.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
          <Ticket className="h-4 w-4" />
          Geen kaartjie tipes vir hierdie geleentheid nie.
        </div>
      )}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">
          {totalSelected} kaartjie{totalSelected !== 1 ? "s" : ""} gekies
        </span>
        <span className="text-lg font-semibold text-foreground">
          Totaal: {formatZAR(grandTotal)}
        </span>
      </div>
    </div>
  );
}
