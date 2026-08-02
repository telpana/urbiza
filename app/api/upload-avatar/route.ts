import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserIdFromRequest } from '@/lib/authUser'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { base64, contentType, ext } = await req.json()
  if (!base64 || !contentType || !ext) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  if (!allowed.includes(ext.toLowerCase())) return NextResponse.json({ error: 'Formato no permitido' }, { status: 400 })

  const buffer = Buffer.from(base64, 'base64')
  const path = `avatares/${userId}-${Date.now()}.${ext.toLowerCase()}`

  const { data, error } = await sb.storage
    .from('propiedades')
    .upload(path, buffer, { upsert: true, contentType })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = sb.storage.from('propiedades').getPublicUrl(data.path)
  return NextResponse.json({ url: urlData.publicUrl })
}
