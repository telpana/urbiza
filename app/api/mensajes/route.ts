import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { emailNuevoMensaje } from '@/lib/emails'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { propiedad_id, vendedor_id, nombre_cliente, telefono_cliente, mensaje } = await req.json()

  if (!propiedad_id || !vendedor_id || !nombre_cliente || !mensaje) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  // Derivar remitente_id del token si el usuario está autenticado — nunca del body
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  let remitente_id: string | null = null
  if (token) {
    const { data: { user } } = await sb.auth.getUser(token)
    if (user) remitente_id = user.id
  }

  const { error } = await sb.from('mensajes').insert({
    propiedad_id,
    vendedor_id,
    remitente_id,
    nombre_cliente,
    telefono_cliente: telefono_cliente || null,
    mensaje,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Enviar email al vendedor (sin bloquear respuesta)
  Promise.all([
    sb.from('usuarios').select('email, nombre').eq('id', vendedor_id).single(),
    sb.from('propiedades').select('titulo').eq('id', propiedad_id).single(),
  ]).then(([{ data: vendedor }, { data: prop }]) => {
    if (vendedor?.email) {
      emailNuevoMensaje({
        emailVendedor: vendedor.email,
        nombreCliente: nombre_cliente,
        mensaje,
        tituloProp: prop?.titulo || 'Propiedad',
        propiedadId: propiedad_id,
      }).catch(e => console.error('email mensajes error:', e))
    }
  }).catch(e => console.error('email mensajes lookup error:', e))

  return NextResponse.json({ ok: true })
}
