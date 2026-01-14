'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const initial = sp.get('q') || ''
  const [q, setQ] = useState(initial)

  const category = sp.get('category') || ''
  const currency = sp.get('currency') || 'all'

  const action = useMemo(() => (pathname === '/' ? '/explore' : pathname), [pathname])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (category) params.set('category', category)
    if (currency) params.set('currency', currency)
    router.push(`${action}?${params.toString()}`)
  }

  return (
    <form onSubmit={submit}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search campaigns by title…"
        className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </form>
  )
}
