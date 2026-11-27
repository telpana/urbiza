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

  let { data, error } = await buildQuery('id,nombre,email,tipo,plan,numero_aei,aei_aprobado,inmobiliaria,foto_url,created_at,plan_activo_hasta,stripe_subscription_id,codigo_promo_usado')
  if (error) {
    const fallback = await buildQuery('id,nombre,email,tipo,plan,numero_aei,inmobiliaria,foto_url,created_at,plan_activo_hasta,stripe_subscription_id')
    data = fallback.data
  }
  if (data && data.length > 0) {
    const ids = data.map((u: any) => u.id)
    const { data: props } = await sb.from('propiedades').select('usuario_id').in('usuario_id', ids)
    const counts: Record<string, number> = {}
    if (props) props.forEach((p: any) => { counts[p.usuario_id] = (counts[p.usuario_id] || 0) + 1 })
    data = data.map((u: any) => ({ ...u, num_propiedades: counts[u.id] || 0 }))
  }
  return NextResponse.json(data ?? [])
}

export async function PATCH(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, plan } = await req.json()
  if (!id || !plan) return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })

  const planesValidos = ['gratis', 'plata', 'oro', 'platino', 'fundador', 'profesional']
  if (!planesValidos.includes(plan)) return NextResponse.json({ error: 'Plan no válido' }, { status: 400 })

  const updates: any = { plan }
  if (plan === 'gratis') {
    updates.tipo = 'particular'
    updates.stripe_subscription_id = null
    updates.plan_activo_hasta = null
    updates.plan_intervalo = null
    updates.codigo_promo_usado = null
  }

  const { error } = await sb.from('usuarios').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (plan === 'gratis') {
    await sb.from('propiedades').update({ estado: 'pausado' }).eq('usuario_id', id).eq('estado', 'activo')
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  // Borrar datos relacionados antes de eliminar el usuario
  await sb.from('notificaciones_propiedades').delete().eq('usuario_id', id)
  await sb.from('favoritos').delete().eq('usuario_id', id)
  await sb.from('mensajes').delete().eq('remitente_id', id)
  await sb.from('mensajes').delete().eq('vendedor_id', id)
  await sb.from('propiedades').delete().eq('usuario_id', id)
  await sb.from('usuarios').delete().eq('id', id)

  // Borrar cuenta de auth (necesita service_role)
  const { error } = await sb.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message || error.toString() || 'Error al eliminar cuenta de auth' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
