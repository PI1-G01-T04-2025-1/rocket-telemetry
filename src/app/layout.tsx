import type { Metadata } from "next";
import { Geist, Geist_Mono, Itim } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const itimFont = Itim({
  variable: "--font-itim",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "Oásis Rocket",
  description: "Oásis Rocket, telemetria de lançamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-lt-installed="true">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${itimFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
