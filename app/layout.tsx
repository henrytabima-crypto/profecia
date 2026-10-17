import type { Metadata } from "next";
import "./globals.css";
import "./game.css";
import "./bible.css";
import "./journey.css";
import "./guided.css";
import "./excerpt.css";
import "./motion.css";
import "./first-level.css";
import "./expedition-world.css";
import { BibleReaderProvider } from "./components/BibleReader";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ?? "https://profecia.henrytabimagiraldo.com",
  ),
  title: "Profecía | Atlas bíblico interactivo",
  description:
    "Un atlas visual e interactivo para explorar Daniel y Apocalipsis desde una perspectiva adventista.",
  keywords: [
    "profecía bíblica",
    "Daniel",
    "Apocalipsis",
    "Iglesia Adventista",
    "El conflicto de los siglos",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    title: "Profecía | Atlas interactivo de Daniel y Apocalipsis",
    description:
      "Explora mapas, cronologías e infografías bíblicas con las fuentes siempre a mano.",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Profecía: Entender el pasado. Discernir el presente.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profecía | Atlas bíblico interactivo",
    description:
      "Mapas, cronologías e infografías bíblicas con las fuentes siempre a mano.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased"><BibleReaderProvider>{children}</BibleReaderProvider></body>
    </html>
  );
}
