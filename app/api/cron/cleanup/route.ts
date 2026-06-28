import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let procesados = 0
  const ahora = new Date().toISOString()

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

  return NextResponse.json({ ok: true, procesados })
}
