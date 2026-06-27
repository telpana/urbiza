import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  // Vercel Cron envía Authorization header con el secret
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Buscar usuarios con plan past_due cuya gracia ya venció
  const { data: vencidos, error } = await supabase
    .from('usuarios')
    .select('id, stripe_subscription_id')
    .eq('plan', 'past_due')
    .lt('plan_activo_hasta', new Date().toISOString())

  if (error) {
    console.error('[cron/cleanup] error consultando vencidos:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let procesados = 0
  for (const u of vencidos || []) {
    await supabase.from('propiedades').delete().eq('usuario_id', u.id)
    await supabase.from('usuarios').update({
      plan: 'gratis',
      stripe_subscription_id: null,
      plan_activo_hasta: null
    }).eq('id', u.id)
    procesados++
    console.log('[cron/cleanup] usuario bajado a gratis:', u.id)
  }

  return NextResponse.json({ ok: true, procesados })
}
