import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  const { codigo } = await req.json()
  if (!codigo) return NextResponse.json({ ok: false, error: 'Código requerido' }, { status: 400 })

  const { data, error } = await sb
    .from('codigos_promo')
    .select('activo, usos_actuales, usos_maximos, dias_trial')
    .eq('codigo', codigo.toUpperCase())
    .single()

  if (error || !data) return NextResponse.json({ ok: false, error: 'Código no válido' })
  if (!data.activo) return NextResponse.json({ ok: false, error: 'Este código ya no está activo' })
  if (data.usos_maximos && data.usos_actuales >= data.usos_maximos) return NextResponse.json({ ok: false, error: 'Este código ha alcanzado el límite de usos' })

  return NextResponse.json({ ok: true, dias: data.dias_trial ?? 30 })
}
