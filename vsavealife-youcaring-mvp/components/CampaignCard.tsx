import Link from 'next/link'
import { formatMoney } from '@/lib/money'
import { ProgressBar } from './ProgressBar'

export function CampaignCard({ c }: { c: any }) {
  const percent = c.goalMinor ? Math.round((c.raisedMinor / c.goalMinor) * 100) : 0
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Link href={`/c/${c.slug}`} className="block">
        <div className="aspect-[16/9] bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.coverPublicUrl || '/logo.png'} alt={c.title} className="h-full w-full object-cover" />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-extrabold text-slate-900 line-clamp-2">{c.title}</h3>
            <span className="text-xs font-bold uppercase text-slate-600 bg-slate-100 px-2 py-1 rounded-full">{c.currency}</span>
          </div>
          <div className="mt-3"><ProgressBar percent={percent} /></div>
          <div className="mt-2 text-sm text-slate-700 flex items-center justify-between">
            <span className="font-semibold">{formatMoney(c.raisedMinor, c.currency)} raised</span>
            <span className="text-slate-500">of {formatMoney(c.goalMinor, c.currency)}</span>
          </div>
          <div className="mt-3">
            <span className="inline-flex rounded-full bg-brand-500 text-white px-4 py-2 text-sm font-semibold">View campaign</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
