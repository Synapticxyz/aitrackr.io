import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth-cache'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.user) redirect('/auth/signin')

  const alertCount = await prisma.overlapAlert.count({
    where: { userId: session.user.id, dismissed: false },
  })

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar alertCount={alertCount} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
