import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";

import { Navbar } from "../components/layout/Navbar/Navbar";
import { Footer } from "../components/layout/Footer/Footer";

import "@blossom-carousel/react/style.css";
import "./globals.css";
import { NetworkContextProvider } from "@/context/NetworkContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title:
    "Stayke - Your preferred hosting platform for decentralized applications",
  description:
    "A decentralized, open-source, and secure platform for managing and sharing your digital assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NetworkContextProvider>
          <Navbar />
          <main className="bg-white pt-10 flex-1">{children}</main>
          <Footer />
        </NetworkContextProvider>
      </body>
    </html>
  );
}
