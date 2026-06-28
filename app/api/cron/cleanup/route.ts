import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Fallback por si el webhook de Stripe no disparó customer.subscription.deleted
export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let procesados = 0

  // Usuarios past_due cuya gracia de 15 días ya venció → borrar todo
  const { data: vencidos } = await supabase
    .from('usuarios')
    .select('id')
    .eq('plan', 'past_due')
    .lt('plan_activo_hasta', new Date().toISOString())

  for (const u of vencidos || []) {
    await supabase.from('propiedades').delete().eq('usuario_id', u.id)
    await supabase.from('usuarios').update({
      plan: 'gratis',
      tipo: 'particular',
      stripe_subscription_id: null,
      plan_activo_hasta: null,
    }).eq('id', u.id)
    procesados++
    console.log('[cron/cleanup] past_due expirado, anuncios borrados:', u.id)
  }

  return NextResponse.json({ ok: true, procesados })
}
