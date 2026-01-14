export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPrisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const prisma = getPrisma()
  const stripe = getStripe()

  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: any
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const donation = await prisma.donation.findUnique({
      where: { stripeSessionId: session.id },
    })

    if (donation && donation.status !== 'PAID') {
      await prisma.$transaction([
        prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: 'PAID',
            stripePaymentIntentId: session.payment_intent?.toString() || null,
          },
        }),
        prisma.campaign.update({
          where: { id: donation.campaignId },
          data: { raisedMinor: { increment: donation.amountMinor } },
        }),
      ])
    }
  }

  return NextResponse.json({ received: true })
}
