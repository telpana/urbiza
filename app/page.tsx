'use client'
import { useState, useEffect, useRef } from 'react'
import { useIdioma } from '../IdiomaContext'
import { supabase } from '../supabase'
import NavUserMenu from '../components/NavUserMenu'

const propiedadesMapaHome = [
  { id: 1, precio: 285000, titulo: 'Apartamento en Piantini', zona: 'Piantini, D.N.', tipo: 'Apartamento', hab: 3, m2: 150, banos: 2, lat: 18.4890, lng: -69.9370, desc: 'Amplio apartamento en Piantini con acabados de alta calidad.' },
  { id: 2, precio: 620000, titulo: 'Villa en Bávaro', zona: 'Bávaro, La Altagracia', tipo: 'Villa', hab: 4, m2: 500, banos: 3, lat: 18.6835, lng: -68.4070, desc: 'Villa con piscina privada y acceso a playa.' },
  { id: 3, precio: 165000, titulo: 'Apartamento en Bella Vista', zona: 'Bella Vista, D.N.', tipo: 'Apartamento', hab: 2, m2: 95, banos: 2, lat: 18.4760, lng: -69.9450, desc: 'Cómodo apartamento en Bella Vista.' },
  { id: 4, precio: 310000, titulo: 'Villa en Arroyo Hondo', zona: 'Arroyo Hondo, D.N.', tipo: 'Villa', hab: 4, m2: 380, banos: 3, lat: 18.5050, lng: -69.9650, desc: 'Villa en urbanización cerrada.' },
  { id: 5, precio: 98000, titulo: 'Apartamento en Santiago', zona: 'Santiago', tipo: 'Apartamento', hab: 2, m2: 90, banos: 1, lat: 19.4517, lng: -70.6970, desc: 'Apartamento céntrico en Santiago.' },
  { id: 6, precio: 450000, titulo: 'Villa en Cap Cana', zona: 'Cap Cana', tipo: 'Villa', hab: 3, m2: 320, banos: 3, lat: 18.5200, lng: -68.3700, desc: 'Villa exclusiva en Cap Cana.' },
  { id: 7, precio: 320000, titulo: 'Oficina en Piantini', zona: 'Piantini, D.N.', tipo: 'Oficina', hab: 0, m2: 200, banos: 2, lat: 18.4920, lng: -69.9400, desc: 'Oficina moderna en edificio corporativo.' },
  { id: 8, precio: 85000, titulo: 'Terreno en La Romana', zona: 'La Romana', tipo: 'Terreno', hab: 0, m2: 800, banos: 0, lat: 18.4274, lng: -68.9728, desc: 'Terreno ideal para construcción.' },
  { id: 9, precio: 120000, titulo: 'Local comercial en Santiago', zona: 'Santiago', tipo: 'Local comercial', hab: 0, m2: 150, banos: 1, lat: 19.4600, lng: -70.6850, desc: 'Local comercial en zona de alto tráfico.' },
]

function MapaCompletoPropiedades({ onCerrar }: { onCerrar: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [filtroTipo, setFiltroTipo] = useState('Todos')

  const tipos = ['Todos', 'Apartamento', 'Villa', 'Terreno', 'Oficina', 'Local comercial']

  function actualizarMarkers(L: any, map: any, filtro: string) {
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []
    const filtradas = filtro === 'Todos' ? propiedadesMapaHome : propiedadesMapaHome.filter(p => p.tipo === filtro)
    filtradas.forEach(p => {
      const icono = L.divIcon({
        className: '',
        html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 19 11 19s11-11.333 11-19C22 4.925 17.075 0 11 0z" fill="#006D77" stroke="#fff" stroke-width="1.5"/><circle cx="11" cy="11" r="4.5" fill="#fff"/></svg>`,
        iconSize: [22, 30], iconAnchor: [11, 30], popupAnchor: [0, -30],
      })
      const marker = L.marker([p.lat, p.lng], { icon: icono }).addTo(map).bindPopup(`
        <div style="min-width:180px;font-family:sans-serif;">
          <div style="font-size:11px;color:#17A6B4;font-weight:600;margin-bottom:3px;">${p.tipo.toUpperCase()}</div>
          <div style="font-size:13px;font-weight:600;color:#006D77;margin-bottom:4px;">${p.titulo}</div>
          <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:2px;">US$ ${p.precio.toLocaleString('en-US')}</div>
          <div style="font-size:12px;color:#555;margin-bottom:8px;">${p.hab > 0 ? p.hab + ' hab · ' : ''}${p.m2} m²${p.banos > 0 ? ' · ' + p.banos + ' baños' : ''}</div>
          <a href="/propiedad/${p.id}" style="display:block;background:#006D77;color:#fff;padding:6px 10px;border-radius:4px;text-align:center;text-decoration:none;font-size:12px;font-weight:500;">Ver propiedad</a>
        </div>
      `)
      markersRef.current.push(marker)
    })
  }

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return
    const load = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return
      const map = L.map(mapRef.current, { center: [18.7357, -70.1627], zoom: 7, zoomControl: true, attributionControl: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      actualizarMarkers(L, map, 'Todos')
      mapInstanceRef.current = { map, L }
    }
    if ((window as any).L) { load() }
    else {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.onload = load
      document.head.appendChild(s)
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.map.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    const { L, map } = mapInstanceRef.current
    actualizarMarkers(L, map, filtroTipo)
  }, [filtroTipo])

  const visibles = filtroTipo === 'Todos' ? propiedadesMapaHome.length : propiedadesMapaHome.filter(p => p.tipo === filtroTipo).length

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{visibles} propiedades en República Dominicana</div>
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ border: '1.5px solid #006D77', borderRadius: 4, padding: '6px 12px', fontSize: 13, color: '#333', outline: 'none', cursor: 'pointer', background: '#fff' }}>
            {tipos.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={onCerrar} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '8px 18px', borderRadius: 4, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          ← Volver
        </button>
      </div>
      <div ref={mapRef} style={{ flex: 1 }} />
    </div>
  )
}

function MapaMiniHome() {
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
        center: [18.7357, -70.1627],
        zoom: 6,
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

const USD_TO_DOP = 59.5

function formatDOP(usd: number) {
  const dop = usd * USD_TO_DOP
  return 'RD$ ' + dop.toLocaleString('es-DO', { maximumFractionDigits: 0 })
}

const propiedadesDestacadas = [
  { price: 620000, title: 'Villa en Bávaro', loc: 'La Altagracia', feats: '4 hab · 500 m²', tipo: 'pagado', bg: '#ddf0e8' },
  { price: 285000, title: 'Apartamento en Piantini', loc: 'Distrito Nacional', feats: '3 hab · 150 m²', tipo: 'pagado', bg: '#e0f5f7' },
  { price: 410000, title: 'Penthouse en Naco', loc: 'Distrito Nacional', feats: '3 hab · 200 m²', tipo: 'pagado', bg: '#e8eaf0' },
  { price: 165000, title: 'Apartamento en Bella Vista', loc: 'Distrito Nacional', feats: '2 hab · 95 m²', tipo: 'visitas', bg: '#f0ebe0' },
  { price: 310000, title: 'Villa en Arroyo Hondo', loc: 'Distrito Nacional', feats: '4 hab · 380 m²', tipo: 'visitas', bg: '#e8f0e0' },
  { price: 98000, title: 'Apartamento en Santiago', loc: 'Santiago', feats: '2 hab · 90 m²', tipo: 'visitas', bg: '#f0e8f0' },
]

const propiedadesSantoDomingo = [
  { price: 285000, title: 'Apartamento en Piantini', feats: 'Apartamento · 3 hab · 150 m²', bg: '#e0f5f7' },
  { price: 195000, title: 'Apartamento en Naco', feats: 'Apartamento · 2 hab · 110 m²', bg: '#ddf0e8' },
  { price: 410000, title: 'Oficina en Serrallés', feats: 'Oficina · 180 m² · Piso 5', bg: '#e8eaf0' },
  { price: 165000, title: 'Apartamento en Bella Vista', feats: 'Apartamento · 2 hab · 95 m²', bg: '#f0ebe0' },
]

const propiedadesPuntaCana = [
  { price: 620000, title: 'Villa en Bávaro', feats: 'Villa · 4 hab · 500 m²', bg: '#ddf0e8' },
  { price: 280000, title: 'Apartamento en Cap Cana', feats: 'Apartamento · 3 hab · 140 m²', bg: '#e0f5f7' },
  { price: 450000, title: 'Villa en Punta Cana Village', feats: 'Villa · 3 hab · 320 m²', bg: '#e8eaf0' },
  { price: 185000, title: 'Apartamento en Bávaro', feats: 'Apartamento · 2 hab · 105 m²', bg: '#f0ebe0' },
]

const propiedadesSantiago = [
  { price: 145000, title: 'Apartamento en Los Jardines', feats: 'Apartamento · 3 hab · 120 m²', bg: '#f0ebe0' },
  { price: 220000, title: 'Casa en Cerros de Gurabo', feats: 'Casa · 4 hab · 280 m²', bg: '#e0f5f7' },
  { price: 98000, title: 'Apartamento en Reparto Conuco', feats: 'Apartamento · 2 hab · 90 m²', bg: '#ddf0e8' },
  { price: 310000, title: 'Villa en Arroyo Hondo', feats: 'Villa · 4 hab · 380 m²', bg: '#e8eaf0' },
]

const zonas = [
  { nombre: 'Santo Domingo', tipo: 'Apartamentos en venta' },
  { nombre: 'Punta Cana', tipo: 'Villas en venta' },
  { nombre: 'Santiago', tipo: 'Casas en venta' },
  { nombre: 'La Romana', tipo: 'Propiedades en venta' },
  { nombre: 'Puerto Plata', tipo: 'Apartamentos en venta' },
  { nombre: 'Las Terrenas', tipo: 'Villas en alquiler' },
  { nombre: 'Samaná', tipo: 'Casas en venta' },
  { nombre: 'Bávaro', tipo: 'Apartamentos en venta' },
  { nombre: 'Cap Cana', tipo: 'Villas en venta' },
  { nombre: 'Jarabacoa', tipo: 'Casas en venta' },
  { nombre: 'San Pedro de Macorís', tipo: 'Apartamentos en venta' },
  { nombre: 'La Vega', tipo: 'Casas en venta' },
]

const bgsNovedad = ['#e0f5f7','#ddf0e8','#e8eaf0','#f0ebe0']

function SeccionNovedad({ titulo, subtitulo, reales, ejemplos, zona }: {
  titulo: string, subtitulo: string, zona: string,
  reales: any[],
  ejemplos: { price: number, title: string, feats: string, bg: string }[]
}) {
  const items = reales.length > 0 ? reales : null
  if (items === null && ejemplos.length === 0) return null
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4 }}>{titulo}</h2>
          <a href={`/buscar?zona=${encodeURIComponent(zona)}`} style={{ fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>{subtitulo}</a>
        </div>
      </div>
      <div className="novedades-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, paddingBottom: 32 }}>
        {items
          ? items.map((p: any, i: number) => (
              <a key={p.id} href={`/propiedad/${p.id}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #ebebeb', display: 'block' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,119,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                <div style={{ height: 160, background: bgsNovedad[i % 4], position: 'relative', overflow: 'hidden' }}>
                  {Array.isArray(p.fotos) && p.fotos.length > 0
                    ? <img src={p.fotos[0]} alt={p.titulo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.25"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                  }
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 1 }}>US$ {(p.precio || 0).toLocaleString('en-US')}</div>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{formatDOP(p.precio || 0)}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 2 }}>{p.titulo}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{[p.tipo, p.habitaciones && `${p.habitaciones} hab`, p.m2 && `${p.m2} m²`].filter(Boolean).join(' · ')}</div>
                </div>
              </a>
            ))
          : ejemplos.map((p) => (
              <div key={p.title} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px solid #ebebeb' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,119,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                <div style={{ height: 160, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.25"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 1 }}>US$ {p.price.toLocaleString('en-US')}</div>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{formatDOP(p.price)}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 2 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{p.feats}</div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [tipo, setTipo] = useState('Comprar')
  const [tipoInmueble, setTipoInmueble] = useState('Apartamento')
  const [verMapa, setVerMapa] = useState(false)
  const { idioma, setIdioma, tr } = useIdioma()
  const [queryHome, setQueryHome] = useState('')
  const [sugHome, setSugHome] = useState<string[]>([])
  const [mostrarSugHome, setMostrarSugHome] = useState(false)
  const [destReales, setDestReales] = useState<any[]>([])
  const [masVistasReales, setMasVistasReales] = useState<any[]>([])
  const [slideIdx, setSlideIdx] = useState(0)
  const [masIdx, setMasIdx] = useState(0)
  const [novedadesSantoDomingo, setNovedadesSantoDomingo] = useState<any[]>([])
  const [novedadesPuntaCana, setNovedadesPuntaCana] = useState<any[]>([])
  const [novedadesSantiago, setNovedadesSantiago] = useState<any[]>([])
  const [sesionActiva, setSesionActiva] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [planUsuario, setPlanUsuario] = useState<string>('gratis')
  const [tipoUsuario, setTipoUsuario] = useState<string>('')
  const [fotoUrl, setFotoUrl] = useState<string>('')
  const [nombreUsuario, setNombreUsuario] = useState<string>('')
  const [idiomaOpen, setIdiomaOpen] = useState(false)
  const [bannerUrl, setBannerUrl] = useState(() =>
    (typeof window !== 'undefined' && localStorage.getItem('hb_banner')) ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80'
  )
  const [featureImgUrl, setFeatureImgUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [faviconUrl, setFaviconUrl] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setAuthReady(true); return }
      setSesionActiva(true)
      const meta = data.user.user_metadata || {}
      const avatarMeta = meta.avatar_url || meta.picture || ''
      const { data: usr } = await supabase.from('usuarios').select('plan,tipo,foto_url,nombre').eq('id', data.user.id).single()
      if (usr?.plan) setPlanUsuario(usr.plan)
      if (usr?.tipo) setTipoUsuario(usr.tipo)
      if (usr?.nombre) setNombreUsuario(usr.nombre)
      setFotoUrl(usr?.foto_url || avatarMeta)
      setAuthReady(true)
    })
    // Load site config
    fetch('/api/admin/config').then(r => r.json()).then(cfg => {
      if (cfg.banner_url) { setBannerUrl(cfg.banner_url); localStorage.setItem('hb_banner', cfg.banner_url) }
      if (cfg.feature_img_url) setFeatureImgUrl(cfg.feature_img_url)
      if (cfg.instagram_url) setInstagramUrl(cfg.instagram_url)
      if (cfg.facebook_url) setFacebookUrl(cfg.facebook_url)
      if (cfg.tiktok_url) setTiktokUrl(cfg.tiktok_url)
      if (cfg.whatsapp_url) setWhatsappUrl(cfg.whatsapp_url)
      if (cfg.favicon_url) {
        setFaviconUrl(cfg.favicon_url)
        const link = document.querySelector("link[rel='icon']") as HTMLLinkElement
        if (link) link.href = cfg.favicon_url
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const cargar = async () => {
      const { data: dest } = await supabase.from('propiedades')
        .select('id,titulo,precio,zona,habitaciones,m2,operacion,fotos').eq('destacado', true).eq('estado', 'activo').limit(12)
      if (dest && dest.length > 0) setDestReales(dest)
      const { data: vistas } = await supabase.from('propiedades')
        .select('id,titulo,precio,zona,habitaciones,m2,operacion,fotos').eq('estado', 'activo').order('visitas', { ascending: false }).limit(3)
      if (vistas && vistas.length > 0) setMasVistasReales(vistas)

      const campos = 'id,titulo,precio,zona,habitaciones,m2,tipo,operacion,fotos'
      const [{ data: sd }, { data: pc }, { data: stg }] = await Promise.all([
        supabase.from('propiedades').select(campos).eq('estado', 'activo')
          .or('zona.ilike.%Santo Domingo%,zona.ilike.%Distrito Nacional%')
          .order('created_at', { ascending: false }).limit(4),
        supabase.from('propiedades').select(campos).eq('estado', 'activo')
          .or('zona.ilike.%Punta Cana%,zona.ilike.%Bávaro%,zona.ilike.%La Altagracia%,zona.ilike.%Cap Cana%')
          .order('created_at', { ascending: false }).limit(4),
        supabase.from('propiedades').select(campos).eq('estado', 'activo')
          .or('zona.ilike.%Santiago%')
          .order('created_at', { ascending: false }).limit(4),
      ])
      if (sd && sd.length > 0) setNovedadesSantoDomingo(sd)
      if (pc && pc.length > 0) setNovedadesPuntaCana(pc)
      if (stg && stg.length > 0) setNovedadesSantiago(stg)
    }
    cargar()
  }, [])

  useEffect(() => {
    if (destReales.length <= 3) return
    const t = setInterval(() => setSlideIdx(i => (i + 1) % destReales.length), 4000)
    return () => clearInterval(t)
  }, [destReales.length])

  useEffect(() => {
    if (masVistasReales.length <= 3) return
    const t = setInterval(() => setMasIdx(i => (i + 1) % masVistasReales.length), 4500)
    return () => clearInterval(t)
  }, [masVistasReales.length])

  const zonasRD = ['Piantini, Distrito Nacional', 'Naco, Distrito Nacional', 'Serrallés, Distrito Nacional', 'Bella Vista, Distrito Nacional', 'Arroyo Hondo, Distrito Nacional', 'Los Cacicazgos, Distrito Nacional', 'Gazcue, Distrito Nacional', 'Ciudad Colonial, Distrito Nacional', 'Evaristo Morales, Distrito Nacional', 'Miramar, Distrito Nacional', 'La Esperilla, Distrito Nacional', 'Urbanización Real, Distrito Nacional', 'Viejo Arroyo Hondo, Distrito Nacional', 'Los Prados, Distrito Nacional', 'Jardines del Norte, Distrito Nacional', 'Ensanche Naco, Distrito Nacional', 'Ensanche Ozama, Distrito Nacional', 'Villa Consuelo, Distrito Nacional', 'Cristo Rey, Distrito Nacional', 'Alma Rosa, Santo Domingo Este', 'Los Tres Brazos, Santo Domingo Este', 'Ensanche Isabelita, Santo Domingo Este', 'San Isidro, Santo Domingo Este', 'Los Mina, Santo Domingo Este', 'Bávaro, La Altagracia', 'Punta Cana, La Altagracia', 'Downtown Punta Cana, La Altagracia', 'Cap Cana, La Altagracia', 'Cabeza de Toro, La Altagracia', 'Los Corales, La Altagracia', 'Uvero Alto, La Altagracia', 'Macao, La Altagracia', 'Cortecito, La Altagracia', 'El Cortecito, La Altagracia', 'Higüey, La Altagracia', 'San Rafael del Yuma, La Altagracia', 'Los Jardines, Santiago', 'Cerros de Gurabo, Santiago', 'Reparto Conuco, Santiago', 'Bella Vista, Santiago', 'Villa Olga, Santiago', 'Pontezuela, Santiago', 'Urbanización Tropical, Santiago', 'Las Colinas, Santiago', 'El Dorado, Santiago', 'Las Terrenas, Samaná', 'Samaná', 'El Portillo, Samaná', 'Cosón, Samaná', 'Las Galeras, Samaná', 'El Limón, Samaná', 'Rancho Español, Samaná', 'Puerto Plata', 'Sosúa, Puerto Plata', 'Cabarete, Puerto Plata', 'Costámbar, Puerto Plata', 'Cofresí, Puerto Plata', 'Playa Dorada, Puerto Plata', 'La Romana', 'Casa de Campo, La Romana', 'Bayahíbe, La Romana', 'Dominicus, La Romana', 'Jarabacoa, La Vega', 'Constanza, La Vega', 'La Vega', 'San Pedro de Macorís', 'Juan Dolio, San Pedro de Macorís', 'Guayacanes, San Pedro de Macorís', 'Boca Chica, Santo Domingo', 'Andrés, Boca Chica', 'San Cristóbal', 'Baní, Peravia', 'Azua', 'Barahona', 'Monte Plata', 'Hato Mayor', 'El Seibo', 'Miches, El Seibo', 'Moca, Espaillat', 'San Francisco de Macorís, Duarte', 'Nagua, María Trinidad Sánchez', 'Monte Cristi', 'Dajabón', 'Pedernales', 'Neiba, Baoruco', 'San Juan de la Maguana']
  const handleQueryHome = (val: string) => {
    setQueryHome(val)
    if (val.length >= 2) {
      const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      setSugHome(zonasRD.filter(z => norm(z).includes(norm(val))).slice(0, 6))
      setMostrarSugHome(true)
    } else {
      setSugHome([])
      setMostrarSugHome(false)
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6' }}>
      {verMapa && <MapaCompletoPropiedades onCerrar={() => setVerMapa(false)} />}

      {/* MENÚ MÓVIL OVERLAY */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400 }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 270, height: '100vh', background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#006D77', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: -1 }}>habitade<span style={{ color: '#83D4DB' }}>.</span></span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ all: 'unset', cursor: 'pointer', color: '#fff', fontSize: 24, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {authReady && sesionActiva ? (<>
                <div style={{ padding: '10px 20px 4px', fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 }}>Mi cuenta</div>
                {[
                  { label: 'Mi panel', href: '/panel' },
                  { label: 'Mis anuncios', href: '/panel?s=anuncios' },
                  { label: 'Mensajes', href: '/panel?s=mensajes' },
                  { label: 'Guardados', href: '/panel?s=guardados' },
                  { label: 'Mi perfil', href: '/panel?s=perfil' },
                ].map(item => (
                  <a key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', fontSize: 14, color: '#333', textDecoration: 'none', borderBottom: '1px solid #f5f5f5' }}>
                    {item.label}
                  </a>
                ))}
                <button onClick={async () => { const { supabase: sb } = await import('../supabase'); await sb.auth.signOut(); window.location.href = '/' }} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', padding: '14px 20px', fontSize: 14, color: '#e63946', cursor: 'pointer', borderTop: '1px solid #f0f0f0', marginTop: 8, boxSizing: 'border-box' }}>
                  Cerrar sesión
                </button>
              </>) : authReady ? (
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid #f0f0f0', marginTop: 8 }}>
                  <a href="/login" style={{ display: 'block', textAlign: 'center', padding: '13px', fontSize: 15, fontWeight: 600, color: '#006D77', border: '1.5px solid #006D77', borderRadius: 8, textDecoration: 'none' }}>Iniciar sesión</a>
                  <a href="/registro" style={{ display: 'block', textAlign: 'center', padding: '13px', fontSize: 15, fontWeight: 600, color: '#fff', background: '#006D77', borderRadius: 8, textDecoration: 'none' }}>Publicar gratis</a>
                </div>
              ) : null}
              {/* Idioma */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0', marginTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Idioma</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['es', 'en', 'fr'] as const).map(l => (
                    <button key={l} onClick={() => { setIdioma(l); setMobileMenuOpen(false) }} style={{ all: 'unset', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${idioma === l ? '#006D77' : '#e0e0e0'}`, color: idioma === l ? '#006D77' : '#666', background: idioma === l ? '#f0fafb' : '#fff' }}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV — BLANCO */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', height: 60, display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <a href="/" style={{ fontSize: 28, fontWeight: 700, color: '#006D77', letterSpacing: -2, marginRight: 32, textDecoration: 'none' }}>
            habitade<span style={{ color: '#17A6B4' }}>.</span>
          </a>
          <div className="nav-links" style={{ display: 'flex' }}>
          {[
            { label: 'Comprar', href: '/buscar?operacion=venta' },
            { label: 'Alquilar', href: '/buscar?operacion=alquiler' },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{ padding: '0 14px', height: 60, display: 'flex', alignItems: 'center', fontSize: 14, color: '#555', textDecoration: 'none', borderBottom: '2.5px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#006D77'; e.currentTarget.style.borderBottomColor = '#006D77' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderBottomColor = 'transparent' }}>
              {item.label}
            </a>
          ))}
          </div>
        </div>

        {/* Desktop: idioma + NavUserMenu + botones auth */}
        <div className="nav-desktop-right" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIdiomaOpen(false) }}>
            <button onClick={() => setIdiomaOpen(!idiomaOpen)} style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#555', cursor: 'pointer', padding: '5px 8px', borderRadius: 4 }}
              onMouseEnter={e => e.currentTarget.style.color = '#006D77'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}>
              {idioma.toUpperCase()}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            {idiomaOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', overflow: 'hidden', zIndex: 200, minWidth: 64 }}>
                {(['es', 'en', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => { setIdioma(l); setIdiomaOpen(false) }} style={{ all: 'unset', display: 'block', width: '100%', padding: '9px 16px', fontSize: 13, fontWeight: idioma === l ? 700 : 400, color: idioma === l ? '#006D77' : '#444', cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <NavUserMenu dark={false} />
          {authReady && !sesionActiva && <>
            <a href="/login" style={{ fontSize: 13, color: '#006D77', border: '1.5px solid #006D77', padding: '7px 18px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>{tr.nav.entrar}</a>
            <a href="/registro" style={{ fontSize: 13, color: '#fff', background: '#006D77', padding: '8px 18px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>{tr.nav.publicar}</a>
          </>}
        </div>

        {/* Móvil: hamburger */}
        <button className="nav-mobile-hamburger" onClick={() => setMobileMenuOpen(true)} style={{ display: 'none', background: 'none', cursor: 'pointer', padding: '8px', borderRadius: 6, border: '1.5px solid #e0e0e0' }}>
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><rect y="0" width="20" height="2.5" rx="1.25" fill="#006D77"/><rect y="6.5" width="20" height="2.5" rx="1.25" fill="#006D77"/><rect y="13" width="20" height="2.5" rx="1.25" fill="#006D77"/></svg>
        </button>
      </nav>

      {/* BANNER CON IMAGEN — imagen configurable desde panel de administración */}
      <div style={{ position: 'relative', minHeight: 420, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="banner-img" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,78,87,0.72)' }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: '40px 20px 36px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 600, marginBottom: 6, textAlign: 'center', letterSpacing: -0.5 }}>
            {tr.hero.titulo}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 22, textAlign: 'center' }}>
            {tr.hero.subtitulo}
          </p>
          <div className="hero-search-box" style={{ background: '#fff', borderRadius: 8, padding: '18px 18px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', gap: 0, marginBottom: 14 }}>
              {['Comprar', 'Alquilar'].map((t) => (
                <button key={t} onClick={() => setTipo(t)} style={{ flex: 1, padding: '9px', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', borderBottom: tipo === t ? '2.5px solid #006D77' : '2.5px solid #e0e0e0', background: 'transparent', color: tipo === t ? '#006D77' : '#888' }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="hero-search" style={{ display: 'flex', border: '1.5px solid #006D77', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: '#f9f9f9', borderRight: '1px solid #e0e0e0' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  value={queryHome}
                  onChange={e => handleQueryHome(e.target.value)}
                  onBlur={() => setTimeout(() => setMostrarSugHome(false), 150)}
                  placeholder={tr.hero.placeholder}
                  style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: 'none', outline: 'none', color: '#222', background: '#fff', boxSizing: 'border-box' }}
                />
                {mostrarSugHome && sugHome.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e0e0e0', borderTop: 'none', borderRadius: '0 0 6px 6px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 500 }}>
                  {sugHome.map((s: string, i: number) => (
                    <div key={i} onMouseDown={() => { const p = new URLSearchParams(); p.set('operacion', tipo === 'Alquilar' ? 'alquiler' : 'venta'); p.set('zona', s); window.location.href = `/buscar?${p.toString()}` }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 14, color: '#333', cursor: 'pointer', borderBottom: i < sugHome.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      {s}
                    </div>
                  ))}
                  </div>
                )}
              </div>{/* fin input wrapper */}
              <select value={tipoInmueble} onChange={e => setTipoInmueble(e.target.value)} style={{ padding: '0 30px 0 12px', fontSize: 13, border: 'none', borderLeft: '1px solid #e0e0e0', outline: 'none', color: '#555', background: `#f9f9f9 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E") no-repeat right 10px center`, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Villa">Villa</option>
                <option value="Oficina">Oficina</option>
                <option value="Terreno">Terreno</option>
                <option value="Local comercial">Local comercial</option>
                <option value="Edificio">Edificio</option>
              </select>
              <button onClick={() => { const p = new URLSearchParams(); p.set('operacion', tipo === 'Alquilar' ? 'alquiler' : 'venta'); if (queryHome) p.set('zona', queryHome); if (tipoInmueble) p.set('tipo', tipoInmueble); window.location.href = `/buscar?${p.toString()}` }} style={{ background: '#006D77', color: '#fff', border: 'none', padding: '0 26px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{tr.hero.buscar}</button>
            </div>{/* fin hero-search */}
          </div>{/* fin hero-search-box */}
        </div>
        </div>
      </div>

      {/* SECCIONES ACCIÓN */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div className="home-actions-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <a href="#" onClick={e => { e.preventDefault(); setVerMapa(true) }}
            style={{ display: 'flex', gap: 20, padding: '28px 32px', textDecoration: 'none', borderRight: '1px solid #e8e8e8', alignItems: 'center', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#f8fdfd'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}>
            <div style={{ width: 120, height: 86, borderRadius: 8, flexShrink: 0, overflow: 'hidden', border: '1.5px solid #c5e8ea' }}>
              <MapaMiniHome />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 5 }}>Seleccionar zonas en el mapa</div>
              <div style={{ fontSize: 13, color: '#777', lineHeight: 1.6, marginBottom: 10 }}>Busca en varias zonas a la vez seleccionándolas directamente en el mapa de República Dominicana.</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#006D77', background: '#e0f5f7', padding: '4px 12px', borderRadius: 20 }}>Explorar el mapa</span>
            </div>
          </a>
          <a href="/registro"
            style={{ display: 'flex', gap: 20, padding: '28px 32px', textDecoration: 'none', alignItems: 'center', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#f8fdfd'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}>
            <div style={{ width: 120, height: 86, borderRadius: 8, flexShrink: 0, background: '#006D77', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {featureImgUrl
                ? <img src={featureImgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <svg width="40" height="64" viewBox="0 0 44 72" fill="none">
                    <rect x="4" y="4" width="36" height="64" rx="5" fill="#fff"/>
                    <rect x="8" y="12" width="28" height="40" rx="2" fill="#e0f5f7"/>
                    <rect x="10" y="20" width="24" height="2" rx="1" fill="#006D77" opacity="0.5"/>
                    <rect x="10" y="26" width="16" height="2" rx="1" fill="#006D77" opacity="0.3"/>
                    <rect x="10" y="32" width="20" height="2" rx="1" fill="#006D77" opacity="0.3"/>
                    <circle cx="22" cy="42" r="7" fill="#006D77" opacity="0.15"/>
                    <path d="M19 42 L21 44 L26 39" stroke="#006D77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              }
              <div style={{ position: 'absolute', top: 6, right: 6, background: '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>GRATIS</div>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 5 }}>Publicar tu anuncio</div>
              <div style={{ fontSize: 13, color: '#777', lineHeight: 1.6, marginBottom: 10 }}>Tus 2 primeros anuncios son completamente gratis. Apartamentos, casas, villas, terrenos... ¡Todo cabe!</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#006D77', background: '#e0f5f7', padding: '4px 12px', borderRadius: 20 }}>Poner mi anuncio</span>
            </div>
          </a>
        </div>
      </div>

      {/* PROPIEDADES DESTACADAS */}
      <style dangerouslySetInnerHTML={{__html:`
        .sc-wrap { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .sc-wrap > a { display: block; }
        @media (max-width: 768px) {
          .sc-wrap { display: flex !important; overflow-x: auto !important; gap: 12px !important; padding-bottom: 12px !important; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; }
          .sc-wrap > a { min-width: 240px !important; max-width: 240px !important; flex-shrink: 0 !important; scroll-snap-align: start; }
        }
      `}} />
      <div style={{ background: '#f4f5f6' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 20px 0' }}>
          {/* Destacadas rotando */}
          {(() => {
            const bgs = ['#e0f5f7','#ddf0e8','#e8eaf0','#f0ebe0','#e8f0e0','#f0e8f0']
            const src = destReales.length > 0 ? destReales : propiedadesDestacadas.filter(p => p.tipo === 'pagado').map((p,i) => ({ id: i, titulo: p.title, precio: p.price, zona: p.loc, habitaciones: null, m2: null }))
            const total = src.length
            const visibles = total > 0 ? [src[slideIdx % total], src[(slideIdx+1) % total], src[(slideIdx+2) % total]].filter(Boolean) : []
            return (
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4 }}>Propiedades destacadas</h2>
                    <a href="/buscar?dest=1" style={{ fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>Ver todas las propiedades</a>
                  </div>
                </div>
                <div className="sc-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {visibles.map((p: any, i: number) => (
                    <a key={p.id} href={`/propiedad/${p.id}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '2px solid #006D77', display: 'block' }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,119,0.12)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                      <div style={{ height: 180, background: bgs[i % bgs.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {Array.isArray(p.fotos) && p.fotos.length > 0
                          ? <img src={p.fotos[0]} alt={p.titulo ?? p.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.25"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        }
                        <div style={{ position: 'absolute', top: 8, right: 8, background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, zIndex: 1 }}>DESTACADO</div>
                        <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.92)', padding: '3px 9px', borderRadius: 20, fontSize: 11, color: '#006D77', border: '1px solid #c5e8ea', zIndex: 1 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                          {(p.zona || p.loc || '').split(',')[0]}
                        </div>
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 19, fontWeight: 700, color: '#111', marginBottom: 1 }}>US$ {(p.precio ?? p.price ?? 0).toLocaleString('en-US')}</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 3 }}>{p.titulo ?? p.title}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{[p.habitaciones && `${p.habitaciones} hab`, p.m2 && `${p.m2} m²`].filter(Boolean).join(' · ') || p.feats || ''}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Más vistos */}
          {(() => {
            const bgs = ['#f0ebe0','#e8f0e0','#f0e8f0']
            const src = masVistasReales.length > 0 ? masVistasReales : propiedadesDestacadas.filter(p => p.tipo === 'visitas').map((p,i) => ({ id: i, titulo: p.title, precio: p.price, zona: p.loc, habitaciones: null, m2: null }))
            if (src.length === 0) return null
            const masTotal = src.length
            const masVisibles = [src[masIdx % masTotal], src[(masIdx+1) % masTotal], src[(masIdx+2) % masTotal]].filter(Boolean)
            return (
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4 }}>Más vistos</h2>
                    <a href="/buscar?orden=visitas" style={{ fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>Ver todas las propiedades</a>
                  </div>
                </div>
                <div className="sc-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {masVisibles.map((p: any, i: number) => (
                    <a key={p.id} href={`/propiedad/${p.id}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px solid #ebebeb', display: 'block' }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,119,0.12)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                      <div style={{ height: 180, background: bgs[i % bgs.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {Array.isArray(p.fotos) && p.fotos.length > 0
                          ? <img src={p.fotos[0]} alt={p.titulo ?? p.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.25"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        }
                        <div style={{ position: 'absolute', top: 8, right: 8, background: '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, zIndex: 1 }}>MÁS VISTO</div>
                        <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.92)', padding: '3px 9px', borderRadius: 20, fontSize: 11, color: '#006D77', border: '1px solid #c5e8ea', zIndex: 1 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                          {(p.zona || p.loc || '').split(',')[0]}
                        </div>
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 19, fontWeight: 700, color: '#111', marginBottom: 1 }}>US$ {(p.precio ?? p.price ?? 0).toLocaleString('en-US')}</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 3 }}>{p.titulo ?? p.title}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{[p.habitaciones && `${p.habitaciones} hab`, p.m2 && `${p.m2} m²`].filter(Boolean).join(' · ') || p.feats || ''}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>

        {/* NOVEDADES POR ZONA */}
        <SeccionNovedad titulo="Novedades en Santo Domingo" subtitulo="Ver todas las propiedades" zona="Santo Domingo" reales={novedadesSantoDomingo} ejemplos={propiedadesSantoDomingo} />
        <SeccionNovedad titulo="Novedades en Punta Cana" subtitulo="Ver todas las propiedades" zona="Punta Cana" reales={novedadesPuntaCana} ejemplos={propiedadesPuntaCana} />
        <SeccionNovedad titulo="Novedades en Santiago" subtitulo="Ver todas las propiedades" zona="Santiago" reales={novedadesSantiago} ejemplos={propiedadesSantiago} />
      </div>

      {/* ZONAS MÁS BUSCADAS */}
      <div style={{ background: '#fff', borderTop: '1px solid #e8e8e8', padding: '36px 20px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 20 }}>Zonas más buscadas</h2>
          <div className="zonas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {zonas.map((z) => (
              <div key={z.nombre + z.tipo} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <a href={`/buscar?zona=${encodeURIComponent(z.nombre)}`} style={{ display: 'block', fontSize: 14, color: '#006D77', fontWeight: 500, textDecoration: 'none', marginBottom: 3 }}>{z.nombre}</a>
                <div style={{ fontSize: 12, color: '#888' }}>{z.tipo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#004E57', color: 'rgba(255,255,255,0.5)', padding: '28px 20px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Logo y redes */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: -1.5 }}>
              habitade<span style={{ color: '#83D4DB' }}>.</span>
            </div>
            {/* Iconos redes sociales — enlaces se añaden desde el panel de admin */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* Instagram */}
              <a href={instagramUrl || '#'} {...(instagramUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label="Instagram" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href={facebookUrl || '#'} {...(facebookUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label="Facebook" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href={tiktokUrl || '#'} {...(tiktokUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label="TikTok" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href={whatsappUrl || '#'} {...(whatsappUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label="WhatsApp" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
          {/* Links */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Aviso legal', href: '/legal/aviso-legal' },
                { label: 'Privacidad', href: '/legal/privacidad' },
                { label: 'Cookies', href: '/legal/cookies' },
                { label: 'Publicar anuncio', href: '/panel' },
                { label: 'Planes', href: '/panel?s=plan' },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 12 }}>{label}</a>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              © 2025 habitade.com · República Dominicana
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
