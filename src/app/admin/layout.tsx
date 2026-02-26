import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { BarChart3, Users, Activity, Home, Shield, LogOut } from 'lucide-react'

export const metadata = { title: 'Admin — AiTrackr' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/signin')

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  })
  if (!dbUser?.isAdmin) redirect('/dashboard')

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A] font-mono">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-[#1A1A1A] flex flex-col">
        <div className="p-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className="text-amber-500 font-bold text-sm tracking-widest">ADMIN</span>
          </div>
          <p className="text-[#444] text-xs mt-1 tracking-wider">AiTrackr Control Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[#888] hover:text-amber-500 hover:bg-[#111] transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[#888] hover:text-amber-500 hover:bg-[#111] transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </Link>
          <Link
            href="/admin/activity"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[#888] hover:text-amber-500 hover:bg-[#111] transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </Link>
        </nav>

        <div className="p-3 border-t border-[#1A1A1A] space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[#555] hover:text-[#888] hover:bg-[#111] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to App</span>
          </Link>
          <a
            href="/api/auth/signout"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[#555] hover:text-red-400 hover:bg-[#111] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-[#1A1A1A] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#555] text-xs tracking-widest">AITRACKR</span>
            <span className="text-[#333]">/</span>
            <span className="text-amber-500 text-xs tracking-widest">ADMIN_PANEL</span>
          </div>
          <div className="text-[#444] text-xs">
            {session.user.email}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
