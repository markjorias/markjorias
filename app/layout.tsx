import type { Metadata } from "next";
import { Archivo, Archivo_Narrow } from "next/font/google";
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
  title: "Joseph Orias, computer science student and designer",
  description:
    "Mark Joseph Orias is a computer science student at Camarines Sur Polytechnic Colleges. He builds web apps in Python and Flask, and designs the screens they run on.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
