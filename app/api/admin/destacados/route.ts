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
  const { data } = await sb.from('propiedades')
    .select('id,titulo,zona,tipo,precio,destacado_hasta,destacado_dias,created_at,usuarios(nombre,email)')
    .eq('destacado', true)
    .gt('destacado_hasta', ahora)
    .order('destacado_hasta', { ascending: true })

  return NextResponse.json(data ?? [])
}
