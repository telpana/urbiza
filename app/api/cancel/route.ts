import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 })

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('stripe_subscription_id')
      .eq('id', userId)
      .single()

    // Cancelar suscripción en Stripe inmediatamente
    if (usuario?.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(usuario.stripe_subscription_id)
      } catch {
        // Si ya estaba cancelada en Stripe, seguimos igualmente
      }
    }

    // Obtener las propiedades del usuario para borrar sus dependencias
    const { data: propiedades } = await supabase
      .from('propiedades')
      .select('id')
      .eq('usuario_id', userId)

    const propIds = (propiedades || []).map((p: any) => p.id)

    if (propIds.length > 0) {
      // Borrar mensajes recibidos sobre sus propiedades
      await supabase.from('mensajes').delete().in('propiedad_id', propIds)
      // Borrar favoritos de sus propiedades
      await supabase.from('favoritos').delete().in('propiedad_id', propIds)
      // Borrar las propiedades
      await supabase.from('propiedades').delete().in('id', propIds)
    }

    // Borrar mensajes que el usuario haya enviado como comprador
    await supabase.from('mensajes').delete().eq('remitente_id', userId)

    // Borrar favoritos del usuario
    await supabase.from('favoritos').delete().eq('usuario_id', userId)

    // Degradar cuenta a particular, sin AEI ni suscripción
    await supabase.from('usuarios').update({
      plan: 'particular',
      tipo: 'particular',
      plan_activo_hasta: null,
      stripe_subscription_id: null,
      numero_aei: null,
      aei_aprobado: false,
    }).eq('id', userId)

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
