import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  const { data } = await sb.from('configuracion').select('valor').eq('clave', 'visitas_web').single()
  const nuevo = (parseInt(data?.valor || '0') + 1).toString()
  await sb.from('configuracion').upsert({ clave: 'visitas_web', valor: nuevo }, { onConflict: 'clave' })
  return NextResponse.json({ ok: true })
}
