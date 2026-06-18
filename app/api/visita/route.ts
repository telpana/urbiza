import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { propiedadId } = await req.json()
    if (!propiedadId) return NextResponse.json({ error: 'Falta propiedadId' }, { status: 400 })

    const { data } = await supabase
      .from('propiedades')
      .select('visitas')
      .eq('id', propiedadId)
      .single()

    await supabase
      .from('propiedades')
      .update({ visitas: (data?.visitas || 0) + 1 })
      .eq('id', propiedadId)

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
