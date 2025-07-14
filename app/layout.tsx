import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Registration Form',
  description: 'Registration Form',
  generator: 'Registration Form',
}

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode,
  modal : React.ReactNode,
}>) {
  return (
    <html lang="en">
      {modal}
      <body>{children}</body>
    </html>
  )
}
