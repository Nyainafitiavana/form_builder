import React from "react";
import type {Metadata} from "next";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {ThemeProvider} from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <html lang="en">
          <body
          >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
            >
               {children}
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
  );
}
