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

  const { propiedadId, vendedorId, remitenteId, nombreCliente, telefonoCliente, mensaje } = await req.json()
  if (!propiedadId || !vendedorId || !remitenteId || !mensaje) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }
  if (callerUid !== remitenteId) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const { data, error } = await sb.from('mensajes').insert({
    propiedad_id: propiedadId,
    vendedor_id: vendedorId,
    remitente_id: remitenteId,
    nombre_cliente: nombreCliente || '',
    telefono_cliente: telefonoCliente || null,
    mensaje,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
