import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../verify/route'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File
  const clave = form.get('clave') as string // 'banner_url' | 'favicon_url' | 'feature_img_url'

  if (!file || !clave) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `config/${clave.replace('_url', '')}_${Date.now()}.${ext}`

  const { data: uploadData, error: uploadErr } = await sb.storage
    .from('propiedades')
    .upload(path, file, { upsert: false, contentType: file.type })

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 })

  const { data: urlData } = sb.storage.from('propiedades').getPublicUrl(uploadData.path)
  const publicUrl = urlData.publicUrl

  await sb.from('configuracion').upsert(
    { clave, valor: publicUrl, updated_at: new Date().toISOString() },
    { onConflict: 'clave' }
  )

  return NextResponse.json({ url: publicUrl })
}
