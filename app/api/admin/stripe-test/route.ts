import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyToken } from '../verify/route'

export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const key = process.env.STRIPE_SECRET_KEY
  const keyInfo = key ? `${key.substring(0, 12)}... (${key.length} chars)` : 'MISSING'

  try {
    const stripe = new Stripe(key!, {})
    const products = await stripe.products.list({ limit: 1 })
    return NextResponse.json({ ok: true, keyInfo, products: products.data.length })
  } catch (e: any) {
    return NextResponse.json({ ok: false, keyInfo, errorType: e.type, errorMessage: e.message })
  }
}
