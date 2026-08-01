import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { getUserIdFromRequest } from '@/lib/authUser'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const callerUid = await getUserIdFromRequest(req)
    if (!callerUid) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Sin userId' }, { status: 400 })
    if (callerUid !== userId) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('stripe_subscription_id, plan_activo_hasta, created_at, ya_suscrito')
      .eq('id', userId)
      .single()

    if (!usuario?.stripe_subscription_id) {
      return NextResponse.json({ ok: true, sin_sub: true, ya_suscrito: usuario?.ya_suscrito ?? false })
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

    const esTrial = sub.status === 'trialing'

    const pagos = esTrial ? [] : invoicesRes.data
      .filter(inv => inv.status === 'paid' && inv.amount_paid > 0)
      .map(inv => ({
        fecha: new Date(inv.created * 1000).toISOString(),
        monto: (inv.amount_paid / 100).toFixed(2),
        moneda: inv.currency.toUpperCase(),
        estado: inv.status,
        numero: inv.number || '',
        pdf: inv.invoice_pdf || null,
      }))

    const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null

    return NextResponse.json({
      ok: true,
      inicio: sub.created ? new Date(sub.created * 1000).toISOString() : null,
      proximo_cobro: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
      estado: sub.status,
      last4: card,
      trial_end: trialEnd,
      pagos,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
