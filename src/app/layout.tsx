import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eden Academy Registry - Registry-as-Protocol",
  description: "Single source of truth for Eden ecosystem agents, works, and cohorts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="helvetica-regular antialiased">
        {children}
      </body>
    </html>
  );
}
