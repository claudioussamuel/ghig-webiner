import type { Metadata } from 'next'
import './globals.css'
import Link from "next/link"

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
      <body>
        {/* Navigation Bar */}
        <nav className="w-full z-50 bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 shadow-lg border-b border-white/10 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/images.jpg" alt="Logo" className="w-10 h-10 rounded-lg shadow-md border border-white/20" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">GHIG Portal</span>
            </div>
            <div className="flex items-center space-x-6">

              <Link href="/dashboard" className="text-purple-200 hover:text-white font-medium transition-colors">Dashboard</Link>
              <Link href="/register" className="text-purple-200 hover:text-white font-medium transition-colors">Register</Link>
              <Link href="/admin-register" className="text-purple-200 hover:text-white font-medium transition-colors">Admin Register</Link>
              <Link href="/thank-you" className="text-purple-200 hover:text-white font-medium transition-colors">Thank You</Link>
            </div>
          </div>
        </nav>
        {/* End Navigation Bar */}
        {children}
      </body>
    </html>
  )
}
