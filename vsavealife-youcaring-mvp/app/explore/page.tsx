export const dynamic = 'force-dynamic'
import { getPrisma } from '@/lib/prisma'
import { CampaignCard } from '@/components/CampaignCard'
import { CategoryChips } from '@/components/CategoryChips'
import { CurrencyTabs } from '@/components/CurrencyTabs'

export default async function ExplorePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const prisma = getPrisma()
  const category = typeof searchParams.category === 'string' ? searchParams.category : ''
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const currency = typeof searchParams.currency === 'string' ? searchParams.currency : 'all'

  const whereBase: any = {
    status: 'PUBLISHED',
    ...(category ? { category } : {}),
    ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),
  }

  async function fetchCurrency(cur: string) {
    return prisma.campaign.findMany({
      where: { ...whereBase, currency: cur },
      orderBy: [{ raisedMinor: 'desc' }, { updatedAt: 'desc' }],
      take: 18,
    })
  }

  const data = currency === 'all'
    ? await Promise.all([fetchCurrency('usd'), fetchCurrency('eur'), fetchCurrency('gbp')])
    : [await prisma.campaign.findMany({
        where: { ...whereBase, currency },
        orderBy: [{ raisedMinor: 'desc' }, { updatedAt: 'desc' }],
        take: 54,
      })]

  const [usd, eur, gbp] = currency === 'all' ? data as any : [[], [], []]
  const single = currency !== 'all' ? data[0] as any[] : []

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Explore campaigns</h1>
        <p className="mt-1 text-sm text-slate-600">Trending by most raised</p>

        <div className="mt-5 flex flex-col gap-4">
          <CurrencyTabs />
          <CategoryChips />
        </div>

        {q && (
          <p className="mt-4 text-sm text-slate-600">Searching titles for: <span className="font-semibold text-slate-900">{q}</span></p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 space-y-10">
        {currency === 'all' ? (
          <>
            <Section title="Trending in USD" items={usd} />
            <Section title="Trending in EUR" items={eur} />
            <Section title="Trending in GBP" items={gbp} />
          </>
        ) : (
          <Section title={`Trending in ${currency.toUpperCase()}`} items={single} />
        )}
      </section>
    </main>
  )
}

function Section({ title, items }: { title: string; items: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No campaigns found.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => <CampaignCard key={c.id} c={c} />)}
        </div>
      )}
    </div>
  )
}
