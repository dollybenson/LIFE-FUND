
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getPrisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const prisma = getPrisma() //

  // Demo-only: use the demo creator by env email
  const email = process.env.DEMO_CREATOR_EMAIL || 'creator@example.com'

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) return <div className="p-10">Run seed first.</div>

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-extrabold">Creator dashboard (demo)</h1>
      <p className="mt-2 text-slate-600">
        Connect Stripe and accept the creator fee policy.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold">Stripe connection</h2>
        <p className="mt-2 text-sm text-slate-600">
          Connected account:{' '}
          <span className="font-mono">{user.stripeAccountId || 'Not connected'}</span>
        </p>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/api/stripe/connect/start?userId=${user.id}`}
            className="rounded-full bg-brand-500 px-5 py-2 text-white font-semibold"
          >
            Connect with Stripe
          </Link>
        </div>

        <h3 className="mt-8 text-sm font-extrabold">Creator fee consent (required)</h3>
        <p className="mt-2 text-sm text-slate-700">
          I agree the platform fee will be deducted from each donation:{' '}
          <b>max(1.00, 5% of donation)</b> (no upper cap).
        </p>
        <p className="mt-2 text-xs text-slate-500">
          (MVP) Consent capture UI will be added next. For now, set{' '}
          <code>creatorFeeConsentAcceptedAt</code> in DB.
        </p>
      </div>

      <div className="mt-8">
        /
          ← Back to home
        </Link>
      </div>
    </main>
  )
}
