import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Sin userId' }, { status: 400 })

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('stripe_subscription_id, plan_activo_hasta, created_at')
      .eq('id', userId)
      .single()

    if (!usuario?.stripe_subscription_id) {
      return NextResponse.json({ ok: true, sin_sub: true })
    }

    const sub = await stripe.subscriptions.retrieve(usuario.stripe_subscription_id, {
      expand: ['default_payment_method', 'customer'],
    })

    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

    const invoicesRes = await stripe.invoices.list({
      customer: customerId,
      limit: 12,
    })

    const card = sub.default_payment_method &&
      typeof sub.default_payment_method !== 'string' &&
      sub.default_payment_method.card
        ? sub.default_payment_method.card.last4
        : null

    const pagos = invoicesRes.data.map(inv => ({
      fecha: new Date(inv.created * 1000).toISOString(),
      monto: (inv.amount_paid / 100).toFixed(2),
      moneda: inv.currency.toUpperCase(),
      estado: inv.status,
      numero: inv.number || '',
      pdf: inv.invoice_pdf || null,
    }))

    return NextResponse.json({
      ok: true,
      inicio: new Date(sub.created * 1000).toISOString(),
      proximo_cobro: new Date(sub.current_period_end * 1000).toISOString(),
      estado: sub.status,
      last4: card,
      pagos,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
