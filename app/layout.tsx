import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteFlow AI",
  description: "AI study workspace",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pl" className="dark" suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
