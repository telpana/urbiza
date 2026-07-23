import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Habitade | Portal Inmobiliario República Dominicana'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

export default async function OgImage() {
  // Intentar cargar el favicon personalizado desde Supabase
  let faviconSrc: string | null = null
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/configuracion?clave=eq.favicon_url&select=valor`,
      { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! }, next: { revalidate: 3600 } }
    )
    if (res.ok) {
      const data = await res.json()
      const url = data?.[0]?.valor
      if (url) {
        const imgRes = await fetch(url)
        if (imgRes.ok) {
          const buf = await imgRes.arrayBuffer()
          const b64 = Buffer.from(buf).toString('base64')
          const mime = imgRes.headers.get('content-type') || 'image/png'
          faviconSrc = `data:${mime};base64,${b64}`
        }
      }
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          background: '#006D77',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Logo (favicon o H generada) */}
        {faviconSrc ? (
          <img src={faviconSrc} width={130} height={130} style={{ borderRadius: 24, marginBottom: 28 }} />
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            width: 130, height: 130, borderRadius: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 88, fontWeight: 900, color: '#fff', marginBottom: 28,
          }}>
            H
          </div>
        )}

        {/* Nombre */}
        <div style={{ fontSize: 80, fontWeight: 800, color: '#ffffff', letterSpacing: '-2px', marginBottom: 20, display: 'flex' }}>
          habitade.
        </div>

        {/* Separador */}
        <div style={{ width: 72, height: 4, background: 'rgba(255,255,255,0.35)', borderRadius: 2, marginBottom: 28, display: 'flex' }} />

        {/* Subtítulo */}
        <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.82)', fontWeight: 400, display: 'flex' }}>
          El portal inmobiliario de República Dominicana
        </div>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: 40, fontSize: 20, color: 'rgba(255,255,255,0.38)', display: 'flex' }}>
          www.habitade.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
