'use client'
import NavUserMenu from '../../../components/NavUserMenu'

export default function AgenteProfile() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f7f8', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#004E57', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>habitade.</span>
        </a>
        <NavUserMenu />
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#004E57', marginBottom: 12 }}>Próximamente</h1>
        <p style={{ fontSize: 16, color: '#666', maxWidth: 380, lineHeight: 1.6, marginBottom: 32 }}>
          Los perfiles de agentes profesionales estarán disponibles muy pronto.
        </p>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#006D77', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
          ← Volver al inicio
        </a>
      </div>
    </main>
  )
}
