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
