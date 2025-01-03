import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <link
          rel="icon"
          href="https://www.sealos.io/img/sealos-left.png"
          type="image/png"
          sizes="any"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
