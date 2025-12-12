import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const winterIsComing = localFont({
  src: '../public/fonts/Winter is coming.otf',
  variable: '--font-disney',
  display: 'swap',
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
    <html lang="en" className={`${winterIsComing.variable} ${quicksand.variable}`}>
      <body className="min-h-screen font-body">
        {children}
      </body>
    </html>
  );
}
