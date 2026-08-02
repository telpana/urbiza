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

  const { ext } = await req.json().catch(() => ({ ext: 'jpg' }))
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext?.toLowerCase()) ? ext.toLowerCase() : 'jpg'
  const path = `${userId}/avatar-${Date.now()}.${safeExt}`

  const { data, error } = await sb.storage.from('propiedades').createSignedUploadUrl(path)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = sb.storage.from('propiedades').getPublicUrl(path)
  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path, publicUrl: urlData.publicUrl })
}
