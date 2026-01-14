
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const code = searchParams.get('code')
  const userId = searchParams.get('userId')

  if (!code || !userId) {
    return NextResponse.json({ error: 'Missing code or userId' }, { status: 400 })
  }

  // Exchange the authorization code for an access token + connected account id
  const token = await stripe.oauth.token({ grant_type: 'authorization_code', code })

  // ✅ TypeScript-safe check (stripe_user_id can be string | undefined)
  const connectedAccountId = token.stripe_user_id
  if (!connectedAccountId) {
    return NextResponse.json(
      { error: 'Stripe did not return a connected account id (stripe_user_id).' },
      { status: 400 }
    )
  }

  // Retrieve account to store readiness flags
  const acct = await stripe.accounts.retrieve(connectedAccountId)

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeAccountId: connectedAccountId,
      stripeChargesEnabled: !!acct.charges_enabled,
      stripeDetailsSubmitted: !!acct.details_submitted,
    },
  })

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=connected`)
}

