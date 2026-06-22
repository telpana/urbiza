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

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId) return NextResponse.json({ error: 'Falta sessionId' }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json({ ok: false, status: session.status })
    }

    const userId = session.metadata?.userId
    const tipo = session.metadata?.tipo || 'profesional'
    const propiedadId = session.metadata?.propiedadId

    if (!userId) return NextResponse.json({ error: 'Sin userId en metadata' }, { status: 400 })

    if (['15', '30', '60'].includes(tipo) && propiedadId) {
      // Pago de destacado — marcar la propiedad como destacada
      const dias = Number(tipo)
      const { error } = await supabase.from('propiedades').update({
        destacado: true,
        destacado_hasta: new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString(),
        destacado_dias: dias,
      }).eq('id', propiedadId)
      if (error) {
        console.error('[verificar-pago] error destacado:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ ok: true, tipo: 'destacar' })
    } else {
      // Pago de plan profesional
      const { error } = await supabase.from('usuarios').update({
        plan: 'profesional',
        tipo: 'profesional',
        stripe_subscription_id: session.subscription as string || null,
        plan_activo_hasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }).eq('id', userId)
      if (error) {
        console.error('[verificar-pago] error plan:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ ok: true, tipo: 'profesional' })
    }
  } catch (error: any) {
    console.error('[verificar-pago] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
