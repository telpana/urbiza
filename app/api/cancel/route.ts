import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    // Buscar subscription_id del usuario en Supabase
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('stripe_subscription_id')
      .eq('id', userId)
      .single()

    if (!usuario?.stripe_subscription_id) {
      return NextResponse.json({ error: 'No hay suscripción activa' }, { status: 400 })
    }

    // Cancelar al final del período en Stripe
    await stripe.subscriptions.update(usuario.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    // Marcar en Supabase como cancelando
    await supabase.from('usuarios').update({
      plan: 'cancelando'
    }).eq('id', userId)

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}