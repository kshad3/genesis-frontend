import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "North Highland",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          {children}
          <Script
            src={
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"
            }
          />
          <Script
            src={
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js"
            }
          />
          <Script
            id={"pdfjsLib"}
            dangerouslySetInnerHTML={{
              __html: `window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';`,
            }}
          />
        </>
      </body>
    </html>
  );
}
