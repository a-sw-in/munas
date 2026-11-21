import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portofolio - Yuko Pradana | Graphic Design & Social Media Management",
  description: "Graphic Design & Social Media Management Portfolio Presentation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#0d0f12] text-white antialiased">
      <body className="min-h-full flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
