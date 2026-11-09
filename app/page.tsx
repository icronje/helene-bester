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
} from "lucide-react";
import type { Event } from "@/types/events";
import { prisma } from "@/lib/prisma";

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
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="https://www.wapadrant.co.za/gebeurtenisse"
            className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug na Gebeurtenisse
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10">
              <img
                src="/helene-bester-3.jpeg"
                alt="Kers & Fees met Helene Bester"
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-3 flex flex-wrap gap-2">
                {isPast && (
                  <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    Verby
                  </span>
                )}
                {soldOut && hasTickets && (
                  <span className="inline-flex items-center rounded-md bg-destructive px-2.5 py-0.5 text-xs font-medium text-destructive-foreground">
                    Uitverkoop
                  </span>
                )}
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                {event.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-5 w-5 text-primary" />
                {formatAfrikaansDate(event.date)}
              </p>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                {event.location}
              </p>
              {hasTickets && !isPast && (
                <p className="mt-4 text-2xl font-semibold text-primary">
                  Vanaf {formatZAR(minPrice)}
                </p>
              )}

              {isPast ? (
                <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Hierdie gebeurtenis het reeds plaasgevind.
                </div>
              ) : hasTickets && !soldOut ? (
                <div className="mt-6">
                  <TicketCheckout event={event}>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Ticket className="h-5 w-5" />
                      Bespreek nou
                    </button>
                  </TicketCheckout>
                </div>
              ) : hasTickets && soldOut ? (
                <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                  Uitverkoop — geen kaartjies meer beskikbaar nie.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Oor hierdie geleentheid
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Al die besonderhede wat u moet weet.
                  </p>
                </div>
                <div className="prose max-w-none text-foreground">
                  {event.description ? (
                    event.description.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      Geen verdere besonderhede beskikbaar nie.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Ligging
                  </h3>
                </div>
                <p className="text-foreground">{event.location}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Datum en tyd
                  </h3>
                </div>
                <p className="text-foreground">
                  {formatAfrikaansDate(event.date)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
