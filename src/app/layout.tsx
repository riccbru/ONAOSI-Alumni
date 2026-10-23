import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONAOSI Alumni Network",
  description:
    "La rete degli alumni ONAOSI: mappa 3D interattiva delle fellowship (Perugia → Chicago, Taipei) e direttorio completo dei borsisti.",
};

export const viewport: Viewport = {
  themeColor: "#003366",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-neutral-50 text-text antialiased">{children}</body>
    </html>
  );
}
