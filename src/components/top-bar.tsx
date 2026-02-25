'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, ChevronDown, Sparkles } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface TopBarProps {
  alertCount?: number
}

export function TopBar({ alertCount = 0 }: TopBarProps) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <header className="h-14 border-b border-white/10 bg-black flex items-center justify-end px-6 gap-4">
      <button
        onClick={() => router.push('/dashboard')}
        className="relative p-2 text-gray-500 hover:text-white transition-colors"
      >
        <Bell className="h-4 w-4" />
        {alertCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
        )}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono text-gray-300 hover:text-white">
          <div className="w-5 h-5 bg-amber-500 flex items-center justify-center text-black text-xs font-bold font-mono">
            {getInitials(session?.user?.name)}
          </div>
          <span className="hidden sm:block max-w-32 truncate">{session?.user?.name ?? 'User'}</span>
          <ChevronDown className="h-3 w-3 text-gray-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 font-mono" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-bold text-white">{session?.user?.name ?? 'User'}</p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="text-xs">
            SETTINGS
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/pricing')} className="text-xs">
            {session?.user?.subscriptionStatus === 'PRO' ? (
              <><Sparkles className="h-3 w-3 mr-2 text-amber-500" />PRO_PLAN</>
            ) : (
              <span className="text-amber-500">UPGRADE_TO_PRO</span>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-xs text-red-400 focus:text-red-400"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            SIGN_OUT
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
