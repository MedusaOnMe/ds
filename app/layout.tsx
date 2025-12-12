import type { Metadata } from 'next';
import { Cinzel, Quicksand } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-disney',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
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
    <html lang="en" className={`${cinzel.variable} ${quicksand.variable}`}>
      <body className="min-h-screen font-body">
        {children}
      </body>
    </html>
  );
}
