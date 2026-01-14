
import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }

  if (!_stripe) {
    _stripe = new Stripe(key, {
      apiVersion: '2023-10-16',
    })
  }

  return _stripe
}


