import React, { useState, useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingSpinner from "./components/LoadingSpinner"; // Import the loading spinner

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Summers Collection",
  description: "Summer's fashion marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ADD8E6" />
      </head>
      <body className={inter.className}>
        {isLoading ? <LoadingSpinner /> : children}
      </body>
    </html>
  );
}
