import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: lista AEI
export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error } = await sb.from('usuarios')
    .select('id,nombre,email,numero_aei,tipo,plan,created_at,aei_aprobado,inmobiliaria')
    .not('numero_aei', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    const fallback = await sb.from('usuarios')
      .select('id,nombre,email,numero_aei,tipo,plan,created_at,inmobiliaria')
      .not('numero_aei', 'is', null)
      .order('created_at', { ascending: false })
    return NextResponse.json({ lista: fallback.data ?? [], columnaMissing: true })
  }

  return NextResponse.json({ lista: data ?? [], columnaMissing: false })
}

// POST: aprobar o rechazar
export async function POST(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, accion } = await req.json()
  if (!id || !accion) return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })

  if (accion === 'aprobar') {
    const { error } = await sb.from('usuarios').update({ aei_aprobado: true }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message, columnaMissing: error.message.includes('aei_aprobado') }, { status: 500 })
  } else if (accion === 'rechazar') {
    const { error } = await sb.from('usuarios').update({ numero_aei: null, aei_aprobado: false }).eq('id', id)
    if (error) {
      // Si falla por aei_aprobado, intentar solo borrar numero_aei
      const { error: e2 } = await sb.from('usuarios').update({ numero_aei: null }).eq('id', id)
      if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
    }
  }
  return NextResponse.json({ ok: true })
}
