import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function getUser(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user }, error } = await sb.auth.getUser(token)
  return error ? null : user
}

// GET: returns unread count (for badge) or full list (for section)
export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ count: 0, notificaciones: [] })

  const full = new URL(req.url).searchParams.get('full') === '1'

  const { data } = await sb
    .from('notificaciones_propiedades')
    .select(full ? '*' : 'id')
    .eq('usuario_id', user.id)
    .eq('leida', false)

  const notificaciones = data || []
  return NextResponse.json({ count: notificaciones.length, notificaciones })
}

// PATCH: mark all unread as read for this user
export async function PATCH(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ ok: false })

  await sb
    .from('notificaciones_propiedades')
    .update({ leida: true })
    .eq('usuario_id', user.id)
    .eq('leida', false)

  return NextResponse.json({ ok: true })
}
