import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DISNEYIFY',
  description: 'Transform any image into a Disney character',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={quicksand.className}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
