
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

export async function GET(req: Request) {
  const stripe = getStripe()

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const userId = searchParams.get('userId')

  if (!code || !userId) {
    return NextResponse.json({ error: 'Missing code or userId' }, { status: 400 })
  }

  const token = await stripe.oauth.token({ grant_type: 'authorization_code', code })

  const connectedAccountId = token.stripe_user_id
  if (!connectedAccountId) {
    return NextResponse.json(
      { error: 'Stripe did not return stripe_user_id.' },
      { status: 400 }
    )
  }

  const acct = await stripe.accounts.retrieve(connectedAccountId)

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeAccountId: connectedAccountId,
      stripeChargesEnabled: !!acct.charges_enabled,
      stripeDetailsSubmitted: !!acct.details_submitted,
    },
  })

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=connected`
  )
}


