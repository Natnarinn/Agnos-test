import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGNOS Patient Registration & Staff Dashboard",
  description: "Real-time patient registration monitoring and form submission",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-100 text-slate-900">{children}</body>
    </html>
  );
}
