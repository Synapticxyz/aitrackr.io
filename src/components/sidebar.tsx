'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { LayoutDashboard, CreditCard, BarChart3, Puzzle, Settings, ShieldCheck } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  { href: '/dashboard/subscriptions', label: 'SUBSCRIPTIONS', icon: CreditCard },
  { href: '/dashboard/analytics', label: 'ANALYTICS', icon: BarChart3 },
  { href: '/dashboard/extension', label: 'EXTENSION', icon: Puzzle },
  { href: '/dashboard/settings', label: 'SETTINGS', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin === true

  return (
    <aside className="w-60 flex-shrink-0 border-r border-white/10 bg-black h-full flex flex-col">
      <div className="p-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo.png" alt="AiTrackr" width={140} height={32} className="h-8 w-auto object-contain" priority />
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-xs font-mono font-medium transition-colors',
                isActive
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {isAdmin && (
        <div className="px-3 pb-2">
          <Link
            href="/admin"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-xs font-mono font-medium transition-colors',
              pathname.startsWith('/admin')
                ? 'bg-amber-500 text-black'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            )}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            ADMIN
          </Link>
        </div>
      )}

      <div className="p-4 border-t border-white/10">
        <Link href="/" className="text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors">
          ← BACK_TO_SITE
        </Link>
      </div>
    </aside>
  )
}
