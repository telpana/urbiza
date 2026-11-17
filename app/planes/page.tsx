'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../supabase'

const BRAND = '#006D77'
const BRAND_DARK = '#004E57'

const LISTADOS = [
  { zona: 'Piantini, D.N.', precio: '$285,000', tipo: 'Apartamento', hab: 3, banos: 2 },
  { zona: 'Cap Cana', precio: '$420,000', tipo: 'Villa', hab: 4, banos: 3 },
  { zona: 'Punta Cana', precio: '$195,000', tipo: 'Apartamento', hab: 2, banos: 2 },
  { zona: 'Santiago', precio: '$148,000', tipo: 'Casa', hab: 3, banos: 2 },
]

function MapaRD() {
  return (
    <svg viewBox="0 0 400 220" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="220" fill="#dbeeff" rx="8"/>
      <path d="M5,90 L10,55 L30,30 L70,15 L120,10 L175,18 L210,22 L235,8 L265,2 L282,18 L292,32 L320,42 L370,58 L395,80 L398,110 L385,148 L355,172 L310,188 L255,196 L190,196 L130,190 L70,182 L28,165 L5,130 Z"
        fill="#e8f5e9" stroke="#b2dfb0" strokeWidth="1.5"/>
      <path d="M60,80 Q120,55 180,70 Q240,55 290,75 Q330,90 350,120 Q300,140 240,145 Q180,150 130,140 Q80,130 60,110 Z"
        fill="#c8e6c9" opacity="0.5"/>
      {/* Santo Domingo */}
      <g transform="translate(192,165)">
        <path d="M0,-14 C-5,-14 -9,-10 -9,-5 C-9,2 0,12 0,12 C0,12 9,2 9,-5 C9,-10 5,-14 0,-14Z" fill={BRAND} stroke="#fff" strokeWidth="1.2"/>
        <circle cx="0" cy="-5" r="3.5" fill="#fff"/>
        <text y="20" textAnchor="middle" fontSize="8" fill={BRAND_DARK} fontWeight="700">Sto. Domingo</text>
      </g>
      {/* Punta Cana */}
      <g transform="translate(372,110)">
        <path d="M0,-14 C-5,-14 -9,-10 -9,-5 C-9,2 0,12 0,12 C0,12 9,2 9,-5 C9,-10 5,-14 0,-14Z" fill={BRAND} stroke="#fff" strokeWidth="1.2"/>
        <circle cx="0" cy="-5" r="3.5" fill="#fff"/>
        <text y="20" textAnchor="middle" fontSize="8" fill={BRAND_DARK} fontWeight="700">Punta Cana</text>
      </g>
      {/* Santiago */}
      <g transform="translate(118,72)">
        <path d="M0,-14 C-5,-14 -9,-10 -9,-5 C-9,2 0,12 0,12 C0,12 9,2 9,-5 C9,-10 5,-14 0,-14Z" fill={BRAND} stroke="#fff" strokeWidth="1.2"/>
        <circle cx="0" cy="-5" r="3.5" fill="#fff"/>
        <text y="20" textAnchor="middle" fontSize="8" fill={BRAND_DARK} fontWeight="700">Santiago</text>
      </g>
      {/* La Romana */}
      <g transform="translate(302,168)">
        <path d="M0,-12 C-4,-12 -8,-9 -8,-4 C-8,2 0,10 0,10 C0,10 8,2 8,-4 C8,-9 4,-12 0,-12Z" fill="#f59e0b" stroke="#fff" strokeWidth="1.2"/>
        <circle cx="0" cy="-4" r="3" fill="#fff"/>
        <text y="18" textAnchor="middle" fontSize="7.5" fill="#92400e" fontWeight="700">La Romana</text>
      </g>
      {/* Puerto Plata */}
      <g transform="translate(100,32)">
        <path d="M0,-12 C-4,-12 -8,-9 -8,-4 C-8,2 0,10 0,10 C0,10 8,2 8,-4 C8,-9 4,-12 0,-12Z" fill="#f59e0b" stroke="#fff" strokeWidth="1.2"/>
        <circle cx="0" cy="-4" r="3" fill="#fff"/>
        <text y="18" textAnchor="middle" fontSize="7.5" fill="#92400e" fontWeight="700">Pto. Plata</text>
      </g>
    </svg>
  )
}

export default function Planes() {
  const [anual, setAnual] = useState(true)
  const [sesionActiva, setSesionActiva] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [planActual, setPlanActual] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setSesionActiva(true)
        supabase.from('usuarios').select('plan').eq('id', user.id).single()
          .then(({ data }) => { if (data) setPlanActual(data.plan) })
      }
    })
  }, [])

  const irACheckout = async (tipo: string) => {
    if (!sesionActiva) { window.location.href = '/registro?next=/planes'; return }
    setCargando(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { data: { user } } = await supabase.auth.getUser()
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token ?? ''}` },
        body: JSON.stringify({ userId: user?.id, email: user?.email, tipo })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
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
      cta: 'Crear cuenta gratis',
      href: '/registro',
      tipo: null,
      limite: '2 propiedades',
      features: ['2 propiedades publicadas', 'Fotos básicas', 'Visible en búsquedas', 'Mensajes de contacto'],
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
      features: ['15 propiedades publicadas', 'Fotos ilimitadas por propiedad', 'Estadísticas de visitas', 'Destacados disponibles', 'Soporte por email', 'Perfil de agente verificado'],
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
      features: ['50 propiedades publicadas', 'Todo lo del plan Plata', 'Destacados incluidos (2/mes)', 'Soporte prioritario', 'Perfil premium con logo', 'Acceso anticipado a funciones'],
      noIncludes: [],
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafb', fontFamily: 'Arial, Helvetica, sans-serif' }}>

      {/* NAV */}
      <nav style={{ background: BRAND_DARK, height: 54, display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>habitade.</Link>
          {[{ label: 'Comprar', href: '/buscar?operacion=venta' }, { label: 'Alquilar', href: '/buscar?operacion=alquiler' }].map(item => (
            <Link key={item.label} href={item.href} style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{item.label}</Link>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND} 100%)`, padding: '56px 24px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', margin: '0 0 40px', lineHeight: 1.15, letterSpacing: '-1px' }}>
            Publica. Llega. Vende.
          </h1>

          {/* Mockup plataforma */}
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', boxShadow: '0 -4px 60px rgba(0,0,0,0.25)', padding: '16px 16px 0', maxWidth: 900, margin: '0 auto', textAlign: 'left' }}>

            {/* Barra de browser */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              <div style={{ flex: 1, background: '#f4f5f6', borderRadius: 6, height: 26, display: 'flex', alignItems: 'center', padding: '0 10px', marginLeft: 8 }}>
                <span style={{ fontSize: 11, color: '#aaa' }}>habitade.com/buscar</span>
              </div>
            </div>

            {/* KPIs */}
            <div className="planes-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
              {[
                { label: 'Propiedades activas', valor: '1,850+', icon: '🏠', color: BRAND },
                { label: 'Agentes verificados', valor: '280+', icon: '✅', color: '#10b981' },
                { label: 'Visitas mensuales', valor: '42K', icon: '👁️', color: '#f59e0b' },
                { label: 'Provincias cubiertas', valor: '32', icon: '📍', color: '#8b5cf6' },
              ].map(k => (
                <div key={k.label} style={{ background: '#f8fafb', borderRadius: 10, padding: '12px', border: '1px solid #eee' }}>
                  <div style={{ fontSize: 20 }}>{k.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: k.color, lineHeight: 1.2, marginTop: 2 }}>{k.valor}</div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 2, lineHeight: 1.3 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Mapa + listados */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 0, borderRadius: '10px 10px 0 0', overflow: 'hidden', height: 200 }}>
              {/* SVG mapa ilustrativo */}
              <div style={{ background: '#dbeeff', overflow: 'hidden' }}>
                <MapaRD />
              </div>
              {/* Listados con precio */}
              <div style={{ background: '#f8fafb', borderLeft: '1px solid #e8e8e8', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
                <div style={{ padding: '0 12px 6px', fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: 0.5, textTransform: 'uppercase' }}>Recientes</div>
                {LISTADOS.map((l, i) => (
                  <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#111', marginBottom: 2 }}>{l.zona}</div>
                    <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>{l.tipo} · {l.hab} hab · {l.banos} baños</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: BRAND }}>{l.precio}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PLANES */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#111', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Elige tu plan
          </h2>
          <p style={{ fontSize: 16, color: '#666', margin: '0 0 28px' }}>Sin permanencia. Cancela cuando quieras.</p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 100, padding: '6px 20px' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: anual ? '#aaa' : '#111' }}>Mensual</span>
            <button onClick={() => setAnual(v => !v)} style={{ width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer', background: anual ? BRAND : '#ccc', position: 'relative', transition: 'background 0.2s', padding: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: anual ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: anual ? '#111' : '#aaa' }}>
              Anual
              <span style={{ marginLeft: 6, background: '#e6f7f1', color: '#00a870', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 100 }}>−12%</span>
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="planes-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {planesData.map(plan => {
            const esPlanActual = planActual === plan.id || (plan.id === 'gratis' && (!planActual || planActual === 'gratis'))
            const esPopular = !!plan.badge
            const precio = anual ? plan.precioAnual : plan.precioMes
            return (
              <div key={plan.id} style={{ background: plan.color, borderRadius: 16, padding: 28, border: esPopular ? `2px solid ${BRAND}` : '1.5px solid #e8e8e8', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: esPopular ? '0 8px 40px rgba(0,109,119,0.18)' : '0 2px 12px rgba(0,0,0,0.05)' }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: BRAND, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap' }}>{plan.badge}</div>
                )}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: plan.colorTexto, marginBottom: 4 }}>{plan.nombre}</div>
                  <div style={{ fontSize: 13, color: esPopular ? 'rgba(255,255,255,0.75)' : '#888' }}>{plan.desc}</div>
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
                        {anual && <div style={{ fontSize: 12, color: esPopular ? 'rgba(255,255,255,0.65)' : '#aaa', marginTop: 4 }}>Facturado anualmente</div>}
                      </>
                  }
                  <div style={{ fontSize: 12, fontWeight: 700, color: esPopular ? 'rgba(255,255,255,0.9)' : BRAND, marginTop: 8, background: esPopular ? 'rgba(255,255,255,0.15)' : '#e8f7f8', display: 'inline-block', padding: '3px 10px', borderRadius: 6 }}>
                    {plan.limite}
                  </div>
                </div>
                {esPlanActual
                  ? <div style={{ width: '100%', padding: '11px 0', borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: 700, background: 'rgba(0,0,0,0.08)', color: plan.colorTexto, marginBottom: 20 }}>Plan actual</div>
                  : plan.tipo
                    ? <button disabled={cargando} onClick={() => irACheckout(plan.tipo!)} style={{ width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, background: esPopular ? '#fff' : BRAND, color: esPopular ? BRAND : '#fff', marginBottom: 20 }}>
                        {cargando ? '...' : plan.cta}
                      </button>
                    : <Link href={plan.href || '/registro'} style={{ display: 'block', width: '100%', padding: '12px 0', borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: 700, background: '#f0f0f0', color: '#333', textDecoration: 'none', marginBottom: 20 }}>{plan.cta}</Link>
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

        {/* Platino */}
        <div className="planes-platino" style={{ marginTop: 20, background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`, borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Platino — Para grandes agencias</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Propiedades ilimitadas, integraciones personalizadas y cuenta dedicada.</div>
          </div>
          <a href="mailto:hola@habitade.com" style={{ background: '#fff', color: BRAND, padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>Contactar</a>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 80, textAlign: 'center' }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 32 }}>Preguntas frecuentes</h3>
          <div className="planes-faq" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, textAlign: 'left' }}>
            {[
              { p: '¿Puedo cancelar en cualquier momento?', r: 'Sí. Sin permanencia ni penalizaciones. Si cancelas, tus anuncios quedan visibles hasta el final del periodo pagado.' },
              { p: '¿Qué pasa si supero el límite de propiedades?', r: 'No podrás publicar nuevas hasta que elimines alguna existente o mejores de plan.' },
              { p: '¿Puedo cambiar de plan más adelante?', r: 'Sí. Puedes subir de plan en cualquier momento desde tu panel.' },
              { p: '¿Hay periodo de prueba?', r: 'Sí, en ocasiones ofrecemos códigos promocionales con días de prueba gratuita. Consulta con soporte.' },
            ].map(faq => (
              <div key={faq.p} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8e8e8' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>{faq.p}</div>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{faq.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: BRAND_DARK, color: 'rgba(255,255,255,0.5)', padding: '28px 24px 20px', textAlign: 'center' }}>
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
      </footer>
    </div>
  )
}
