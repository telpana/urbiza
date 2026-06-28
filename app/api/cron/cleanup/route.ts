import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DIAS_GRACIA_BORRADO = 30

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let procesados = 0

  // 1. Usuarios past_due cuya gracia (7 días) ya venció → gratis + borrar propiedades
  const { data: pastDue } = await supabase
    .from('usuarios')
    .select('id')
    .eq('plan', 'past_due')
    .lt('plan_activo_hasta', new Date().toISOString())

  for (const u of pastDue || []) {
    await supabase.from('propiedades').update({ estado: 'pausado' }).eq('usuario_id', u.id)
    await supabase.from('usuarios').update({
      plan: 'gratis',
      tipo: 'particular',
      stripe_subscription_id: null,
      plan_activo_hasta: new Date().toISOString(),
    }).eq('id', u.id)
    procesados++
    console.log('[cron/cleanup] past_due → gratis, anuncios pausados:', u.id)
  }

  // 2. Usuarios gratis cuya suscripción venció hace más de 30 días → borrar propiedades pausadas
  const limiteBorrado = new Date(Date.now() - DIAS_GRACIA_BORRADO * 24 * 60 * 60 * 1000).toISOString()

  const { data: vencidosAntiGuos } = await supabase
    .from('usuarios')
    .select('id')
    .eq('plan', 'gratis')
    .lt('plan_activo_hasta', limiteBorrado)
    .not('plan_activo_hasta', 'is', null)

  for (const u of vencidosAntiGuos || []) {
    const { data: deleted } = await supabase
      .from('propiedades')
      .delete()
      .eq('usuario_id', u.id)
      .eq('estado', 'pausado')
    await supabase.from('usuarios').update({ plan_activo_hasta: null }).eq('id', u.id)
    procesados++
    console.log('[cron/cleanup] propiedades pausadas borradas tras 30 días:', u.id)
  }

  return NextResponse.json({ ok: true, procesados })
}
