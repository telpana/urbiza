'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../supabase'

const USD_TO_DOP = 59.5

function formatDOP(usd: number) {
  return 'RD$ ' + (usd * USD_TO_DOP).toLocaleString('es-DO', { maximumFractionDigits: 0 })
}

const propiedadesEjemplo = [
  { id: 1, precio: 285000, titulo: 'Apartamento en Piantini', zona: 'Piantini, Distrito Nacional', hab: 3, banos: 2, m2: 150, parqueos: 2, tipo: 'Apartamento', operacion: 'venta', dest: true, visitas: false, bg: '#e0f5f7', lat: 18.4890, lng: -69.9370, desc: 'Amplio apartamento en el corazón de Piantini con acabados de alta calidad, pisos de mármol importado y vista panorámica.' },
  { id: 2, precio: 620000, titulo: 'Villa en Bávaro', zona: 'Bávaro, La Altagracia', hab: 4, banos: 3, m2: 500, parqueos: 3, tipo: 'Villa', operacion: 'venta', dest: true, visitas: false, bg: '#ddf0e8', lat: 18.6835, lng: -68.4070, desc: 'Espectacular villa con piscina privada, jardín tropical y acceso a playa privada.' },
  { id: 3, precio: 1800, titulo: 'Apartamento en Bella Vista', zona: 'Bella Vista, Distrito Nacional', hab: 2, banos: 2, m2: 95, parqueos: 1, tipo: 'Apartamento', operacion: 'alquiler', dest: false, visitas: true, bg: '#f0ebe0', lat: 18.4760, lng: -69.9450, desc: 'Cómodo apartamento en alquiler en Bella Vista con buenas comunicaciones.' },
  { id: 4, precio: 2500, titulo: 'Oficina en Naco', zona: 'Naco, Distrito Nacional', hab: 0, banos: 2, m2: 180, parqueos: 3, tipo: 'Oficina', operacion: 'alquiler', dest: false, visitas: true, bg: '#e8eaf0', lat: 18.4950, lng: -69.9450, desc: 'Moderna oficina en alquiler en edificio corporativo con lobby, seguridad 24h.' },
  { id: 5, precio: 310000, titulo: 'Villa en Arroyo Hondo', zona: 'Arroyo Hondo, Distrito Nacional', hab: 4, banos: 3, m2: 380, parqueos: 2, tipo: 'Villa', operacion: 'venta', dest: false, visitas: true, bg: '#e8f0e0', lat: 18.5050, lng: -69.9650, desc: 'Villa en urbanización cerrada con seguridad privada y piscina comunitaria.' },
  { id: 6, precio: 1200, titulo: 'Apartamento en Santiago', zona: 'Reparto Conuco, Santiago', hab: 2, banos: 1, m2: 90, parqueos: 1, tipo: 'Apartamento', operacion: 'alquiler', dest: false, visitas: false, bg: '#f0e8f0', lat: 19.4517, lng: -70.6970, desc: 'Apartamento en alquiler en Santiago con excelente acceso a transporte.' },
  { id: 7, precio: 195000, titulo: 'Apartamento en Naco', zona: 'Naco, Distrito Nacional', hab: 2, banos: 2, m2: 110, parqueos: 1, tipo: 'Apartamento', operacion: 'venta', dest: false, visitas: false, bg: '#e0f5f7', lat: 18.4930, lng: -69.9480, desc: 'Apartamento moderno en Naco con terraza y área de lavandería.' },
  { id: 8, precio: 450000, titulo: 'Villa en Cap Cana', zona: 'Cap Cana, La Altagracia', hab: 3, banos: 3, m2: 320, parqueos: 2, tipo: 'Villa', operacion: 'venta', dest: false, visitas: false, bg: '#ddf0e8', lat: 18.5200, lng: -68.3700, desc: 'Exclusiva villa en Cap Cana con acceso a campo de golf y marina.' },
]

// Mapa mini limpio — solo muestra el mapa sin zonas seleccionadas
function MapaMini() {
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
      const map = L.map(mapRef.current, {
        center: [18.4861, -69.9312],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
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
  }, [])

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}

// Mapa completo con iconos de propiedades
function MapaCompleto({ propiedades, onCerrar }: { propiedades: typeof propiedades, onCerrar: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return
    const load = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return
      const map = L.map(mapRef.current, {
        center: [18.4861, -69.9312],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

      propiedades.forEach(p => {
        const icono = L.divIcon({
          className: '',
          html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 19 11 19s11-11.333 11-19C22 4.925 17.075 0 11 0z" fill="#006D77" stroke="#fff" stroke-width="1.5"/>
            <circle cx="11" cy="11" r="4.5" fill="#fff"/>
          </svg>`,
          iconSize: [22, 30],
          iconAnchor: [11, 30],
          popupAnchor: [0, -30],
        })
        L.marker([p.lat, p.lng], { icon: icono }).addTo(map).bindPopup(`
          <div style="min-width:200px;font-family:sans-serif;">
            <div style="font-size:13px;font-weight:600;color:#006D77;margin-bottom:4px;">${p.titulo}</div>
            <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:2px;">US$ ${p.precio.toLocaleString('en-US')}</div>
            <div style="font-size:11px;color:#aaa;margin-bottom:6px;">${formatDOP(p.precio)}</div>
            <div style="font-size:12px;color:#555;margin-bottom:8px;">${p.hab > 0 ? p.hab + ' hab · ' : ''}${p.m2} m²${p.banos > 0 ? ' · ' + p.banos + ' baños' : ''}</div>
            <div style="font-size:12px;color:#777;">${p.desc.substring(0, 80)}...</div>
          </div>
        `)
      })
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
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{propiedades.length} propiedades en el mapa</div>
        <button onClick={onCerrar} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '8px 18px', borderRadius: 4, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Volver a listado
        </button>
      </div>
      <div ref={mapRef} style={{ flex: 1 }} />
    </div>
  )
}

const zonasSugerencias = [
  'Piantini, Distrito Nacional', 'Naco, Distrito Nacional', 'Serrallés, Distrito Nacional',
  'Bella Vista, Distrito Nacional', 'Arroyo Hondo, Distrito Nacional', 'Evaristo Morales, Distrito Nacional',
  'Los Cacicazgos, Distrito Nacional', 'Gazcue, Distrito Nacional', 'Ciudad Colonial, Distrito Nacional',
  'Miramar, Distrito Nacional', 'La Esperilla, Distrito Nacional', 'Bávaro, La Altagracia',
  'Punta Cana, La Altagracia', 'Cap Cana, La Altagracia', 'Los Corales, La Altagracia',
  'Cabeza de Toro, La Altagracia', 'Los Jardines, Santiago', 'Cerros de Gurabo, Santiago',
  'Reparto Conuco, Santiago', 'Las Terrenas, Samaná', 'Samaná', 'Puerto Plata', 'La Romana',
  'Casa de Campo, La Romana', 'Jarabacoa, La Vega', 'Constanza, La Vega',
  'San Pedro de Macorís', 'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste',
]

function BuscarContent() {
  const searchParams = useSearchParams()
  const operacionParam = searchParams.get('operacion') || ''
  const zonaParam = searchParams.get('zona') || ''
  const tipoParam = searchParams.get('tipo') || ''

  const [tipo, setTipo] = useState(tipoParam || 'Todos')
  const [operacion, setOperacion] = useState(operacionParam)
  const [query, setQuery] = useState(zonaParam)
  const [orden, setOrden] = useState('Relevancia')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [m2Min, setM2Min] = useState('')
  const [m2Max, setM2Max] = useState('')
  const [habMin, setHabMin] = useState(0)
  const [banosMin, setBanosMin] = useState(0)
  const [sugerencias, setSugerencias] = useState<string[]>([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [propiedadesReales, setPropiedadesReales] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [verMapa, setVerMapa] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      let q = supabase
        .from('propiedades')
        .select('*, usuarios(nombre, inmobiliaria, tipo, foto_url)')
        .eq('estado', 'activo')
      if (operacionParam) q = q.eq('operacion', operacionParam)
      if (tipoParam) q = q.eq('tipo', tipoParam)
      if (zonaParam) q = q.ilike('zona', `%${zonaParam}%`)
      const { data, error } = await q
        .order('destacado', { ascending: false })
        .order('created_at', { ascending: false })
      if (!error && data) setPropiedadesReales(data)
      setCargando(false)
    }
    cargar()
  }, [])

  const propiedadesActivas = propiedadesReales.length > 0 ? propiedadesReales.map(p => ({
    id: p.id,
    precio: p.precio,
    titulo: p.titulo,
    zona: p.zona || '',
    hab: p.habitaciones || 0,
    banos: p.banos || 0,
    m2: p.m2 || 0,
    parqueos: 0,
    tipo: p.tipo || 'Apartamento',
    operacion: p.operacion || 'venta',
    dest: p.destacado || false,
    visitas: false,
    bg: '#e0f5f7',
    desc: p.descripcion || '',
    lat: 18.4861,
    lng: -69.9312,
  })) : propiedadesEjemplo

  const tipos = ['Todos', 'Apartamento', 'Villa', 'Oficina', 'Terreno', 'Local comercial']
  const ordenes = ['Relevancia', 'Recientes', 'Baratos', 'Caros']

  const filtradas = propiedadesActivas.filter((p: any) => {
    if (operacion && p.operacion !== operacion) return false
    if (tipo !== 'Todos' && p.tipo !== tipo) return false
    if (precioMax && p.precio > Number(precioMax.replace(/\D/g, ''))) return false
    if (precioMin && p.precio < Number(precioMin.replace(/\D/g, ''))) return false
    if (m2Max && p.m2 > Number(m2Max.replace(/\D/g, ''))) return false
    if (m2Min && p.m2 < Number(m2Min.replace(/\D/g, ''))) return false
    if (habMin > 0 && p.hab < habMin) return false
    if (banosMin > 0 && p.banos < banosMin) return false
    if (query && !p.titulo.toLowerCase().includes(query.toLowerCase()) && !p.zona.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    // Destacadas siempre primero sin importar el orden seleccionado
    if (b.dest !== a.dest) return (b.dest ? 1 : 0) - (a.dest ? 1 : 0)
    if (orden === 'Baratos') return a.precio - b.precio
    if (orden === 'Caros') return b.precio - a.precio
    return 0
  })

  const handleQueryChange = (val: string) => {
    setQuery(val)
    if (val.length >= 2) {
      setSugerencias(zonasSugerencias.filter(z => z.toLowerCase().includes(val.toLowerCase())).slice(0, 6))
      setMostrarSugerencias(true)
    } else {
      setSugerencias([])
      setMostrarSugerencias(false)
    }
  }

  const tituloOperacion = operacion === 'alquiler' ? 'en alquiler' : 'en venta'
  const tituloZona = query ? `en ${query.split(',')[0].trim()}` : 'en República Dominicana'
  const tituloPagina = `Propiedades ${tituloOperacion} ${tituloZona}`

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>

      {/* MAPA COMPLETO — pantalla entera */}
      {verMapa && <MapaCompleto propiedades={filtradas} onCerrar={() => setVerMapa(false)} />}

      {/* NAV */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>
            urbiza<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          {[
            { label: 'Comprar', href: '/buscar?operacion=venta' },
            { label: 'Alquilar', href: '/buscar?operacion=alquiler' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: operacion === (item.label === 'Alquilar' ? 'alquiler' : 'venta') ? '#fff' : 'rgba(255,255,255,0.7)', textDecoration: 'none', borderBottom: operacion === (item.label === 'Alquilar' ? 'alquiler' : 'venta') ? '2px solid #83D4DB' : '2px solid transparent' }}>{item.label}</a>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: 380, margin: '0 20px' }}>
          <div style={{ display: 'flex', background: '#fff', borderRadius: 4, overflow: 'hidden', height: 34, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', borderRight: '1px solid #e8e8e8' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <input value={query} onChange={e => setQuery(e.target.value)} type="text" placeholder="Zona, sector, municipio..." style={{ flex: 1, padding: '0 10px', fontSize: 13, border: 'none', outline: 'none', color: '#222', background: '#fff' }} />
            <button style={{ background: '#17A6B4', color: '#fff', border: 'none', padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Buscar</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/login" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>Entrar</a>
          <a href="/registro" style={{ fontSize: 12, color: '#006D77', background: '#fff', padding: '6px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>+ Publicar gratis</a>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '8px 20px', fontSize: 12, color: '#aaa', display: 'flex', alignItems: 'center', gap: 6 }}>
        <a href="/" style={{ color: '#006D77', textDecoration: 'none' }}>Urbiza</a>
        <span>›</span>
        <a href="/buscar" style={{ color: '#006D77', textDecoration: 'none' }}>República Dominicana</a>
        {query && <><span>›</span><span style={{ color: '#444' }}>{query.split(',')[0].trim()}</span></>}
        <span>›</span>
        <span style={{ color: '#444' }}>{operacion === 'alquiler' ? 'Alquiler' : 'Venta'}</span>
        <span style={{ color: '#ccc', marginLeft: 8 }}>·</span>
        <span style={{ color: '#444', marginLeft: 8, fontWeight: 500 }}>{filtradas.length} propiedades</span>
      </div>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 90px)' }}>

        {/* SIDEBAR */}
        <div style={{ background: '#fff', borderRight: '1px solid #e8e8e8', padding: '14px', overflowY: 'auto' }}>

          {/* MAPA MINI LIMPIO */}
          <div style={{ border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ height: 180 }}>
              <MapaMini />
            </div>
            <div style={{ padding: '8px 12px', borderTop: '1px solid #e8e8e8', background: '#fafafa' }}>
              <button onClick={() => setVerMapa(true)} style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: '#006D77', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Ver en mapa
              </button>
            </div>
          </div>

          {/* FILTRO OPERACION */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Operación</div>
            <div style={{ display: 'flex', gap: 0, background: '#f4f5f6', borderRadius: 6, padding: 3 }}>
              {[{ val: '', label: 'Todas' }, { val: 'venta', label: 'Venta' }, { val: 'alquiler', label: 'Alquiler' }].map(op => (
                <button key={op.val} onClick={() => setOperacion(op.val)} style={{ all: 'unset', flex: 1, padding: '6px 0', textAlign: 'center', fontSize: 12, fontWeight: operacion === op.val ? 700 : 400, color: operacion === op.val ? '#fff' : '#555', background: operacion === op.val ? '#006D77' : 'transparent', borderRadius: 4, cursor: 'pointer' }}>
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* FILTRO TIPO */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Tipo de inmueble</div>
            <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 13, color: '#444', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              {tipos.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* FILTRO PRECIO */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Precio (US$)</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder="Mínimo" value={precioMin} onChange={e => setPrecioMin(e.target.value)} style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }} />
              <input type="text" placeholder="Máximo" value={precioMax} onChange={e => setPrecioMax(e.target.value)} style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }} />
            </div>
          </div>

          {/* FILTRO SUPERFICIE */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Superficie (m²)</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder="Mínimo" value={m2Min} onChange={e => setM2Min(e.target.value)} style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }} />
              <input type="text" placeholder="Máximo" value={m2Max} onChange={e => setM2Max(e.target.value)} style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }} />
            </div>
          </div>

          {/* FILTRO HABITACIONES */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Habitaciones</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4].map(h => (
                <button key={h} onClick={() => setHabMin(h)} style={{ all: 'unset', border: `1px solid ${habMin === h ? '#006D77' : '#ddd'}`, borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer', color: habMin === h ? '#006D77' : '#666', background: habMin === h ? '#f0fafb' : '#fff' }}>
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
          <div style={{ paddingBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Características</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Piscina', 'Parqueo', 'Vista al mar', 'Amueblado', 'Jardín', 'Terraza', 'Agente AEI verificado'].map(c => (
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
          <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '12px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111', margin: 0 }}>
                {cargando ? 'Cargando propiedades...' : `${filtradas.length} ${tituloPagina}`}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {filtradas.map(p => (
              <div key={p.id} style={{ display: 'flex', background: '#fff', borderBottom: '8px solid #f4f5f6', cursor: 'pointer', minHeight: 220 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafefe')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
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
                      <button style={{ all: 'unset', border: '1px solid #006D77', color: '#006D77', padding: '7px 16px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Ver teléfono</button>
                      <button style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '7px 18px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Contactar</button>
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

export default function Buscar() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', background: '#f4f5f6' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#006D77', marginBottom: 8 }}>urbiza<span style={{ color: '#17A6B4' }}>.</span></div>
          <div style={{ fontSize: 14, color: '#888' }}>Cargando propiedades...</div>
        </div>
      </div>
    }>
      <BuscarContent />
    </Suspense>
  )
}
