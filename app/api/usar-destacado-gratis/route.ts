import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserIdFromRequest } from '@/lib/authUser'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { propiedadId } = await req.json()
    if (!propiedadId) return NextResponse.json({ error: 'propiedadId requerido' }, { status: 400 })

    // Verificar que la propiedad pertenece al usuario
    const { data: prop } = await supabase.from('propiedades').select('usuario_id').eq('id', propiedadId).single()
    if (!prop || prop.usuario_id !== userId) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    // Verificar que tiene destacados gratis disponibles
    const { data: usuario } = await supabase.from('usuarios').select('destacados_gratis, plan').eq('id', userId).single()
    if (!usuario || !usuario.destacados_gratis || usuario.destacados_gratis <= 0) {
      return NextResponse.json({ error: 'No tienes destacados gratuitos disponibles' }, { status: 400 })
    }

    const hasta = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    // Aplicar destacado 30 días
    await supabase.from('propiedades').update({
      destacado: true,
      destacado_desde: new Date().toISOString(),
      destacado_hasta: hasta,
      destacado_dias: 30,
    }).eq('id', propiedadId)

    // Decrementar contador
    await supabase.from('usuarios').update({
      destacados_gratis: usuario.destacados_gratis - 1,
    }).eq('id', userId)

    return NextResponse.json({ ok: true, hasta })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
