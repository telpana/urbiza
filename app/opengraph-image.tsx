import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Habitade - Portal Inmobiliario República Dominicana'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#f4f5f6',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
      }}
    >
      {/* H logo */}
      <div
        style={{
          background: '#006D77',
          width: 220,
          height: 220,
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 150,
          fontWeight: 900,
          color: 'white',
          flexShrink: 0,
        }}
      >
        H
      </div>

      {/* Text block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#006D77', letterSpacing: -3, lineHeight: 1 }}>
          habitade.
        </div>
        <div style={{ width: 60, height: 4, background: '#17A6B4', borderRadius: 2, marginTop: 4, marginBottom: 4 }} />
        <div style={{ fontSize: 26, color: '#444', fontWeight: 500 }}>
          Portal Inmobiliario
        </div>
        <div style={{ fontSize: 22, color: '#888' }}>
          República Dominicana
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
