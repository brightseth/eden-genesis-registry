import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eden2 Agent Shell',
  description: 'Sovereign agent runtime for Eden2 federation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}