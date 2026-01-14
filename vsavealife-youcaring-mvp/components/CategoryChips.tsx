
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const CATS = [
  'Medical',
  'Emergency',
  'Memorial',
  'Education',
  'Community',
  'Animals',
  'Disaster Relief',
  'Funeral',
]

export function CategoryChips() {
  const router = useRouter()
  const sp = useSearchParams()

  const selected = sp.get('category') || ''
  const q = sp.get('q') || ''
  const currency = sp.get('currency') || 'all'

  function toggle(cat: string) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (currency) params.set('currency', currency)

    // Single-select: clicking active chip clears it
    if (selected !== cat) params.set('category', cat)

    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATS.map((c) => {
        const active = selected === c
        return (
          <button
            key={c}
            type="button"
            onClick={() => toggle(c)}
            className={
              'rounded-full px-4 py-2 text-sm font-semibold border ' +
              (active
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500')
            }
          >
            {c}
          </button>
        )
      })}
    </div>
  )
}
