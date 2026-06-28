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

const DIAS_GRACIA = 15

// Stripe agotó reintentos — dejar en gratis, el cron borra a los 15 días
async function bajarAPlaGratis(subscriptionId: string) {
  const { data: usuario } = await supabase.from('usuarios').select('id, plan, plan_activo_hasta').eq('stripe_subscription_id', subscriptionId).single()
  if (!usuario) return
  // Si ya está en past_due, respetar el plan_activo_hasta del invoice.payment_failed (15 días desde el fallo)
  // Si no, poner fecha de hoy para que el cron limpie pronto
  const vencimiento = usuario.plan === 'past_due' && usuario.plan_activo_hasta
    ? usuario.plan_activo_hasta
    : new Date().toISOString()
  await supabase.from('usuarios').update({ plan: 'gratis', tipo: 'particular', stripe_subscription_id: null, plan_activo_hasta: vencimiento }).eq('id', usuario.id)
  console.log('[webhook] suscripción cancelada, anuncios se borran vía cron en:', vencimiento)
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
        tipo: 'profesional',
        stripe_subscription_id: subscriptionId,
        plan_activo_hasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }).eq('id', userId)
      if (error) console.error('[webhook] error actualizando plan:', error)
    }
  }

  // Renovación mensual cobrada con éxito → reactivar propiedades pausadas
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = invoice.subscription as string
    if (subscriptionId) {
      const { data: usuario } = await supabase.from('usuarios').select('id').eq('stripe_subscription_id', subscriptionId).single()
      if (usuario) {
        await supabase.from('usuarios').update({
          plan: 'profesional',
          tipo: 'profesional',
          plan_activo_hasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }).eq('id', usuario.id)
        // Reactivar propiedades que estaban pausadas por fallo de pago
        await supabase.from('propiedades').update({ estado: 'activo' }).eq('usuario_id', usuario.id).eq('estado', 'pausado')
        console.log('[webhook] plan renovado y anuncios reactivados:', usuario.id)
      }
    }
  }

  // Fallo de pago → pausar anuncios y dar 15 días de gracia
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = invoice.subscription as string
    if (subscriptionId) {
      const { data: usuario } = await supabase.from('usuarios').select('id').eq('stripe_subscription_id', subscriptionId).single()
      if (usuario) {
        await supabase.from('usuarios').update({
          plan: 'past_due',
          plan_activo_hasta: new Date(Date.now() + DIAS_GRACIA * 24 * 60 * 60 * 1000).toISOString()
        }).eq('id', usuario.id)
        // Ocultar anuncios inmediatamente
        await supabase.from('propiedades').update({ estado: 'pausado' }).eq('usuario_id', usuario.id).eq('estado', 'activo')
        console.log('[webhook] pago fallido, anuncios pausados 15 días de gracia:', usuario.id)
      }
    }
  }

  // Stripe cancela la suscripción tras agotar reintentos → borrar todo
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    await bajarAPlaGratis(subscription.id)
  }

  return NextResponse.json({ ok: true })
}
