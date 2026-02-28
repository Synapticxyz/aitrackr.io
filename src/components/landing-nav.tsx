'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Download } from 'lucide-react'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed w-full z-50 top-0 border-b bg-black/95 backdrop-blur-sm transition-colors duration-200 ${
        scrolled ? 'border-white/20' : 'border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="AiTrackr" width={160} height={36} className="h-9 w-auto object-contain" priority />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-mono text-gray-400 hover:text-white transition-colors">[Features]</a>
            <a href="#how-it-works" className="text-sm font-mono text-gray-400 hover:text-white transition-colors">[How_It_Works]</a>
            <a href="#pricing" className="text-sm font-mono text-gray-400 hover:text-white transition-colors">[Pricing]</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/signin" className="hidden md:block text-sm font-mono text-gray-400 hover:text-white transition-colors">
              Sign_In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-amber-500 text-black px-5 py-2 font-mono font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2"
            >
              GET_STARTED
              <Download className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
