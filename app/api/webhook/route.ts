import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SEMANA_MS = 7 * 24 * 60 * 60 * 1000

async function bajarAPlaGratis(subscriptionId: string) {
  const { data: usuario } = await supabase.from('usuarios').select('id').eq('stripe_subscription_id', subscriptionId).single()
  if (!usuario) return
  await supabase.from('propiedades').delete().eq('usuario_id', usuario.id)
  await supabase.from('usuarios').update({ plan: 'gratis', stripe_subscription_id: null, plan_activo_hasta: null }).eq('id', usuario.id)
  console.log('[webhook] usuario bajado a gratis y anuncios eliminados:', usuario.id)
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  // Pago inicial completado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const subscriptionId = session.subscription as string
    if (userId && subscriptionId) {
      const { error } = await supabase.from('usuarios').update({
        plan: 'profesional',
        stripe_subscription_id: subscriptionId,
        plan_activo_hasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }).eq('id', userId)
      if (error) console.error('[webhook] error actualizando plan:', error)
    }
  }

  // Renovación mensual cobrada con éxito
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = invoice.subscription as string
    if (subscriptionId) {
      await supabase.from('usuarios').update({
        plan: 'profesional',
        plan_activo_hasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }).eq('stripe_subscription_id', subscriptionId)
      console.log('[webhook] plan renovado para suscripción', subscriptionId)
    }
  }

  // Fallo de pago → 7 días de gracia
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = invoice.subscription as string
    if (subscriptionId) {
      await supabase.from('usuarios').update({
        plan: 'past_due',
        plan_activo_hasta: new Date(Date.now() + SEMANA_MS).toISOString()
      }).eq('stripe_subscription_id', subscriptionId)
      console.log('[webhook] pago fallido, 7 días de gracia para suscripción', subscriptionId)
    }
  }

  // Stripe cancela la suscripción tras agotar reintentos → borrar todo y gratis
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    await bajarAPlaGratis(subscription.id)
  }

  return NextResponse.json({ ok: true })
}
