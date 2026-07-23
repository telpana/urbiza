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
      <div style={{ width: 1200, height: 630, display: 'flex', position: 'relative', fontFamily: 'sans-serif' }}>
        {/* Foto de fondo */}
        {bannerSrc && (
          <img
            src={bannerSrc}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        {/* Overlay teal como en el hero */}
        <div style={{
          position: 'absolute', inset: 0,
          background: bannerSrc
            ? 'linear-gradient(to bottom, rgba(0,109,119,0.72) 0%, rgba(0,109,119,0.80) 100%)'
            : '#006D77',
          display: 'flex',
        }} />

        {/* Contenido centrado */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 100, fontWeight: 800, color: '#ffffff', letterSpacing: '-3px', display: 'flex' }}>
            habitade.
          </div>
          <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.4)', borderRadius: 2, marginTop: 20, marginBottom: 28, display: 'flex' }} />
          <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.88)', fontWeight: 400, display: 'flex' }}>
            El portal inmobiliario de República Dominicana
          </div>
        </div>

        {/* URL abajo */}
        <div style={{
          position: 'absolute', bottom: 40, width: '100%',
          display: 'flex', justifyContent: 'center',
          fontSize: 20, color: 'rgba(255,255,255,0.45)',
        }}>
          www.habitade.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
