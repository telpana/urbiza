'use client'
import { useState, useEffect, useRef } from 'react'

const USD_TO_DOP = 59.5
function formatDOP(usd: number) {
  return 'RD$ ' + (usd * USD_TO_DOP).toLocaleString('es-DO', { maximumFractionDigits: 0 })
}

const propiedades = [
  { id: 1, precio: 285000, titulo: 'Apartamento en Piantini', zona: 'Piantini, Distrito Nacional', hab: 3, banos: 2, m2: 150, parqueos: 2, tipo: 'Apartamento', dest: true, visitas: false, bg: '#e0f5f7', desc: 'Amplio apartamento en el corazón de Piantini con acabados de alta calidad, pisos de mármol importado y vista panorámica. Cocina equipada con electrodomésticos de acero inoxidable.' },
  { id: 2, precio: 620000, titulo: 'Villa en Bávaro', zona: 'Bávaro, La Altagracia', hab: 4, banos: 3, m2: 500, parqueos: 3, tipo: 'Villa', dest: true, visitas: false, bg: '#ddf0e8', desc: 'Espectacular villa con piscina privada, jardín tropical y acceso a playa privada. Ideal para inversión vacacional o residencia permanente.' },
  { id: 3, precio: 165000, titulo: 'Apartamento en Bella Vista', zona: 'Bella Vista, Distrito Nacional', hab: 2, banos: 2, m2: 95, parqueos: 1, tipo: 'Apartamento', dest: false, visitas: true, bg: '#f0ebe0', desc: 'Cómodo apartamento en Bella Vista con buenas comunicaciones y cercano a centros comerciales, restaurantes y colegios.' },
  { id: 4, precio: 410000, titulo: 'Oficina en Naco', zona: 'Naco, Distrito Nacional', hab: 0, banos: 2, m2: 180, parqueos: 3, tipo: 'Oficina', dest: false, visitas: true, bg: '#e8eaf0', desc: 'Moderna oficina en edificio corporativo con lobby, seguridad 24h y estacionamiento. Piso 5 con vista a la ciudad.' },
  { id: 5, precio: 310000, titulo: 'Villa en Arroyo Hondo', zona: 'Arroyo Hondo, Distrito Nacional', hab: 4, banos: 3, m2: 380, parqueos: 2, tipo: 'Villa', dest: false, visitas: true, bg: '#e8f0e0', desc: 'Villa en urbanización cerrada con seguridad privada, piscina comunitaria y áreas verdes. A 10 minutos del Blue Mall.' },
  { id: 6, precio: 98000, titulo: 'Apartamento en Santiago', zona: 'Reparto Conuco, Santiago', hab: 2, banos: 1, m2: 90, parqueos: 1, tipo: 'Apartamento', dest: false, visitas: false, bg: '#f0e8f0', desc: 'Apartamento céntrico en Santiago con excelente acceso a transporte público y comercios. Ideal para primera vivienda o inversión.' },
  { id: 7, precio: 195000, titulo: 'Apartamento en Naco', zona: 'Naco, Distrito Nacional', hab: 2, banos: 2, m2: 110, parqueos: 1, tipo: 'Apartamento', dest: false, visitas: false, bg: '#e0f5f7', desc: 'Apartamento moderno en Naco con terraza y área de lavandería. Edificio con generador eléctrico y cisterna.' },
  { id: 8, precio: 450000, titulo: 'Villa en Cap Cana', zona: 'Cap Cana, La Altagracia', hab: 3, banos: 3, m2: 320, parqueos: 2, tipo: 'Villa', dest: false, visitas: false, bg: '#ddf0e8', desc: 'Exclusiva villa en Cap Cana con acceso a campo de golf, marina y playa privada. Acabados de lujo y piscina propia.' },
]

function LeafletMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return

    // Cargar CSS de Leaflet
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Cargar JS de Leaflet
    const loadLeaflet = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [18.4861, -69.9312],
        zoom: 13,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      // Zonas coloreadas
      const zonas = [
        { name: 'Piantini', coords: [[18.492,  -69.942], [18.492, -69.932], [18.486, -69.932], [18.486, -69.942]], color: '#006D77' },
        { name: 'Naco',     coords: [[18.498,  -69.949], [18.498, -69.942], [18.492, -69.942], [18.492, -69.949]], color: '#17A6B4' },
        { name: 'Serrallés',coords: [[18.486,  -69.942], [18.486, -69.932], [18.480, -69.932], [18.480, -69.942]], color: '#006D77' },
        { name: 'Bella Vista', coords: [[18.480, -69.949], [18.480, -69.942], [18.474, -69.942], [18.474, -69.949]], color: '#17A6B4' },
      ]

      zonas.forEach(z => {
        L.polygon(z.coords, {
          color: z.color,
          weight: 2,
          fillColor: z.color,
          fillOpacity: 0.3,
        }).addTo(map).bindTooltip(z.name, { permanent: true, direction: 'center', className: 'zona-label' })
      })

      mapInstanceRef.current = map
    }

    if ((window as any).L) {
      loadLeaflet()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = loadLeaflet
      document.head.appendChild(script)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden', marginBottom: 14 }}>
      <style>{`.zona-label { background: transparent !important; border: none !important; box-shadow: none !important; font-size: 10px !important; font-weight: bold !important; color: #004E57 !important; }`}</style>
      <div ref={mapRef} style={{ height: 200 }} />
      <div style={{ padding: '8px 12px', borderTop: '1px solid #e8e8e8', background: '#fafafa' }}>
        <button style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: '#006D77', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          Ver en mapa
        </button>
      </div>
    </div>
  )
}

export default function Buscar() {
  const [tipo, setTipo] = useState('Todos')
  const [orden, setOrden] = useState('Relevancia')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [habMin, setHabMin] = useState(0)
  const [banosMin, setBanosMin] = useState(0)
  const [m2Min, setM2Min] = useState('')
  const [m2Max, setM2Max] = useState('')
  const [query, setQuery] = useState('')

  const tipos = ['Todos', 'Apartamento', 'Villa', 'Oficina', 'Terreno', 'Local comercial']
  const ordenes = ['Relevancia', 'Baratos', 'Caros', 'Recientes']

  const filtradas = propiedades.filter(p => {
    if (tipo !== 'Todos' && p.tipo !== tipo) return false
    if (precioMax && p.precio > Number(precioMax.replace(/\D/g, ''))) return false
    if (precioMin && p.precio < Number(precioMin.replace(/\D/g, ''))) return false
    if (habMin > 0 && p.hab < habMin) return false
    if (query && !p.titulo.toLowerCase().includes(query.toLowerCase()) && !p.zona.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (orden === 'Baratos') return a.precio - b.precio
    if (orden === 'Caros') return b.precio - a.precio
    if (orden === 'Relevancia') return (b.dest ? 2 : b.visitas ? 1 : 0) - (a.dest ? 2 : a.visitas ? 1 : 0)
    return 0
  })

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#006D77', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>
            urbiza<span style={{ color: '#17A6B4' }}>.</span>
          </a>
          {['Comprar', 'Alquilar', 'Obra nueva'].map(item => (
            <a key={item} href="#" style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: '#555', textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: 340, margin: '0 20px' }}>
          <div style={{ display: 'flex', border: '1.5px solid #006D77', borderRadius: 4, overflow: 'hidden', height: 34 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', background: '#f9f9f9', borderRight: '1px solid #e0e0e0' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <input value={query} onChange={e => setQuery(e.target.value)} type="text" placeholder="Zona, sector, municipio..." style={{ flex: 1, padding: '0 10px', fontSize: 13, border: 'none', outline: 'none', background: '#fff' }} />
            <button style={{ background: '#006D77', color: '#fff', border: 'none', padding: '0 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Buscar</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/login" style={{ fontSize: 12, color: '#006D77', border: '1.5px solid #006D77', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>Entrar</a>
          <a href="/registro" style={{ fontSize: 12, color: '#fff', background: '#006D77', padding: '6px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>+ Publicar gratis</a>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '8px 20px', fontSize: 12, color: '#aaa', display: 'flex', alignItems: 'center', gap: 6 }}>
        <a href="/" style={{ color: '#006D77', textDecoration: 'none' }}>Urbiza</a>
        <span>›</span>
        <a href="#" style={{ color: '#006D77', textDecoration: 'none' }}>República Dominicana</a>
        <span>›</span>
        <span style={{ color: '#444' }}>Comprar</span>
        <span style={{ color: '#ccc', marginLeft: 8 }}>·</span>
        <span style={{ color: '#444', marginLeft: 8, fontWeight: 500 }}>{filtradas.length} propiedades</span>
      </div>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 90px)' }}>

        {/* SIDEBAR */}
        <div style={{ background: '#fff', borderRight: '1px solid #e8e8e8', padding: '14px', overflowY: 'auto' }}>

          {/* MAPA REAL GOOGLE MAPS */}
          <LeafletMap />

          {/* FILTRO TIPO */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Tipo de inmueble</div>
            <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 13, color: '#444', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              {tipos.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* FILTRO PRECIO — inputs iguales */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Precio (US$)</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input
                type="text"
                placeholder="Mínimo"
                value={precioMin}
                onChange={e => setPrecioMin(e.target.value)}
                style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }}
              />
              <input
                type="text"
                placeholder="Máximo"
                value={precioMax}
                onChange={e => setPrecioMax(e.target.value)}
                style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }}
              />
            </div>
          </div>

          {/* FILTRO SUPERFICIE */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Superficie (m²)</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Mínimo"
                value={m2Min}
                onChange={e => setM2Min(e.target.value)}
                style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }}
              />
              <input
                type="text"
                placeholder="Máximo"
                value={m2Max}
                onChange={e => setM2Max(e.target.value)}
                style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }}
              />
            </div>
          </div>

          {/* FILTRO HABITACIONES */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Habitaciones</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4].map(h => (
                <button key={h} onClick={() => setHabMin(h)} style={{ all: 'unset', border: `1px solid ${habMin === h ? '#006D77' : '#ddd'}`, borderRadius: 4, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: habMin === h ? '#006D77' : '#666', background: habMin === h ? '#f0fafb' : '#fff' }}>
                  {h === 0 ? '0 (estudio)' : h === 4 ? '4+' : h}
                </button>
              ))}
            </div>
          </div>

          {/* FILTRO BAÑOS */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Baños</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {[1, 2, 3].map(b => (
                <button key={b} onClick={() => setBanosMin(b === banosMin ? 0 : b)} style={{ all: 'unset', border: `1px solid ${banosMin === b ? '#006D77' : '#ddd'}`, borderRadius: 4, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: banosMin === b ? '#006D77' : '#666', background: banosMin === b ? '#f0fafb' : '#fff' }}>
                  {b === 3 ? '3+' : b}
                </button>
              ))}
            </div>
          </div>

          {/* FILTRO CARACTERÍSTICAS */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Características</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['piscina', 'parqueo', 'Vista al mar', 'Amueblado', 'jardín', 'terraza', 'Agente AEI verificado'].map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#444', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#006D77', width: 14, height: 14 }} />
                  {c}
                  {c === 'Agente AEI verificado' && <span style={{ display: 'inline-flex', alignItems: 'center', background: '#1a3a5c', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>AEI</span>}
                </label>
              ))}
            </div>
          </div>


        </div>

        {/* RESULTADOS */}
        <div>
          {/* CABECERA */}
          <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '12px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111', margin: 0 }}>
                {filtradas.length} propiedades en República Dominicana
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#777' }}>Ordenar:</span>
                {ordenes.map(o => (
                  <button key={o} onClick={() => setOrden(o)} style={{ all: 'unset', border: `1px solid ${orden === o ? '#006D77' : '#ddd'}`, borderRadius: 4, padding: '5px 12px', fontSize: 13, color: orden === o ? '#006D77' : '#555', cursor: 'pointer', background: orden === o ? '#f0fafb' : '#fff' }}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LISTADOS — con más separación */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {filtradas.map(p => (
              <div key={p.id} style={{ display: 'flex', background: '#fff', borderBottom: '8px solid #f4f5f6', cursor: 'pointer', minHeight: 220 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafefe')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                {/* IMAGEN */}
                <div style={{ width: 300, minWidth: 300, background: p.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.dest && <div style={{ position: 'absolute', top: 10, left: 10, background: '#006D77', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 3 }}>Destacado</div>}
                  {p.visitas && !p.dest && <div style={{ position: 'absolute', top: 10, left: 10, background: '#17A6B4', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 3 }}>Más visto</div>}
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    {p.id * 3 + 5}
                  </div>
                </div>

                {/* INFO */}
                <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#006D77', marginBottom: 8 }}>{p.titulo}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 2 }}>
                      US$ {p.precio.toLocaleString('en-US')}
                      <span style={{ fontSize: 13, color: '#aaa', fontWeight: 400, marginLeft: 10 }}>US$ {Math.round(p.precio / p.m2).toLocaleString('en-US')}/m²</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>{formatDOP(p.precio)}</div>
                    <div style={{ fontSize: 13, color: '#444', marginBottom: 12 }}>
                      {p.hab > 0 && <span>{p.hab} hab. &nbsp;·&nbsp; </span>}
                      <span>{p.m2} m² &nbsp;·&nbsp; </span>
                      {p.banos > 0 && <span>{p.banos} baños &nbsp;·&nbsp; </span>}
                      {p.parqueos > 0 && <span>{p.parqueos} parqueo{p.parqueos > 1 ? 's' : ''}</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#777', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 14 }}>{p.desc}</div>
                  </div>
                  <div style={{ paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f0fafb', border: '1px solid #c5e8ea', padding: '3px 10px', borderRadius: 20, marginBottom: 10, width: 'fit-content' }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      <span style={{ color: '#006D77', fontSize: 12 }}>{p.zona}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button style={{ all: 'unset', border: '1px solid #e0e0e0', borderRadius: 4, padding: '6px 10px', cursor: 'pointer', color: '#ccc', fontSize: 16, lineHeight: 1 }}>♡</button>
                      <button style={{ all: 'unset', border: '1px solid #006D77', color: '#006D77', padding: '7px 16px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                        Ver teléfono
                      </button>
                      <button style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '7px 18px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                        Contactar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filtradas.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa', background: '#fff' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#555', marginBottom: 6 }}>No hay propiedades con esos filtros</div>
                <div style={{ fontSize: 13 }}>Prueba a cambiar el tipo o ampliar el rango de precio</div>
              </div>
            )}
          </div>

          {filtradas.length > 0 && (
            <div style={{ textAlign: 'center', padding: '24px', background: '#f4f5f6' }}>
              <button style={{ all: 'unset', border: '1.5px solid #006D77', color: '#006D77', background: '#fff', padding: '11px 36px', borderRadius: 4, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Ver más propiedades
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
