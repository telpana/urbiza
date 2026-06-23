import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { email, password, nombre, tipo, telefono, cedula, numero_aei } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  // Crear usuario sin enviar ningún email de confirmación
  const { data: authData, error: authError } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre, tipo },
  })

  if (authError) {
    // Si el email ya existe, devolver error claro
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const uid = authData.user.id

  // Guardar perfil completo
  const { error: dbError } = await sb.from('usuarios').upsert({
    id: uid,
    email,
    nombre: nombre || null,
    tipo: tipo || 'particular',
    telefono: telefono || null,
    cedula: cedula || null,
    numero_aei: numero_aei || null,
  }, { onConflict: 'id' })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
