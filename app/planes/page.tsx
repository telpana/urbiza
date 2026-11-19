'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../supabase'
import { useIdioma } from '../../IdiomaContext'

const BRAND = '#006D77'
const BRAND_DARK = '#004E57'

const LISTADOS = [
  { zona: 'Piantini, D.N.', precio: '$285,000', tipo: 'Apartamento', hab: 3, banos: 2 },
  { zona: 'Cap Cana', precio: '$420,000', tipo: 'Villa', hab: 4, banos: 3 },
  { zona: 'Punta Cana', precio: '$195,000', tipo: 'Apartamento', hab: 2, banos: 2 },
  { zona: 'Santiago', precio: '$148,000', tipo: 'Casa', hab: 3, banos: 2 },
]

function Pin({ x, y, color = '#006D77', size = 14 }: { x: number; y: number; color?: string; size?: number }) {
  const r = size
  return (
    <g transform={`translate(${x},${y})`}>
      <path d={`M0,${-r} C${-r * 0.56},${-r} ${-r},${-r * 0.56} ${-r},0 C${-r},${r * 0.6} 0,${r * 1.1} 0,${r * 1.1} C0,${r * 1.1} ${r},${r * 0.6} ${r},0 C${r},${-r * 0.56} ${r * 0.56},${-r} 0,${-r}Z`}
        fill={color} stroke="#fff" strokeWidth="1.2"/>
      <circle cx="0" cy="0" r={r * 0.32} fill="#fff"/>
    </g>
  )
}

function MapaRD() {
  return (
    <svg viewBox="0 0 420 250" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="250" fill="#c8e6f8"/>
      {/* Silueta RD — trazada sobre la forma real */}
      <path d="
        M 32,80 L 38,62 L 48,48 L 62,36 L 80,24 L 100,16 L 122,10
        L 148,7 L 172,8 L 194,12 L 208,16
        L 212,12 L 220,6 L 232,2 L 246,1 L 258,4
        L 266,10 L 264,20 L 258,28
        L 268,24 L 280,24 L 294,28 L 312,36
        L 334,46 L 358,60 L 382,76 L 402,96
        L 416,116 L 416,136 L 410,156
        L 400,170 L 384,180 L 364,188 L 340,194
        L 312,198 L 282,200 L 252,200 L 222,198
        L 192,196 L 162,193 L 134,189 L 106,183
        L 80,175 L 56,165 L 36,153
        L 22,140 L 16,124 L 18,106
        L 22,90 L 28,80 Z"
        fill="#d4edda" stroke="#a5d6a7" strokeWidth="1.2"/>
      {/* Isla Saona */}
      <ellipse cx="380" cy="210" rx="16" ry="7" fill="#d4edda" stroke="#a5d6a7" strokeWidth="1"/>
      {/* Isla Beata */}
      <ellipse cx="118" cy="216" rx="9" ry="5" fill="#d4edda" stroke="#a5d6a7" strokeWidth="1"/>
      {/* Relieve interior suave */}
      <path d="M 70,90 Q 130,65 190,76 Q 250,62 300,80 Q 335,95 345,125 Q 300,148 240,152 Q 178,156 128,144 Q 85,132 70,110 Z"
        fill="#b8dfc0" opacity="0.4"/>
      {/* Pines */}
      <Pin x={200} y={178} color={BRAND} size={13}/>
      <Pin x={128} y={72} color={BRAND} size={12}/>
      <Pin x={408} y={124} color={BRAND} size={12}/>
      <Pin x={338} y={184} color="#f59e0b" size={11}/>
      <Pin x={88} y={26} color="#f59e0b" size={11}/>
    </svg>
  )
}

export default function Planes() {
  const { tr } = useIdioma()
  const Tp = tr.panel.planesPage
  const [isEmbed, setIsEmbed] = useState(false)
  const [anual, setAnual] = useState(true)
  const [sesionActiva, setSesionActiva] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [planActual, setPlanActual] = useState<string | null>(null)
  const [iniciado, setIniciado] = useState(false)
  const [codigoPromo, setCodigoPromo] = useState('')
  const [promoExpanded, setPromoExpanded] = useState(false)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [promoValidado, setPromoValidado] = useState(false)
  const [promoDias, setPromoDias] = useState(0)

  useEffect(() => { setIsEmbed(window.self !== window.top) }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIniciado(true)
      if (session?.user) {
        setSesionActiva(true)
        supabase.from('usuarios').select('plan').eq('id', session.user.id).single()
          .then(({ data }) => { if (data?.plan) setPlanActual(data.plan) })
      }
    })

    // Recuperar código promo guardado antes del registro
    try {
      const guardado = sessionStorage.getItem('hb_promo_pendiente')
      if (guardado) {
        sessionStorage.removeItem('hb_promo_pendiente')
        setCodigoPromo(guardado)
        setPromoExpanded(true)
        setAnual(false)
        fetch('/api/validar-promo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo: guardado }) })
          .then(r => r.json())
          .then(data => { if (data.ok) { setPromoValidado(true); setPromoDias(data.dias) } })
          .catch(() => {})
      }
    } catch {}
  }, [])

  const aplicarCodigo = async () => {
    if (!codigoPromo.trim()) return
    setPromoError('')
    setPromoLoading(true)
    try {
      const res = await fetch('/api/validar-promo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo: codigoPromo.trim() }) })
      const data = await res.json()
      if (data.ok) { setPromoValidado(true); setPromoDias(data.dias); setAnual(false) }
      else setPromoError(data.error || 'Código no válido')
    } catch { setPromoError('Error de conexión') }
    finally { setPromoLoading(false) }
  }

  const irACheckout = async (tipo: string) => {
    if (!sesionActiva) {
      if (promoValidado && codigoPromo.trim()) {
        try { sessionStorage.setItem('hb_promo_pendiente', codigoPromo.trim().toUpperCase()) } catch {}
        ;(window.top || window).location.href = '/registro?next=/unete'
      } else {
        ;(window.top || window).location.href = '/registro'
      }
      return
    }
    setCargando(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { data: { user } } = await supabase.auth.getUser()
      const body: any = { userId: user?.id, email: user?.email, tipo }
      if (promoValidado && codigoPromo.trim() && tipo === 'plata_mensual') body.codigoPromo = codigoPromo.trim().toUpperCase()
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token ?? ''}` },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.url) (window.top || window).location.href = data.url
    } catch {}
    setCargando(false)
  }

  const planesData = [
    {
      id: 'gratis',
      nombre: 'Gratis',
      desc: 'Para empezar a explorar',
      precioMes: 0,
      precioAnual: 0,
      color: '#f8f9fa',
      colorTexto: '#333',
      badge: null,
      get cta() { return Tp.empezarGratis },
      href: '/registro',
      tipo: null,
      limite: '2 propiedades',
      features: ['2 propiedades publicadas', 'Fotos básicas', 'Visible en búsquedas', 'Chat con clientes'],
      noIncludes: ['Sin destacados', 'Sin estadísticas', 'Sin soporte prioritario'],
    },
    {
      id: 'plata',
      nombre: 'Plata',
      desc: 'Para agentes independientes',
      precioMes: 16.99,
      precioAnual: 14.99,
      color: '#fff',
      colorTexto: '#111',
      badge: null,
      cta: 'Empezar con Plata',
      tipo: anual ? 'plata_anual' : 'plata_mensual',
      limite: '15 propiedades',
      features: ['15 propiedades publicadas', 'Más fotos por propiedad', 'Chat con clientes', 'Estadísticas de visitas', '1 destacado gratis de 30 días', 'Soporte por email', 'Perfil de agente verificado'],
      noIncludes: [],
    },
    {
      id: 'oro',
      nombre: 'Oro',
      desc: 'Para agencias y equipos',
      precioMes: 39.99,
      precioAnual: 34.99,
      color: BRAND,
      colorTexto: '#fff',
      badge: 'Más popular',
      cta: 'Empezar con Oro',
      tipo: anual ? 'oro_anual' : 'oro_mensual',
      limite: '50 propiedades',
      features: ['50 propiedades publicadas', 'Más fotos por propiedad', 'Chat con clientes', 'Estadísticas de visitas', '2 destacados gratis de 30 días', 'Soporte prioritario', 'Perfil de agente verificado', 'Acceso anticipado a funciones'],
      noIncludes: [],
    },
    {
      id: 'platino',
      nombre: 'Platino',
      desc: 'Para grandes equipos',
      precioMes: 69.99,
      precioAnual: 59.99,
      color: '#1a1a2e',
      colorTexto: '#fff',
      badge: null,
      cta: 'Empezar con Platino',
      tipo: anual ? 'platino_anual' : 'platino_mensual',
      limite: '100 propiedades',
      features: ['100 propiedades publicadas', 'Más fotos por propiedad', 'Chat con clientes', 'Estadísticas de visitas', '5 destacados gratis de 30 días', 'Soporte prioritario', 'Perfil de agente verificado', 'Acceso anticipado a funciones'],
      noIncludes: [],
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafb', fontFamily: 'Arial, Helvetica, sans-serif', opacity: iniciado ? 1 : 0, transition: 'opacity 0.15s' }}>
      <style>{`
        @media (max-width: 768px) {
          .planes-features { flex-direction: column !important; }
          .planes-cards { grid-template-columns: 1fr !important; }
          .planes-faq { grid-template-columns: 1fr !important; }
          .planes-platino { flex-direction: column !important; align-items: stretch !important; text-align: center !important; }
          .planes-platino a { text-align: center !important; }
          .planes-hero-title { font-size: 32px !important; }
          .planes-section-title { font-size: 26px !important; }
        }
      `}</style>

      {/* NAV */}
      {!isEmbed && <nav style={{ background: BRAND_DARK, height: 54, display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>habitade.</Link>
          {[{ label: 'Comprar', href: '/buscar?operacion=venta' }, { label: 'Alquilar', href: '/buscar?operacion=alquiler' }].map(item => (
            <Link key={item.label} href={item.href} style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{item.label}</Link>
          ))}
        </div>
      </nav>}

      {/* HERO */}
      {!isEmbed && <div style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND} 100%)`, padding: '56px 24px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', margin: '0 0 40px', lineHeight: 1.15, letterSpacing: '-1px' }}>
            {Tp.heroTitulo}
          </h1>

          {/* Mockup plataforma */}
          <div style={{ borderRadius: '12px 12px 0 0', boxShadow: '0 -8px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.15)', maxWidth: 900, margin: '0 auto', overflow: 'hidden' }}>
            <img src="/buscar-preview.png" alt="Habitade búsqueda"
              style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top', maxHeight: 380 }} />
          </div>
        </div>
      </div>}

      {/* PLANES */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '56px 24px 80px', display: 'flex', flexDirection: 'column' }}>
        {/* CTA Únete */}
        {!sesionActiva && <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>Empieza hoy</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#111', margin: '0 0 14px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>Únete a Habitade</h2>
          <p style={{ fontSize: 17, color: '#666', margin: '0 0 28px', maxWidth: 480, marginInline: 'auto' }}>Publica tus propiedades y llega a miles de compradores en República Dominicana.</p>
          <a href="/registro" style={{ display: 'inline-block', background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`, color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px 36px', borderRadius: 8, textDecoration: 'none', boxShadow: `0 6px 20px ${BRAND}44` }}>Crear cuenta gratis</a>
          <div style={{ marginTop: 10, fontSize: 12, color: '#aaa' }}>Sin tarjeta de crédito · Cancela cuando quieras</div>
        </div>}

        {/* Features */}
        <div style={{ background: '#f8fafb', borderRadius: 20, padding: '48px 32px', marginBottom: 56, order: isEmbed ? 1 : 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h3 style={{ fontSize: 26, fontWeight: 900, color: '#111', margin: '0 0 10px', letterSpacing: '-0.3px' }}>Herramientas que convierten visitas en ventas</h3>
            <p style={{ fontSize: 15, color: '#666', margin: 0 }}>Todo lo que necesitas para gestionar tus propiedades y cerrar más rápido.</p>
          </div>
          <div className="planes-features" style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
            <div style={{ flex: 1, background: BRAND_DARK, borderRadius: 20, padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 10 }}>Mensajería</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>Chat directo con compradores</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 16px', lineHeight: 1.5 }}>Responde a los interesados en tiempo real desde tu panel.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { nombre: 'Carlos M.', msg: '¿Cuándo se puede visitar?', time: '2 min', unread: true },
                  { nombre: 'Ana R.', msg: '¿Tiene parqueo disponible?', time: '14 min', unread: true },
                  { nombre: 'José L.', msg: 'Envíame más fotos por favor', time: '1 h', unread: false },
                ].map((n, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 10px' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: ['#2a9d8f','#e76f51','#457b9d'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{n.nombre[0]}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{n.nombre}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.msg}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{n.time}</span>
                      {n.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, background: BRAND_DARK, borderRadius: 20, padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 10 }}>Analítica</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>Métricas en tiempo real</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 16px', lineHeight: 1.5 }}>Visitas, contactos y conversión de cada propiedad.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Visitas hoy', val: '1.247', delta: '+12%' },
                  { label: 'Contactos', val: '48', delta: '+8%' },
                  { label: 'Conversión', val: '3.8%', delta: '+0.4pp' },
                  { label: 'Favoritos', val: '134', delta: '+21%' },
                ].map((k, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 4, fontWeight: 500 }}>{k.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{k.val}</div>
                    <div style={{ fontSize: 10, color: '#4ade80', marginTop: 4, fontWeight: 600 }}>↑ {k.delta}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, background: BRAND_DARK, borderRadius: 20, padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 10 }}>Visibilidad</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>Soporte prioritario</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 16px', lineHeight: 1.5 }}>Aparece primero ante miles de compradores e inmobiliarias.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Destacado en resultados de búsqueda','Filtros por precio, zona y tipología','Soporte prioritario','Acceso anticipado a nuevas funciones'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="2 6 5 9 10 3"/></svg>
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 16 }}>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>, titulo: 'Sin molestos anuncios', desc: 'Experiencia limpia, sin interrupciones.' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, titulo: 'Precios claros', desc: 'Sin sorpresas, sin letras pequeñas.' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, titulo: 'Cambio de divisa', desc: 'Muestra precios en USD y pesos dominicanos.' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, titulo: 'Cambio de medidas', desc: 'Convierte entre m², sq ft y tareas.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', border: '1px solid #e8f4f5', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e8f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{item.titulo}</div>
                <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ order: isEmbed ? 0 : 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#111', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            {Tp.elegirPlan}
          </h2>
          <p style={{ fontSize: 16, color: '#666', margin: '0 0 28px' }}>{Tp.sinPermanencia}</p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 100, padding: '6px 20px' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: anual ? '#aaa' : '#111' }}>{Tp.mensual}</span>
            <button onClick={() => { if (!promoValidado) setAnual(v => !v) }} title={promoValidado ? 'El código aplica solo al plan mensual' : undefined} style={{ width: 44, height: 24, borderRadius: 100, border: 'none', cursor: promoValidado ? 'not-allowed' : 'pointer', background: anual ? BRAND : '#ccc', position: 'relative', transition: 'background 0.2s', padding: 0, opacity: promoValidado ? 0.6 : 1 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: anual ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: anual ? '#111' : '#aaa' }}>
              {Tp.anual}
              <span style={{ marginLeft: 6, background: '#e6f7f1', color: '#00a870', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 100 }}>−12%</span>
            </span>
          </div>
        </div>

        {/* Banner fundador / profesional */}
        {['fundador', 'profesional', 'platino'].includes(planActual || '') && (
          <div style={{ background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`, borderRadius: 12, padding: '18px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                {planActual === 'fundador' ? 'Plan Fundador · Acceso ilimitado' : planActual === 'platino' ? 'Plan Platino · 100 propiedades' : 'Plan Profesional · Acceso ilimitado'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>Ya tienes acceso completo a todas las funciones de la plataforma.</div>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="planes-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {planesData.map(plan => {
            const esPlanEspecial = ['fundador', 'profesional', 'platino'].includes(planActual || '')
            const esPlanActual = sesionActiva && !esPlanEspecial && (planActual === plan.id || (plan.id === 'gratis' && (!planActual || planActual === 'gratis')))
            const esPopular = !!plan.badge
            const precio = anual ? plan.precioAnual : plan.precioMes
            const bloqueadoPorPromo = promoValidado && plan.id === 'oro'
            return (
              <div key={plan.id} style={{ background: plan.color, borderRadius: 16, padding: 28, border: promoValidado && plan.id === 'plata' ? `2px solid #10b981` : esPopular ? `2px solid ${BRAND}` : '1.5px solid #e8e8e8', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: esPopular ? '0 8px 40px rgba(0,109,119,0.18)' : '0 2px 12px rgba(0,0,0,0.05)', opacity: bloqueadoPorPromo ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                {promoValidado && plan.id === 'plata' && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap' }}>✓ Código aplicado</div>
                )}
                {!promoValidado && plan.badge && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: BRAND, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap' }}>{plan.badge}</div>
                )}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: plan.colorTexto, marginBottom: 4 }}>{plan.nombre}</div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  {precio === 0
                    ? <div style={{ fontSize: 36, fontWeight: 900, color: plan.colorTexto }}>Gratis</div>
                    : <>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: esPopular ? 'rgba(255,255,255,0.75)' : '#888' }}>US$</span>
                          <span style={{ fontSize: 36, fontWeight: 900, color: plan.colorTexto, lineHeight: 1 }}>{precio.toFixed(2)}</span>
                          <span style={{ fontSize: 13, color: esPopular ? 'rgba(255,255,255,0.75)' : '#888' }}>/mes</span>
                        </div>
                        {anual && <div style={{ fontSize: 12, color: esPopular ? 'rgba(255,255,255,0.65)' : '#aaa', marginTop: 4 }}>{Tp.facturadoAnual}</div>}
                      </>
                  }
                  <div style={{ fontSize: 13, fontWeight: 600, color: esPopular ? 'rgba(255,255,255,0.75)' : '#888', marginTop: 8 }}>
                    {plan.limite}
                  </div>
                </div>
                {esPlanActual
                  ? <div style={{ width: '100%', padding: '11px 0', borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: 700, background: 'rgba(0,0,0,0.08)', color: plan.colorTexto, marginBottom: 20 }}>{Tp.planActual}</div>
                  : bloqueadoPorPromo
                    ? <div style={{ width: '100%', padding: '11px 0', borderRadius: 8, textAlign: 'center', fontSize: 13, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>Código no aplica</div>
                    : plan.tipo
                      ? <button disabled={cargando} onClick={() => irACheckout(plan.tipo!)} style={{ width: '100%', padding: promoValidado && plan.id === 'plata' ? '8px 0' : '12px 0', borderRadius: 8, border: 'none', cursor: cargando ? 'default' : 'pointer', fontSize: 14, fontWeight: 700, background: promoValidado && plan.id === 'plata' ? '#10b981' : esPopular ? '#fff' : BRAND, color: promoValidado && plan.id === 'plata' ? '#fff' : esPopular ? BRAND : '#fff', marginBottom: 20 }}>
                          {promoValidado && plan.id === 'plata'
                            ? <><div>Continuar con Plan Plata</div><div style={{ fontSize: 11, fontWeight: 500, opacity: 0.9 }}>{promoDias} días gratis incluidos</div></>
                            : plan.cta}
                        </button>
                      : <a href={sesionActiva ? '/panel' : (plan.href || '/registro')} onClick={e => { e.preventDefault(); (window.top || window).location.href = sesionActiva ? '/panel' : (plan.href || '/registro') }} style={{ display: 'block', width: '100%', padding: '12px 0', borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: 700, background: BRAND, color: '#fff', textDecoration: 'none', marginBottom: 20 }}>{plan.cta}</a>
                }
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: plan.colorTexto }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={esPopular ? '#fff' : BRAND} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </div>
                  ))}
                  {(plan.noIncludes || []).map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#bbb' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Código promocional */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {promoValidado ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: '#d1fae5', color: '#065f46', fontSize: 13, fontWeight: 700, padding: '6px 16px', borderRadius: 20 }}>✓ {promoDias} días gratis aplicados</span>
              <button onClick={() => { setPromoValidado(false); setCodigoPromo(''); setPromoError(''); setPromoExpanded(false) }} style={{ all: 'unset', fontSize: 12, color: '#aaa', cursor: 'pointer', textDecoration: 'underline' }}>Quitar</button>
            </div>
          ) : promoExpanded ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%', maxWidth: 360 }}>
              <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                <input value={codigoPromo} onChange={e => { setCodigoPromo(e.target.value.toUpperCase()); setPromoError('') }}
                  onKeyDown={async e => { if (e.key === 'Enter') { e.preventDefault(); await aplicarCodigo() } }}
                  placeholder="CÓDIGO PROMOCIONAL" maxLength={32}
                  style={{ flex: 1, border: '1.5px solid #83D4DB', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, letterSpacing: 1, color: '#006D77', outline: 'none', background: '#f0fafb' }} />
                <button onClick={aplicarCodigo} disabled={promoLoading || !codigoPromo.trim()} style={{ all: 'unset', background: BRAND, color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: (!codigoPromo.trim() || promoLoading) ? 'default' : 'pointer', opacity: (!codigoPromo.trim() || promoLoading) ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                  {promoLoading ? '...' : 'Aplicar'}
                </button>
              </div>
              {promoError && <div style={{ fontSize: 12, color: '#dc2626' }}>{promoError}</div>}
            </div>
          ) : (
            <button onClick={() => setPromoExpanded(true)} style={{ all: 'unset', fontSize: 13, color: '#006D77', cursor: 'pointer', textDecoration: 'underline', opacity: 0.8 }}>
              ¿Tienes un código promocional?
            </button>
          )}
        </div>

        {/* Flex */}
        <div style={{ marginTop: 40, textAlign: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 6px' }}>{Tp.necesitasMedida}</p>
        </div>
        <div className="planes-platino" style={{ background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`, borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Flex</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{Tp.platinoDesc}</div>
          </div>
          <a href="mailto:hola@habitade.com" style={{ background: '#fff', color: BRAND, padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>{Tp.contactar}</a>
        </div>
        </div>

      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 32 }}>{Tp.preguntasFrecuentes}</h3>
          <div className="planes-faq" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, textAlign: 'left' }}>
            {Tp.faq.map((faq: { p: string; r: string }) => (
              <div key={faq.p} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8e8e8' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>{faq.p}</div>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{faq.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      {!isEmbed && <footer style={{ background: BRAND_DARK, color: 'rgba(255,255,255,0.5)', padding: '28px 24px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            { label: 'Aviso legal', href: '/legal/aviso-legal' },
            { label: 'Privacidad', href: '/legal/privacidad' },
            { label: 'Cookies', href: '/legal/cookies' },
            { label: 'Buscar propiedades', href: '/buscar' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ fontSize: 12 }}>© {new Date().getFullYear()} Habitade. Todos los derechos reservados.</div>
      </footer>}
    </div>
  )
}
