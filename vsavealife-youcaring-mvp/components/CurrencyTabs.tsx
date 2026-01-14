
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'usd', label: 'USD' },
  { key: 'eur', label: 'EUR' },
  { key: 'gbp', label: 'GBP' },
]

export function CurrencyTabs() {
  const router = useRouter()
  const sp = useSearchParams()

  const selected = sp.get('currency') || 'all'
  const q = sp.get('q') || ''
  const category = sp.get('category') || ''

  function setCurrency(cur: string) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    params.set('currency', cur)
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
      {TABS.map((t) => {
        const active = selected === t.key
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setCurrency(t.key)}
            className={
              'rounded-full px-4 py-2 text-sm font-semibold ' +
              (active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50')
            }
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
``
