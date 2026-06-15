'use client'
import { useState, useEffect, useRef } from 'react'

const USD_TO_DOP = 59.5

function formatDOP(usd: number) {
  return 'RD$ ' + (usd * USD_TO_DOP).toLocaleString('es-DO', { maximumFractionDigits: 0 })
}

const propiedades: Record<string, any> = {
  '1': { id: 1, precio: 285000, titulo: 'Apartamento en Piantini', zona: 'Piantini, Distrito Nacional', hab: 3, banos: 2, m2: 150, parqueos: 2, tipo: 'Apartamento', planta: '8ª planta', anio: 2019, lat: 18.4890, lng: -69.9370, agente: { nombre: 'Rafael Castillo', agencia: 'RE/MAX Capital RD', aei: true, tel: '+1 809 555 0123', plan: 'Profesional' }, desc: 'Amplio apartamento en el corazón de Piantini con acabados de alta calidad, pisos de mármol importado y vista panorámica de la ciudad. La cocina está completamente equipada con electrodomésticos de acero inoxidable.\n\nEl cuarto master incluye walk-in closet y baño en suite con bañera y ducha independiente. Los otros dos cuartos tienen closets empotrados y comparten un baño completo.\n\nEl edificio cuenta con piscina en la azotea, gimnasio, salón de eventos y seguridad 24 horas. Incluye 2 parqueos techados.', amenidades: ['Piscina', 'Gimnasio', 'Seguridad 24h', 'Generador', 'Ascensor', 'Salón de eventos', 'Terraza', 'Cisterna'], bgs: ['#e0f5f7', '#c5e8ea', '#ddf0f5', '#e8f8fa', '#d0eef2'] },
  '2': { id: 2, precio: 620000, titulo: 'Villa en Bávaro', zona: 'Bávaro, La Altagracia', hab: 4, banos: 3, m2: 500, parqueos: 3, tipo: 'Villa', planta: 'Planta baja', anio: 2021, lat: 18.6835, lng: -68.4070, agente: { nombre: 'María González', agencia: 'Coldwell Banker RD', aei: true, tel: '+1 809 555 0456', plan: 'Profesional' }, desc: 'Espectacular villa con piscina privada, jardín tropical y acceso a playa privada en Bávaro. Ideal para inversión vacacional o residencia permanente.\n\nDiseñada por arquitecto reconocido con materiales importados de primera calidad. Cocina gourmet con isla central, sala de estar con techos de 5 metros y amplias terrazas.\n\nA 20 minutos del aeropuerto de Punta Cana y 5 minutos de los mejores restaurantes y centros comerciales de la zona.', amenidades: ['Piscina privada', 'Jardín tropical', 'Acceso a playa', 'BBQ', 'Seguridad 24h', 'Parqueo techado', 'Terraza', 'Cisterna'], bgs: ['#ddf0e8', '#c5e8d5', '#e0f5ea', '#d5eee0', '#cce8d8'] },
}

function MapaUbicacion({ lat, lng }: { lat: number, lng: number }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

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
      const map = L.map(mapRef.current, { center: [lat, lng], zoom: 15, zoomControl: true, attributionControl: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      const icono = L.divIcon({
        className: '',
        html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 19 11 19s11-11.333 11-19C22 4.925 17.075 0 11 0z" fill="#006D77" stroke="#fff" stroke-width="1.5"/><circle cx="11" cy="11" r="4.5" fill="#fff"/></svg>`,
        iconSize: [22, 30], iconAnchor: [11, 30],
      })
      L.marker([lat, lng], { icon: icono }).addTo(map)
      mapInstanceRef.current = map
    }
    if ((window as any).L) { load() }
    else {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.onload = load
      document.head.appendChild(s)
    }
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
  }, [lat, lng])

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}

export default function Propiedad({ params }: { params: { id: string } }) {
  const p = propiedades[params.id] || propiedades['1']
  const [fotoActiva, setFotoActiva] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [telVisible, setTelVisible] = useState(false)

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6' }}>

      {/* NAV */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>
            urbiza<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          {['Comprar', 'Alquilar', 'Obra nueva'].map(item => (
            <a key={item} href="#" style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/login" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>Entrar</a>
          <a href="/registro" style={{ fontSize: 12, color: '#006D77', background: '#fff', padding: '6px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>+ Publicar gratis</a>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '8px 20px', fontSize: 12, color: '#aaa', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <a href="/" style={{ color: '#006D77', textDecoration: 'none' }}>Urbiza</a>
        <span>›</span>
        <a href="/buscar" style={{ color: '#006D77', textDecoration: 'none' }}>República Dominicana</a>
        <span>›</span>
        <a href="/buscar" style={{ color: '#006D77', textDecoration: 'none' }}>{p.tipo}</a>
        <span>›</span>
        <span style={{ color: '#444' }}>{p.titulo}</span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 20px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* COLUMNA IZQUIERDA */}
          <div>

            {/* GALERÍA */}
            <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              {/* Foto principal */}
              <div style={{ height: 420, background: p.bgs[fotoActiva], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="0.8" opacity="0.2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>
                  {fotoActiva + 1} / {p.bgs.length}
                </div>
                {/* Flechas */}
                {fotoActiva > 0 && (
                  <button onClick={() => setFotoActiva(fotoActiva - 1)} style={{ all: 'unset', position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>‹</button>
                )}
                {fotoActiva < p.bgs.length - 1 && (
                  <button onClick={() => setFotoActiva(fotoActiva + 1)} style={{ all: 'unset', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>›</button>
                )}
              </div>
              {/* Miniaturas */}
              <div style={{ display: 'flex', gap: 6, padding: '10px 12px', background: '#f9f9f9', overflowX: 'auto' }}>
                {p.bgs.map((bg: string, i: number) => (
                  <div key={i} onClick={() => setFotoActiva(i)} style={{ width: 72, height: 52, background: bg, borderRadius: 4, flexShrink: 0, cursor: 'pointer', border: fotoActiva === i ? '2px solid #006D77' : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5" opacity="0.4">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* TÍTULO Y PRECIO */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>{p.titulo}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    {p.zona}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#006D77' }}>US$ {p.precio.toLocaleString('en-US')}</div>
                  <div style={{ fontSize: 13, color: '#aaa' }}>{formatDOP(p.precio)}</div>
                  <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>US$ {Math.round(p.precio / p.m2).toLocaleString('en-US')}/m²</div>
                </div>
              </div>
            </div>

            {/* CARACTERÍSTICAS */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 16 }}>Características</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><path d="M3 7h18M3 7v13h18V7M3 7l2-4h14l2 4"/><line x1="9" y1="11" x2="15" y2="11"/></svg>, label: 'Habitaciones', val: p.hab > 0 ? p.hab : 'Estudio' },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z"/><path d="M4 12V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/><circle cx="7" cy="7" r="1" fill="#006D77"/></svg>, label: 'Baños', val: p.banos },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>, label: 'Superficie', val: p.m2 + ' m²' },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><circle cx="12" cy="14" r="2"/></svg>, label: 'Parqueos', val: p.parqueos },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 9v12"/></svg>, label: 'Planta', val: p.planta },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: 'Año construcción', val: p.anio },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8f8f8', borderRadius: 6 }}>
                    <div style={{ width: 36, height: 36, background: '#e0f5f7', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>{c.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 }}>Descripción</h2>
              {p.desc.split('\n\n').map((parrafo: string, i: number) => (
                <p key={i} style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 12 }}>{parrafo}</p>
              ))}
            </div>

            {/* AMENIDADES */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 }}>Amenidades</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {p.amenidades.map((a: string) => (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* MAPA */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 }}>Ubicación</h2>
              <div style={{ height: 300, borderRadius: 6, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
                <MapaUbicacion lat={p.lat} lng={p.lng} />
              </div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {p.zona}
              </div>
            </div>

          </div>

          {/* SIDEBAR AGENTE */}
          <div style={{ position: 'sticky', top: 70 }}>

            {/* TARJETA AGENTE */}
            <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <div style={{ background: '#006D77', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#004E57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#83D4DB', flexShrink: 0 }}>
                  {p.agente.nombre.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    {p.agente.nombre}
                    {/* Insignia de plan — solo Particular o Profesional */}
                    {p.agente.plan === 'Particular' ? (
                      <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 10, letterSpacing: 0.4 }}>PARTICULAR</span>
                    ) : (
                      <span style={{ background: '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10, letterSpacing: 0.4 }}>PROFESIONAL</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{p.agente.agencia}</span>
                    {p.agente.aei && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: '#1a3a5c', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#83D4DB" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        AEI
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 18px' }}>
                {p.agente.aei && (
                  <div style={{ background: '#e0f5f7', border: '1px solid #c5e8ea', borderRadius: 5, padding: '7px 10px', fontSize: 11, color: '#004E57', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Agente verificado por la AEI
                  </div>
                )}
                <button onClick={() => setTelVisible(!telVisible)} style={{ all: 'unset', width: '100%', background: '#006D77', color: '#fff', padding: '11px', borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center', display: 'block', marginBottom: 10, boxSizing: 'border-box' }}>
                  {telVisible ? p.agente.tel : 'Ver teléfono'}
                </button>
                <div style={{ marginBottom: 10 }}>
                  <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} rows={3} placeholder={`Hola ${p.agente.nombre.split(' ')[0]}, me interesa esta propiedad...`} style={{ width: '100%', border: '1px solid #ddd', borderRadius: 5, padding: '10px', fontSize: 13, color: '#333', resize: 'none', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button style={{ all: 'unset', width: '100%', background: '#17A6B4', color: '#fff', padding: '11px', borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                  Enviar mensaje
                </button>
              </div>
            </div>

            {/* REFERENCIA */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '14px 18px', fontSize: 12, color: '#aaa', textAlign: 'center', marginBottom: 16 }}>
              Ref. PUM-0{p.id}821 · Publicado hace 2 días
            </div>

            {/* ACCIONES */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ all: 'unset', flex: 1, border: '1px solid #e0e0e0', borderRadius: 6, padding: '10px', fontSize: 12, color: '#555', cursor: 'pointer', textAlign: 'center', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                ♡ Guardar
              </button>
              <button style={{ all: 'unset', flex: 1, border: '1px solid #e0e0e0', borderRadius: 6, padding: '10px', fontSize: 12, color: '#555', cursor: 'pointer', textAlign: 'center', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                ↗ Compartir
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#004E57', color: 'rgba(255,255,255,0.5)', padding: '20px', fontSize: 12, textAlign: 'center' }}>
        <strong style={{ color: 'rgba(255,255,255,0.8)' }}>urbiza.com</strong> · © 2025 · República Dominicana
      </footer>

    </main>
  )
}
