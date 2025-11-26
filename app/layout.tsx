import type { Metadata } from 'next';
import { Comic_Neue } from 'next/font/google';
import './globals.css';

const comicNeue = Comic_Neue({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WOJAKIFY',
  description: 'Transform any image into a Wojak meme',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${comicNeue.className}`}>
        {children}
      </body>
    </html>
  );
}
