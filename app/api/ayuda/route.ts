import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { usuario_id, nombre, email, tipo, mensaje } = await req.json()
  if (!mensaje?.trim()) return NextResponse.json({ error: 'Falta mensaje' }, { status: 400 })
  const { error } = await sb.from('soporte').insert({ usuario_id: usuario_id || null, nombre: nombre || null, email: email || null, tipo: tipo || 'pregunta', mensaje, leido: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
