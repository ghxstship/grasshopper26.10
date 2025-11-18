import type { Metadata } from "next";
import { Bebas_Neue, Oswald, Share_Tech, Anton } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const oswald = Oswald({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  subsets: ["latin"],
});

const shareTech = Share_Tech({
  weight: "400",
  variable: "--font-share-tech",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grasshopper - Event Management Platform",
  description: "GVTEWAY, ATLVS, and COMPVSS - Comprehensive event management ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${oswald.variable} ${shareTech.variable} ${anton.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
