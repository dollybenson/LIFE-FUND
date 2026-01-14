import { formatMoney } from '@/lib/money'

export function DonorPanel({ topDonors, latestDonors }: { topDonors: any[]; latestDonors: any[] }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Top donors</h3>
          <span className="text-xs text-slate-500">Highest amounts</span>
        </div>
        <ul className="mt-3 space-y-2">
          {topDonors.map((d, idx) => (
            <li key={d.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">{idx + 1}</span>
                <span className="text-sm font-semibold text-slate-800">{d.isAnonymous ? 'Anonymous' : (d.donorName?.trim() || 'Supporter')}</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">{formatMoney(d.amountMinor, d.currency)}</span>
            </li>
          ))}
        </ul>
        {topDonors.length === 0 && <p className="mt-3 text-sm text-slate-500">No donations yet.</p>}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Latest donors</h3>
          <span className="text-xs text-slate-500">Most recent</span>
        </div>
        <ul className="mt-3 space-y-2">
          {latestDonors.map((d) => (
            <li key={d.id} className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">{d.isAnonymous ? 'Anonymous' : (d.donorName?.trim() || 'Supporter')}</span>
              <span className="text-sm font-extrabold text-slate-900">{formatMoney(d.amountMinor, d.currency)}</span>
            </li>
          ))}
        </ul>
        {latestDonors.length === 0 && <p className="mt-3 text-sm text-slate-500">No donations yet.</p>}
      </div>
    </aside>
  )
}
