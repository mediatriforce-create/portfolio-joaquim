import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/layout/SmoothScrolling";
import { HeroParticlesWrapper } from "@/components/ui/HeroParticlesWrapper";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joaquim AI | System Architect & AI Developer",
  description:
    "Construo sistemas operacionais de alta precisão com IA e automação. Do caos digital ao cockpit que roda sozinho.",
  keywords: [
    "AI Developer",
    "System Architect",
    "Automação",
    "Next.js",
    "Supabase",
    "Inteligência Artificial",
  ],
  authors: [{ name: "Joaquim Salles" }],
  creator: "Joaquim Salles",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Joaquim AI | System Architect",
    description:
      "Sistemas de alta precisão com IA e automação. Do caos digital ao controle absoluto.",
    siteName: "Joaquim AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joaquim AI | System Architect",
    description:
      "Sistemas de alta precisão com IA e automação. Do caos digital ao controle absoluto.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark bg-black">
      <body
        className={`${ibmPlexSans.variable} ${jetBrainsMono.variable} font-sans bg-black text-white antialiased selection:bg-[#00ff66] selection:text-black overflow-x-clip`}
      >
        <HeroParticlesWrapper />
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
