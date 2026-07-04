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

const ZONAS_COORDS_HOME: Record<string, [number, number]> = {
  'piantini': [18.4890, -69.9370], 'naco': [18.4950, -69.9450], 'bella vista': [18.4760, -69.9450],
  'arroyo hondo': [18.5050, -69.9650], 'serralles': [18.4850, -69.9500], 'gazcue': [18.4720, -69.9300],
  'evaristo morales': [18.4870, -69.9420], 'la esperilla': [18.4780, -69.9330], 'miramar': [18.4800, -69.9200],
  'ciudad colonial': [18.4740, -69.8880], 'los cacicazgos': [18.4670, -69.9500],
  'los prados': [18.5000, -69.9550], 'distrito nacional': [18.4861, -69.9312],
  'santo domingo este': [18.4900, -69.8600], 'santo domingo norte': [18.5500, -69.9500],
  'santo domingo oeste': [18.4800, -70.0200], 'santo domingo': [18.4861, -69.9312],
  'boca chica': [18.4490, -69.6080],
  'punta cana': [18.5674, -68.3634], 'downtown punta cana': [18.6384, -68.3917],
  'bavaro': [18.6950, -68.4300], 'cap cana': [18.5100, -68.3900],
  'los corales': [18.6600, -68.4500], 'cabeza de toro': [18.7100, -68.4600],
  'uvero alto': [18.8100, -68.5850], 'macao': [18.7536, -68.5625],
  'cortecito': [18.7080, -68.4220], 'el cortecito': [18.7080, -68.4220],
  'higuey': [18.6142, -68.7073], 'san rafael del yuma': [18.3570, -68.5720],
  'la altagracia': [18.5654, -68.4500],
  'santiago': [19.4517, -70.6970], 'los jardines': [19.4600, -70.7100],
  'cerros de gurabo': [19.4700, -70.6500], 'reparto conuco': [19.4400, -70.6900],
  'puerto plata': [19.7950, -70.6910], 'sosua': [19.7600, -70.5200],
  'cabarete': [19.7700, -70.4100], 'costambar': [19.7900, -70.7200],
  'cofresí': [19.8100, -70.7500], 'playa dorada': [19.8100, -70.6800],
  'las terrenas': [19.3100, -69.5200], 'samana': [19.2060, -69.3360],
  'las galeras': [19.2750, -69.1900], 'el portillo': [19.3300, -69.4800],
  'coson': [19.3400, -69.4500], 'sanchez': [19.2317, -69.6088],
  'la romana': [18.4273, -68.9728], 'casa de campo': [18.4080, -68.9130],
  'bayahibe': [18.3650, -68.8280], 'dominicus': [18.3600, -68.8600],
  'jarabacoa': [19.1130, -70.6380], 'constanza': [18.9090, -70.7490], 'la vega': [19.2211, -70.5286],
  'san pedro de macoris': [18.4530, -69.3090], 'juan dolio': [18.4400, -69.5300],
  'nagua': [19.3730, -69.8470], 'bani': [18.2790, -70.3310],
  'azua': [18.4530, -70.7350], 'moca': [19.3960, -70.5150],
  'san cristobal': [18.4153, -70.1062], 'barahona': [18.2090, -71.0990],
  'pedernales': [18.0380, -71.7430], 'hato mayor': [18.7600, -69.2545],
  'miches': [18.9803, -69.0424],
}

function coordsDeZona(zona: string): [number, number] {
  if (!zona) return [18.4861, -69.9312]
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const partes = zona.split(',').map(p => norm(p.trim()))
  for (const parte of partes) {
    if (ZONAS_COORDS_HOME[parte]) return ZONAS_COORDS_HOME[parte]
  }
  const sorted = Object.entries(ZONAS_COORDS_HOME).sort((a, b) => b[0].length - a[0].length)
  const z = norm(zona)
  for (const [key, coords] of sorted) {
    if (partes[0] && partes[0].includes(norm(key))) return coords
  }
  for (const [key, coords] of sorted) {
    if (z.includes(norm(key))) return coords
  }
  return [18.4861, -69.9312]
}

function MapaCompletoPropiedades({ onCerrar }: { onCerrar: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [propiedades, setPropiedades] = useState<any[]>([])
  const { tr } = useIdioma()

  useEffect(() => {
    supabase.from('propiedades')
      .select('id,titulo,precio,zona,habitaciones,m2,tipo,operacion,fotos')
      .eq('estado', 'activo')
      .limit(300)
      .then(({ data }) => { if (data) setPropiedades(data) })
  }, [])

  const tipos = ['Todos', 'Apartamento', 'Villa', 'Casa', 'Terreno', 'Oficina', 'Local comercial']
  const tipoLabel = (t: string) => {
    if (t === 'Todos') return tr.buscar.todos
    const map: Record<string, keyof typeof tr.tipos> = { 'Apartamento': 'apartamento', 'Villa': 'villa', 'Casa': 'casa', 'Terreno': 'terreno', 'Oficina': 'oficina', 'Local comercial': 'local' }
    return tr.tipos[map[t]] || t
  }

  function actualizarMarkers(L: any, map: any, filtro: string, data: any[]) {
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []
    const filtradas = filtro === 'Todos' ? data : data.filter(p => p.tipo === filtro)
    filtradas.forEach(p => {
      const [lat, lng] = coordsDeZona(p.zona || '')
      const icono = L.divIcon({
        className: '',
        html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 19 11 19s11-11.333 11-19C22 4.925 17.075 0 11 0z" fill="#006D77" stroke="#fff" stroke-width="1.5"/><circle cx="11" cy="11" r="4.5" fill="#fff"/></svg>`,
        iconSize: [22, 30], iconAnchor: [11, 30], popupAnchor: [0, -30],
      })
      const fotos = Array.isArray(p.fotos) ? p.fotos : (typeof p.fotos === 'string' ? (() => { try { return JSON.parse(p.fotos) } catch { return [] } })() : [])
      const fotoHtml = fotos.length > 0
        ? `<img src="${fotos[0]}" style="width:100%;height:120px;object-fit:cover;border-radius:6px;margin-bottom:10px;display:block">`
        : `<div style="width:100%;height:80px;background:#e0f5f7;border-radius:6px;display:flex;align-items:center;justify-content:center;margin-bottom:10px"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006D77" stroke-width="1" opacity="0.3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`
      const marker = L.marker([lat, lng], { icon: icono }).addTo(map).bindPopup(`
        <div style="width:200px;font-family:Arial,sans-serif;padding:4px 0">
          ${fotoHtml}
          <div style="font-size:10px;color:#17A6B4;font-weight:700;letter-spacing:0.5px;margin-bottom:4px">${(p.tipo||'').toUpperCase()}</div>
          <div style="font-size:13px;font-weight:600;color:#111;margin-bottom:6px;line-height:1.35">${p.titulo||''}</div>
          <div style="font-size:18px;font-weight:700;color:#006D77;margin-bottom:2px">US$ ${(p.precio||0).toLocaleString('en-US')}</div>
          <div style="font-size:11px;color:#bbb;margin-bottom:8px">${formatDOP(p.precio||0)}</div>
          ${[p.habitaciones > 0 && `<span>${p.habitaciones} hab</span>`, p.m2 && `<span>${p.m2} m²</span>`].filter(Boolean).join('<span style="color:#ddd;margin:0 4px">·</span>')}
          <a href="/propiedad/${p.id}" style="display:block;background:#006D77;color:#fff;padding:8px;border-radius:6px;text-align:center;text-decoration:none;font-size:13px;font-weight:600;margin-top:10px">Ver propiedad</a>
        </div>
      `, { maxWidth: 240 })
      markersRef.current.push(marker)
    })
  }

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return
    const load = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return
      const map = L.map(mapRef.current, { center: [18.7357, -70.1627], zoom: 8, zoomControl: true, attributionControl: false })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map)
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
    if (!mapInstanceRef.current || propiedades.length === 0) return
    const { L, map } = mapInstanceRef.current
    actualizarMarkers(L, map, filtroTipo, propiedades)
  }, [filtroTipo, propiedades])

  const visibles = filtroTipo === 'Todos' ? propiedades.length : propiedades.filter(p => p.tipo === filtroTipo).length

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      {/* Header — una línea */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', height: 46, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
        {/* Hamburger — solo móvil vía CSS */}
        <button
          onClick={() => setMenuAbierto(o => !o)}
          className="mapa-home-burger"
          style={{ all: 'unset', display: 'none', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, cursor: 'pointer', flexShrink: 0, touchAction: 'manipulation' }}
        >
          {menuAbierto
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>

        {/* Contador */}
        <span style={{ fontSize: 12, fontWeight: 600, color: '#333', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {visibles} {tr.buscar.titulo}
        </span>

        {/* Desktop: filtro + volver */}
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="mapa-home-desk"
          style={{ border: '1.5px solid #d0d0d0', borderRadius: 4, padding: '5px 10px', fontSize: 12, color: '#333', outline: 'none', cursor: 'pointer', background: '#fff' }}
        >
          {tipos.map(t => <option key={t} value={t}>{tipoLabel(t)}</option>)}
        </select>
        <button
          onClick={onCerrar}
          className="mapa-home-desk"
          style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0, touchAction: 'manipulation' }}
        >
          {tr.buscar.volver}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <select
            value={filtroTipo}
            onChange={e => { setFiltroTipo(e.target.value); setMenuAbierto(false) }}
            style={{ border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '9px 12px', fontSize: 14, color: '#333', outline: 'none', width: '100%', background: '#fff' }}
          >
            {tipos.map(t => <option key={t} value={t}>{tipoLabel(t)}</option>)}
          </select>
          <button
            onClick={onCerrar}
            style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '10px 0', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', touchAction: 'manipulation' }}
          >
            {tr.buscar.volver}
          </button>
        </div>
      )}

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
        center: [18.85, -70.35],
        zoom: 6,
        zoomSnap: 0.5,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
      })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map)
      // Santo Domingo, Bávaro, Santiago
      [[18.4890, -69.9370], [18.6835, -68.4070], [19.4517, -70.6970]].forEach(([lat, lng]) => {
        L.divIcon && L.marker([lat, lng], { icon: L.divIcon({
          className: '',
          html: `<svg width="8" height="11" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 19 11 19s11-11.333 11-19C22 4.925 17.075 0 11 0z" fill="#006D77" stroke="#fff" stroke-width="2"/></svg>`,
          iconSize: [8, 11], iconAnchor: [4, 11],
        }) }).addTo(map)
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

const propiedadesSamana = [
  { price: 185000, title: 'Villa en Las Terrenas', feats: 'Villa · 3 hab · 180 m²', bg: '#e0f5f7' },
  { price: 95000, title: 'Casa en Las Galeras', feats: 'Casa · 2 hab · 90 m²', bg: '#ddf0e8' },
  { price: 320000, title: 'Villa en Cosón', feats: 'Villa · 4 hab · 350 m²', bg: '#f0ebe0' },
  { price: 130000, title: 'Apartamento en Samaná', feats: 'Apartamento · 3 hab · 150 m²', bg: '#e8eaf0' },
]

const zonas = [
  { nombre: 'Santo Domingo', tipo: 'Apartamentos en venta', slug: 'santo-domingo' },
  { nombre: 'Punta Cana', tipo: 'Villas en venta', slug: 'punta-cana' },
  { nombre: 'Santiago', tipo: 'Casas en venta', slug: 'santiago' },
  { nombre: 'La Romana', tipo: 'Propiedades en venta', slug: 'la-romana' },
  { nombre: 'Naco', tipo: 'Apartamentos en venta', slug: 'naco' },
  { nombre: 'Samaná', tipo: 'Villas y casas en venta', slug: 'samana' },
  { nombre: 'Bávaro', tipo: 'Apartamentos frente al mar', slug: 'bavaro' },
  { nombre: 'Cap Cana', tipo: 'Villas de lujo en venta', slug: 'cap-cana' },
  { nombre: 'Piantini', tipo: 'Apartamentos de lujo', slug: 'piantini' },
  { nombre: 'Bella Vista', tipo: 'Casas y apartamentos', slug: 'bella-vista' },
  { nombre: 'Sosúa', tipo: 'Propiedades frente al mar', slug: 'sosua' },
  { nombre: 'Cabarete', tipo: 'Casas y villas en venta', slug: 'cabarete' },
]

const bgsNovedad = ['#e0f5f7','#ddf0e8','#e8eaf0','#f0ebe0']

function SeccionNovedad({ titulo, subtitulo, reales, ejemplos, zona, href }: {
  titulo: string, subtitulo: string, zona: string, href?: string,
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
          <a href={href || `/buscar?zona=${encodeURIComponent(zona)}`} style={{ fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>{subtitulo}</a>
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
  const inputHomeRef = useRef<HTMLInputElement>(null)
  const [mostrarSugHome, setMostrarSugHome] = useState(false)
  const lsGet = (k: string) => { try { return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(k) || '[]') : [] } catch { return [] } }
  const lsGetDaily = (k: string) => { try { if (typeof window === 'undefined') return []; const raw = localStorage.getItem(k); if (!raw) return []; const { data, date } = JSON.parse(raw); return date === new Date().toDateString() ? (data || []) : [] } catch { return [] } }
  const [destReales, setDestReales] = useState<any[]>(() => lsGet('hb_dest'))
  const [masVistasReales, setMasVistasReales] = useState<any[]>(() => lsGetDaily('hb_masvistos'))
  const [slideIdx, setSlideIdx] = useState(0)
  const [novedadesSantoDomingo, setNovedadesSantoDomingo] = useState<any[]>(() => lsGet('hb_nov_sd'))
  const [novedadesPuntaCana, setNovedadesPuntaCana] = useState<any[]>(() => lsGet('hb_nov_pc'))
  const [novedadesSamana, setNovedadesSamana] = useState<any[]>(() => lsGet('hb_nov_lt'))
  const [sesionActiva, setSesionActiva] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [noLeidosNav, setNoLeidosNav] = useState(0)
  const [planUsuario, setPlanUsuario] = useState<string>('gratis')
  const [tipoUsuario, setTipoUsuario] = useState<string>('')
  const [fotoUrl, setFotoUrl] = useState<string>('')
  const [nombreUsuario, setNombreUsuario] = useState<string>('')
  const [idiomaOpen, setIdiomaOpen] = useState(false)
  const [bannerUrl, setBannerUrl] = useState(() =>
    (typeof window !== 'undefined' && localStorage.getItem('hb_banner')) ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80'
  )
  const [featureImgUrl, setFeatureImgUrl] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('hb_feature_img') || '' : '')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [faviconUrl, setFaviconUrl] = useState('')

  useEffect(() => {
    const initAuth = async (user: any) => {
      if (!user) { setAuthReady(true); setSesionActiva(false); return }
      setSesionActiva(true)
      const meta = user.user_metadata || {}
      const avatarMeta = meta.avatar_url || meta.picture || ''
      const { data: usr } = await supabase.from('usuarios').select('plan,tipo,foto_url,nombre').eq('id', user.id).single()
      if (usr?.plan) setPlanUsuario(usr.plan)
      if (usr?.tipo) setTipoUsuario(usr.tipo)
      if (usr?.nombre) setNombreUsuario(usr.nombre)
      setFotoUrl(usr?.foto_url || avatarMeta)
      const { data: msgs } = await supabase.from('mensajes').select('id').eq('vendedor_id', user.id)
      if (msgs) {
        const leidos: Record<string, boolean> = JSON.parse(localStorage.getItem(`habitade_leidos_${user.id}`) || '{}')
        setNoLeidosNav(msgs.filter((m: any) => !leidos[m.id]).length)
      }
      setAuthReady(true)
    }
    supabase.auth.getUser().then(({ data }) => initAuth(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) initAuth(session.user)
      else { setSesionActiva(false); setAuthReady(true) }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Load site config
    fetch('/api/admin/config').then(r => r.json()).then(cfg => {
      if (cfg.banner_url) { setBannerUrl(cfg.banner_url); localStorage.setItem('hb_banner', cfg.banner_url) }
      if (cfg.feature_img_url) { setFeatureImgUrl(cfg.feature_img_url); localStorage.setItem('hb_feature_img', cfg.feature_img_url) }
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
      if (dest && dest.length > 0) { setDestReales(dest); try { localStorage.setItem('hb_dest', JSON.stringify(dest)) } catch {} }
      const { data: vistas } = await supabase.from('propiedades')
        .select('id,titulo,precio,zona,habitaciones,m2,operacion,fotos').eq('estado', 'activo').order('visitas', { ascending: false }).limit(100)
      if (vistas && vistas.length > 0) { setMasVistasReales(vistas); try { localStorage.setItem('hb_masvistos', JSON.stringify({ data: vistas, date: new Date().toDateString() })) } catch {} }

      const campos = 'id,titulo,precio,zona,habitaciones,m2,tipo,operacion,fotos'
      const [{ data: sd }, { data: pc }, { data: stg }] = await Promise.all([
        supabase.from('propiedades').select(campos).eq('estado', 'activo')
          .or('zona.ilike.%Santo Domingo%,zona.ilike.%Distrito Nacional%')
          .order('created_at', { ascending: false }).limit(4),
        supabase.from('propiedades').select(campos).eq('estado', 'activo')
          .or('zona.ilike.%Punta Cana%,zona.ilike.%Bávaro%,zona.ilike.%La Altagracia%,zona.ilike.%Cap Cana%')
          .order('created_at', { ascending: false }).limit(4),
        supabase.from('propiedades').select(campos).eq('estado', 'activo')
          .or('zona.ilike.%Samaná%,zona.ilike.%Las Terrenas%,zona.ilike.%Las Galeras%,zona.ilike.%Sánchez%,zona.ilike.%El Portillo%,zona.ilike.%Cosón%,zona.ilike.%El Limón%,zona.ilike.%Santa Bárbara%')
          .order('created_at', { ascending: false }).limit(4),
      ])
      if (sd && sd.length > 0) { setNovedadesSantoDomingo(sd); try { localStorage.setItem('hb_nov_sd', JSON.stringify(sd)) } catch {} }
      if (pc && pc.length > 0) { setNovedadesPuntaCana(pc); try { localStorage.setItem('hb_nov_pc', JSON.stringify(pc)) } catch {} }
      if (stg && stg.length > 0) { setNovedadesSamana(stg); try { localStorage.setItem('hb_nov_lt', JSON.stringify(stg)) } catch {} }
    }
    cargar()
  }, [])

  useEffect(() => {
    if (destReales.length <= 3) return
    const t = setInterval(() => setSlideIdx(i => (i + 1) % destReales.length), 4000)
    return () => clearInterval(t)
  }, [destReales.length])

  const getDailyMasVistos = (pool: any[]) => {
    if (pool.length === 0) return []
    const seed = new Date().toDateString().split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const start = seed % pool.length
    const picks: any[] = []
    for (let i = 0; picks.length < 3 && i < pool.length; i++) {
      picks.push(pool[(start + i) % pool.length])
    }
    return picks
  }

  const zonasRD = ['Piantini, Distrito Nacional', 'Naco, Distrito Nacional', 'Serrallés, Distrito Nacional', 'Bella Vista, Distrito Nacional', 'Arroyo Hondo, Distrito Nacional', 'Los Cacicazgos, Distrito Nacional', 'Gazcue, Distrito Nacional', 'Ciudad Colonial, Distrito Nacional', 'Evaristo Morales, Distrito Nacional', 'Miramar, Distrito Nacional', 'La Esperilla, Distrito Nacional', 'Urbanización Real, Distrito Nacional', 'Viejo Arroyo Hondo, Distrito Nacional', 'Los Prados, Distrito Nacional', 'Jardines del Norte, Distrito Nacional', 'Ensanche Naco, Distrito Nacional', 'Ensanche Ozama, Distrito Nacional', 'Villa Consuelo, Distrito Nacional', 'Cristo Rey, Distrito Nacional', 'Alma Rosa, Santo Domingo Este', 'Los Tres Brazos, Santo Domingo Este', 'Ensanche Isabelita, Santo Domingo Este', 'San Isidro, Santo Domingo Este', 'Los Mina, Santo Domingo Este', 'Bávaro, La Altagracia', 'Punta Cana, La Altagracia', 'Downtown Punta Cana, La Altagracia', 'Cap Cana, La Altagracia', 'Cabeza de Toro, La Altagracia', 'Los Corales, La Altagracia', 'Uvero Alto, La Altagracia', 'Macao, La Altagracia', 'Cortecito, La Altagracia', 'El Cortecito, La Altagracia', 'Higüey, La Altagracia', 'San Rafael del Yuma, La Altagracia', 'Los Jardines, Santiago', 'Cerros de Gurabo, Santiago', 'Reparto Conuco, Santiago', 'Bella Vista, Santiago', 'Villa Olga, Santiago', 'Pontezuela, Santiago', 'Urbanización Tropical, Santiago', 'Las Colinas, Santiago', 'El Dorado, Santiago', 'Las Terrenas, Samaná', 'Samaná', 'El Portillo, Samaná', 'Cosón, Samaná', 'Las Galeras, Samaná', 'El Limón, Samaná', 'Rancho Español, Samaná', 'Puerto Plata', 'Sosúa, Puerto Plata', 'Cabarete, Puerto Plata', 'Costámbar, Puerto Plata', 'Cofresí, Puerto Plata', 'Playa Dorada, Puerto Plata', 'La Romana', 'Casa de Campo, La Romana', 'Bayahíbe, La Altagracia', 'Dominicus, La Altagracia', 'Jarabacoa, La Vega', 'Constanza, La Vega', 'La Vega', 'San Pedro de Macorís', 'Juan Dolio, San Pedro de Macorís', 'Guayacanes, San Pedro de Macorís', 'Boca Chica, Santo Domingo', 'Andrés, Boca Chica', 'San Cristóbal', 'Baní, Peravia', 'Azua', 'Barahona', 'Monte Plata', 'Hato Mayor', 'El Seibo', 'Miches, El Seibo', 'Moca, Espaillat', 'San Francisco de Macorís, Duarte', 'Nagua, María Trinidad Sánchez', 'Monte Cristi', 'Dajabón', 'Pedernales', 'Neiba, Baoruco', 'San Juan de la Maguana']
  const PROVINCIAS_LIST = ['Punta Cana', 'La Altagracia', 'Bávaro', 'Distrito Nacional', 'Santo Domingo', 'Santiago', 'Puerto Plata', 'Samaná', 'Las Terrenas', 'La Romana', 'San Pedro de Macorís', 'La Vega', 'María Trinidad Sánchez', 'El Seibo', 'Hato Mayor', 'San Cristóbal', 'Peravia', 'Espaillat', 'Duarte', 'Monseñor Nouel', 'Valverde', 'Monte Cristi', 'Dajabón', 'Azua', 'Barahona', 'Pedernales']
  const PROVINCIAS_SET = new Set(PROVINCIAS_LIST)
  const handleQueryHome = (val: string) => {
    setQueryHome(val)
    if (val.length >= 2) {
      const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      const nv = norm(val)
      const prov = PROVINCIAS_LIST.filter(p => norm(p).includes(nv)).slice(0, 3)
      const zonas = zonasRD.filter(z => norm(z).includes(nv) && !PROVINCIAS_SET.has(z)).slice(0, 5)
      setSugHome([...prov, ...zonas])
      setMostrarSugHome(true)
    } else {
      setSugHome([])
      setMostrarSugHome(false)
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6' }}>
      {verMapa && <MapaCompletoPropiedades onCerrar={() => setVerMapa(false)} />}

      {/* MENÚ MÓVIL DROPDOWN */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.25)' }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 60, left: 0, right: 0, background: '#fff', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', borderRadius: '0 0 16px 16px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

            {authReady && sesionActiva ? (<>
              {/* Mi cuenta */}
              <div style={{ padding: '4px 0' }}>
                <div style={{ padding: '10px 20px 4px', fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1 }}>{tr.nav.miCuenta}</div>
                {[
                  { label: tr.panel.menu.miPanel, href: '/panel', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
                  { label: tr.panel.menu.anuncios, href: '/panel?s=anuncios',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                  { label: tr.panel.menu.mensajes,     href: '/panel?s=mensajes',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, badge: noLeidosNav },
                  { label: tr.panel.menu.guardados,    href: '/panel?s=guardados', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
                  { label: tr.panel.menu.perfil,    href: '/panel?s=perfil',    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                ].map(item => (
                  <a key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontSize: 14, color: '#333', textDecoration: 'none' }}>
                    <span style={{ color: '#888', display: 'flex', position: 'relative' }}>
                      {item.icon}
                      {(item as any).badge > 0 && <span style={{ position: 'absolute', top: -4, right: -5, width: 8, height: 8, background: '#e63946', borderRadius: '50%', border: '1.5px solid #fff' }} />}
                    </span>
                    {item.label}
                    {(item as any).badge > 0 && <span style={{ marginLeft: 'auto', background: '#e63946', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px', minWidth: 16, textAlign: 'center' }}>{(item as any).badge}</span>}
                  </a>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', padding: '4px 0 6px' }}>
                <button onClick={async () => { const { supabase: sb } = await import('../supabase'); await sb.auth.signOut(); window.location.href = '/' }} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', fontSize: 14, color: '#e63946', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  {tr.nav.cerrarSesion}
                </button>
              </div>
            </>) : authReady ? (
              <div style={{ borderTop: '1px solid #f0f0f0', padding: '14px 20px', display: 'flex', gap: 10 }}>
                <a href="/login" style={{ flex: 1, display: 'block', textAlign: 'center', padding: '11px', fontSize: 14, fontWeight: 600, color: '#006D77', border: '1.5px solid #006D77', borderRadius: 8, textDecoration: 'none' }}>{tr.nav.entrar}</a>
                <a href="/registro" style={{ flex: 1, display: 'block', textAlign: 'center', padding: '11px', fontSize: 14, fontWeight: 600, color: '#fff', background: '#006D77', borderRadius: 8, textDecoration: 'none' }}>{tr.nav.publicar}</a>
              </div>
            ) : null}

            {/* Idioma */}
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 20px 16px', display: 'flex', gap: 0, background: '#fafafa' }}>
              <div style={{ display: 'flex', background: '#efefef', borderRadius: 8, overflow: 'hidden', padding: 3, gap: 2 }}>
                {(['es', 'en', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => { setIdioma(l); setMobileMenuOpen(false) }} style={{ border: 'none', outline: 'none', padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: idioma === l ? '#fff' : 'transparent', color: idioma === l ? '#006D77' : '#999', boxShadow: idioma === l ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'background 0.15s, color 0.15s, box-shadow 0.15s', touchAction: 'manipulation', userSelect: 'none' }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* NAV — BLANCO */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', height: 60, display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <a href="/" style={{ fontSize: 28, fontWeight: 700, color: '#006D77', letterSpacing: -2, marginRight: 32, textDecoration: 'none' }}>
            habitade.
          </a>
          <div className="nav-links" style={{ display: 'flex' }}>
          {[
            { label: tr.nav.comprar, href: '/buscar?operacion=venta' },
            { label: tr.nav.alquilar, href: '/buscar?operacion=alquiler' },
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
            <button onClick={() => setIdiomaOpen(!idiomaOpen)} style={{ border: 'none', outline: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#555', cursor: 'pointer', padding: '5px 8px', borderRadius: 4, touchAction: 'manipulation', userSelect: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#006D77'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}>
              {idioma.toUpperCase()}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            {idiomaOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', overflow: 'hidden', zIndex: 200, minWidth: 64 }}>
                {(['es', 'en', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => { setIdioma(l); setIdiomaOpen(false) }} style={{ border: 'none', outline: 'none', background: 'transparent', display: 'block', width: '100%', padding: '9px 16px', fontSize: 13, fontWeight: idioma === l ? 700 : 400, color: idioma === l ? '#006D77' : '#444', cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box', touchAction: 'manipulation', userSelect: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          {sesionActiva && <NavUserMenu dark={false} />}
          {authReady && !sesionActiva && <>
            <a href="/login" style={{ fontSize: 13, color: '#006D77', border: '1.5px solid #006D77', padding: '7px 18px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>{tr.nav.entrar}</a>
            <a href="/registro" style={{ fontSize: 13, color: '#fff', background: '#006D77', padding: '8px 18px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>{tr.nav.publicar}</a>
          </>}
        </div>

        {/* Móvil: hamburger con avatar */}
        {(() => {
          const ini = nombreUsuario.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('')
          return (
            <button className="nav-mobile-hamburger" onClick={() => setMobileMenuOpen(true)} style={{ display: 'none', background: 'none', cursor: 'pointer', padding: 0, border: 'none', touchAction: 'manipulation' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1.5px solid #e0e0e0', borderRadius: 20, padding: '4px 10px 4px 4px', background: '#fafafa' }}>
                {sesionActiva ? (
                  fotoUrl
                    ? <img src={fotoUrl} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} referrerPolicy="no-referrer" />
                    : <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#006D77', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: ini.length > 1 ? 10 : 12, fontWeight: 700, letterSpacing: -0.5, flexShrink: 0 }}>{ini || 'U'}</div>
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                )}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M0 1h16M0 6h16M0 11h16" stroke="#555" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
            </button>
          )
        })()}
      </nav>

      {/* BANNER CON IMAGEN — imagen configurable desde panel de administración */}
      <div className="home-banner" style={{ position: 'relative', minHeight: 420, display: 'flex', alignItems: 'center', zIndex: 10 }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div className="banner-img" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,78,87,0.72)' }} />
        <div style={{ position: 'relative', zIndex: 50, width: '100%', padding: '40px 20px 36px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 className="home-hero-h1" style={{ color: '#fff', fontSize: 26, fontWeight: 600, marginBottom: 6, textAlign: 'center', letterSpacing: -0.5 }}>
            {tr.hero.titulo}
          </h1>
          <p className="home-hero-sub" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 22, textAlign: 'center' }}>
            {tr.hero.subtitulo}
          </p>
          <div className="hero-search-box" style={{ background: '#fff', borderRadius: 8, padding: '18px 18px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', gap: 0, marginBottom: 14 }}>
              {[{ key: 'Comprar', label: tr.nav.comprar }, { key: 'Alquilar', label: tr.nav.alquilar }].map(({ key, label }) => (
                <button key={key} onClick={() => setTipo(key)} style={{ flex: 1, padding: '9px', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', borderBottom: tipo === key ? '2.5px solid #006D77' : '2.5px solid #e0e0e0', background: 'transparent', color: tipo === key ? '#006D77' : '#888' }}>
                  {label}
                </button>
              ))}
            </div>
            <div className="hero-search" style={{ display: 'flex', border: '1.5px solid #006D77', borderRadius: 4, position: 'relative', overflow: 'visible' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: '#f9f9f9', borderRight: '1px solid #e0e0e0', borderRadius: '4px 0 0 4px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <input
                  ref={inputHomeRef}
                  type="text"
                  value={queryHome}
                  onChange={e => handleQueryHome(e.target.value)}
                  onBlur={() => setTimeout(() => setMostrarSugHome(false), 200)}
                  placeholder={tr.hero.placeholder}
                  style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: 'none', outline: 'none', color: '#222', background: '#fff', boxSizing: 'border-box' }}
                />
                {mostrarSugHome && sugHome.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '0 0 8px 8px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', zIndex: 9999, maxHeight: 280, overflowY: 'auto' }}>
                    {sugHome.map((s: string, i: number) => (
                      <div key={i}
                        onMouseDown={e => { e.preventDefault(); const p = new URLSearchParams(); p.set('operacion', tipo === 'Alquilar' ? 'alquiler' : 'venta'); p.set('zona', s); window.location.href = `/buscar?${p.toString()}` }}
                        onTouchEnd={e => { e.preventDefault(); const p = new URLSearchParams(); p.set('operacion', tipo === 'Alquilar' ? 'alquiler' : 'venta'); p.set('zona', s); window.location.href = `/buscar?${p.toString()}` }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', fontSize: 14, color: '#333', cursor: 'pointer', borderBottom: i < sugHome.length - 1 ? '1px solid #f5f5f5' : 'none' }}
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
                <option value="Apartamento">{tr.tipos.apartamento}</option>
                <option value="Casa">{tr.tipos.casa}</option>
                <option value="Villa">{tr.tipos.villa}</option>
                <option value="Oficina">{tr.tipos.oficina}</option>
                <option value="Terreno">{tr.tipos.terreno}</option>
                <option value="Local comercial">{tr.tipos.local}</option>
                <option value="Edificio">{tr.tipos.edificio}</option>
              </select>
              <button onClick={() => { const p = new URLSearchParams(); p.set('operacion', tipo === 'Alquilar' ? 'alquiler' : 'venta'); if (queryHome) p.set('zona', queryHome); if (tipoInmueble) p.set('tipo', tipoInmueble); window.location.href = `/buscar?${p.toString()}` }} style={{ background: '#006D77', color: '#fff', border: 'none', padding: '0 26px', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: '0 4px 4px 0' }}>{tr.hero.buscar}</button>
            </div>{/* fin hero-search */}
          </div>{/* fin hero-search-box */}
        </div>
        </div>
      </div>

      {/* SECCIONES ACCIÓN — isolation:isolate contiene compositing layers de Leaflet */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', position: 'relative', zIndex: 0, isolation: 'isolate' }}>
        <div className="home-actions-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <a href="#" onClick={e => { e.preventDefault(); setVerMapa(true) }}
            style={{ display: 'flex', gap: 20, padding: '28px 32px', textDecoration: 'none', borderRight: '1px solid #e8e8e8', alignItems: 'stretch', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#f8fdfd'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}>
            <div style={{ width: 120, height: 90, borderRadius: 8, flexShrink: 0, overflow: 'hidden', border: '1.5px solid #c5e8ea' }}>
              <MapaMiniHome />
            </div>
            <div style={{ height: 90, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 4 }}>{tr.secciones.mapaTitle}</div>
                <div style={{ fontSize: 12.5, color: '#777', lineHeight: 1.5 }}>{tr.secciones.mapaDesc}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#006D77', background: '#e0f5f7', padding: '4px 12px', borderRadius: 20, alignSelf: 'flex-start' }}>{tr.secciones.mapaLink}</span>
            </div>
          </a>
          <a href="/registro"
            style={{ display: 'flex', gap: 20, padding: '28px 32px', textDecoration: 'none', alignItems: 'stretch', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#f8fdfd'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}>
            <div style={{ width: 120, height: 90, borderRadius: 8, flexShrink: 0, background: '#006D77', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
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
              <div style={{ position: 'absolute', top: 6, right: 6, background: '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>{tr.destacadas.gratis}</div>
            </div>
            <div style={{ height: 90, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 4 }}>{tr.secciones.publicarTitle}</div>
                <div style={{ fontSize: 12.5, color: '#777', lineHeight: 1.5 }}>{tr.secciones.publicarDesc}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#006D77', background: '#e0f5f7', padding: '4px 12px', borderRadius: 20, alignSelf: 'flex-start' }}>{tr.secciones.publicarLink}</span>
            </div>
          </a>
        </div>
      </div>

      {/* PROPIEDADES DESTACADAS */}
      <style dangerouslySetInnerHTML={{__html:`
        .sc-wrap { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .sc-wrap > a { display: block; }
      `}} />
      <div style={{ background: '#f4f5f6' }}>
        <div className="home-props-wrap" style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 20px 0' }}>
          {/* Destacadas rotando */}
          {(() => {
            const bgs = ['#e0f5f7','#ddf0e8','#e8eaf0','#f0ebe0','#e8f0e0','#f0e8f0']
            const src = destReales.length > 0 ? destReales : propiedadesDestacadas.filter(p => p.tipo === 'pagado').map((p,i) => ({ id: i, titulo: p.title, precio: p.price, zona: p.loc, habitaciones: null, m2: null }))
            const total = src.length
            const visibles = total > 0 ? [src[slideIdx % total], src[(slideIdx+1) % total], src[(slideIdx+2) % total]].filter(Boolean) : []
            return (
              <div className="home-cards-section" style={{ marginBottom: 32 }}>
                <div className="home-section-hdr" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4 }}>{tr.destacadas.titulo}</h2>
                    <a href="/buscar?dest=1" className="home-ver-top" style={{ fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>{tr.destacadas.verTodas}</a>
                  </div>
                </div>
                <div className="sc-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {visibles.map((p: any, i: number) => (
                    <a key={p.id} href={`/propiedad/${p.id}`} className="home-prop-card" style={{ textDecoration: 'none', background: '#fff', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '2px solid #006D77', display: 'block' }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,119,0.12)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                      <div className="home-prop-card-img" style={{ height: 180, background: bgs[i % bgs.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {Array.isArray(p.fotos) && p.fotos.length > 0
                          ? <img src={p.fotos[0]} alt={p.titulo ?? p.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.25"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        }
                        <div style={{ position: 'absolute', top: 8, right: 8, background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, zIndex: 1 }}>{tr.destacadas.destacado}</div>
                      </div>
                      <div className="home-prop-card-body" style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 19, fontWeight: 700, color: '#111', marginBottom: 1 }}>US$ {(p.precio ?? p.price ?? 0).toLocaleString('en-US')}</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 3 }}>{p.titulo ?? p.title}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{[p.habitaciones && `${p.habitaciones} hab`, p.m2 && `${p.m2} m²`].filter(Boolean).join(' · ') || p.feats || ''}</div>
                        <div className="home-prop-card-zona" style={{ display: 'none' }}>{(p.zona || p.loc || '').split(',')[0]}</div>
                      </div>
                    </a>
                  ))}
                </div>
                <a href="/buscar?dest=1" className="home-ver-bottom" style={{ display: 'none', fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>{tr.destacadas.verTodas}</a>
              </div>
            )
          })()}

          {/* Más vistos */}
          {(() => {
            const bgs = ['#f0ebe0','#e8f0e0','#f0e8f0']
            const pool = masVistasReales.length > 0 ? masVistasReales : propiedadesDestacadas.filter(p => p.tipo === 'visitas').map((p,i) => ({ id: i, titulo: p.title, precio: p.price, zona: p.loc, habitaciones: null, m2: null }))
            if (pool.length === 0) return null
            const masVisibles = masVistasReales.length > 0 ? getDailyMasVistos(pool) : pool.slice(0, 3)
            return (
              <div className="home-cards-section" style={{ marginBottom: 32 }}>
                <div className="home-section-hdr" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4 }}>{tr.destacadas.masVistos}</h2>
                    <a href="/buscar?orden=visitas" className="home-ver-top" style={{ fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>{tr.destacadas.verTodas}</a>
                  </div>
                </div>
                <div className="sc-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {masVisibles.map((p: any, i: number) => (
                    <a key={p.id} href={`/propiedad/${p.id}`} className="home-prop-card" style={{ textDecoration: 'none', background: '#fff', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px solid #ebebeb', display: 'block' }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,119,0.12)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                      <div className="home-prop-card-img" style={{ height: 180, background: bgs[i % bgs.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {Array.isArray(p.fotos) && p.fotos.length > 0
                          ? <img src={p.fotos[0]} alt={p.titulo ?? p.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.25"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        }
                        <div style={{ position: 'absolute', top: 8, right: 8, background: '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, zIndex: 1 }}>{tr.destacadas.masVisto}</div>
                      </div>
                      <div className="home-prop-card-body" style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 19, fontWeight: 700, color: '#111', marginBottom: 1 }}>US$ {(p.precio ?? p.price ?? 0).toLocaleString('en-US')}</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 3 }}>{p.titulo ?? p.title}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{[p.habitaciones && `${p.habitaciones} hab`, p.m2 && `${p.m2} m²`].filter(Boolean).join(' · ') || p.feats || ''}</div>
                        <div className="home-prop-card-zona" style={{ display: 'none' }}>{(p.zona || p.loc || '').split(',')[0]}</div>
                      </div>
                    </a>
                  ))}
                </div>
                <a href="/buscar?orden=visitas" className="home-ver-bottom" style={{ display: 'none', fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>{tr.destacadas.verTodas}</a>
              </div>
            )
          })()}
        </div>

        {/* NOVEDADES POR ZONA */}
        <SeccionNovedad titulo={tr.novedades.santoDomingo} subtitulo={tr.novedades.verTodas} zona="Santo Domingo" reales={novedadesSantoDomingo} ejemplos={propiedadesSantoDomingo} />
        <SeccionNovedad titulo={tr.novedades.puntaCana} subtitulo={tr.novedades.verTodas} zona="Punta Cana" reales={novedadesPuntaCana} ejemplos={propiedadesPuntaCana} />
        <SeccionNovedad titulo={tr.novedades.samana} subtitulo={tr.novedades.verTodas} zona="Samaná" reales={novedadesSamana} ejemplos={propiedadesSamana} />
      </div>

      {/* ZONAS MÁS BUSCADAS */}
      <div className="home-zonas-section" style={{ background: '#fff', borderTop: '1px solid #e8e8e8', padding: '36px 20px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 20 }}>{tr.zonas.titulo}</h2>
          <div className="zonas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {zonas.map((z) => (
              <div key={z.nombre + z.tipo} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <a href={`/buscar?zona=${encodeURIComponent(z.nombre)}&operacion=venta`} style={{ display: 'block', fontSize: 14, color: '#006D77', fontWeight: 500, textDecoration: 'none', marginBottom: 3 }}>{z.nombre}</a>
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
              habitade.
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
            </div>
          </div>
          {/* Links */}
          <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: tr.footer.avisoLegal, href: '/legal/aviso-legal' },
                { label: tr.footer.privacidad, href: '/legal/privacidad' },
                { label: tr.footer.cookies, href: '/legal/cookies' },
                { label: tr.footer.publicar, href: '/panel' },
                { label: tr.footer.planes, href: '/panel?s=plan' },
              ].map(({ label, href }) => (
                <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 12 }}>{label}</a>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {tr.footer.derechos}
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
