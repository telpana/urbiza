import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { propiedadId, userId1, userId2 } = await req.json()
  if (!propiedadId || !userId1 || !userId2) return NextResponse.json({ data: [] })

  const { data, error } = await sb
    .from('mensajes')
    .select('*')
    .eq('propiedad_id', propiedadId)
    .in('remitente_id', [userId1, userId2])
    .in('vendedor_id', [userId1, userId2])
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}
