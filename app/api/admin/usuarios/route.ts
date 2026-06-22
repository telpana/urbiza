import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''

  const buildQuery = (cols: string) => {
    let query = sb.from('usuarios').select(cols)
      .order('created_at', { ascending: false }).limit(200)
    if (q) query = query.or(`nombre.ilike.%${q}%,email.ilike.%${q}%`)
    return query
  }

  let { data, error } = await buildQuery('id,nombre,email,tipo,plan,numero_aei,aei_aprobado,inmobiliaria,created_at,plan_activo_hasta')
  if (error) {
    const fallback = await buildQuery('id,nombre,email,tipo,plan,numero_aei,inmobiliaria,created_at,plan_activo_hasta')
    data = fallback.data
  }
  return NextResponse.json(data ?? [])
}

export async function DELETE(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  // Borrar anuncios del usuario primero
  await sb.from('propiedades').delete().eq('usuario_id', id)

  // Borrar fila en tabla usuarios
  await sb.from('usuarios').delete().eq('id', id)

  // Borrar cuenta de auth (necesita service_role)
  const { error } = await sb.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
