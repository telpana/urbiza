import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const brandedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="90" fill="#006D77"/>
  <text x="256" y="385" font-family="Arial Black,Arial,sans-serif" font-size="330" font-weight="900" fill="white" text-anchor="middle">H</text>
</svg>`

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

  return new Response(brandedSvg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  })
}
