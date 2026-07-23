import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Habitade | Portal Inmobiliario República Dominicana'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

export default async function OgImage() {
  // Cargar foto del banner desde Supabase
  let bannerSrc: string | null = null
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/configuracion?clave=eq.banner_url&select=valor`,
      { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! } }
    )
    if (res.ok) {
      const data = await res.json()
      const url = data?.[0]?.valor
      if (url) {
        const imgRes = await fetch(url)
        if (imgRes.ok) {
          const buf = await imgRes.arrayBuffer()
          const b64 = Buffer.from(buf).toString('base64')
          const mime = imgRes.headers.get('content-type') || 'image/jpeg'
          bannerSrc = `data:${mime};base64,${b64}`
        }
      }
    }
  } catch {}

  return new ImageResponse(
    (
      <div style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        backgroundImage: bannerSrc ? `url(${bannerSrc})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#006D77',
        position: 'relative',
      }}>
        {/* Overlay teal */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,109,119,0.70)',
          display: 'flex',
        }} />

        {/* Logo */}
        <div style={{ fontSize: 104, fontWeight: 800, color: '#fff', letterSpacing: '-3px', display: 'flex', zIndex: 1 }}>
          habitade.
        </div>

        {/* Línea */}
        <div style={{ width: 80, height: 5, background: 'rgba(255,255,255,0.45)', borderRadius: 3, marginTop: 18, marginBottom: 26, display: 'flex', zIndex: 1 }} />

        {/* Subtítulo */}
        <div style={{ fontSize: 33, color: 'rgba(255,255,255,0.88)', fontWeight: 400, display: 'flex', zIndex: 1 }}>
          El portal inmobiliario de República Dominicana
        </div>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', fontSize: 20, color: 'rgba(255,255,255,0.42)' }}>
          www.habitade.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
