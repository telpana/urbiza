import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { emailNovedadFavorito } from '@/lib/emails'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ ok: false }, { status: 401 })
    const { data: { user }, error: authError } = await sb.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ ok: false }, { status: 401 })

    const { propiedadId, tipo, precioAnterior, precioNuevo } = await req.json()
    if (!propiedadId || !tipo) return NextResponse.json({ ok: false }, { status: 400 })

    // Verificar que el usuario autenticado es el dueño de la propiedad
    const { data: propCheck } = await sb.from('propiedades').select('usuario_id').eq('id', propiedadId).single()
    if (!propCheck || propCheck.usuario_id !== user.id) return NextResponse.json({ ok: false }, { status: 403 })

    const propietarioId = user.id

    const { data: favs } = await sb
      .from('favoritos')
      .select('usuario_id, usuarios(email, nombre)')
      .eq('propiedad_id', propiedadId)
      .neq('usuario_id', propietarioId)

    if (!favs || favs.length === 0) return NextResponse.json({ ok: true })

    const { error: insertError } = await sb.from('notificaciones_propiedades').insert(
      favs.map((f: any) => ({
        usuario_id: f.usuario_id,
        propiedad_id: String(propiedadId),
        tipo,
        precio_anterior: precioAnterior ?? null,
        precio_nuevo: precioNuevo ?? null,
      }))
    )
    if (insertError) {
      console.error('notificar-cambio insert error', insertError)
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 })
    }

    // Obtener info de la propiedad para el email
    const { data: prop } = await sb.from('propiedades').select('titulo, fotos').eq('id', propiedadId).single()
    const fotoUrl = Array.isArray(prop?.fotos) && prop.fotos.length > 0 ? prop.fotos[0] : undefined

    // Enviar email a cada usuario que tiene la propiedad en favoritos
    for (const f of favs) {
      const u = (f as any).usuarios
      if (u?.email) {
        emailNovedadFavorito({
          email: u.email,
          tituloProp: prop?.titulo || 'Propiedad',
          propiedadId: String(propiedadId),
          tipo: tipo as 'cambioPrecio' | 'nuevasFotos',
          precioAnterior: precioAnterior ?? undefined,
          precioNuevo: precioNuevo ?? undefined,
          fotoUrl,
        }).catch(e => console.error('email favorito error:', e))
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
