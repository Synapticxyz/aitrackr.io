'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Shield, Trash2 } from 'lucide-react'

interface UserRow {
  id: string
  email: string
  name: string | null
  createdAt: string
  subscriptionStatus: string
  deletedAt: string | null
  isAdmin: boolean
  _count: { usageLogs: number; subscriptions: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set('q', search)
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(data.users)
      setTotal(data.total)
      setPages(data.pages)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#E0E0E0] text-lg font-bold tracking-wider">USERS</h1>
          <p className="text-[#444] text-xs mt-1">{total} total accounts</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="search by email or name..."
          className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded pl-8 pr-3 py-2 text-xs text-[#888] placeholder-[#333] focus:outline-none focus:border-amber-500/30 tracking-wider"
        />
      </div>

      {/* Table */}
      <div className="border border-[#1A1A1A] rounded overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1A1A1A] bg-[#0D0D0D]">
              <th className="text-left px-4 py-2.5 text-[#444] tracking-widest font-normal">USER</th>
              <th className="text-left px-4 py-2.5 text-[#444] tracking-widest font-normal">PLAN</th>
              <th className="text-left px-4 py-2.5 text-[#444] tracking-widest font-normal">USAGE</th>
              <th className="text-left px-4 py-2.5 text-[#444] tracking-widest font-normal">SUBS</th>
              <th className="text-left px-4 py-2.5 text-[#444] tracking-widest font-normal">JOINED</th>
              <th className="text-left px-4 py-2.5 text-[#444] tracking-widest font-normal">FLAGS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#333] tracking-widest animate-pulse">
                  LOADING...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#333] tracking-widest">
                  NO_USERS_FOUND
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-[#111] hover:bg-[#0D0D0D] transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-[#888]">{u.email}</div>
                    {u.name && <div className="text-[#444] text-xs mt-0.5">{u.name}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-1.5 py-0.5 rounded text-xs tracking-wider ${
                      u.subscriptionStatus === 'PRO'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-[#111] text-[#555] border border-[#1A1A1A]'
                    }`}>
                      {u.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#555]">{u._count.usageLogs}</td>
                  <td className="px-4 py-3 text-[#555]">{u._count.subscriptions}</td>
                  <td className="px-4 py-3 text-[#444]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {u.isAdmin && (
                        <span title="Admin" className="text-amber-500">
                          <Shield className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {u.deletedAt && (
                        <span title="Soft deleted" className="text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center gap-3 text-xs text-[#444]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-2 py-1 border border-[#1A1A1A] rounded hover:border-amber-500/30 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            PREV
          </button>
          <span className="tracking-widest">
            PAGE {page} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="flex items-center gap-1 px-2 py-1 border border-[#1A1A1A] rounded hover:border-amber-500/30 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            NEXT
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}
