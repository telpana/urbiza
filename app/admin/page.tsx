'use client'
import { useState, useEffect, useCallback } from 'react'

const C = { verde: '#006D77', azul: '#17A6B4', oscuro: '#004E57', bg: '#f4f5f6' }

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { id: 'aei', label: 'Verificaciones AEI', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id: 'propiedades', label: 'Anuncios', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'usuarios', label: 'Usuarios', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'cobros', label: 'Suscripciones', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'destacados', label: 'Destacados', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'banner', label: 'Banner inicio', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { id: 'favicon', label: 'Favicon e img', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
  { id: 'redes', label: 'Redes sociales', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
]

function fmtFecha(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [seccion, setSeccion] = useState('dashboard')
  const [token, setToken] = useState('')

  // --- DATA STATES ---
  const [stats, setStats] = useState<any>(null)
  const [aeiLista, setAeiLista] = useState<any[]>([])
  const [aeiLoading, setAeiLoading] = useState(false)
  const [aeiColumnaMissing, setAeiColumnaMissing] = useState(false)
  const [propiedades, setPropiedades] = useState<any[]>([])
  const [propLoading, setPropLoading] = useState(false)
  const [propQ, setPropQ] = useState('')
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersQ, setUsersQ] = useState('')
  const [cobros, setCobros] = useState<any[]>([])
  const [cobrosLoading, setCobrosLoading] = useState(false)
  const [ingresos, setIngresos] = useState<any>(null)
  const [ingresosLoading, setIngresosLoading] = useState(false)
  const [destacadosActivos, setDestacadosActivos] = useState<any[]>([])
  const [destacadosLoading, setDestacadosLoading] = useState(false)
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80')
  const [bannerInput, setBannerInput] = useState('')
  const [bannerGuardado, setBannerGuardado] = useState(false)
  const [faviconUrl, setFaviconUrl] = useState('')
  const [featureImgUrl, setFeatureImgUrl] = useState('')
  const [configUploading, setConfigUploading] = useState<string | null>(null)
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [redesGuardadas, setRedesGuardadas] = useState(false)

  const authHeader = useCallback((t?: string) => ({
    'Authorization': `Bearer ${t || token}`,
    'Content-Type': 'application/json',
  }), [token])

  // Verificar token al cargar
  useEffect(() => {
    const stored = localStorage.getItem('habitade_admin_token')
    if (!stored) { setAuthed(false); return }
    fetch('/api/admin/verify', { method: 'POST', headers: { 'Authorization': `Bearer ${stored}`, 'Content-Type': 'application/json' } })
      .then(r => { if (r.ok) { setToken(stored); setAuthed(true) } else { localStorage.removeItem('habitade_admin_token'); setAuthed(false) } })
      .catch(() => setAuthed(false))
  }, [])

  // Cargar stats al autenticarse + polling cada 30s para actualizaciones AEI/nuevos registros
  useEffect(() => {
    if (!authed || !token) return
    const cargar = () => fetch('/api/admin/stats', { headers: authHeader() }).then(r => r.json()).then(setStats)
    cargar()
    const id = setInterval(cargar, 30000)
    return () => clearInterval(id)
  }, [authed, token, authHeader])

  const login = async () => {
    setLoginLoading(true); setLoginError('')
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: loginPass }) })
    const d = await r.json()
    if (r.ok) { localStorage.setItem('habitade_admin_token', d.token); setToken(d.token); setAuthed(true) }
    else { setLoginError(d.error || 'Error') }
    setLoginLoading(false)
  }

  const logout = () => { localStorage.removeItem('habitade_admin_token'); setAuthed(false); setToken('') }

  const cargarAei = useCallback(async () => {
    setAeiLoading(true)
    const r = await fetch('/api/admin/aei', { headers: authHeader() })
    const d = await r.json()
    setAeiLista(d.lista ?? [])
    setAeiColumnaMissing(d.columnaMissing ?? false)
    setAeiLoading(false)
  }, [authHeader])

  const accionAei = async (id: string, accion: 'aprobar' | 'rechazar') => {
    const r = await fetch('/api/admin/aei', { method: 'POST', headers: authHeader(), body: JSON.stringify({ id, accion }) })
    const d = await r.json()
    if (!r.ok) {
      if (d.columnaMissing) {
        alert('⚠ Falta ejecutar la migración SQL.\n\nVe a Supabase → SQL Editor y ejecuta:\n\nALTER TABLE usuarios ADD COLUMN IF NOT EXISTS aei_aprobado boolean DEFAULT false;')
      } else {
        alert(`Error: ${d.error}`)
      }
      return
    }
    cargarAei()
    fetch('/api/admin/stats', { headers: authHeader() }).then(r => r.json()).then(setStats)
  }

  const cargarPropiedades = useCallback(async (q = '') => {
    setPropLoading(true)
    const r = await fetch(`/api/admin/propiedades?q=${encodeURIComponent(q)}`, { headers: authHeader() })
    setPropiedades(await r.json())
    setPropLoading(false)
  }, [authHeader])

  const eliminarPropiedad = async (id: string) => {
    if (!confirm('¿Eliminar este anuncio? Esta acción es irreversible.')) return
    await fetch('/api/admin/propiedades', { method: 'DELETE', headers: authHeader(), body: JSON.stringify({ id }) })
    cargarPropiedades(propQ)
    fetch('/api/admin/stats', { headers: authHeader() }).then(r => r.json()).then(setStats)
  }

  const toggleEstado = async (id: string, estadoActual: string) => {
    const nuevo = estadoActual === 'activo' ? 'inactivo' : 'activo'
    await fetch('/api/admin/propiedades', { method: 'PATCH', headers: authHeader(), body: JSON.stringify({ id, estado: nuevo }) })
    cargarPropiedades(propQ)
  }

  const cargarUsuarios = useCallback(async (q = '') => {
    setUsersLoading(true)
    const r = await fetch(`/api/admin/usuarios?q=${encodeURIComponent(q)}`, { headers: authHeader() })
    setUsuarios(await r.json())
    setUsersLoading(false)
  }, [authHeader])

  const eliminarUsuario = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar la cuenta de "${nombre}"?\n\nSe borrarán también todos sus anuncios. Esta acción no se puede deshacer.`)) return
    const r = await fetch('/api/admin/usuarios', { method: 'DELETE', headers: authHeader(), body: JSON.stringify({ id }) })
    const d = await r.json()
    if (!r.ok) { alert(`Error: ${d.error}`); return }
    cargarUsuarios(usersQ)
    fetch('/api/admin/stats', { headers: authHeader() }).then(r => r.json()).then(setStats)
  }

  const cargarCobros = useCallback(async () => {
    setCobrosLoading(true)
    const r = await fetch('/api/admin/usuarios?q=', { headers: authHeader() })
    const all = await r.json()
    setCobros((all as any[]).filter((u: any) => u.plan === 'profesional'))
    setCobrosLoading(false)
  }, [authHeader])

  const cargarIngresos = useCallback(async () => {
    setIngresosLoading(true)
    const r = await fetch('/api/admin/ingresos', { headers: authHeader() })
    setIngresos(await r.json())
    setIngresosLoading(false)
  }, [authHeader])

  const cargarConfig = useCallback(async () => {
    const r = await fetch('/api/admin/config', { headers: authHeader() })
    const cfg = await r.json()
    if (cfg.banner_url) setBannerUrl(cfg.banner_url)
    if (cfg.favicon_url) setFaviconUrl(cfg.favicon_url)
    if (cfg.feature_img_url) setFeatureImgUrl(cfg.feature_img_url)
  }, [authHeader])

  const subirConfig = async (clave: string, file: File) => {
    setConfigUploading(clave)
    const form = new FormData()
    form.append('file', file)
    form.append('clave', clave)
    const r = await fetch('/api/admin/upload-config', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: form })
    const d = await r.json()
    if (d.url) {
      if (clave === 'banner_url') setBannerUrl(d.url)
      if (clave === 'favicon_url') setFaviconUrl(d.url)
      if (clave === 'feature_img_url') setFeatureImgUrl(d.url)
    }
    setConfigUploading(null)
  }

  const cargarDestacados = useCallback(async () => {
    setDestacadosLoading(true)
    const [rd, ri] = await Promise.all([
      fetch('/api/admin/destacados', { headers: authHeader() }),
      fetch('/api/admin/ingresos', { headers: authHeader() }),
    ])
    setDestacadosActivos(await rd.json())
    setIngresos(await ri.json())
    setDestacadosLoading(false)
  }, [authHeader])

  useEffect(() => {
    if (!authed) return
    cargarConfig()
    if (seccion === 'propiedades') cargarPropiedades()
    if (seccion === 'usuarios') cargarUsuarios()
    if (seccion === 'cobros') { cargarCobros(); cargarIngresos() }
    if (seccion === 'destacados') cargarDestacados()

    // AEI: carga inicial + polling cada 20s para detectar nuevas solicitudes
    if (seccion === 'aei') {
      cargarAei()
      const id = setInterval(cargarAei, 20000)
      return () => clearInterval(id)
    }
  }, [seccion, authed, cargarAei, cargarPropiedades, cargarUsuarios, cargarCobros, cargarIngresos, cargarDestacados, cargarConfig])

  // ─── PANTALLA DE CARGA ───────────────────────────────────────────────
  if (authed === null) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${C.verde}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  // ─── PANTALLA DE LOGIN ───────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.oscuro }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '48px 40px', width: 360, boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.verde, letterSpacing: -1.5 }}>habitade<span style={{ color: C.azul }}>.</span></div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Panel de administración</div>
        </div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 8 }}>Contraseña</label>
        <input
          type="password"
          value={loginPass}
          onChange={e => setLoginPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Contraseña admin"
          autoFocus
          style={{ width: '100%', border: `1.5px solid ${loginError ? '#ef4444' : '#e0e0e0'}`, borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
        />
        {loginError && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>{loginError}</div>}
        <button onClick={login} disabled={loginLoading || !loginPass} style={{ all: 'unset', width: '100%', background: C.verde, color: '#fff', padding: '12px 0', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', marginTop: 8, opacity: loginLoading || !loginPass ? 0.6 : 1 }}>
          {loginLoading ? 'Verificando...' : 'Entrar'}
        </button>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ─── BADGE HELPERS ───────────────────────────────────────────────────
  const Badge = ({ txt, color, bg }: { txt: string, color: string, bg: string }) => (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap' }}>{txt}</span>
  )

  const Th = ({ children }: { children: React.ReactNode }) => (
    <th style={{ textAlign: 'left', fontSize: 11, color: '#aaa', fontWeight: 500, padding: '0 12px 10px 0' }}>{children}</th>
  )
  const Td = ({ children }: { children: React.ReactNode }) => (
    <td style={{ padding: '10px 12px 10px 0', fontSize: 13, color: '#333', verticalAlign: 'middle' }}>{children}</td>
  )

  const Btn = ({ onClick, children, variant = 'primary', small = false }: { onClick: () => void, children: React.ReactNode, variant?: 'primary' | 'danger' | 'ghost', small?: boolean }) => {
    const styles: Record<string, React.CSSProperties> = {
      primary: { background: C.verde, color: '#fff', border: 'none' },
      danger: { background: '#fee2e2', color: '#991b1b', border: 'none' },
      ghost: { background: 'transparent', color: '#666', border: '1px solid #e0e0e0' },
    }
    return (
      <button onClick={onClick} style={{ all: 'unset', ...styles[variant], padding: small ? '4px 10px' : '6px 14px', borderRadius: 4, fontSize: small ? 11 : 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', ...styles[variant] }}>
        {children}
      </button>
    )
  }

  const Seccion = ({ titulo, desc, children }: { titulo: string, desc?: string, children: React.ReactNode }) => (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: desc ? 4 : 24 }}>{titulo}</h1>
      {desc && <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>{desc}</p>}
      {children}
    </div>
  )

  const Card = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', ...style }}>{children}</div>
  )

  // ─── PANEL ───────────────────────────────────────────────────────────
  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* NAV */}
      <nav style={{ background: C.verde, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>habitade<span style={{ color: '#83D4DB' }}>.</span></a>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 10 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>← Ver web</a>
          <button onClick={logout} style={{ all: 'unset', fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', padding: '5px 14px', borderRadius: 4, cursor: 'pointer' }}>Cerrar sesión</button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>

        {/* SIDEBAR */}
        <div style={{ width: 220, background: C.oscuro, minHeight: 'calc(100vh - 54px)', padding: '20px 0', flexShrink: 0 }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontSize: 13, color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.6)', background: seccion === item.id ? 'rgba(255,255,255,0.12)' : 'transparent', cursor: 'pointer', borderLeft: seccion === item.id ? `3px solid #83D4DB` : '3px solid transparent', boxSizing: 'border-box' }}>
              {item.icon}{item.label}
            </button>
          ))}
          {stats?.aeiPend > 0 && seccion !== 'aei' && (
            <button onClick={() => setSeccion('aei')} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px 10px 40px', fontSize: 12, color: '#fbbf24', cursor: 'pointer', boxSizing: 'border-box' }}>
              ⚠ {stats.aeiPend} pendiente{stats.aeiPend !== 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* CONTENIDO */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {/* DASHBOARD */}
          {seccion === 'dashboard' && (
            <Seccion titulo="Dashboard">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Anuncios activos', val: stats?.totalProp ?? '—', color: C.verde, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.verde} strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> },
                  { label: 'Usuarios registrados', val: stats?.totalUsers ?? '—', color: C.azul, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.azul} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
                  { label: 'Suscripciones activas', val: stats?.totalSubs ?? '—', color: '#10b981', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
                  { label: 'AEI pendientes', val: stats?.aeiPend ?? '—', color: '#f59e0b', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                ].map(s => (
                  <Card key={s.label} style={{ padding: 20, borderTop: `3px solid ${s.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>{s.label}</div>{s.icon}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>{s.val}</div>
                  </Card>
                ))}
              </div>

              {/* Suscripciones recientes */}
              <Card style={{ padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 }}>Usuarios con suscripción activa</div>
                {!stats ? <div style={{ color: '#aaa', fontSize: 13 }}>Cargando...</div> : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '1px solid #f0f0f0' }}><Th>Usuario</Th><Th>Email</Th><Th>Alta</Th></tr></thead>
                    <tbody>
                      {stats.recientes.length === 0 && <tr><td colSpan={3} style={{ padding: '16px 0', fontSize: 13, color: '#aaa' }}>Sin suscripciones activas</td></tr>}
                      {stats.recientes.map((u: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f8f8f8' }}>
                          <Td><span style={{ fontWeight: 500 }}>{u.nombre}</span></Td>
                          <Td>{u.email}</Td>
                          <Td>{fmtFecha(u.created_at)}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>

              {stats?.aeiPend > 0 && (
                <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#92400e', fontSize: 14 }}>⚠ {stats.aeiPend} verificación{stats.aeiPend !== 1 ? 'es' : ''} AEI pendiente{stats.aeiPend !== 1 ? 's' : ''}</span>
                    <span style={{ color: '#a16207', fontSize: 13, marginLeft: 10 }}>Requiere tu aprobación</span>
                  </div>
                  <button onClick={() => setSeccion('aei')} style={{ all: 'unset', background: '#f59e0b', color: '#fff', padding: '7px 18px', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Revisar ahora</button>
                </div>
              )}
            </Seccion>
          )}

          {/* VERIFICACIONES AEI */}
          {seccion === 'aei' && (
            <Seccion titulo="Verificaciones AEI" desc="Comprueba cada número AEI con la organización antes de aprobar">
              {aeiColumnaMissing && (
                <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '14px 20px', marginBottom: 20 }}>
                  <div style={{ fontWeight: 600, color: '#92400e', fontSize: 14, marginBottom: 6 }}>⚠ Paso previo necesario</div>
                  <div style={{ fontSize: 13, color: '#78350f', marginBottom: 10 }}>La columna <code style={{ background: '#fde68a', padding: '1px 5px', borderRadius: 3 }}>aei_aprobado</code> no existe todavía en la base de datos. Hasta que la añadas, el botón Aprobar no funcionará (Rechazar sí funciona).</div>
                  <div style={{ fontSize: 13, color: '#78350f', fontWeight: 500, marginBottom: 6 }}>Ve a <strong>Supabase → SQL Editor</strong> y ejecuta:</div>
                  <code style={{ display: 'block', background: '#1e1e2e', color: '#a6e3a1', padding: '10px 14px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace', userSelect: 'all' }}>
                    ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS aei_aprobado boolean DEFAULT false;
                  </code>
                </div>
              )}
              {aeiLoading ? <div style={{ color: '#aaa', fontSize: 13 }}>Cargando...</div> : (
                <>
                  {/* Pendientes */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 10 }}>
                    Pendientes de revisión ({aeiLista.filter(a => !a.aei_aprobado).length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                    {aeiLista.filter(a => !a.aei_aprobado).length === 0 && (
                      <Card style={{ padding: '32px 24px', textAlign: 'center' }}>
                        <div style={{ fontSize: 14, color: '#aaa' }}>No hay solicitudes pendientes</div>
                      </Card>
                    )}
                    {aeiLista.filter(a => !a.aei_aprobado).map((a) => (
                      <Card key={a.id} style={{ padding: '20px 24px', borderLeft: '4px solid #f59e0b' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>

                          {/* Avatar */}
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#92400e', flexShrink: 0 }}>
                            {a.nombre?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>

                          {/* Info agente */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{a.nombre}</span>
                              <Badge txt={a.tipo || 'profesional'} color="#555" bg="#f0f0f0" />
                              {a.inmobiliaria && <Badge txt={a.inmobiliaria} color="#1a3a5c" bg="#e8edf5" />}
                              {a.plan !== 'profesional' && (
                                <Badge txt="⚠ Sin plan pagado" color="#92400e" bg="#fef3c7" />
                              )}
                            </div>
                            <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>{a.email}</div>

                            {/* Número AEI — grande y copiable */}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#f0fafb', border: '1.5px solid #c5e8ea', borderRadius: 8, padding: '10px 16px' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.verde} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                              <span style={{ fontSize: 20, fontWeight: 800, color: C.verde, letterSpacing: 1, fontFamily: 'monospace' }}>{a.numero_aei}</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(a.numero_aei)}
                                title="Copiar número"
                                style={{ all: 'unset', cursor: 'pointer', color: '#aaa', display: 'flex', alignItems: 'center' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.verde}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#aaa'}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                              </button>
                            </div>
                            <div style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>Solicitud: {fmtFecha(a.created_at)}</div>
                          </div>

                          {/* Acciones */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                            <Btn onClick={() => accionAei(a.id, 'aprobar')}>✓ Aprobar</Btn>
                            <Btn onClick={() => accionAei(a.id, 'rechazar')} variant="danger">✗ Rechazar</Btn>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Aprobados */}
                  {aeiLista.filter(a => a.aei_aprobado).length > 0 && (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 10 }}>
                        Aprobados ({aeiLista.filter(a => a.aei_aprobado).length})
                      </div>
                      <Card style={{ overflow: 'hidden' }}>
                        {aeiLista.filter(a => a.aei_aprobado).map((a, i, arr) => (
                          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{a.nombre}</span>
                                {a.plan !== 'profesional' && <Badge txt="⚠ Sin plan pagado" color="#92400e" bg="#fef3c7" />}
                              </div>
                              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{a.email}</div>
                            </div>
                            <span style={{ fontSize: 15, fontWeight: 700, color: C.verde, fontFamily: 'monospace', letterSpacing: 0.5 }}>{a.numero_aei}</span>
                            <Badge txt="✓ Aprobado" color="#065f46" bg="#d1fae5" />
                            <Btn onClick={() => accionAei(a.id, 'rechazar')} variant="ghost" small>Revocar</Btn>
                          </div>
                        ))}
                      </Card>
                    </>
                  )}
                </>
              )}
            </Seccion>
          )}

          {/* ANUNCIOS */}
          {seccion === 'propiedades' && (
            <Seccion titulo="Anuncios" desc="Gestiona todos los anuncios publicados en Habitade">
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input value={propQ} onChange={e => setPropQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && cargarPropiedades(propQ)} placeholder="Buscar por título..." style={{ flex: 1, border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '9px 14px', fontSize: 13, outline: 'none' }} />
                <button onClick={() => cargarPropiedades(propQ)} style={{ all: 'unset', background: C.verde, color: '#fff', padding: '9px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Buscar</button>
              </div>
              <Card style={{ overflow: 'hidden' }}>
                {propLoading ? <div style={{ padding: 24, color: '#aaa', fontSize: 13 }}>Cargando...</div> : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                      <tr><Th>Título</Th><Th>Zona</Th><Th>Precio</Th><Th>Tipo</Th><Th>Estado</Th><Th>Publicado</Th><Th>Usuario</Th><Th></Th></tr>
                    </thead>
                    <tbody>
                      {propiedades.length === 0 && <tr><td colSpan={8} style={{ padding: '24px', fontSize: 13, color: '#aaa', textAlign: 'center' }}>Sin resultados</td></tr>}
                      {propiedades.map((p: any) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f8f8f8' }} onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                          <Td><a href={`/propiedad/${p.id}`} target="_blank" rel="noreferrer" style={{ color: C.verde, fontWeight: 500, textDecoration: 'none', fontSize: 13 }}>{p.titulo}</a>{p.destacado && <Badge txt="DEST." color="#006D77" bg="#e0f5f7" />}</Td>
                          <Td><span style={{ fontSize: 12, color: '#666' }}>{p.zona}</span></Td>
                          <Td><span style={{ fontWeight: 600 }}>US$ {(p.precio || 0).toLocaleString('en-US')}</span></Td>
                          <Td><Badge txt={p.tipo} color="#555" bg="#f0f0f0" /></Td>
                          <Td><Badge txt={p.estado} color={p.estado === 'activo' ? '#065f46' : '#92400e'} bg={p.estado === 'activo' ? '#d1fae5' : '#fef3c7'} /></Td>
                          <Td><span style={{ fontSize: 12, color: '#aaa' }}>{fmtFecha(p.created_at)}</span></Td>
                          <Td><span style={{ fontSize: 12 }}>{(p.usuarios as any)?.nombre || '—'}</span></Td>
                          <Td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <Btn onClick={() => toggleEstado(p.id, p.estado)} variant="ghost" small>{p.estado === 'activo' ? 'Desactivar' : 'Activar'}</Btn>
                              <Btn onClick={() => eliminarPropiedad(p.id)} variant="danger" small>Eliminar</Btn>
                            </div>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </Seccion>
          )}

          {/* USUARIOS */}
          {seccion === 'usuarios' && (
            <Seccion titulo="Usuarios" desc="Todos los usuarios registrados en Habitade">
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input value={usersQ} onChange={e => setUsersQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && cargarUsuarios(usersQ)} placeholder="Buscar por nombre o email..." style={{ flex: 1, border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '9px 14px', fontSize: 13, outline: 'none' }} />
                <button onClick={() => cargarUsuarios(usersQ)} style={{ all: 'unset', background: C.verde, color: '#fff', padding: '9px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Buscar</button>
              </div>
              <Card style={{ overflow: 'auto' }}>
                {usersLoading ? <div style={{ padding: 24, color: '#aaa', fontSize: 13 }}>Cargando...</div> : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                    <thead style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                      <tr><Th>Nombre</Th><Th>Email</Th><Th>Tipo</Th><Th>Plan</Th><Th>AEI</Th><Th>Registro</Th><Th></Th></tr>
                    </thead>
                    <tbody>
                      {usuarios.length === 0 && <tr><td colSpan={7} style={{ padding: 24, fontSize: 13, color: '#aaa', textAlign: 'center' }}>Sin resultados</td></tr>}
                      {usuarios.map((u: any) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f8f8f8' }} onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                          <Td><span style={{ fontWeight: 500 }}>{u.nombre}</span></Td>
                          <Td><span style={{ fontSize: 12, color: '#666' }}>{u.email}</span></Td>
                          <Td><Badge txt={u.tipo || 'particular'} color="#555" bg="#f0f0f0" /></Td>
                          <Td><Badge txt={u.plan || 'gratis'} color={u.plan === 'profesional' ? '#065f46' : '#555'} bg={u.plan === 'profesional' ? '#d1fae5' : '#f0f0f0'} /></Td>
                          <Td>
                            {u.numero_aei
                              ? u.aei_aprobado
                                ? <Badge txt={`✓ ${u.numero_aei}`} color="#065f46" bg="#d1fae5" />
                                : <Badge txt={`⏳ ${u.numero_aei}`} color="#92400e" bg="#fef3c7" />
                              : <span style={{ color: '#ccc', fontSize: 12 }}>—</span>
                            }
                          </Td>
                          <Td><span style={{ fontSize: 12, color: '#aaa' }}>{fmtFecha(u.created_at)}</span></Td>
                          <Td>
                            <Btn onClick={() => eliminarUsuario(u.id, u.nombre || u.email)} variant="danger" small>Eliminar</Btn>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </Seccion>
          )}

          {/* SUSCRIPCIONES */}
          {seccion === 'cobros' && (
            <Seccion titulo="Suscripciones" desc="Usuarios con plan profesional activo">
              <div style={{ marginBottom: 24 }}>
                <Card style={{ padding: 20, borderTop: `3px solid ${C.verde}`, display: 'inline-block', minWidth: 200 }}>
                  <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 8 }}>Suscripciones activas</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: C.verde }}>{cobros.length}</div>
                </Card>
              </div>
              <Card style={{ overflow: 'auto' }}>
                {cobrosLoading ? <div style={{ padding: 24, color: '#aaa', fontSize: 13 }}>Cargando...</div> : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                    <thead style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                      <tr><Th>Nombre</Th><Th>Email</Th><Th>Tipo</Th><Th>ID Stripe</Th><Th>Vence</Th></tr>
                    </thead>
                    <tbody>
                      {cobros.length === 0 && <tr><td colSpan={5} style={{ padding: 24, fontSize: 13, color: '#aaa', textAlign: 'center' }}>Sin suscripciones activas</td></tr>}
                      {cobros.map((u: any) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                          <Td><span style={{ fontWeight: 500 }}>{u.nombre}</span></Td>
                          <Td><span style={{ fontSize: 12, color: '#666' }}>{u.email}</span></Td>
                          <Td><Badge txt={u.tipo || 'particular'} color="#555" bg="#f0f0f0" /></Td>
                          <Td><span style={{ fontSize: 11, color: '#aaa', fontFamily: 'monospace' }}>{u.stripe_subscription_id || '—'}</span></Td>
                          <Td>
                            {u.plan_activo_hasta
                              ? <Badge txt={fmtFecha(u.plan_activo_hasta)} color={new Date(u.plan_activo_hasta) > new Date() ? '#065f46' : '#991b1b'} bg={new Date(u.plan_activo_hasta) > new Date() ? '#d1fae5' : '#fee2e2'} />
                              : <span style={{ color: '#aaa', fontSize: 12 }}>—</span>}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </Seccion>
          )}

          {/* DESTACADOS ACTIVOS */}
          {seccion === 'destacados' && (
            <Seccion titulo="Destacados" desc="Anuncios con destacado activo por tipo de plan">
              {/* 3 columnas por duración */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
                <Card style={{ padding: 20, borderTop: `3px solid #006D77` }}>
                  <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 8 }}>Total activos</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#006D77' }}>{destacadosLoading ? '…' : destacadosActivos.length}</div>
                  <div style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>destacados ahora</div>
                </Card>
                {[15, 30, 60].map(dias => {
                  const count = destacadosActivos.filter((p: any) => p.destacado_dias === dias || (!p.destacado_dias && dias === 15)).length
                  return (
                    <Card key={dias} style={{ padding: 20, borderTop: `3px solid #f59e0b` }}>
                      <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 8 }}>Plan {dias} días</div>
                      <div style={{ fontSize: 36, fontWeight: 800, color: '#f59e0b' }}>{destacadosLoading ? '…' : count}</div>
                      <div style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>activos ahora</div>
                    </Card>
                  )
                })}
              </div>

              {/* Tabla */}
              <Card style={{ overflow: 'auto' }}>
                {destacadosLoading ? <div style={{ padding: 24, color: '#aaa', fontSize: 13 }}>Cargando...</div> : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
                    <thead style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                      <tr><Th>Anuncio</Th><Th>Zona</Th><Th>Tipo</Th><Th>Propietario</Th><Th>Destac. hasta</Th></tr>
                    </thead>
                    <tbody>
                      {destacadosActivos.length === 0 && (
                        <tr><td colSpan={5} style={{ padding: 24, fontSize: 13, color: '#aaa', textAlign: 'center' }}>Sin destacados activos</td></tr>
                      )}
                      {destacadosActivos.map((p: any) => {
                        const hasta = new Date(p.destacado_hasta)
                        const diasRestantes = Math.ceil((hasta.getTime() - Date.now()) / 86400000)
                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid #f8f8f8' }} onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                            <Td>
                              <a href={`/propiedad/${p.id}`} target="_blank" rel="noreferrer" style={{ color: C.verde, fontWeight: 500, textDecoration: 'none', fontSize: 13 }}>{p.titulo}</a>
                            </Td>
                            <Td><span style={{ fontSize: 12, color: '#666' }}>{p.zona}</span></Td>
                            <Td><Badge txt={p.tipo} color="#555" bg="#f0f0f0" /></Td>
                            <Td>
                              <div style={{ fontSize: 13 }}>{(p.usuarios as any)?.nombre || '—'}</div>
                              <div style={{ fontSize: 11, color: '#aaa' }}>{(p.usuarios as any)?.email || ''}</div>
                            </Td>
                            <Td>
                              <div style={{ fontSize: 13, fontWeight: 500, color: diasRestantes <= 3 ? '#991b1b' : '#111' }}>{fmtFecha(p.destacado_hasta)}</div>
                              <div style={{ fontSize: 11, color: diasRestantes <= 3 ? '#ef4444' : '#aaa' }}>
                                {diasRestantes === 1 ? 'Vence mañana' : `${diasRestantes} días restantes`}
                              </div>
                            </Td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </Card>
            </Seccion>
          )}

          {/* BANNER */}
          {seccion === 'banner' && (
            <Seccion titulo="Banner de inicio" desc="Cambia la imagen de fondo del banner principal de Habitade">
              <Card style={{ padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 12 }}>Vista previa</div>
                <div style={{ height: 200, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,78,87,0.72)' }} />
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: '#fff', textAlign: 'center', padding: '0 20px' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Encuentra tu próxima propiedad en República Dominicana</div>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>El portal inmobiliario líder del Caribe</div>
                  </div>
                </div>
              </Card>
              <Card style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 16 }}>Cambiar imagen</div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#555', fontWeight: 600, marginBottom: 8 }}>Subir desde tu ordenador</div>
                  <div style={{ fontSize: 11, color: '#f59e0b', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '8px 12px', marginBottom: 10 }}>
                    Recomendado: <strong>1600 × 500 px</strong> · formato JPG o PNG · máx. 3 MB
                  </div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fafb', border: `1.5px solid ${C.verde}`, borderRadius: 6, padding: '9px 18px', fontSize: 13, fontWeight: 600, color: C.verde, cursor: 'pointer' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {configUploading === 'banner_url' ? 'Subiendo…' : 'Elegir imagen'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) subirConfig('banner_url', f) }} />
                  </label>
                </div>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>O pega una URL directamente:</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <input value={bannerInput} onChange={e => setBannerInput(e.target.value)} type="text" placeholder="https://ejemplo.com/imagen.jpg" style={{ flex: 1, border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none' }} />
                  <button onClick={async () => { if (!bannerInput.trim()) return; setBannerUrl(bannerInput.trim()); await fetch('/api/admin/config', { method: 'POST', headers: authHeader(), body: JSON.stringify({ clave: 'banner_url', valor: bannerInput.trim() }) }); setBannerGuardado(true); setTimeout(() => setBannerGuardado(false), 3000) }} style={{ all: 'unset', background: C.verde, color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {bannerGuardado ? '✓ Guardado' : 'Guardar'}
                  </button>
                </div>
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 12 }}>Imágenes sugeridas (Unsplash)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', label: 'Interior moderno' },
                      { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80', label: 'Villa tropical' },
                      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', label: 'Casa de lujo' },
                      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', label: 'Residencia moderna' },
                      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', label: 'Piscina exterior' },
                      { url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80', label: 'Apartamento vistas' },
                    ].map(img => (
                      <div key={img.url} onClick={() => { setBannerInput(img.url.replace('w=800', 'w=1600')); setBannerUrl(img.url) }} style={{ cursor: 'pointer', borderRadius: 6, overflow: 'hidden', border: bannerUrl === img.url ? `2px solid ${C.verde}` : '2px solid transparent', position: 'relative' }}>
                        <div style={{ height: 80, backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div style={{ padding: '5px 8px', background: '#f9f9f9', fontSize: 11, color: '#666' }}>{img.label}</div>
                        {bannerUrl === img.url && <div style={{ position: 'absolute', top: 6, right: 6, background: C.verde, color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Seccion>
          )}

          {/* FAVICON E IMAGEN INICIO */}
          {seccion === 'favicon' && (
            <Seccion titulo="Favicon e imagen de inicio" desc="Personaliza el icono de la pestaña y la imagen de la sección de publicar">
              <Card style={{ padding: '24px', marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 4 }}>Favicon (icono de pestaña)</div>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 16 }}>El icono que aparece en la pestaña del navegador y en favoritos</div>
                <div style={{ fontSize: 11, color: '#f59e0b', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '8px 12px', marginBottom: 14 }}>
                  Recomendado: <strong>32 × 32 px</strong> o <strong>64 × 64 px</strong> · formato ICO, PNG o SVG
                </div>
                {faviconUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '10px 14px', background: '#f9fafb', borderRadius: 6 }}>
                    <img src={faviconUrl} alt="favicon" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                    <span style={{ fontSize: 12, color: '#666' }}>Favicon actual</span>
                  </div>
                )}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fafb', border: `1.5px solid ${C.verde}`, borderRadius: 6, padding: '9px 18px', fontSize: 13, fontWeight: 600, color: C.verde, cursor: 'pointer' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {configUploading === 'favicon_url' ? 'Subiendo…' : 'Subir favicon'}
                  <input type="file" accept=".ico,.png,.svg,image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) subirConfig('favicon_url', f) }} />
                </label>
              </Card>

              <Card style={{ padding: '24px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 4 }}>Imagen sección "Publicar anuncio"</div>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 16 }}>La imagen que aparece en la página de inicio junto a "Publica 2 anuncios gratis". Actualmente es un icono genérico.</div>
                <div style={{ fontSize: 11, color: '#f59e0b', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '8px 12px', marginBottom: 14 }}>
                  Recomendado: <strong>280 × 200 px</strong> · formato PNG o JPG · fondo transparente o claro
                </div>
                {featureImgUrl && (
                  <div style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden', width: 140, height: 100, background: '#006D77', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={featureImgUrl} alt="feature" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fafb', border: `1.5px solid ${C.verde}`, borderRadius: 6, padding: '9px 18px', fontSize: 13, fontWeight: 600, color: C.verde, cursor: 'pointer' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {configUploading === 'feature_img_url' ? 'Subiendo…' : 'Subir imagen'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) subirConfig('feature_img_url', f) }} />
                </label>
              </Card>
            </Seccion>
          )}

          {/* REDES */}
          {seccion === 'redes' && (
            <Seccion titulo="Redes sociales" desc="Configura los enlaces a las redes sociales del footer">
              <Card style={{ padding: 24 }}>
                {[
                  { label: 'Instagram', emoji: '📸', val: instagramUrl, set: setInstagramUrl, placeholder: 'https://instagram.com/habitade' },
                  { label: 'Facebook', emoji: '👥', val: facebookUrl, set: setFacebookUrl, placeholder: 'https://facebook.com/habitade' },
                  { label: 'TikTok', emoji: '🎵', val: tiktokUrl, set: setTiktokUrl, placeholder: 'https://tiktok.com/@habitade' },
                  { label: 'WhatsApp', emoji: '💬', val: whatsappUrl, set: setWhatsappUrl, placeholder: 'https://wa.me/18095550000' },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{r.emoji} {r.label}</label>
                    <input value={r.val} onChange={e => r.set(e.target.value)} type="text" placeholder={r.placeholder} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <button onClick={() => { setRedesGuardadas(true); setTimeout(() => setRedesGuardadas(false), 3000) }} style={{ all: 'unset', background: C.verde, color: '#fff', padding: '11px 28px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
                  {redesGuardadas ? '✓ Guardado' : 'Guardar enlaces'}
                </button>
              </Card>
            </Seccion>
          )}

        </div>
      </div>
    </main>
  )
}
