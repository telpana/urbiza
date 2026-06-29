import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { data, error } = await supabase
    .from('soporte')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lista: data ?? [] })
}

export async function PATCH(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await req.json()
  const { error } = await supabase.from('soporte').update({ leido: true }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await req.json()
  const { error } = await supabase.from('soporte').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
