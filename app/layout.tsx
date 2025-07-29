import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/nav';

export const metadata: Metadata = {
  title: 'Registration Form',
  description: 'Registration Form',
  generator: 'Registration Form',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Modal overlay */}
        {modal}

        {/* Navigation bar */}
        <Navbar />

        {/* Page content */}
        {children}
      </body>
    </html>
  );
}
