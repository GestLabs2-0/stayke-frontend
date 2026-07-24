import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Montserrat,
  Plus_Jakarta_Sans,
} from "next/font/google";

import { Footer } from "../components/layout/Footer/Footer";
import { Navbar } from "../components/layout/Navbar/Navbar";

import "@blossom-carousel/react/style.css";
import "./globals.css";

import AuthClientLayer from "@/components/auth/AuthClientLayer";
import { EmbeddedProvider } from "@/context/EmbeddedProvider";
import { NetworkContextProvider } from "@/context/NetworkContext";
import { WalletContextProvider } from "@/context/WalletContext";

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

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title:
    "Stayke - Your preferred hosting platform for decentralized applications",
  description:
    "A decentralized, open-source, and secure platform for managing and sharing your digital assets.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NetworkContextProvider>
          <EmbeddedProvider>
            <WalletContextProvider>
              <AuthClientLayer>
                <Navbar />
                <main className="bg-white pt-10 flex-1">{children}</main>
                <Footer />
              </AuthClientLayer>
            </WalletContextProvider>
          </EmbeddedProvider>
        </NetworkContextProvider>
      </body>
    </html>
  );
}
