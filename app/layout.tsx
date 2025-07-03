import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Registration Form',
  description: 'Registration Form',
  generator: 'Registration Form',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
