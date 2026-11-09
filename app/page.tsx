export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TicketCheckout } from "./components/ticket-checkout";
import { formatAfrikaansDate, formatZAR } from "@/lib/date-format";
import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Ticket,
  CheckCircle2,
} from "lucide-react";
import type { Event } from "@/types/events";
import { prisma } from "@/lib/prisma";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg width='600' height='400' viewBox='0 0 600 400' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='600' height='400' fill='%23e8f0e8'/%3E%3Ccircle cx='300' cy='160' r='50' fill='%234a7c4a' opacity='0.3'/%3E%3Cpath d='M250 280 L300 200 L350 280 Z' fill='%234a7c4a' opacity='0.3'/%3E%3Crect x='200' y='290' width='200' height='8' rx='4' fill='%234a7c4a' opacity='0.2'/%3E%3Crect x='230' y='310' width='140' height='6' rx='3' fill='%234a7c4a' opacity='0.15'/%3E%3Ctext x='300' y='370' font-family='Arial' font-size='16' fill='%234a7c4a' opacity='0.4' text-anchor='middle'%3EWapadrant Gemeente%3C/text%3E%3C/svg%3E";

const EVENT_ID = "helene-bester-konser-2026";

export async function generateMetadata(): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { id: EVENT_ID },
    select: { title: true, description: true },
  });

  return {
    title: event
      ? `${event.title} | Wapadrant Gemeente`
      : "Gebeurtenis | Wapadrant Gemeente",
    description:
      event?.description || "Kom deel hierdie spesiale geleentheid saam met ons.",
  };
}

async function getEvent(id: string): Promise<Event | null> {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { ticketTypes: true },
    });

    if (!event) return null;

    return {
      ...event,
      date: event.date.toISOString(),
      endDate: event.endDate?.toISOString() || null,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      ticketTypes: event.ticketTypes.map((tt) => ({
        ...tt,
        price: tt.price.toNumber(),
        sold: tt.sold || 0,
      })),
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export default async function EventDetailPage() {
  const event = await getEvent(EVENT_ID);

  if (!event) {
    notFound();
  }

  const isPast = new Date(event.date) < new Date();
  const soldOut = event.ticketTypes.every(
    (tt) => tt.quantity - (tt.sold || 0) <= 0
  );
  const hasTickets = event.ticketTypes.length > 0;
  const minPrice = hasTickets
    ? Math.min(...event.ticketTypes.map((tt) => Number(tt.price)))
    : 0;

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <section className="bg-church-pattern py-12 sm:py-16">
        <div className="nw-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link
              href="https://www.wapadrant.co.za/gebeurtenisse"
              className="inline-flex items-center text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug na Gebeurtenisse
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl bg-[var(--card)] ring-1 ring-[var(--border)] shadow-lg">
              <img
                src="/helene-bester-3.jpeg"
                alt="Kers & Fees met Helene Bester"
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-3 flex flex-wrap gap-2">
                {isPast && (
                  <span className="badge">Verby</span>
                )}
                {soldOut && hasTickets && (
                  <span className="badge badge-primary bg-[var(--destructive)] text-white border-[var(--destructive)]">
                    Uitverkoop
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] font-[var(--font-heading)]">
                {event.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-[var(--muted-foreground)]">
                <CalendarDays className="h-5 w-5 text-[var(--primary)]" />
                {formatAfrikaansDate(event.date)}
              </p>
              <p className="mt-2 flex items-center gap-2 text-[var(--muted-foreground)]">
                <MapPin className="h-5 w-5 text-[var(--primary)]" />
                {event.location}
              </p>
              {hasTickets && !isPast && (
                <p className="mt-4 text-2xl font-semibold text-[var(--primary)]">
                  Vanaf {formatZAR(minPrice)}
                </p>
              )}

              {isPast ? (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--secondary)] px-4 py-3 text-sm text-[var(--muted-foreground)] border border-[var(--border)]">
                  <CalendarDays className="h-4 w-4" />
                  Hierdie gebeurtenis het reeds plaasgevind.
                </div>
              ) : hasTickets && !soldOut ? (
                <div className="mt-6">
                  <TicketCheckout event={event}>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 text-base font-medium hover:opacity-90 transition">
                      <Ticket className="h-5 w-5" />
                      Bespreek nou
                    </button>
                  </TicketCheckout>
                </div>
              ) : hasTickets && soldOut ? (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--destructive)]/10 px-4 py-3 text-sm font-medium text-[var(--destructive)] border border-[var(--destructive)]/20">
                  Uitverkoop — geen kaartjies meer beskikbaar nie.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 py-12 sm:py-16">
        <div className="nw-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="card">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                    Oor hierdie geleentheid
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Al die besonderhede wat u moet weet.
                  </p>
                </div>
                <div className="prose max-w-none text-[var(--foreground)]">
                  {event.description ? (
                    event.description.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-[var(--muted-foreground)]">
                      Geen verdere besonderhede beskikbaar nie.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--primary)]" />
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    Ligging
                  </h3>
                </div>
                <p className="text-[var(--foreground)]">{event.location}</p>
              </div>

              <div className="card">
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[var(--primary)]" />
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    Datum en tyd
                  </h3>
                </div>
                <p className="text-[var(--foreground)]">
                  {formatAfrikaansDate(event.date)}
                </p>
              </div>

              {hasTickets && !isPast && !soldOut && (
                <div className="card bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        Beskikbare kaartjies
                      </h3>
                      <p className="text-sm opacity-90">
                        Kies u kaartjies hier en voltooi die bespreking.
                      </p>
                    </div>
                  </div>
                  <TicketCheckout event={event} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
