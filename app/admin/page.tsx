'use client'
import { useState } from 'react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { id: 'banner', label: 'Banner inicio', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { id: 'propiedades', label: 'Propiedades', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'usuarios', label: 'Usuarios', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'aei', label: 'Verificaciones AEI', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id: 'cobros', label: 'Cobros', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'redes', label: 'Redes sociales', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
]

// Estadísticas del dashboard
const stats = [
  { label: 'Propiedades activas', val: '12,841', color: '#006D77', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> },
  { label: 'Usuarios registrados', val: '3,204', color: '#17A6B4', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#17A6B4" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  { label: 'Ingresos este mes', val: 'US$ 4,320', color: '#10b981', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { label: 'Verificaciones AEI pendientes', val: '7', color: '#f59e0b', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
]

const aeiPendientes = [
  { nombre: 'Carlos Méndez', email: 'carlos@email.com', numero: 'AEI-3421', fecha: 'Hace 2h', tipo: 'Broker' },
  { nombre: 'Ana Reyes', email: 'ana@email.com', numero: 'AEI-3422', fecha: 'Hace 5h', tipo: 'Agencia' },
  { nombre: 'Luis García', email: 'luis@email.com', numero: 'AEI-3423', fecha: 'Hace 1 día', tipo: 'Broker' },
  { nombre: 'María Torres', email: 'maria@email.com', numero: 'AEI-3424', fecha: 'Hace 2 días', tipo: 'Broker' },
]

const cobrosRecientes = [
  { usuario: 'Rafael Castillo', plan: 'Broker', monto: 'US$ 15', fecha: 'Hoy', estado: 'Pagado' },
  { usuario: 'RE/MAX Capital RD', plan: 'Unlimited', monto: 'US$ 99', fecha: 'Ayer', estado: 'Pagado' },
  { usuario: 'Century 21 RD', plan: 'Agencia Pro', monto: 'US$ 49', fecha: 'Hace 2 días', estado: 'Pagado' },
  { usuario: 'Ana Reyes', plan: 'Agencia Basic', monto: 'US$ 29', fecha: 'Hace 3 días', estado: 'Fallido' },
]

export default function Admin() {
  const [seccion, setSeccion] = useState('dashboard')
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80')
  const [bannerInput, setBannerInput] = useState('')
  const [bannerGuardado, setBannerGuardado] = useState(false)
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [redesGuardadas, setRedesGuardadas] = useState(false)
  const [aeiEstados, setAeiEstados] = useState<Record<number, string>>({})

  const guardarBanner = () => {
    if (bannerInput.trim()) {
      setBannerUrl(bannerInput.trim())
      setBannerGuardado(true)
      setTimeout(() => setBannerGuardado(false), 3000)
    }
  }

  const guardarRedes = () => {
    setRedesGuardadas(true)
    setTimeout(() => setRedesGuardadas(false), 3000)
  }

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* NAV ADMIN */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>
            urbiza<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 10 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Panel de administración</span>
          <a href="/" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none' }}>← Ver web</a>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>

        {/* SIDEBAR */}
        <div style={{ width: 220, background: '#004E57', minHeight: 'calc(100vh - 54px)', padding: '20px 0', flexShrink: 0 }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontSize: 13, color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.6)', background: seccion === item.id ? 'rgba(255,255,255,0.12)' : 'transparent', cursor: 'pointer', borderLeft: seccion === item.id ? '3px solid #83D4DB' : '3px solid transparent', boxSizing: 'border-box' }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* CONTENIDO */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {/* DASHBOARD */}
          {seccion === 'dashboard' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 24 }}>Dashboard</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {stats.map(s => (
                  <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderTop: `3px solid ${s.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>{s.label}</div>
                      {s.icon}
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#111' }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Últimos cobros */}
              <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 }}>Cobros recientes</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      {['Usuario', 'Plan', 'Monto', 'Fecha', 'Estado'].map(h => (
                        <th key={h} style={{ textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, padding: '0 0 10px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cobrosRecientes.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f8f8f8' }}>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#333', fontWeight: 500 }}>{c.usuario}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#666' }}>{c.plan}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#111', fontWeight: 600 }}>{c.monto}</td>
                        <td style={{ padding: '10px 0', fontSize: 12, color: '#aaa' }}>{c.fecha}</td>
                        <td style={{ padding: '10px 0' }}>
                          <span style={{ background: c.estado === 'Pagado' ? '#e0f5f0' : '#fee2e2', color: c.estado === 'Pagado' ? '#065f46' : '#991b1b', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>{c.estado}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BANNER */}
          {seccion === 'banner' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>Banner de inicio</h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>Cambia la imagen de fondo del banner principal de urbiza.com</p>

              {/* Preview actual */}
              <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 12 }}>Vista previa actual</div>
                <div style={{ height: 200, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,78,87,0.72)' }} />
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: '#fff', textAlign: 'center', padding: '0 20px' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Encuentra tu próxima propiedad en República Dominicana</div>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>El portal inmobiliario líder del Caribe</div>
                  </div>
                </div>
              </div>

              {/* Cambiar imagen */}
              <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 16 }}>Cambiar imagen</div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 8 }}>URL de la imagen</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input value={bannerInput} onChange={e => setBannerInput(e.target.value)} type="text" placeholder="https://ejemplo.com/imagen.jpg" style={{ flex: 1, border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none', color: '#222' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                    <button onClick={guardarBanner} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {bannerGuardado ? '✓ Guardado' : 'Guardar'}
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>Pega la URL de cualquier imagen. Recomendado: mínimo 1600px de ancho.</div>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 12 }}>Imágenes sugeridas gratuitas (Unsplash)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', label: 'Interior moderno' },
                      { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80', label: 'Villa tropical' },
                      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', label: 'Casa de lujo' },
                      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', label: 'Residencia moderna' },
                      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', label: 'Piscina exterior' },
                      { url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80', label: 'Apartamento vistas' },
                    ].map(img => (
                      <div key={img.url} onClick={() => { setBannerInput(img.url.replace('w=800', 'w=1600')); setBannerUrl(img.url) }} style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', border: bannerUrl === img.url ? '2px solid #006D77' : '2px solid transparent', position: 'relative' }}>
                        <div style={{ height: 80, backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div style={{ padding: '5px 8px', background: '#f9f9f9', fontSize: 11, color: '#666' }}>{img.label}</div>
                        {bannerUrl === img.url && <div style={{ position: 'absolute', top: 6, right: 6, background: '#006D77', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VERIFICACIONES AEI */}
          {seccion === 'aei' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>Verificaciones AEI</h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>Aprueba o rechaza las solicitudes de verificación de agentes</p>
              <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                {aeiPendientes.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: i < aeiPendientes.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#006D77', flexShrink: 0 }}>
                      {a.nombre.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2 }}>{a.nombre}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{a.email} · <span style={{ color: '#006D77', fontWeight: 500 }}>{a.numero}</span> · {a.tipo}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#aaa', marginRight: 8 }}>{a.fecha}</div>
                    {aeiEstados[i] ? (
                      <span style={{ background: aeiEstados[i] === 'aprobado' ? '#e0f5f0' : '#fee2e2', color: aeiEstados[i] === 'aprobado' ? '#065f46' : '#991b1b', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
                        {aeiEstados[i] === 'aprobado' ? '✓ Aprobado' : '✗ Rechazado'}
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setAeiEstados(prev => ({ ...prev, [i]: 'aprobado' }))} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '6px 16px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Aprobar</button>
                        <button onClick={() => setAeiEstados(prev => ({ ...prev, [i]: 'rechazado' }))} style={{ all: 'unset', border: '1px solid #e0e0e0', color: '#666', padding: '6px 16px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Rechazar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REDES SOCIALES */}
          {seccion === 'redes' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>Redes sociales</h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>Configura los enlaces a las redes sociales que aparecen en el footer</p>
              <div style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                {[
                  { label: 'Instagram', icon: '📸', val: instagramUrl, set: setInstagramUrl, placeholder: 'https://instagram.com/urbizard' },
                  { label: 'Facebook', icon: '👥', val: facebookUrl, set: setFacebookUrl, placeholder: 'https://facebook.com/urbiza' },
                  { label: 'TikTok', icon: '🎵', val: tiktokUrl, set: setTiktokUrl, placeholder: 'https://tiktok.com/@urbiza' },
                  { label: 'WhatsApp', icon: '💬', val: whatsappUrl, set: setWhatsappUrl, placeholder: 'https://wa.me/18095550000' },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{r.icon} {r.label}</label>
                    <input value={r.val} onChange={e => r.set(e.target.value)} type="text" placeholder={r.placeholder} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                ))}
                <button onClick={guardarRedes} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '11px 28px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
                  {redesGuardadas ? '✓ Guardado' : 'Guardar enlaces'}
                </button>
              </div>
            </div>
          )}

          {/* SECCIONES PENDIENTES */}
          {['propiedades', 'usuarios', 'cobros'].includes(seccion) && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>
                {menuItems.find(m => m.id === seccion)?.label}
              </h1>
              <div style={{ background: '#fff', borderRadius: 8, padding: '48px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔧</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>Disponible cuando conectemos Supabase</div>
                <div style={{ fontSize: 13, color: '#aaa' }}>Esta sección mostrará datos reales de la base de datos</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
