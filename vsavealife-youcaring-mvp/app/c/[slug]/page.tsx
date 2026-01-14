
export const dynamic = 'force-dynamic'

import { getPrisma } from '@/lib/prisma'
import { formatMoney } from '@/lib/money'
import { ProgressBar } from '@/components/ProgressBar'
import { DonateCard } from '@/components/DonateCard'
import { DonorPanel } from '@/components/DonorPanel'

export default async function CampaignPage({ params }: { params: { slug: string } }) {
  const prisma = getPrisma()

  const campaign = await prisma.campaign.findUnique({
    where: { slug: params.slug },
    include: { organizer: true },
  })

  if (!campaign) return <div className="p-10">Not found</div>

  const percent = campaign.goalMinor ? Math.round((campaign.raisedMinor / campaign.goalMinor) * 100) : 0

  const [topDonors, latestDonors] = await Promise.all([
    prisma.donation.findMany({
      where: { campaignId: campaign.id, status: 'PAID' },
      orderBy: [{ amountMinor: 'desc' }, { createdAt: 'desc' }],
      take: 10,
      select: { id: true, amountMinor: true, currency: true, donorName: true, isAnonymous: true, createdAt: true },
    }),
    prisma.donation.findMany({
      where: { campaignId: campaign.id, status: 'PAID' },
      orderBy: [{ createdAt: 'desc' }],
      take: 10,
      select: { id: true, amountMinor: true, currency: true, donorName: true, isAnonymous: true, createdAt: true },
    }),
  ])

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      <section>
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[16/9] bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.coverPublicUrl || '/logo.png'}
              alt={campaign.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{campaign.title}</h1>
            <p className="mt-1 text-sm text-slate-600">
              Category: <span className="font-semibold">{campaign.category}</span>
            </p>

            <div className="mt-5">
              <ProgressBar percent={percent} />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{formatMoney(campaign.raisedMinor, campaign.currency)} raised</span>
                <span className="text-slate-500">of {formatMoney(campaign.goalMinor, campaign.currency)}</span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-extrabold">Story</h2>
              <p className="mt-2 text-slate-700">
                (MVP) Story editor + images + YouTube embeds will be added next.
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-extrabold">Updates</h2>
              <p className="mt-2 text-slate-700">
                (MVP) Story updates + attachments will be added next.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:sticky lg:top-24 h-fit space-y-4">
        <DonateCard
          campaignId={campaign.id}
          connectedAccountId={campaign.organizer.stripeAccountId}
          currency={campaign.currency}
        />
        <DonorPanel topDonors={topDonors} latestDonors={latestDonors} />
      </section>
    </main>
  )
}
