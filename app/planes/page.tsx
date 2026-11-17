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
          <div style={{ borderRadius: '12px 12px 0 0', boxShadow: '0 -8px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.15)', maxWidth: 900, margin: '0 auto', overflow: 'hidden' }}>
            <img src="/buscar-preview.png" alt="Habitade búsqueda"
              style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top', maxHeight: 380 }} />
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ background: BRAND_DARK, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.5px' }}>Herramientas que convierten visitas en ventas</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', margin: 0 }}>Todo lo que necesitas para gestionar tus propiedades y cerrar más rápido.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>

            {/* Chat directo */}
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 12 }}>Mensajería</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 10px', lineHeight: 1.3 }}>Chat directo con compradores</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 24px', lineHeight: 1.65 }}>Responde a los interesados en tiempo real desde tu panel. Sin intermediarios ni esperas.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { nombre: 'Carlos M.', msg: '¿Está disponible para visita este fin?', time: '2 min', unread: true },
                  { nombre: 'Ana R.', msg: 'Me interesa la propiedad, ¿tiene garaje?', time: '14 min', unread: true },
                  { nombre: 'José L.', msg: 'Envíame más fotos por favor', time: '1 h', unread: false },
                ].map((n, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 12px' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: ['#2a9d8f','#e76f51','#457b9d'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{n.nombre[0]}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{n.nombre}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.msg}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{n.time}</span>
                      {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 12 }}>Analítica</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 10px', lineHeight: 1.3 }}>Métricas en tiempo real</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 24px', lineHeight: 1.65 }}>Visitas, contactos y tasa de conversión de cada propiedad actualizada al instante.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Visitas hoy', val: '1.247', delta: '+12%' },
                  { label: 'Contactos', val: '48', delta: '+8%' },
                  { label: 'Conversión', val: '3.8%', delta: '+0.4pp' },
                  { label: 'Favoritos', val: '134', delta: '+21%' },
                ].map((k, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginBottom: 6, fontWeight: 500 }}>{k.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{k.val}</div>
                    <div style={{ fontSize: 11, color: '#4ade80', marginTop: 6, fontWeight: 600 }}>↑ {k.delta}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtros + soporte */}
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 12 }}>Visibilidad</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 10px', lineHeight: 1.3 }}>Destacado y soporte prioritario</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 24px', lineHeight: 1.65 }}>Aparece primero ante miles de compradores. Con soporte dedicado para agentes e inmobiliarias.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Destacado en los primeros resultados de búsqueda',
                  'Filtros avanzados por precio, zona y tipología',
                  'Soporte prioritario por WhatsApp y email',
                  'Acceso anticipado a nuevas funciones',
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2"><polyline points="2 6 5 9 10 3"/></svg>
                    </div>
                    {f}
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
