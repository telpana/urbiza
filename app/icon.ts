import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export const revalidate = 3600

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function Icon(): Promise<Response> {
  try {
    const { data } = await sb.from('configuracion').select('valor').eq('clave', 'favicon_url').single()
    if (data?.valor) {
      const res = await fetch(data.valor, { next: { revalidate: 3600 } })
      if (res.ok) {
        return new Response(await res.arrayBuffer(), {
          headers: { 'Content-Type': res.headers.get('content-type') ?? 'image/png' },
        })
      }
    }
  } catch {}

  try {
    const ico = fs.readFileSync(path.join(process.cwd(), 'public', 'favicon.ico'))
    return new Response(ico, { headers: { 'Content-Type': 'image/x-icon' } })
  } catch {}

  return new Response(null, { status: 204 })
}
