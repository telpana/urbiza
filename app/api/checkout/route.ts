import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

const PRECIOS: Record<string, string> = {
  'profesional': 'price_1TjQ7N2W2OvWvCK3IFRRmZBY',
  '15': 'price_1TjIsm2W2OvWvCK3yycPzPR6',
  '30': 'price_1TjItK2W2OvWvCK3K2TW7Hf6',
  '60': 'price_1TjIts2W2OvWvCK3OG28wLg9',
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let userId: string, email: string, tipo: string, codigoPromo: string | undefined

    if (contentType.includes('application/json')) {
      const body = await req.json();
      ({ userId, email, tipo, codigoPromo } = body)
    } else {
      const form = await req.formData()
      userId = form.get('userId') as string
      email = form.get('email') as string
      tipo = form.get('tipo') as string
      codigoPromo = form.get('codigoPromo') as string || undefined
    }

    const priceId = PRECIOS[tipo || 'profesional']
    const esDestacado = ['15', '30', '60'].includes(tipo)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: esDestacado ? 'payment' : 'subscription',
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/panel?pago=ok&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/panel?pago=cancelado`,
      metadata: { userId, tipo },
    }

    if (codigoPromo && !esDestacado) {
      sessionParams.discounts = [{ coupon: codigoPromo }]
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(session.url!, 303)
    }
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
