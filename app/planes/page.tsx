'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../supabase'
import NavUserMenu from '../../components/NavUserMenu'

const BRAND = '#006D77'
const BRAND_DARK = '#004E57'

export default function Planes() {
  const [anual, setAnual] = useState(false)
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`
        },
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
      features: [
        '2 propiedades publicadas',
        'Fotos básicas',
        'Visible en búsquedas',
        'Mensajes de contacto',
      ],
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
      features: [
        '15 propiedades publicadas',
        'Fotos ilimitadas por propiedad',
        'Estadísticas de visitas',
        'Destacados disponibles',
        'Soporte por email',
        'Perfil de agente verificado',
      ],
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
      features: [
        '50 propiedades publicadas',
        'Todo lo del plan Plata',
        'Destacados incluidos (2/mes)',
        'Soporte prioritario',
        'Perfil premium con logo',
        'Acceso anticipado a funciones',
      ],
      noIncludes: [],
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafb', fontFamily: 'Arial, Helvetica, sans-serif' }}>

      {/* NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', height: 60, display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 900 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: BRAND, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#111', letterSpacing: '-0.5px' }}>urbiza</span>
        </Link>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/buscar" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>Buscar</Link>
          {sesionActiva
            ? <><NavUserMenu dark={false} /><Link href="/panel" style={{ fontSize: 14, background: BRAND, color: '#fff', padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Panel</Link></>
            : <>
                <Link href="/login" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>Entrar</Link>
                <Link href="/registro" style={{ fontSize: 14, background: BRAND, color: '#fff', padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Crear cuenta</Link>
              </>
          }
        </div>
      </nav>

      {/* HERO — mockup de plataforma */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND} 100%)`, padding: '64px 24px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '6px 16px', fontSize: 13, color: '#fff', fontWeight: 600, marginBottom: 20, letterSpacing: 0.5 }}>
            🇩🇴 La plataforma inmobiliaria de República Dominicana
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-1px' }}>
            Publica. Llega. Vende.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', margin: '0 auto 40px', maxWidth: 540, lineHeight: 1.6 }}>
            Miles de compradores buscan propiedades en Urbiza cada mes. Pon tus anuncios donde te van a encontrar.
          </p>

          {/* Mockup UI */}
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', boxShadow: '0 -4px 60px rgba(0,0,0,0.25)', padding: 20, maxWidth: 820, margin: '0 auto', textAlign: 'left' }}>
            {/* Barra superior mockup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              <div style={{ flex: 1, background: '#f4f5f6', borderRadius: 6, height: 28, display: 'flex', alignItems: 'center', padding: '0 12px', marginLeft: 8 }}>
                <span style={{ fontSize: 12, color: '#aaa' }}>urbiza.com/buscar</span>
              </div>
            </div>

            {/* KPI row */}
            <div className="planes-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Propiedades activas', valor: '1,240+', icon: '🏠' },
                { label: 'Agentes verificados', valor: '180+', icon: '✅' },
                { label: 'Visitas este mes', valor: '48K', icon: '👁️' },
                { label: 'Provincias cubiertas', valor: '23', icon: '📍' },
              ].map(k => (
                <div key={k.label} style={{ background: '#f8fafb', borderRadius: 10, padding: '10px 12px', border: '1px solid #eee' }}>
                  <div style={{ fontSize: 18 }}>{k.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: BRAND, lineHeight: 1.2 }}>{k.valor}</div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Mapa + cards mini */}
            <div className="planes-mockup-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 12 }}>
              {/* Mapa RD SVG */}
              <div style={{ background: '#e8f4f5', borderRadius: 10, height: 180, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 400 220" style={{ width: '100%', height: '100%', opacity: 0.5 }} fill="none">
                  <path d="M60 110 Q80 80 120 75 Q160 68 200 72 Q240 70 275 80 Q310 90 330 110 Q350 130 340 155 Q325 175 300 180 Q270 190 240 185 Q210 185 180 188 Q150 192 120 180 Q90 168 70 150 Q50 132 60 110Z" fill={BRAND} opacity="0.3" stroke={BRAND} strokeWidth="1.5"/>
                  <circle cx="195" cy="128" r="6" fill={BRAND} opacity="0.8"/>
                  <circle cx="265" cy="115" r="5" fill={BRAND} opacity="0.7"/>
                  <circle cx="140" cy="130" r="4" fill={BRAND} opacity="0.6"/>
                  <circle cx="310" cy="125" r="4" fill={BRAND} opacity="0.6"/>
                  <circle cx="230" cy="145" r="3" fill={BRAND} opacity="0.5"/>
                  <circle cx="170" cy="115" r="3" fill={BRAND} opacity="0.5"/>
                </svg>
                <div style={{ position: 'absolute', bottom: 10, left: 10, background: '#fff', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600, color: BRAND, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  🗺️ 1,240 propiedades
                </div>
              </div>

              {/* Mini property cards */}
              <div className="planes-mockup-cards" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { titulo: 'Apto. en Piantini', precio: '$285,000', tipo: 'Venta', hab: '3 hab' },
                  { titulo: 'Villa en Bávaro', precio: '$620,000', tipo: 'Venta', hab: '4 hab' },
                  { titulo: 'Local en Naco', precio: '$2,800/mes', tipo: 'Alquiler', hab: '120m²' },
                ].map((p, i) => (
                  <div key={i} style={{ background: '#f8fafb', borderRadius: 8, padding: '8px 10px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{p.titulo}</div>
                      <div style={{ fontSize: 10, color: '#888' }}>{p.hab} · {p.tipo}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: BRAND }}>{p.precio}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PLANES */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#111', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Elige tu plan
          </h2>
          <p style={{ fontSize: 16, color: '#666', margin: '0 0 28px' }}>
            Sin permanencia. Cancela cuando quieras.
          </p>

          {/* Toggle mensual/anual */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 100, padding: '6px 20px' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: anual ? '#aaa' : '#111' }}>Mensual</span>
            <button
              onClick={() => setAnual(v => !v)}
              style={{ width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer', background: anual ? BRAND : '#ccc', position: 'relative', transition: 'background 0.2s', padding: 0 }}
            >
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: anual ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: anual ? '#111' : '#aaa' }}>
              Anual
              <span style={{ marginLeft: 6, background: '#e6f7f1', color: '#00a870', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 100 }}>−12%</span>
            </span>
          </div>
        </div>

        {/* Cards de planes */}
        <div className="planes-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {planesData.map(plan => {
            const esPlanActual = planActual === plan.id || (plan.id === 'gratis' && (!planActual || planActual === 'gratis'))
            const esPopular = !!plan.badge
            const precio = anual ? plan.precioAnual : plan.precioMes
            return (
              <div key={plan.id} style={{
                background: plan.color,
                borderRadius: 16,
                padding: 28,
                border: esPopular ? `2px solid ${BRAND}` : '1.5px solid #e8e8e8',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: esPopular ? '0 8px 40px rgba(0,109,119,0.18)' : '0 2px 12px rgba(0,0,0,0.05)',
              }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: BRAND, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
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

                {/* CTA */}
                {esPlanActual
                  ? <div style={{ width: '100%', padding: '11px 0', borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: 700, background: 'rgba(0,0,0,0.08)', color: plan.colorTexto, marginBottom: 20 }}>
                      Plan actual
                    </div>
                  : plan.tipo
                    ? <button
                        disabled={cargando}
                        onClick={() => irACheckout(plan.tipo!)}
                        style={{ width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, background: esPopular ? '#fff' : BRAND, color: esPopular ? BRAND : '#fff', marginBottom: 20, transition: 'opacity 0.15s' }}
                      >
                        {cargando ? '...' : plan.cta}
                      </button>
                    : <Link
                        href={plan.href || '/registro'}
                        style={{ display: 'block', width: '100%', padding: '12px 0', borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: 700, background: '#f0f0f0', color: '#333', textDecoration: 'none', marginBottom: 20 }}
                      >
                        {plan.cta}
                      </Link>
                }

                {/* Features */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: plan.colorTexto }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={esPopular ? '#fff' : BRAND} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </div>
                  ))}
                  {(plan.noIncludes || []).map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#bbb' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Platino — contacto */}
        <div className="planes-platino" style={{ marginTop: 20, background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`, borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Platino — Para grandes agencias</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Propiedades ilimitadas, integraciones personalizadas y cuenta dedicada.</div>
          </div>
          <a href="mailto:hola@urbiza.com" style={{ background: '#fff', color: BRAND, padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Contactar
          </a>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 32 }}>Preguntas frecuentes</h3>
          <div className="planes-faq" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, textAlign: 'left' }}>
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
        <div style={{ fontSize: 12 }}>© {new Date().getFullYear()} Urbiza. Todos los derechos reservados.</div>
      </footer>
    </div>
  )
}
