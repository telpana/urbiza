import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo') // 'aei' | 'profesional'

  let query = sb.from('usuarios').select('id')
  if (tipo === 'aei') {
    query = query.eq('aei_aprobado', true).not('numero_aei', 'is', null)
  } else if (tipo === 'profesional') {
    query = query.eq('plan', 'profesional')
  } else {
    return NextResponse.json({ error: 'tipo requerido' }, { status: 400 })
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map((u: any) => u.id))
}
