import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'McPaper - Ihr Fachmarkt für Bürobedarf',
    template: '%s | McPaper',
  },
  description:
    'McPaper - Deutschlands führender Fachmarkt für Bürobedarf, Schreibwaren und Geschenkartikel. Jetzt online bestellen!',
  keywords: [
    'Bürobedarf',
    'Schreibwaren',
    'Kopierpapier',
    'Ordner',
    'Stifte',
    'Office Supplies',
    'McPaper',
  ],
  authors: [{ name: 'McPaper AG' }],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://mcpaper.distri-smart.com',
    siteName: 'McPaper',
    title: 'McPaper - Ihr Fachmarkt für Bürobedarf',
    description:
      'McPaper - Deutschlands führender Fachmarkt für Bürobedarf, Schreibwaren und Geschenkartikel.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased min-h-screen flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A1A1A',
              color: '#fff',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#28A745',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#DC3545',
                secondary: '#fff',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
