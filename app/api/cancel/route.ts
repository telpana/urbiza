import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { getUserIdFromRequest } from '@/lib/authUser'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const callerUid = await getUserIdFromRequest(req)
    if (!callerUid) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    if (callerUid !== userId) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('stripe_subscription_id, plan_activo_hasta')
      .eq('id', userId)
      .single()

    let fechaFin: string | null = usuario?.plan_activo_hasta || null

    // Marcar en Stripe que cancela al final del período (no inmediatamente)
    if (usuario?.stripe_subscription_id) {
      try {
        const sub = await stripe.subscriptions.update(usuario.stripe_subscription_id, {
          cancel_at_period_end: true,
        })
        // Usar la fecha real de fin de Stripe (trial_end o current_period_end)
        const finTs = sub.trial_end ?? sub.current_period_end
        if (finTs) fechaFin = new Date(finTs * 1000).toISOString()
      } catch {
        // Si falla Stripe igualmente marcamos en BD
      }
    }

    // Marcar como "cancelando" — sigue activo hasta fechaFin, el webhook limpia al expirar
    await supabase.from('usuarios').update({
      tipo: 'cancelando',
      plan_activo_hasta: fechaFin,
    }).eq('id', userId)

    return NextResponse.json({ ok: true, fechaFin })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
