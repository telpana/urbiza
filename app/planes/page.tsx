'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '../../supabase'

const BRAND = '#006D77'
const BRAND_DARK = '#004E57'

function coordsDeZona(zona: string): [number, number] {
  const z = zona.toLowerCase()
  if (z.includes('piantini')) return [18.489, -69.937]
  if (z.includes('naco')) return [18.495, -69.945]
  if (z.includes('bella vista')) return [18.476, -69.945]
  if (z.includes('punta cana') || z.includes('bávaro') || z.includes('bavaro')) return [18.567, -68.363]
  if (z.includes('cap cana')) return [18.51, -68.39]
  if (z.includes('santiago')) return [19.451, -70.697]
  if (z.includes('la romana')) return [18.427, -68.972]
  if (z.includes('puerto plata')) return [19.793, -70.688]
  if (z.includes('san pedro')) return [18.453, -69.302]
  return [18.4861, -69.9312]
}

export default function Planes() {
  const [anual, setAnual] = useState(true)
  const [sesionActiva, setSesionActiva] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [planActual, setPlanActual] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [mapaListo, setMapaListo] = useState(false)
  const [propiedadesMap, setPropiedadesMap] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setSesionActiva(true)
        supabase.from('usuarios').select('plan').eq('id', user.id).single()
          .then(({ data }) => { if (data) setPlanActual(data.plan) })
      }
    })

    // Propiedades para el mapa
    supabase.from('propiedades')
      .select('id,titulo,precio,zona,tipo,fotos,lat,lng')
      .eq('estado', 'activo')
      .limit(200)
      .then(({ data }) => { if (data) setPropiedadesMap(data) })
  }, [])

  // Inicializar mapa Leaflet
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    const load = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return
      const map = L.map(mapRef.current, {
        center: [18.7357, -70.1627], zoom: 7,
        zoomControl: false, attributionControl: false,
        scrollWheelZoom: false,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      mapInstanceRef.current = { map, L }
      setMapaListo(true)
    }
    if ((window as any).L) { load() }
    else {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.onload = load
      document.head.appendChild(s)
    }
    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.map.remove(); mapInstanceRef.current = null }
    }
  }, [])

  // Añadir pines al mapa cuando carguen las propiedades
  useEffect(() => {
    if (!mapInstanceRef.current || propiedadesMap.length === 0 || !mapaListo) return
    const { L, map } = mapInstanceRef.current
    propiedadesMap.forEach(p => {
      const [lat, lng] = (p.lat != null && p.lng != null) ? [p.lat, p.lng] : coordsDeZona(p.zona || '')
      const icono = L.divIcon({
        className: '',
        html: `<svg width="18" height="24" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 19 11 19s11-11.333 11-19C22 4.925 17.075 0 11 0z" fill="#006D77" stroke="#fff" stroke-width="1.5"/><circle cx="11" cy="11" r="4.5" fill="#fff"/></svg>`,
        iconSize: [18, 24], iconAnchor: [9, 24], popupAnchor: [0, -24],
      })
      const fotos = Array.isArray(p.fotos) ? p.fotos : (typeof p.fotos === 'string' ? (() => { try { return JSON.parse(p.fotos) } catch { return [] } })() : [])
      L.marker([lat, lng], { icon: icono }).addTo(map).bindPopup(`
        <div style="width:180px;font-family:Arial,sans-serif;padding:2px 0">
          ${fotos[0] ? `<img src="${fotos[0]}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px">` : ''}
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">${p.titulo || ''}</div>
          <div style="font-size:14px;font-weight:800;color:#006D77">US$ ${(p.precio || 0).toLocaleString('en-US')}</div>
          <a href="/propiedad/${p.id}" style="display:block;background:#006D77;color:#fff;padding:6px;border-radius:5px;text-align:center;text-decoration:none;font-size:12px;font-weight:600;margin-top:8px">Ver propiedad</a>
        </div>
      `, { maxWidth: 200 })
    })
  }, [propiedadesMap, mapaListo])

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
      <nav style={{ background: BRAND_DARK, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>habitade.</Link>
          {[{ label: 'Comprar', href: '/buscar?operacion=venta' }, { label: 'Alquilar', href: '/buscar?operacion=alquiler' }].map(item => (
            <Link key={item.label} href={item.href} style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{item.label}</Link>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND} 100%)`, padding: '56px 24px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', margin: '0 0 40px', lineHeight: 1.15, letterSpacing: '-1px' }}>
            Publica. Llega. Vende.
          </h1>

          {/* Mockup plataforma */}
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', boxShadow: '0 -4px 60px rgba(0,0,0,0.25)', padding: '16px 16px 0', maxWidth: 860, margin: '0 auto', textAlign: 'left' }}>

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
                { label: 'Propiedades activas', valor: '250+', icon: '🏠', color: BRAND },
                { label: 'Agentes verificados', valor: '18', icon: '✅', color: '#10b981' },
                { label: 'Visitas al portal', valor: '4.2K', icon: '👁️', color: '#f59e0b' },
                { label: 'Provincias cubiertas', valor: '12', icon: '📍', color: '#8b5cf6' },
              ].map(k => (
                <div key={k.label} style={{ background: '#f8fafb', borderRadius: 10, padding: '12px', border: '1px solid #eee' }}>
                  <div style={{ fontSize: 20 }}>{k.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: k.color, lineHeight: 1.2, marginTop: 2 }}>{k.valor}</div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 2, lineHeight: 1.3 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Mapa Leaflet */}
            <div style={{ position: 'relative', borderRadius: '10px 10px 0 0', overflow: 'hidden', height: 180 }}>
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
              {propiedadesMap.length > 0 && (
                <div style={{ position: 'absolute', bottom: 10, left: 10, background: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: BRAND, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 400 }}>
                  🗺️ {propiedadesMap.length} propiedades en el mapa
                </div>
              )}
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
