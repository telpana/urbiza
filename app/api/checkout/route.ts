import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const PRECIOS: Record<string, string> = {
  'profesional': 'price_1TjH4t2W2OvWvCK3mzlhwV4z',
  '15': 'price_1TjIsm2W2OvWvCK3yycPzPR6',
  '30': 'price_1TjItK2W2OvWvCK3K2TW7Hf6',
  '60': 'price_1TjIts2W2OvWvCK3OG28wLg9',
}

export async function POST(req: Request) {
  try {
    const { userId, email, tipo, codigoPromo } = await req.json()
    const priceId = PRECIOS[tipo || 'profesional']
    const esDestacado = ['15', '30', '60'].includes(tipo)

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: esDestacado ? 'payment' : 'subscription',
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/panel?pago=ok`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/panel?pago=cancelado`,
      metadata: { userId, tipo },
    }

    if (codigoPromo && !esDestacado) {
      sessionParams.discounts = [{ coupon: codigoPromo }]
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}