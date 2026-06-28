import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — listar todos los códigos
export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { data, error } = await supabase
    .from('codigos_promo')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — crear código
export async function POST(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { codigo, usos_maximos, descripcion } = await req.json()
  if (!codigo) return NextResponse.json({ error: 'Código requerido' }, { status: 400 })

  const { error } = await supabase.from('codigos_promo').insert({
    codigo: codigo.toUpperCase(),
    activo: true,
    usos_actuales: 0,
    usos_maximos: usos_maximos || null,
    descripcion: descripcion || null,
  })
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'Ese código ya existe' : error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

// PATCH — activar/desactivar
export async function PATCH(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, activo } = await req.json()
  const { error } = await supabase.from('codigos_promo').update({ activo }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE — eliminar
export async function DELETE(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await req.json()
  const { error } = await supabase.from('codigos_promo').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
