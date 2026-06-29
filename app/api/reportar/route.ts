import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { propiedad_id, motivo, comentario } = await req.json()
  if (!propiedad_id || !motivo) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const { error } = await sb.from('reportes').insert({
    propiedad_id,
    motivo,
    comentario: comentario || null,
    leido: false,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
