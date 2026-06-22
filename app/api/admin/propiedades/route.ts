import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: lista todas las propiedades
export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''
  let query = sb.from('propiedades')
    .select('id,titulo,zona,precio,tipo,operacion,estado,created_at,destacado,usuarios(nombre,email)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (q) query = query.ilike('titulo', `%${q}%`)
  const { data } = await query
  return NextResponse.json(data ?? [])
}

// DELETE: eliminar propiedad
export async function DELETE(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })
  const { error } = await sb.from('propiedades').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// PATCH: cambiar estado
export async function PATCH(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, estado } = await req.json()
  if (!id || !estado) return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
  const { error } = await sb.from('propiedades').update({ estado }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
