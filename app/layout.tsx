import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import React from "react";
// eslint-disable-next-line
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";

export const metaData: Metadata = {
  title: "DevFlood",
  description:
    "A platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers around the world. Explore topics in web development, mobile development, algorithms, data structure, and more.",
};
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space_grotesk",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
