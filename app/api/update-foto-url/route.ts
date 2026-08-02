import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserIdFromRequest } from '@/lib/authUser'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { fotoUrl } = await req.json()
  if (!fotoUrl || !fotoUrl.startsWith('data:image/')) {
    return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
  }

  const { error } = await sb.from('usuarios').update({ foto_url: fotoUrl }).eq('id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
