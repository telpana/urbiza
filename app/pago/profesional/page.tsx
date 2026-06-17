'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../supabase'

export default function PagoProfesional() {
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, email: user.email, tipo: 'profesional' })
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          setError(data.error || 'No se pudo iniciar el pago. Inténtalo de nuevo.')
        }
      } catch {
        setError('Error de conexión. Inténtalo de nuevo.')
      }
    }
    init()
  }, [])

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', background: '#f4f5f6' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 8 }}>
          {error ? '⚠️ Error' : 'Redirigiendo a Stripe...'}
        </div>
        {error
          ? <>
              <div style={{ fontSize: 14, color: '#e55', marginBottom: 20 }}>{error}</div>
              <a href="/panel" style={{ fontSize: 13, color: '#006D77' }}>← Volver al panel</a>
            </>
          : <div style={{ fontSize: 14, color: '#888' }}>Espera un momento</div>
        }
      </div>
    </main>
  )
}
