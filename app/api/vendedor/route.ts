import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({}, { status: 400 })

  const { data } = await sb
    .from('usuarios')
    .select('nombre, foto_url, inmobiliaria, plan, tipo, numero_aei, aei_aprobado, idiomas, web_url, instagram_url, telefono')
    .eq('id', id)
    .single()

  return NextResponse.json(data ?? {})
}
