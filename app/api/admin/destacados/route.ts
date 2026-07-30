import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { propiedadId, dias } = await req.json()
  if (!propiedadId || !dias) return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })

  const hasta = new Date(Date.now() + Number(dias) * 86400000).toISOString()
  const { error } = await sb.from('propiedades')
    .update({ destacado: true, destacado_hasta: hasta, destacado_dias: Number(dias) })
    .eq('id', propiedadId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const ahora = new Date().toISOString()
  const { data } = await sb.from('propiedades')
    .select('id,titulo,zona,tipo,precio,fotos,destacado_hasta,destacado_dias,created_at,usuarios(nombre,email)')
    .eq('destacado', true)
    .gt('destacado_hasta', ahora)
    .order('destacado_hasta', { ascending: true })

  return NextResponse.json(data ?? [])
}
