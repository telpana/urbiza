import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { emailNovedadFavorito } from '@/lib/emails'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      console.error('[notificar-cambio] sin token')
      return NextResponse.json({ ok: false, error: 'no token' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await sb.auth.getUser(token)
    if (authError || !user) {
      console.error('[notificar-cambio] auth error:', authError?.message)
      return NextResponse.json({ ok: false, error: 'auth failed' }, { status: 401 })
    }

    const body = await req.json()
    const { propiedadId, tipo, precioAnterior, precioNuevo } = body
    console.log('[notificar-cambio] body:', { propiedadId, tipo, precioAnterior, precioNuevo, userId: user.id })

    if (!propiedadId || !tipo) {
      return NextResponse.json({ ok: false, error: 'faltan campos' }, { status: 400 })
    }

    // Verificar propiedad y ownership
    const { data: propCheck, error: propErr } = await sb
      .from('propiedades').select('usuario_id').eq('id', propiedadId).single()
    console.log('[notificar-cambio] propCheck:', propCheck, 'err:', propErr?.message)

    if (!propCheck || propCheck.usuario_id !== user.id) {
      console.error('[notificar-cambio] no es el dueño o no existe la propiedad')
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    }

    // Obtener favoritos (sin join — fetchamos emails por separado para evitar fallo de FK)
    const { data: favs, error: favsErr } = await sb
      .from('favoritos')
      .select('usuario_id')
      .eq('propiedad_id', propiedadId)
      .neq('usuario_id', user.id)

    console.log('[notificar-cambio] favs:', favs?.length ?? 0, 'err:', favsErr?.message)

    if (!favs || favs.length === 0) {
      console.log('[notificar-cambio] sin favoritos, nada que notificar')
      return NextResponse.json({ ok: true, notificados: 0 })
    }

    const usuarioIds = favs.map((f: any) => f.usuario_id)

    // Insertar notificaciones en app
    const { error: insertError } = await sb.from('notificaciones_propiedades').insert(
      usuarioIds.map((uid: string) => ({
        usuario_id: uid,
        propiedad_id: String(propiedadId),
        tipo,
        precio_anterior: precioAnterior ?? null,
        precio_nuevo: precioNuevo ?? null,
        leida: false,
      }))
    )
    if (insertError) {
      console.error('[notificar-cambio] insert error:', insertError.message, insertError.details)
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 })
    }
    console.log('[notificar-cambio] notificaciones insertadas:', usuarioIds.length)

    // Obtener info de la propiedad para el email
    const { data: prop } = await sb.from('propiedades').select('titulo, fotos').eq('id', propiedadId).single()
    const fotoUrl = Array.isArray(prop?.fotos) && prop.fotos.length > 0 ? prop.fotos[0] : undefined

    // Obtener emails de usuarios desde la tabla pública
    const { data: usuarios } = await sb
      .from('usuarios')
      .select('id, email')
      .in('id', usuarioIds)

    console.log('[notificar-cambio] usuarios con email:', usuarios?.filter((u: any) => u.email).length ?? 0)

    for (const u of usuarios || []) {
      if (!u.email) continue
      emailNovedadFavorito({
        email: u.email,
        tituloProp: prop?.titulo || 'Propiedad',
        propiedadId: String(propiedadId),
        tipo: tipo as 'cambioPrecio' | 'nuevasFotos',
        precioAnterior: precioAnterior ?? undefined,
        precioNuevo: precioNuevo ?? undefined,
        fotoUrl,
      }).catch(e => console.error('[notificar-cambio] email error:', e))
    }

    return NextResponse.json({ ok: true, notificados: usuarioIds.length })
  } catch (e: any) {
    console.error('[notificar-cambio] exception:', e?.message)
    return NextResponse.json({ ok: false, error: 'error interno' }, { status: 500 })
  }
}
