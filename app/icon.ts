import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'
import React from 'react'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'
export const revalidate = 3600

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function Icon() {
  try {
    const { data } = await sb.from('configuracion').select('valor').eq('clave', 'favicon_url').single()
    if (data?.valor) {
      const res = await fetch(data.valor, { next: { revalidate: 3600 } })
      if (res.ok) {
        return new Response(await res.arrayBuffer(), {
          headers: { 'Content-Type': res.headers.get('content-type') ?? 'image/png' }
        })
      }
    }
  } catch {}

  return new ImageResponse(
    React.createElement('div', {
      style: {
        background: '#006D77',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 330,
        fontWeight: 900,
        color: 'white',
        borderRadius: '90px',
        fontFamily: 'Arial Black, Arial, sans-serif',
      }
    }, 'H'),
    { width: 512, height: 512 }
  )
}
