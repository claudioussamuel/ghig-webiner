'use client';

import { useState,  } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { auth } from '../app/config/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/'); 
  };

  return (
    <nav className="w-full z-50 bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 shadow-lg border-b border-white/10 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img src="/images.jpg" alt="Logo" className="w-10 h-10 rounded-lg shadow-md border border-white/20" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">GHIG Portal</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-purple-200 hover:text-white font-medium transition-colors">Dashboard</Link>
          <Link href="/register" className="text-purple-200 hover:text-white font-medium transition-colors">Register</Link>
          <Link href="/admin-register" className="text-purple-200 hover:text-white font-medium transition-colors">Admin Register</Link>
          <Link href="/thank-you" className="text-purple-200 hover:text-white font-medium transition-colors">Thank You</Link>
          <button
           onClick={handleLogout}
           className="block text-purple-200 hover:text-white font-medium"
          >
          Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-purple-100 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/dashboard" className="block text-purple-200 hover:text-white font-medium">Dashboard</Link>
          <Link href="/register" className="block text-purple-200 hover:text-white font-medium">Register</Link>
          <Link href="/admin-register" className="block text-purple-200 hover:text-white font-medium">Admin Register</Link>
          <Link href="/thank-you" className="block text-purple-200 hover:text-white font-medium">Thank You</Link>
          <button
           onClick={handleLogout}
           className="block text-purple-200 hover:text-white font-medium"
          >
          Logout
          </button>
        </div>
      )}
    </nav>
  );
}
