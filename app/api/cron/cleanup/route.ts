import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { emailPagoFallido } from '@/lib/emails'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let procesados = 0
  const ahora = new Date().toISOString()

  // Sincronizar plan_activo_hasta con Stripe para usuarios pro con fecha vencida o próxima a vencer
  const en60dias = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
  const { data: prosPorVencer } = await supabase
    .from('usuarios')
    .select('id, stripe_subscription_id')
    .eq('plan', 'profesional')
    .not('stripe_subscription_id', 'is', null)
    .lt('plan_activo_hasta', en60dias)

  for (const u of prosPorVencer || []) {
    try {
      const sub = await stripe.subscriptions.retrieve(u.stripe_subscription_id)
      if (sub.status === 'active' || sub.status === 'trialing') {
        const nuevaFecha = sub.trial_end
          ? new Date(sub.trial_end * 1000)
          : new Date(sub.current_period_end * 1000)
        await supabase.from('usuarios').update({ plan_activo_hasta: nuevaFecha.toISOString() }).eq('id', u.id)
        console.log('[cron/cleanup] plan_activo_hasta sincronizado:', u.id, nuevaFecha.toISOString())
      }
    } catch (e) {
      console.error('[cron/cleanup] error sincronizando con Stripe:', u.id, e)
    }
  }

  // Destacados vencidos → quitar badge
  const { data: destacadosVencidos } = await supabase
    .from('propiedades')
    .select('id')
    .eq('destacado', true)
    .lt('destacado_hasta', ahora)

  if (destacadosVencidos && destacadosVencidos.length > 0) {
    const ids = destacadosVencidos.map((p: any) => p.id)
    await supabase.from('propiedades').update({ destacado: false }).in('id', ids)
    console.log('[cron/cleanup] destacados vencidos quitados:', ids.length)
  }

  // Usuarios past_due o gratis (ex-pro) cuyo plan_activo_hasta ya venció → borrar anuncios pausados
  const { data: vencidos } = await supabase
    .from('usuarios')
    .select('id')
    .in('plan', ['past_due', 'gratis'])
    .lt('plan_activo_hasta', ahora)
    .not('plan_activo_hasta', 'is', null)

  for (const u of vencidos || []) {
    await supabase.from('propiedades').delete().eq('usuario_id', u.id).eq('estado', 'pausado')
    await supabase.from('usuarios').update({
      plan: 'gratis',
      tipo: 'particular',
      stripe_subscription_id: null,
      plan_activo_hasta: null,
    }).eq('id', u.id)
    procesados++
    console.log('[cron/cleanup] 15 días vencidos, anuncios pausados borrados:', u.id)
  }

  // Emails de pago fallido → enviar 24h después del fallo si no se ha cobrado
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: pagosFallidos } = await supabase
    .from('usuarios')
    .select('id, email, nombre, pago_fallido_at')
    .eq('plan', 'past_due')
    .eq('pago_fallido_email_enviado', false)
    .not('pago_fallido_at', 'is', null)
    .lt('pago_fallido_at', hace24h)

  for (const u of pagosFallidos || []) {
    if (!u.email) continue
    try {
      const fechaStr = new Date(u.pago_fallido_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
      await emailPagoFallido(u.email, u.nombre || '', fechaStr)
      await supabase.from('usuarios').update({ pago_fallido_email_enviado: true }).eq('id', u.id)
      console.log('[cron/cleanup] email pago fallido enviado:', u.id)
    } catch (e) {
      console.error('[cron/cleanup] error enviando email pago fallido:', u.id, e)
    }
  }

  // Anuncios con más de 2 años → borrar
  const dosAniosAtras = new Date()
  dosAniosAtras.setFullYear(dosAniosAtras.getFullYear() - 2)

  const { data: caducados } = await supabase
    .from('propiedades')
    .select('id')
    .lt('created_at', dosAniosAtras.toISOString())

  if (caducados && caducados.length > 0) {
    const ids = caducados.map((p: any) => p.id)
    await supabase.from('propiedades').delete().in('id', ids)
    console.log('[cron/cleanup] anuncios de +2 años borrados:', ids.length)
    procesados += ids.length
  }

  return NextResponse.json({ ok: true, procesados })
}
