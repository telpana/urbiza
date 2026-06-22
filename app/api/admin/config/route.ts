import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data } = await sb.from('configuracion').select('clave,valor')
  const config: Record<string, string> = {}
  for (const row of data ?? []) config[row.clave] = row.valor
  return NextResponse.json(config)
}

export async function POST(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { clave, valor } = await req.json()
  const { error } = await sb.from('configuracion').upsert({ clave, valor, updated_at: new Date().toISOString() }, { onConflict: 'clave' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
