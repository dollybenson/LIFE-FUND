import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'
import { MIN_DONATION_MINOR, platformFeeMinor } from '@/lib/money'

const ALLOWED = new Set(['usd','eur','gbp'])

export async function POST(req: Request) {
  try {
    const { campaignId, connectedAccountId, donationAmountMinor } = await req.json()

    if (!campaignId || !connectedAccountId) {
      return NextResponse.json({ error: 'Missing campaignId or connectedAccountId' }, { status: 400 })
    }

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } })
    if (!campaign || campaign.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Campaign not available' }, { status: 400 })
    }

    if (!ALLOWED.has(campaign.currency)) {
      return NextResponse.json({ error: 'Currency not supported' }, { status: 400 })
    }

    if (!Number.isInteger(donationAmountMinor) || donationAmountMinor < MIN_DONATION_MINOR) {
      return NextResponse.json({ error: 'Minimum donation is 5.00' }, { status: 400 })
    }

    const fee = Math.min(platformFeeMinor(donationAmountMinor), donationAmountMinor)

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: campaign.currency,
              product_data: { name: `Donation: ${campaign.title}` },
              unit_amount: donationAmountMinor,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: fee,
          metadata: {
            campaignId: campaign.id,
            donationAmountMinor: String(donationAmountMinor),
            platformFeeMinor: String(fee),
            currency: campaign.currency,
          },
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/c/${campaign.slug}?paid=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/c/${campaign.slug}`,
      },
      { stripeAccount: connectedAccountId }
    )

    await prisma.donation.create({
      data: {
        campaignId: campaign.id,
        amountMinor: donationAmountMinor,
        currency: campaign.currency,
        status: 'PENDING',
        stripeSessionId: session.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Checkout failed' }, { status: 500 })
  }
}
