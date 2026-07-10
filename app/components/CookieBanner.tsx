'use client'
import { useState, useEffect } from 'react'
import { useIdioma } from '../../IdiomaContext'

export default function CookieBanner() {
  const { tr } = useIdioma()
  const T = tr.cookieBanner
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setVisible(true)
  }, [])

  const accept = () => { localStorage.setItem('cookie_consent', 'accepted'); setVisible(false) }
  const decline = () => { localStorage.setItem('cookie_consent', 'essential'); setVisible(false) }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#fff', borderTop: '1px solid #e0e0e0',
      boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
      padding: '16px 24px',
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
    }}>
      <p style={{ flex: 1, margin: 0, fontSize: 13, color: '#555', minWidth: 200, lineHeight: 1.5 }}>
        {T.texto}{' '}
        <a href="/legal/cookies" style={{ color: '#006D77', textDecoration: 'underline', fontWeight: 500 }}>{T.ver}</a>
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={decline} style={{ all: 'unset', padding: '9px 16px', border: '1.5px solid #e0e0e0', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#555', boxSizing: 'border-box' }}>
          {T.rechazar}
        </button>
        <button onClick={accept} style={{ all: 'unset', padding: '9px 20px', background: '#006D77', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxSizing: 'border-box' }}>
          {T.aceptar}
        </button>
      </div>
    </div>
  )
}
