"use client";

import { useState, useEffect } from "react";
import { Loader2, Ticket, X } from "lucide-react";
import { TicketSelector, SelectedTicket } from "./ticket-selector";
import { formatZAR } from "@/lib/date-format";
import type { Event, Ticket as TicketModel } from "@/types/events";

interface TicketCheckoutProps {
  event: Event;
}

export function TicketCheckout({ event }: TicketCheckoutProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedTicket[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<TicketModel | null>(null);

  const totalAmount = selected.reduce((sum, s) => {
    const type = event.ticketTypes.find((tt) => tt.id === s.ticketTypeId);
    return sum + s.quantity * Number(type?.price || 0);
  }, 0);

  useEffect(() => {
    if (error && selected.length > 0) {
      setError("");
    }
  }, [selected, error]);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Vul asseblief u volle naam in.");
      return;
    }
    if (!email.trim() || !isValidEmail(email)) {
      setError("Vul asseblief 'n geldige e-pos adres in.");
      return;
    }
    if (!phone.trim()) {
      setError("Vul asseblief u telefoonnommer in.");
      return;
    }
    if (selected.length === 0 || totalAmount <= 0) {
      setError("Kies asseblief ten minste een kaartjie.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/events/${event.id}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: name,
          buyerEmail: email,
          buyerPhone: phone,
          items: selected.map((item) => ({
            ticketTypeId: item.ticketTypeId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Kon nie kaartjie koop nie");
      }

      const result = await response.json();
      setConfirmedTicket(result.tickets?.[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout. Probeer weer.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setConfirmedTicket(null);
      setSelected([]);
      setName("");
      setEmail("");
      setPhone("");
      setError("");
    }, 200);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-wapa text-lg">
        <Ticket className="w-5 h-5" />
        Bespreek nou
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isLoading && handleClose()}
          />
          <div className="relative z-10 w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl bg-[var(--card)] p-6 ring-1 ring-[var(--border)] shadow-xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--secondary)] disabled:opacity-30"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Sluit</span>
            </button>

            {confirmedTicket ? (
              <div className="space-y-5 py-2">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">Bevestiging</h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    'n Epos met verdere inligting is gestuur na {confirmedTicket.buyerEmail}.
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4 space-y-3">
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Bespreking verwysingsnommer:</p>
                    <p className="mt-1 font-mono text-lg font-semibold text-[var(--primary)]">
                      #{confirmedTicket.reservation_reference}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Kaartjie verwysingsnommer:</p>
                    <p className="mt-1 font-mono text-sm font-medium text-[var(--primary)]">
                      #{confirmedTicket.reference}
                    </p>
                  </div>
                </div>
                <button onClick={handleClose} className="btn-wapa">Dankie</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 py-2">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    Kaartjies Bespreek — {event.title}
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Vul u besonderhede in en kies u kaartjies.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Jou Besonderhede</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)]">
                      Volle naam *
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Byvoorbeeld: Jan van Wyk"
                      required
                      className="input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
                      E-pos *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jan@voorbeeld.com"
                      required
                      className="input"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--foreground)]">
                      Telefoon *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Byvoorbeeld: 082 123 4567"
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">Kaartjie opsies</label>
                  <TicketSelector
                    ticketTypes={event.ticketTypes}
                    selected={selected}
                    onChange={setSelected}
                  />
                </div>

                {error && (
                  <p className="text-sm font-medium text-[var(--destructive)]">{error}</p>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[var(--border)] pt-4">
                  <div className="text-sm font-medium text-[var(--foreground)]">
                    Totaal: {formatZAR(totalAmount)}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || totalAmount <= 0}
                    className="btn-wapa"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verwerk...
                      </>
                    ) : (
                      `Bespreek nou — ${formatZAR(totalAmount)}`
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
