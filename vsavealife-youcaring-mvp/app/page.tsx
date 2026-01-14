export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getPrisma } from '@/lib/prisma'
import { CampaignCard } from '@/components/CampaignCard'

export default async function HomePage() {
  const prisma = getPrisma()
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'PUBLISHED', featured: true },
    orderBy: [{ raisedMinor: 'desc' }, { updatedAt: 'desc' }],
    take: 12,
  })

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Raise funds fast for medical and urgent needs.</h1>
        <p className="mt-4 text-slate-600 max-w-2xl">Create a campaign in minutes. Share it on WhatsApp and Facebook. Post updates as you progress.</p>

        <div className="mt-6 flex gap-3">
          <Link href="#" className="rounded-full bg-brand-500 px-6 py-3 text-white font-semibold">Start a Campaign</Link>
          <Link href="/explore" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-800">Explore campaigns</Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {['Medical','Emergency','Memorial','Education','Community','Animals','Disaster Relief','Funeral'].map((c) => (
            <Link key={c} href={`/explore?category=${encodeURIComponent(c)}&currency=all`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-500">{c}</Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold text-slate-900">Featured campaigns</h2>
          <Link className="text-sm font-semibold text-brand-600" href="/explore?currency=all">View all</Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} c={c} />
          ))}
        </div>
      </section>
    </main>
  )
}
