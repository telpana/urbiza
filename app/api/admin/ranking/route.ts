import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Fetch all properties with stats and user info
  const { data: props } = await sb.from('propiedades')
    .select('usuario_id, visitas, tel_vistos, compartidos, usuarios(id, nombre, email, foto_url)')

  type UserEntry = { id: string; nombre: string; email: string; foto_url: string | null; visitas: number; tel_vistos: number; compartidos: number }
  const byUser: Record<string, UserEntry> = {}

  for (const p of props || []) {
    const u = p.usuarios as any
    if (!u?.id) continue
    if (!byUser[u.id]) {
      byUser[u.id] = { id: u.id, nombre: u.nombre || '', email: u.email || '', foto_url: u.foto_url || null, visitas: 0, tel_vistos: 0, compartidos: 0 }
    }
    byUser[u.id].visitas += p.visitas || 0
    byUser[u.id].tel_vistos += p.tel_vistos || 0
    byUser[u.id].compartidos += p.compartidos || 0
  }

  // Fetch favoritos joined with property owner
  const { data: favs } = await sb.from('favoritos')
    .select('propiedad_id, propiedades(usuario_id, usuarios(id, nombre, email, foto_url))')

  type GuardEntry = { id: string; nombre: string; email: string; foto_url: string | null; count: number }
  const guardados: Record<string, GuardEntry> = {}

  for (const f of favs || []) {
    const prop = (f as any).propiedades
    const u = prop?.usuarios
    if (!u?.id) continue
    if (!guardados[u.id]) {
      guardados[u.id] = { id: u.id, nombre: u.nombre || '', email: u.email || '', foto_url: u.foto_url || null, count: 0 }
    }
    guardados[u.id].count++
  }

  const top5 = (arr: any[], key: string) =>
    arr.sort((a, b) => b[key] - a[key]).slice(0, 5)

  const users = Object.values(byUser)

  return NextResponse.json({
    masVisitados: top5([...users], 'visitas'),
    masCompartidos: top5([...users], 'compartidos'),
    masContactados: top5([...users], 'tel_vistos'),
    masGuardados: top5(Object.values(guardados), 'count'),
  })
}
