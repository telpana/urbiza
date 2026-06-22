import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const ahora = new Date().toISOString()
  const [{ count: totalProp }, { count: totalUsers }, { data: recientes, count: totalSubs }] = await Promise.all([
    sb.from('propiedades').select('*', { count: 'exact', head: true }).eq('estado', 'activo'),
    sb.from('usuarios').select('*', { count: 'exact', head: true }),
    sb.from('usuarios').select('nombre,email,plan,created_at,stripe_subscription_id', { count: 'exact' })
      .eq('plan', 'profesional')
      .not('stripe_subscription_id', 'is', null)
      .gt('plan_activo_hasta', ahora)
      .order('created_at', { ascending: false }).limit(8),
  ])

  // aei_aprobado puede no existir si aún no se ejecutó la migración SQL
  let aeiPend = 0
  const { count: aeiAprobado, error: aeiErr } = await sb.from('usuarios')
    .select('*', { count: 'exact', head: true })
    .not('numero_aei', 'is', null)
    .eq('tipo', 'profesional')
    .eq('aei_aprobado', false)
  if (!aeiErr) aeiPend = aeiAprobado ?? 0
  else {
    const { count } = await sb.from('usuarios')
      .select('*', { count: 'exact', head: true })
      .not('numero_aei', 'is', null)
      .eq('tipo', 'profesional')
    aeiPend = count ?? 0
  }

  return NextResponse.json({ totalProp, totalUsers, totalSubs: totalSubs ?? 0, aeiPend, recientes: recientes ?? [] })
}
