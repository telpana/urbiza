import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { propiedadId, tipo, precioAnterior, precioNuevo, propietarioId } = await req.json()
    if (!propiedadId || !tipo) return NextResponse.json({ ok: false }, { status: 400 })

    const { data: favs } = await sb
      .from('favoritos')
      .select('usuario_id')
      .eq('propiedad_id', propiedadId)
      .neq('usuario_id', propietarioId)

    if (!favs || favs.length === 0) return NextResponse.json({ ok: true })

    await sb.from('notificaciones_propiedades').insert(
      favs.map((f: any) => ({
        usuario_id: f.usuario_id,
        propiedad_id: propiedadId,
        tipo,
        precio_anterior: precioAnterior ?? null,
        precio_nuevo: precioNuevo ?? null,
      }))
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
