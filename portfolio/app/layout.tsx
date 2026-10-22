import type { Metadata } from "next";
import { Archivo, Archivo_Narrow } from "next/font/google";
import Header from "@/components/Header";
import MotionProvider from "@/components/MotionProvider";
import { publicFileExists } from "@/lib/public-file";
import { loadSite } from "@/lib/site";
import "./globals.css";

const display = Archivo_Narrow({
  weight: "600",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Archivo({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  robots: process.env.PORTFOLIO_DEMO === "1" ? { index: false, follow: false } : undefined,
  title: "Joseph Orias, computer science student and designer",
  description:
    "Mark Joseph Orias is a computer science student at Camarines Sur Polytechnic Colleges. He builds web apps in Python and Flask, and designs the screens they run on.",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  const site = await loadSite();
  const hasResume = publicFileExists("resume.pdf");
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header site={site} hasResume={hasResume} />
        <MotionProvider>
          {children}
          {modal}
        </MotionProvider>
      </body>
    </html>
  );
}
