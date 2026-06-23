import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: { user }, error: authError } = await sb.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { nombre, tipo, telefono, cedula, numero_aei } = await req.json()

  const { error } = await sb.from('usuarios').upsert({
    id: user.id,
    email: user.email,
    nombre,
    tipo,
    telefono,
    cedula: cedula || null,
    numero_aei: numero_aei || null,
  }, { onConflict: 'id' })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Este número de teléfono ya está asociado a otra cuenta.' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
