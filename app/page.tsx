import { Calendar, MapPin, Music, Ticket } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="badge badge-primary mb-4">Fondsinsamelingskonsert</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[var(--foreground)]">
                Helene Bester
                <span className="block text-[var(--primary)]">Lewendig in Konsert</span>
              </h1>
              <p className="text-lg text-[var(--muted-foreground)] mb-8 max-w-xl">
                Kom geniet 'n onvergeetlike aand met Helene Bester ter ondersteuning van Wapadrant Gemeente se fondsinsameling.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
                  <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  <span className="font-medium">24 Januarie 2026</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
                  <MapPin className="w-5 h-5 text-[var(--primary)]" />
                  <span className="font-medium">Wapadrant Gemeente, Pretoria</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
                  <Music className="w-5 h-5 text-[var(--primary)]" />
                  <span className="font-medium">18:00 — Deure open</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/ticket" className="btn-wapa text-center">
                  <Ticket className="w-5 h-5" />
                  Koop jou kaartjie
                </a>
                <a
                  href="https://www.wapadrant.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[var(--border)] rounded-xl text-[var(--foreground)] font-medium hover:bg-[var(--secondary)] transition"
                >
                  Besoek gemeente webwerf
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[var(--border)] aspect-[4/5] bg-[var(--card)]">
                <img
                  src="/helene-bester-poster.jpg"
                  alt="Helene Bester Konsert plakkaat"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket tiers preview */}
      <section className="py-16 bg-[var(--secondary)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Kaartjieopsies</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Kies die kaartjie wat by jou pas. Alle kaartjies sluit toegang tot die konsert in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="tier-card text-center">
              <h3 className="text-xl font-semibold mb-2">Standaard</h3>
              <p className="text-3xl font-bold text-[var(--primary)] mb-2">R150</p>
              <p className="text-sm text-[var(--muted-foreground)]">Algemene sieritorium sitplekke</p>
            </div>
            <div className="tier-card text-center border-[var(--primary)]">
              <span className="badge badge-primary mb-2">Gewild</span>
              <h3 className="text-xl font-semibold mb-2">VIP</h3>
              <p className="text-3xl font-bold text-[var(--primary)] mb-2">R300</p>
              <p className="text-sm text-[var(--muted-foreground)]">Voorste rye + welkomstdrankie</p>
            </div>
            <div className="tier-card text-center">
              <h3 className="text-xl font-semibold mb-2">Tafel vir 10</h3>
              <p className="text-3xl font-bold text-[var(--primary)] mb-2">R2 500</p>
              <p className="text-sm text-[var(--muted-foreground)]">Gereserveerde tafel met versnaperinge</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a href="/ticket" className="btn-wapa inline-flex">
              <Ticket className="w-5 h-5" />
              Begin bestelling
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
