import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helene Bester Konsert — Wapadrant Gemeente",
  description: "Koop jou kaartjies aanlyn vir die Helene Bester fondsinsamelingskonsert.",
  openGraph: {
    title: "Helene Bester Konsert — Wapadrant Gemeente",
    description: "Koop jou kaartjies aanlyn vir die Helene Bester fondsinsamelingskonsert.",
    images: ["/helene-bester-poster.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="af">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Maven+Pro:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] min-h-screen concert-pattern">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-white focus:text-[var(--primary)]"
        >
          Slaan oor na inhoud
        </a>
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
