import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const state = crypto.randomBytes(16).toString('hex')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.STRIPE_CLIENT_ID!,
    scope: 'read_write',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/connect/callback?userId=${userId}`,
    state,
  })

  return NextResponse.redirect(`https://connect.stripe.com/oauth/authorize?${params.toString()}`)
}
