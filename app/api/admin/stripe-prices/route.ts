import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})
  const prices = await stripe.prices.list({ limit: 20, expand: ['data.product'] })
  const result = prices.data.map(p => ({
    id: p.id,
    amount: p.unit_amount,
    currency: p.currency,
    product: (p.product as any)?.name ?? p.product,
    active: p.active,
  }))
  return NextResponse.json(result)
}
