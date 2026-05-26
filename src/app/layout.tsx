import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Marine et la douceur de l'été | Bijoux",
    template: "%s | Marine et la douceur de l'été",
  },
  description:
    "Bijoux artisanaux inspirés par la mer et l'été. Collection Lumière d'été — colliers, bracelets, boucles d'oreilles et bagues.",
  keywords: ["bijoux", "bijoux été", "bijoux mer", "collier", "bracelet", "bijoux artisanaux", "France"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Marine et la douceur de l'été",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
