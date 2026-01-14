'use client'

import { useMemo, useState } from 'react'
import { MIN_DONATION_MINOR } from '@/lib/money'

export function DonateCard({ campaignId, connectedAccountId, currency }: { campaignId: string; connectedAccountId: string | null; currency: string }) {
  const [amount, setAmount] = useState('5')
  const [loading, setLoading] = useState(false)
  const min = useMemo(() => (MIN_DONATION_MINOR / 100).toFixed(2), [])

  async function donate() {
    if (!connectedAccountId) {
      alert('Creator has not connected Stripe yet.')
      return
    }

    const value = Number(amount)
    if (!Number.isFinite(value) || value < 5) {
      alert(`Minimum donation is ${min}`)
      return
    }

    setLoading(true)
    try {
      const donationAmountMinor = Math.round(value * 100)
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, connectedAccountId, donationAmountMinor }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Checkout failed')
      window.location.href = data.url
    } catch (e: any) {
      alert(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-extrabold text-slate-900">Donate</h3>
      <p className="mt-1 text-xs text-slate-500">Minimum donation is {min} {currency.toUpperCase()}</p>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-slate-600 font-bold">{currency.toUpperCase()}</span>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          inputMode="decimal"
          placeholder="5"
        />
      </div>

      <button onClick={donate} disabled={loading} className="mt-4 w-full rounded-xl bg-brand-500 text-white py-2 font-semibold disabled:opacity-60">
        {loading ? 'Redirecting…' : 'Donate now'}
      </button>

      <p className="mt-3 text-xs text-slate-500">Platform fee is deducted from creator proceeds: max(1.00, 5% of donation).</p>
    </div>
  )
}
