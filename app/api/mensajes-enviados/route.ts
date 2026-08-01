import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserIdFromRequest } from '@/lib/authUser'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const callerUid = await getUserIdFromRequest(req)
  if (!callerUid) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ data: [] })
  if (callerUid !== userId) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const { data, error } = await sb
    .from('mensajes')
    .select('*, propiedades(titulo)')
    .eq('remitente_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}
