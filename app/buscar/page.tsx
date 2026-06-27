'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../supabase'
import { useIdioma } from '../../IdiomaContext'
import NavUserMenu from '../../components/NavUserMenu'

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
const ZONAS_COORDS: Record<string, [number, number]> = {
  // Distrito Nacional
  'piantini': [18.4890, -69.9370], 'naco': [18.4950, -69.9450], 'bella vista': [18.4760, -69.9450],
  'arroyo hondo': [18.5050, -69.9650], 'serralles': [18.4850, -69.9500], 'gazcue': [18.4720, -69.9300],
  'evaristo morales': [18.4870, -69.9420], 'la esperilla': [18.4780, -69.9330], 'miramar': [18.4800, -69.9200],
  'ciudad colonial': [18.4740, -69.8880], 'los cacicazgos': [18.4670, -69.9500], 'mirador norte': [18.5100, -69.9400],
  'los prados': [18.5000, -69.9550], 'fernandez': [18.5020, -69.9460], 'reparto paraiso': [18.4600, -69.9650],
  'distrito nacional': [18.4861, -69.9312], 'santo domingo este': [18.4900, -69.8600], 'santo domingo norte': [18.5500, -69.9500],
  'santo domingo oeste': [18.4800, -70.0200], 'santo domingo': [18.4861, -69.9312],
  'boca chica': [18.4490, -69.6080],
  // La Altagracia
  'punta cana': [18.5674, -68.3634], 'downtown punta cana': [18.638436, -68.391718], 'bavaro': [18.6835, -68.4100], 'cap cana': [18.5100, -68.4400],
  'los corales': [18.6600, -68.4500], 'cabeza de toro': [18.7100, -68.4600], 'uvero alto': [18.7800, -68.3800],
  'macao': [18.7536, -68.5625], 'cortecito': [18.7080, -68.4220], 'el cortecito': [18.7080, -68.4220],
  'higuey': [18.6142, -68.7073], 'san rafael del yuma': [18.3570, -68.5720], 'boca de yuma': [18.3230, -68.6210],
  'la altagracia': [18.5654, -68.4500],
  // Santiago
  'santiago': [19.4517, -70.6970], 'los jardines': [19.4600, -70.7100], 'cerros de gurabo': [19.4700, -70.6500],
  'reparto conuco': [19.4400, -70.6900], 'villa progreso': [19.4550, -70.6600],
  // Puerto Plata
  'puerto plata': [19.7950, -70.6910], 'sosua': [19.7600, -70.5200], 'cabarete': [19.7700, -70.4100],
  'costambar': [19.7900, -70.7200], 'cofresí': [19.8100, -70.7500], 'playa dorada': [19.8100, -70.6800],
  'luperon': [19.8977, -70.9480], 'villa isabela': [19.8400, -71.0700], 'la isabela': [19.8400, -71.0700],
  // Samaná
  'las terrenas': [19.3100, -69.5200], 'samana': [19.2060, -69.3360], 'las galeras': [19.2320, -69.2200],
  'el portillo': [19.3300, -69.4800], 'coson': [19.3400, -69.4500], 'sanchez': [19.2317, -69.6088],
  'el limon': [19.2750, -69.4800], 'rancho espanol': [19.2514, -69.4548],
  // La Romana
  'la romana': [18.4273, -68.9728], 'casa de campo': [18.4080, -68.9130],
  'bayahibe': [18.3650, -68.8280], 'dominicus': [18.3600, -68.8600],
  // La Vega
  'jarabacoa': [19.1130, -70.6380], 'constanza': [18.9090, -70.7490], 'la vega': [19.2211, -70.5286],
  // San Pedro de Macorís
  'san pedro de macoris': [18.4530, -69.3090], 'juan dolio': [18.4400, -69.5300], 'guayacanes': [18.4350, -69.5700],
  // María Trinidad Sánchez
  'nagua': [19.3730, -69.8470], 'rio san juan': [19.6310, -70.0760],
  // Otros
  'bani': [18.2790, -70.3310], 'azua': [18.4530, -70.7350], 'moca': [19.3960, -70.5150],
  'san cristobal': [18.4153, -70.1062], 'san francisco de macoris': [19.3011, -70.2527],
  'monte cristi': [19.8674, -71.6500], 'barahona': [18.2090, -71.0990], 'pedernales': [18.0380, -71.7430],
  'bonao': [18.9415, -70.4081], 'hato mayor': [18.7600, -69.2545], 'el seibo': [18.7656, -69.0367],
  'miches': [18.9803, -69.0424], 'sabana de la mar': [19.0563, -69.3870],
  'mao': [19.5543, -71.0763], 'dajabon': [19.5492, -71.7082],
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function matchZona(zona: string): [number, number] | null {
  if (!zona) return null
  // Intenta primero el sector (antes de la coma), luego la zona completa
  const partes = zona.split(',').map(p => normalize(p.trim()))
  for (const parte of partes) {
    const exact = ZONAS_COORDS[parte as keyof typeof ZONAS_COORDS]
    if (exact) return exact
  }
  // Fallback: substring por longitud descendente
  const sorted = Object.entries(ZONAS_COORDS).sort((a, b) => b[0].length - a[0].length)
  const z = normalize(zona)
  for (const [key, coords] of sorted) {
    if (partes[0] && partes[0].includes(normalize(key))) return coords
  }
  for (const [key, coords] of sorted) {
    if (z.includes(normalize(key))) return coords
  }
  return null
}

function getLatLngFromZona(zona: string): [number, number] {
  return matchZona(zona) ?? [18.4861, -69.9312]
}

function getZonaCoords(zona: string): { center: [number, number], zoom: number } {
  if (!zona) return { center: [18.735, -70.165], zoom: 7 }
  const coords = matchZona(zona)
  return coords ? { center: coords, zoom: 11 } : { center: [18.735, -70.165], zoom: 7 }
}

function MapaMini({ zona }: { zona: string }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const { center, zoom } = getZonaCoords(zona)

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
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      if (zona) {
        const icono = L.divIcon({
          className: '',
          html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 19 11 19s11-11.333 11-19C22 4.925 17.075 0 11 0z" fill="#006D77" stroke="#fff" stroke-width="1.5"/><circle cx="11" cy="11" r="4.5" fill="#fff"/></svg>`,
          iconSize: [22, 30], iconAnchor: [11, 30],
        })
        L.marker(center, { icon: icono }).addTo(map)
      }
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
function MapaCompleto({ propiedades, onCerrar }: { propiedades: any[], onCerrar: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return
    const load = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return
      const map = L.map(mapRef.current, {
        center: [18.735, -70.165],
        zoom: 8,
        zoomControl: true,
        attributionControl: false,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

      const marcadores: any[] = []
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
        const m = L.marker([p.lat, p.lng], { icon: icono }).addTo(map)
        m.bindPopup(`
          <div style="min-width:200px;font-family:sans-serif;">
            <div style="font-size:13px;font-weight:600;color:#006D77;margin-bottom:4px;">${p.titulo}</div>
            <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:2px;">US$ ${p.precio.toLocaleString('en-US')}</div>
            <div style="font-size:11px;color:#aaa;margin-bottom:6px;">${formatDOP(p.precio)}</div>
            <div style="font-size:12px;color:#555;margin-bottom:8px;">${p.hab > 0 ? p.hab + ' hab · ' : ''}${p.m2 > 0 ? p.m2 + ' m²' : ''}${p.banos > 0 ? ' · ' + p.banos + ' baños' : ''}</div>
            <a href="/propiedad/${p.id}" style="display:inline-block;margin-top:6px;font-size:12px;color:#fff;background:#006D77;padding:4px 10px;border-radius:3px;text-decoration:none;">Ver propiedad</a>
          </div>
        `)
        marcadores.push(m)
      })
      if (marcadores.length > 0) {
        const grupo = L.featureGroup(marcadores)
        map.fitBounds(grupo.getBounds().pad(0.3), { maxZoom: 14 })
      }
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

// Grupos de búsqueda amplia (clave normalizada sin acentos) → sectores que engloba
const gruposZona: Record<string, string[]> = {
  // Zonas turísticas
  'punta cana':            ['Bávaro', 'Punta Cana', 'Downtown Punta Cana', 'Cap Cana', 'Los Corales', 'Cabeza de Toro', 'Uvero Alto', 'Macao', 'Cortecito', 'Verón', 'Pueblo Bávaro', 'Bávaro Hills', 'Arena Gorda'],
  'bavaro':                ['Bávaro', 'Pueblo Bávaro', 'Cortecito', 'Los Corales', 'Cabeza de Toro', 'Arena Gorda', 'Bávaro Hills'],
  'las terrenas':          ['Las Terrenas', 'El Portillo', 'Cosón'],
  'costa norte':           ['Sosúa', 'Cabarete', 'Costámbar', 'Cofresí', 'Playa Dorada', 'Puerto Plata', 'La Isabela'],
  // Provincias (clave sin acentos)
  'distrito nacional':     ['Piantini', 'Naco', 'Serrallés', 'Bella Vista', 'Arroyo Hondo', 'Evaristo Morales', 'Los Cacicazgos', 'Gazcue', 'Ciudad Colonial', 'Miramar', 'La Esperilla', 'Distrito Nacional', 'Quisqueya', 'Mirador Norte', 'Mirador Sur', 'Altos de Arroyo Hondo', 'Los Prados', 'Fernández'],
  'santo domingo':         ['Santo Domingo', 'Piantini', 'Naco', 'Serrallés', 'Bella Vista', 'Arroyo Hondo', 'Evaristo Morales', 'Los Cacicazgos', 'Gazcue', 'Ciudad Colonial', 'Miramar', 'La Esperilla', 'Distrito Nacional', 'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste', 'Boca Chica'],
  'la altagracia':         ['La Altagracia', 'Bávaro', 'Punta Cana', 'Downtown Punta Cana', 'Cap Cana', 'Los Corales', 'Cabeza de Toro', 'Uvero Alto', 'Macao', 'Cortecito', 'Higüey', 'San Rafael del Yuma', 'Boca de Yuma', 'Verón', 'Pueblo Bávaro', 'Arena Gorda'],
  'santiago':              ['Santiago', 'Los Jardines', 'Cerros de Gurabo', 'Reparto Conuco', 'Villa Olga', 'Pontificia', 'Nibaje'],
  'puerto plata':          ['Puerto Plata', 'Sosúa', 'Cabarete', 'Costámbar', 'Cofresí', 'Playa Dorada', 'Luperón', 'Villa Isabela', 'La Isabela'],
  'samana':                ['Samaná', 'Las Terrenas', 'Las Galeras', 'Sánchez', 'El Portillo', 'Cosón', 'El Limón', 'Rancho Español'],
  'el limon':              ['El Limón', 'El Limon'],
  'rancho espanol':        ['Rancho Español', 'Rancho Espanol'],
  'la romana':             ['La Romana', 'Casa de Campo', 'Bayahibe', 'Dominicus'],
  'san pedro de macoris':  ['San Pedro de Macorís', 'Juan Dolio', 'Guayacanes'],
  'la vega':               ['La Vega', 'Jarabacoa', 'Constanza'],
  'maria trinidad sanchez':['Nagua', 'Río San Juan', 'María Trinidad Sánchez'],
  'el seibo':              ['El Seibo', 'Miches'],
  'hato mayor':            ['Hato Mayor', 'Sabana de la Mar'],
  'san cristobal':         ['San Cristóbal'],
  'peravia':               ['Baní', 'Peravia'],
  'espaillat':             ['Moca', 'Espaillat'],
  'duarte':                ['San Francisco de Macorís', 'Duarte'],
  'monsenor nouel':        ['Bonao', 'Monseñor Nouel'],
  'valverde':              ['Mao', 'Valverde'],
  'monte cristi':          ['Monte Cristi'],
  'dajabon':               ['Dajabón'],
  'azua':                  ['Azua'],
  'barahona':              ['Barahona'],
  'pedernales':            ['Pedernales'],
}

// Devuelve los sectores que engloba un término, o null si no aplica
function expandirGrupo(q: string): string[] | null {
  const n = normalize(q)
  for (const [key, zonas] of Object.entries(gruposZona)) {
    if (n === key || n.startsWith(key) || key.startsWith(n)) return zonas
  }
  return null
}

const zonasSugerencias = [
  // --- Búsqueda por provincia o zona turística ---
  'Punta Cana', 'La Altagracia', 'Bávaro',
  'Distrito Nacional', 'Santo Domingo',
  'Santiago', 'Puerto Plata', 'Samaná', 'Las Terrenas',
  'La Romana', 'San Pedro de Macorís', 'La Vega',
  'María Trinidad Sánchez', 'El Seibo', 'Hato Mayor',
  'San Cristóbal', 'Peravia', 'Espaillat', 'Duarte', 'Monseñor Nouel',
  'Valverde', 'Monte Cristi', 'Dajabón', 'Azua', 'Barahona', 'Pedernales',
  // --- Sectores: Distrito Nacional ---
  'Piantini, Distrito Nacional', 'Naco, Distrito Nacional', 'Serrallés, Distrito Nacional',
  'Bella Vista, Distrito Nacional', 'Arroyo Hondo, Distrito Nacional', 'Evaristo Morales, Distrito Nacional',
  'Los Cacicazgos, Distrito Nacional', 'Gazcue, Distrito Nacional', 'Ciudad Colonial, Distrito Nacional',
  'Miramar, Distrito Nacional', 'La Esperilla, Distrito Nacional',
  'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste', 'Boca Chica, Santo Domingo',
  // --- Sectores: La Altagracia / Punta Cana ---
  'Bávaro, La Altagracia', 'Pueblo Bávaro, La Altagracia', 'Punta Cana, La Altagracia',
  'Downtown Punta Cana, La Altagracia', 'Cap Cana, La Altagracia', 'Los Corales, La Altagracia',
  'Cabeza de Toro, La Altagracia', 'Uvero Alto, La Altagracia', 'Macao, La Altagracia',
  'Cortecito, La Altagracia', 'Verón, La Altagracia', 'Arena Gorda, La Altagracia',
  'Higüey, La Altagracia', 'San Rafael del Yuma, La Altagracia', 'Boca de Yuma, La Altagracia',
  // --- Sectores: Santiago ---
  'Los Jardines, Santiago', 'Cerros de Gurabo, Santiago', 'Reparto Conuco, Santiago',
  'Bella Vista, Santiago', 'Villa Olga, Santiago',
  // --- Sectores: Puerto Plata ---
  'Puerto Plata, Puerto Plata', 'Sosúa, Puerto Plata', 'Cabarete, Puerto Plata',
  'Costámbar, Puerto Plata', 'Cofresí, Puerto Plata', 'Playa Dorada, Puerto Plata',
  'Luperón, Puerto Plata', 'Villa Isabela, Puerto Plata', 'La Isabela, Puerto Plata',
  // --- Sectores: Samaná ---
  'Samaná, Samaná', 'Las Terrenas, Samaná', 'Las Galeras, Samaná',
  'Sánchez, Samaná', 'El Portillo, Samaná', 'Cosón, Samaná', 'El Limón, Samaná', 'Rancho Español, Samaná',
  // --- Sectores: La Romana ---
  'La Romana, La Romana', 'Casa de Campo, La Romana', 'Bayahibe, La Romana', 'Dominicus, La Romana',
  // --- Sectores: La Vega ---
  'Jarabacoa, La Vega', 'Constanza, La Vega', 'La Vega, La Vega',
  // --- Sectores: San Pedro de Macorís ---
  'San Pedro de Macorís, San Pedro de Macorís', 'Juan Dolio, San Pedro de Macorís', 'Guayacanes, San Pedro de Macorís',
  // --- Sectores: otras provincias ---
  'Nagua, María Trinidad Sánchez', 'Río San Juan, María Trinidad Sánchez',
  'Miches, El Seibo', 'Sabana de la Mar, Hato Mayor',
  'San Cristóbal, San Cristóbal', 'Baní, Peravia',
  'Moca, Espaillat', 'San Francisco de Macorís, Duarte', 'Bonao, Monseñor Nouel',
  'Mao, Valverde', 'Monte Cristi, Monte Cristi', 'Dajabón, Dajabón',
  'Azua, Azua', 'Barahona, Barahona', 'Pedernales, Pedernales',
]

function BuscarContent() {
  const { tr } = useIdioma()
  const Tb = tr.buscar
  const Tn = tr.nav
  const searchParams = useSearchParams()
  const operacionParam = searchParams.get('operacion') || ''
  const zonaParam = searchParams.get('zona') || ''
  const tipoParam = searchParams.get('tipo') || ''

  const [tipo, setTipo] = useState(tipoParam || 'Todos')
  const [filtrosOpen, setFiltrosOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [operacion, setOperacion] = useState(operacionParam)
  const [query, setQuery] = useState(zonaParam)
  const [orden, setOrden] = useState('Relevancia')
  const [pagina, setPagina] = useState(1)
  const POR_PAGINA = 20
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
  const [sesionActiva, setSesionActiva] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [planUsuario, setPlanUsuario] = useState<string>('gratis')
  const [tipoUsuario, setTipoUsuario] = useState<string>('')
  const [fotoUrl, setFotoUrl] = useState<string>('')
  const [amenidadesFiltro, setAmenidadesFiltro] = useState<string[]>([])
  const [soloAei, setSoloAei] = useState(false)
  const [pisosMin, setPisosMin] = useState(0)
  const [favoritosSet, setFavoritosSet] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setAuthReady(true)
      if (!data.user) return
      setSesionActiva(true)
      setUserId(data.user.id)
      const { data: usr } = await supabase.from('usuarios').select('plan,tipo,foto_url').eq('id', data.user.id).single()
      if (usr?.plan) setPlanUsuario(usr.plan)
      if (usr?.tipo) setTipoUsuario(usr.tipo)
      const foto = usr?.foto_url || data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || ''
      if (foto) setFotoUrl(foto)
      const { data: favs } = await supabase.from('favoritos').select('propiedad_id').eq('usuario_id', data.user.id)
      if (favs) setFavoritosSet(new Set(favs.map((f: any) => f.propiedad_id)))
    })
  }, [])

  const toggleFavorito = async (e: React.MouseEvent, propId: string) => {
    e.stopPropagation()
    if (!userId) { window.location.href = '/login'; return }
    if (favoritosSet.has(propId)) {
      setFavoritosSet(prev => { const s = new Set(prev); s.delete(propId); return s })
      const { error } = await supabase.from('favoritos').delete().eq('usuario_id', userId).eq('propiedad_id', propId)
      if (error) { console.error('favoritos delete:', error); setFavoritosSet(prev => new Set(prev).add(propId)) }
    } else {
      setFavoritosSet(prev => new Set(prev).add(propId))
      const { error } = await supabase.from('favoritos').insert({ usuario_id: userId, propiedad_id: propId })
      if (error) { console.error('favoritos insert:', error); setFavoritosSet(prev => { const s = new Set(prev); s.delete(propId); return s }) }
    }
  }

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      let q = supabase
        .from('propiedades')
        .select('*, usuarios(nombre, inmobiliaria, tipo, foto_url, numero_aei, aei_aprobado)')
        .eq('estado', 'activo')
      // operacion se filtra en cliente para que el sidebar funcione sin recargar
      if (tipoParam) q = q.eq('tipo', tipoParam)
      if (zonaParam) {
        const sectores = expandirGrupo(zonaParam)
        if (sectores) {
          q = q.or(sectores.map(s => `zona.ilike.%${s}%`).join(','))
        } else {
          q = q.ilike('zona', `%${zonaParam}%`)
        }
      }
      const { data, error } = await q
        .order('created_at', { ascending: false })
      if (!error && data) setPropiedadesReales(data)
      setCargando(false)
    }
    cargar()
  }, [])

  const propiedadesActivas: any[] = propiedadesReales.length > 0 ? propiedadesReales.map(p => ({
    id: p.id,
    precio: p.precio,
    titulo: p.titulo,
    zona: p.zona || '',
    hab: p.habitaciones || 0,
    banos: p.banos || 0,
    m2: p.m2 || 0,
    parqueos: p.parqueos || 0,
    tipo: p.tipo || 'Apartamento',
    operacion: p.operacion || 'venta',
    dest: p.destacado && (!p.destacado_hasta || new Date(p.destacado_hasta) > new Date()),
    visitas: false,
    bg: '#e0f5f7',
    desc: p.descripcion || '',
    lat: p.lat ?? getLatLngFromZona(p.zona || '')[0],
    lng: p.lng ?? getLatLngFromZona(p.zona || '')[1],
    amenidades: Array.isArray(p.amenidades) ? p.amenidades : [],
    aei: !!(p.usuarios?.numero_aei && p.usuarios?.aei_aprobado),
    fotos: Array.isArray(p.fotos) ? p.fotos : [],
    vendedor: p.usuarios || {},
    created_at: p.created_at || '',
  })) : propiedadesEjemplo

  const tipos = ['Todos', 'Apartamento', 'Casa', 'Villa', 'Edificio', 'Oficina', 'Terreno', 'Local comercial']
  const ordenes = [
    { val: 'Relevancia', label: Tb.relevancia },
    { val: 'Recientes', label: Tb.recientes },
    { val: 'Baratos', label: Tb.baratos },
    { val: 'Caros', label: Tb.caros },
  ]

  const filtradas = propiedadesActivas.filter((p: any) => {
    if (operacion && p.operacion !== operacion) return false
    if (tipo !== 'Todos' && p.tipo !== tipo) return false
    if (precioMax && p.precio > Number(precioMax.replace(/\D/g, ''))) return false
    if (precioMin && p.precio < Number(precioMin.replace(/\D/g, ''))) return false
    if (m2Max && p.m2 > Number(m2Max.replace(/\D/g, ''))) return false
    if (m2Min && p.m2 < Number(m2Min.replace(/\D/g, ''))) return false
    if (habMin > 0 && p.hab < habMin) return false
    if (banosMin > 0 && p.banos < banosMin) return false
    if (query) {
      const sectores = expandirGrupo(query)
      if (sectores) {
        if (!sectores.some(s => normalize(p.zona).includes(normalize(s)))) return false
      } else if (!normalize(p.titulo).includes(normalize(query)) && !normalize(p.zona).includes(normalize(query))) {
        return false
      }
    }
    if (soloAei && !p.aei) return false
    if (amenidadesFiltro.length > 0 && !amenidadesFiltro.every(a => p.amenidades.includes(a))) return false
    return true
  }).sort((a, b) => {
    // Destacadas solo tienen prioridad en Relevancia
    if (orden === 'Relevancia' && b.dest !== a.dest) return (b.dest ? 1 : 0) - (a.dest ? 1 : 0)
    if (orden === 'Baratos') return a.precio - b.precio
    if (orden === 'Caros') return b.precio - a.precio
    if (orden === 'Recientes') return (b.created_at || '').localeCompare(a.created_at || '')
    return (b.created_at || '').localeCompare(a.created_at || '')
  })

  useEffect(() => { setPagina(1) }, [query, tipo, orden, precioMin, precioMax, habMin, banosMin])

  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA)
  const filtradasPagina = filtradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const handleQueryChange = (val: string) => {
    setQuery(val)
    if (val.length >= 2) {
      setSugerencias(zonasSugerencias.filter(z => normalize(z).includes(normalize(val))).slice(0, 6))
      setMostrarSugerencias(true)
    } else {
      setSugerencias([])
      setMostrarSugerencias(false)
    }
  }

  const tituloOperacion = operacion === 'alquiler' ? Tb.operacion.alquiler : Tb.operacion.venta
  const tituloPagina = `${filtradas.length} propiedades ${query ? `en ${query.split(',')[0].trim()}` : 'en República Dominicana'}`

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>

      {/* MAPA COMPLETO — pantalla entera */}
      {verMapa && <MapaCompleto propiedades={filtradas} onCerrar={() => setVerMapa(false)} />}

      {/* MENÚ MÓVIL OVERLAY */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.25)' }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 54, left: 0, right: 0, background: '#fff', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', borderRadius: '0 0 16px 16px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {authReady && sesionActiva ? (
              <div style={{ padding: '4px 0' }}>
                <div style={{ padding: '10px 20px 4px', fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1 }}>Mi cuenta</div>
                {[
                  { label: 'Mi panel', href: '/panel' },
                  { label: 'Mis anuncios', href: '/panel?s=anuncios' },
                  { label: 'Mensajes', href: '/panel?s=mensajes' },
                  { label: 'Guardados', href: '/panel?s=guardados' },
                  { label: 'Mi perfil', href: '/panel?s=perfil' },
                ].map(item => (
                  <a key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', fontSize: 14, color: '#333', textDecoration: 'none', borderBottom: '1px solid #f5f5f5' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {item.label}
                  </a>
                ))}
                <button onClick={async () => { const { supabase: sb } = await import('../../supabase'); await sb.auth.signOut(); window.location.href = '/' }} style={{ all: 'unset', display: 'flex', width: '100%', alignItems: 'center', padding: '13px 20px', fontSize: 14, color: '#e63946', cursor: 'pointer', borderTop: '1px solid #f0f0f0', boxSizing: 'border-box', marginTop: 4 }}>
                  Cerrar sesión
                </button>
              </div>
            ) : authReady && !sesionActiva ? (
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="/login" style={{ display: 'block', textAlign: 'center', padding: '12px', fontSize: 14, fontWeight: 600, color: '#006D77', border: '1.5px solid #006D77', borderRadius: 8, textDecoration: 'none' }}>Iniciar sesión</a>
                <a href="/registro" style={{ display: 'block', textAlign: 'center', padding: '12px', fontSize: 14, fontWeight: 600, color: '#fff', background: '#006D77', borderRadius: 8, textDecoration: 'none' }}>Publicar gratis</a>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>
            habitade<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          <div className="buscar-nav-links" style={{ display: 'flex' }}>
          {[
            { label: Tn.comprar, href: '/buscar?operacion=venta', op: 'venta' },
            { label: Tn.alquilar, href: '/buscar?operacion=alquiler', op: 'alquiler' },
          ].map(item => (
            <a key={item.op} href={item.href} style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: operacion === item.op ? '#fff' : 'rgba(255,255,255,0.7)', textDecoration: 'none', borderBottom: operacion === item.op ? '2px solid #83D4DB' : '2px solid transparent' }}>{item.label}</a>
          ))}
          </div>
        </div>
        <div className="buscar-nav-search" style={{ flex: 1, maxWidth: 380, margin: '0 20px', position: 'relative' }}>
          <div style={{ display: 'flex', background: '#fff', borderRadius: 4, overflow: 'hidden', height: 34, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', borderRight: '1px solid #e8e8e8' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <input
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { setMostrarSugerencias(false); window.location.href = `/buscar?zona=${encodeURIComponent(query)}&operacion=${operacion}` } }}
              type="text"
              placeholder="Zona, sector, municipio..."
              style={{ flex: 1, padding: '0 10px', fontSize: 13, border: 'none', outline: 'none', color: '#222', background: '#fff' }}
            />
            <button
              onClick={() => { setMostrarSugerencias(false); window.location.href = `/buscar?zona=${encodeURIComponent(query)}&operacion=${operacion}` }}
              style={{ background: '#17A6B4', color: '#fff', border: 'none', padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{tr.hero.buscar}</button>
          </div>
          {mostrarSugerencias && sugerencias.length > 0 && (
            <div style={{ position: 'absolute', top: 38, left: 0, right: 0, background: '#fff', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 200, overflow: 'hidden' }}>
              {sugerencias.map(s => (
                <div key={s} onClick={() => { setQuery(s); setMostrarSugerencias(false); window.location.href = `/buscar?zona=${encodeURIComponent(s)}&operacion=${operacion}` }}
                  style={{ padding: '9px 14px', fontSize: 13, color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f0f0f0' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <div className="buscar-nav-desktop" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <NavUserMenu dark={true} />
            {authReady && !sesionActiva && <>
              <a href="/login" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>{Tn.entrar}</a>
              <a href="/registro" style={{ fontSize: 12, color: '#006D77', background: '#fff', padding: '6px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>{Tn.publicar}</a>
            </>}
          </div>
          <button className="buscar-mobile-hamburger" onClick={() => setMobileMenuOpen(true)} style={{ background: 'rgba(255,255,255,0.15)', cursor: 'pointer', padding: '6px 8px', borderRadius: 6, border: 'none' }}>
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><rect y="0" width="20" height="2.5" rx="1.25" fill="white"/><rect y="6.5" width="20" height="2.5" rx="1.25" fill="white"/><rect y="13" width="20" height="2.5" rx="1.25" fill="white"/></svg>
          </button>
        </div>
      </nav>

      {/* BARRA MÓVIL: título + tabs + 3 botones estilo Idealista */}
      <div className="buscar-mobile-topbar">
        <div className="buscar-mobile-count">{cargando ? '...' : tituloPagina}</div>

        {/* TABS COMPRAR / ALQUILAR */}
        <div className="buscar-op-tabs">
          <div className="buscar-op-tabs-inner">
            {[{ val: 'venta', label: 'Comprar' }, { val: 'alquiler', label: 'Alquilar' }].map(t => (
              <button key={t.val} className={`buscar-op-tab${operacion === t.val ? ' active' : ''}`} onClick={() => setOperacion(t.val)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="buscar-mobile-actionbar">
          <button className="bma-btn" onClick={() => setFiltrosOpen(v => !v)}>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none"><rect y="0" width="14" height="2" rx="1" fill="currentColor"/><rect x="2" y="5" width="10" height="2" rx="1" fill="currentColor"/><rect x="4" y="10" width="6" height="2" rx="1" fill="currentColor"/></svg>
            Filtrar
          </button>
          <button className="bma-btn" onClick={() => setSortOpen(v => !v)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
            {ordenes.find(o => o.val === orden)?.label ?? orden}
          </button>
          <button className="bma-btn" onClick={() => setVerMapa(true)}>
            <svg width="13" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            Mapa
          </button>
        </div>
      </div>

      {/* OVERLAY ORDENAR (móvil) */}
      {sortOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.35)' }} onClick={() => setSortOpen(false)}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '16px 16px 0 0', padding: '8px 0 32px' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: '#e0e0e0', borderRadius: 2, margin: '8px auto 16px' }} />
            <div style={{ fontSize: 12, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, padding: '0 20px 10px' }}>Ordenar por</div>
            {ordenes.map(o => (
              <button key={o.val} onClick={() => { setOrden(o.val); setSortOpen(false) }} style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '14px 20px', fontSize: 15, color: orden === o.val ? '#006D77' : '#222', fontWeight: orden === o.val ? 600 : 400, cursor: 'pointer', boxSizing: 'border-box', borderBottom: '1px solid #f5f5f5' }}>
                {o.label}
                {orden === o.val && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BREADCRUMB */}
      <div className="buscar-breadcrumb" style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '8px 20px', fontSize: 12, color: '#aaa', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <a href="/" style={{ color: '#006D77', textDecoration: 'none' }}>Habitade</a>
        <span>›</span>
        <a href="/buscar" style={{ color: '#006D77', textDecoration: 'none' }}>República Dominicana</a>
        {query && <><span>›</span><span style={{ color: '#444' }}>{query.split(',')[0].trim()}</span></>}
        <span>›</span>
        <span style={{ color: '#444' }}>{operacion === 'alquiler' ? Tb.operacion.alquiler : Tb.operacion.venta}</span>
        <span style={{ color: '#ccc', marginLeft: 8 }}>·</span>
        <span style={{ color: '#444', marginLeft: 8, fontWeight: 500 }}>{filtradas.length} {Tb.titulo}</span>
      </div>

      {/* BODY */}
      <div className="buscar-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 90px)' }}>

        {/* SIDEBAR */}
        <div className={`buscar-filtros${filtrosOpen ? ' filtros-open' : ''}`} style={{ background: '#fff', borderRight: '1px solid #e8e8e8', isolation: 'isolate' }}>
          <div className={`buscar-filtros-panel${filtrosOpen ? ' open' : ''}`} style={{ padding: '14px' }}>

          {/* Cabecera móvil del panel de filtros */}
          <div className="filtros-mobile-header">
            <span style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>Filtros</span>
            <button onClick={() => setFiltrosOpen(false)} style={{ all: 'unset', cursor: 'pointer', fontSize: 22, color: '#555', lineHeight: 1, padding: '4px 8px' }}>×</button>
          </div>

          {/* MAPA MINI LIMPIO */}
          <div className="buscar-mapa-mini" style={{ border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ height: 180 }}>
              <MapaMini key={zonaParam} zona={zonaParam} />
            </div>
            <div style={{ padding: '8px 12px', borderTop: '1px solid #e8e8e8', background: '#fafafa' }}>
              <button onClick={() => setVerMapa(true)} style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: '#006D77', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {Tb.verMapa}
              </button>
            </div>
          </div>

          {/* FILTRO OPERACION */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>{tr.panel?.publicar?.operacion ?? 'Operación'}</div>
            <div style={{ display: 'flex', gap: 0, background: '#f4f5f6', borderRadius: 6, padding: 3 }}>
              {[{ val: '', label: Tb.todos }, { val: 'venta', label: tr.panel?.publicar?.venta ?? 'Venta' }, { val: 'alquiler', label: tr.panel?.publicar?.alquiler ?? 'Alquiler' }].map(op => (
                <button key={op.val} onClick={() => setOperacion(op.val)} style={{ all: 'unset', flex: 1, padding: '6px 0', textAlign: 'center', fontSize: 12, fontWeight: operacion === op.val ? 700 : 400, color: operacion === op.val ? '#fff' : '#555', background: operacion === op.val ? '#006D77' : 'transparent', borderRadius: 4, cursor: 'pointer' }}>
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* FILTRO TIPO */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>{Tb.tipoInmueble}</div>
            <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 13, color: '#444', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              {tipos.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* FILTRO PRECIO */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>{Tb.precio}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder={Tb.minimo} value={precioMin} onChange={e => setPrecioMin(e.target.value)} style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }} />
              <input type="text" placeholder={Tb.maximo} value={precioMax} onChange={e => setPrecioMax(e.target.value)} style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }} />
            </div>
          </div>

          {/* FILTRO SUPERFICIE */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>{Tb.superficie}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder={Tb.minimo} value={m2Min} onChange={e => setM2Min(e.target.value)} style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }} />
              <input type="text" placeholder={Tb.maximo} value={m2Max} onChange={e => setM2Max(e.target.value)} style={{ flex: 1, width: 0, border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', color: '#444' }} />
            </div>
          </div>

          {/* FILTRO HABITACIONES — oculto para Edificio y Terreno */}
          {tipo !== 'Edificio' && tipo !== 'Terreno' && (
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>{Tb.habitaciones}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {[0, 1, 2, 3, 4].map(h => (
                  <button key={h} onClick={() => setHabMin(h)} style={{ all: 'unset', border: `1px solid ${habMin === h ? '#006D77' : '#ddd'}`, borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer', color: habMin === h ? '#006D77' : '#666', background: habMin === h ? '#f0fafb' : '#fff' }}>
                    {h === 0 ? '0 (estudio)' : h === 4 ? '4+' : h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FILTRO BAÑOS — oculto para Edificio y Terreno */}
          {tipo !== 'Edificio' && tipo !== 'Terreno' && (
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>{Tb.banos}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {[1, 2, 3].map(b => (
                  <button key={b} onClick={() => setBanosMin(b === banosMin ? 0 : b)} style={{ all: 'unset', border: `1px solid ${banosMin === b ? '#006D77' : '#ddd'}`, borderRadius: 4, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: banosMin === b ? '#006D77' : '#666', background: banosMin === b ? '#f0fafb' : '#fff' }}>
                    {b === 3 ? '3+' : b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FILTRO CARACTERÍSTICAS */}
          <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>{Tb.caracteristicas}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'piscina', label: 'Piscina' },
                { id: 'parqueo', label: 'Parqueo' },
                { id: 'vista_mar', label: 'Vista al mar' },
                { id: 'amueblado', label: 'Amueblado' },
                { id: 'jardin', label: 'Jardín' },
                { id: 'terraza', label: 'Terraza' },
                { id: 'jacuzzi', label: 'Jacuzzi' },
                { id: 'barbacoa', label: 'Barbacoa' },
                { id: 'gimnasio', label: 'Gimnasio' },
                { id: 'seguridad', label: 'Seguridad 24h' },
                { id: 'ascensor', label: 'Ascensor' },
              ].map(({ id, label }) => (
                <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#444', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={amenidadesFiltro.includes(id)}
                    onChange={e => setAmenidadesFiltro(prev => e.target.checked ? [...prev, id] : prev.filter(a => a !== id))}
                    style={{ accentColor: '#006D77', width: 14, height: 14 }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* FILTRO EDIFICIO */}
          {tipo === 'Edificio' && (
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginBottom: 8 }}>Número de pisos mínimo</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {[0, 3, 5, 8, 12].map(p => (
                  <button key={p} onClick={() => setPisosMin(p)} style={{ all: 'unset', border: `1px solid ${pisosMin === p ? '#006D77' : '#ddd'}`, borderRadius: 4, padding: '6px 10px', fontSize: 12, cursor: 'pointer', color: pisosMin === p ? '#006D77' : '#666', background: pisosMin === p ? '#f0fafb' : '#fff' }}>
                    {p === 0 ? 'Cualquiera' : `${p}+`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FILTRO AEI */}
          <div style={{ paddingBottom: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444', cursor: 'pointer' }}>
              <input type="checkbox" checked={soloAei} onChange={e => setSoloAei(e.target.checked)} style={{ accentColor: '#006D77', width: 14, height: 14 }} />
              Agente <span style={{ background: '#1a3a5c', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>AEI</span>
            </label>
          </div>

          {/* Botón aplicar filtros — solo móvil */}
          <div className="buscar-filtros-apply">
            <button onClick={() => setFiltrosOpen(false)} style={{ all: 'unset', display: 'block', width: '100%', background: '#006D77', color: '#fff', textAlign: 'center', padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxSizing: 'border-box' }}>
              Ver {filtradas.length} propiedades
            </button>
          </div>

          </div>{/* fin buscar-filtros-panel */}
        </div>{/* fin buscar-filtros */}

        {/* RESULTADOS */}
        <div className="buscar-lista">
          <div className="buscar-titulo-sort" style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '12px 16px' }}>
            <h1 style={{ fontSize: 17, fontWeight: 600, color: '#111', margin: '0 0 8px' }}>
              {cargando ? `${tr.hero.buscar}...` : tituloPagina}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#777' }}>{Tb.ordenar}</span>
              {ordenes.map(o => (
                <button key={o.val} onClick={() => setOrden(o.val)} style={{ all: 'unset', border: `1px solid ${orden === o.val ? '#006D77' : '#ddd'}`, borderRadius: 4, padding: '5px 12px', fontSize: 12, color: orden === o.val ? '#006D77' : '#555', cursor: 'pointer', background: orden === o.val ? '#f0fafb' : '#fff' }}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {filtradasPagina.map(p => (
              <div key={p.id} className="prop-card" style={{ display: 'flex', background: '#fff', borderBottom: '8px solid #f4f5f6', borderLeft: p.dest ? '4px solid #006D77' : 'none', cursor: 'pointer', minHeight: 220, boxShadow: p.dest ? '0 2px 12px rgba(0,109,119,0.10)' : 'none' }}
                onClick={() => window.location.href = `/propiedad/${p.id}`}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafefe')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                <div className="prop-card-img" style={{ width: 300, minWidth: 300, background: p.dest ? '#e0f5f7' : p.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {p.fotos && p.fotos.length > 0
                    ? <img src={p.fotos[0]} alt={p.titulo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  }
                  {p.dest && <div className="pc-badge pc-badge-dest">{Tb.destacado ?? 'DESTACADO'}</div>}
                  {p.visitas && !p.dest && <div className="pc-badge pc-badge-visto">MÁS VISTO</div>}
                  {p.fotos && p.fotos.length > 0 && (
                    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 4, zIndex: 1 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      {p.fotos.length}
                    </div>
                  )}
                  {/* Corazón overlay — solo visible en móvil via CSS */}
                  <button className="pc-fav-img" onClick={e => toggleFavorito(e, String(p.id))}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={favoritosSet.has(String(p.id)) ? '#e63946' : 'none'} stroke={favoritosSet.has(String(p.id)) ? '#e63946' : '#555'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="pc-body" style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                  <div>
                    <div className="pc-zona-text">{p.zona}</div>
                    <div className="pc-titulo" style={{ fontSize: 15, fontWeight: 600, color: '#006D77', marginBottom: 8 }}>
                      {p.titulo}
                    </div>
                    <div className="pc-precio-wrap" style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 2 }}>
                      US$ {p.precio.toLocaleString('en-US')}
                      {p.m2 > 0 && <span style={{ fontSize: 13, color: '#aaa', fontWeight: 400, marginLeft: 10 }}>US$ {Math.round(p.precio / p.m2).toLocaleString('en-US')}/m²</span>}
                    </div>
                    <div className="pc-dop" style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>{formatDOP(p.precio)}</div>
                    <div className="pc-feats" style={{ fontSize: 13, color: '#444', marginBottom: 12 }}>
                      {p.hab > 0 && <span>{p.hab} hab. &nbsp;·&nbsp; </span>}
                      <span>{p.m2} m² &nbsp;·&nbsp; </span>
                      {p.banos > 0 && <span>{p.banos} baños &nbsp;·&nbsp; </span>}
                      {p.parqueos > 0 && <span>{p.parqueos} parqueo{p.parqueos > 1 ? 's' : ''}</span>}
                    </div>
                    <div className="pc-desc" style={{ fontSize: 13, color: '#777', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 14 }}>{p.desc}</div>
                  </div>
                  <div className="pc-footer" style={{ paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                    <div className="pc-zona" style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f0fafb', border: '1px solid #c5e8ea', padding: '3px 10px', borderRadius: 20, marginBottom: 10, width: 'fit-content' }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      <span style={{ color: '#006D77', fontSize: 12 }}>{p.zona}</span>
                    </div>
                    <div className="pc-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button onClick={e => toggleFavorito(e, String(p.id))} style={{ all: 'unset', border: `1px solid ${favoritosSet.has(String(p.id)) ? '#006D77' : '#e0e0e0'}`, borderRadius: 4, padding: '6px 10px', cursor: 'pointer', color: favoritosSet.has(String(p.id)) ? '#006D77' : '#ccc', fontSize: 16, lineHeight: 1 }}>{favoritosSet.has(String(p.id)) ? '♥' : '♡'}</button>
                      <button onClick={e => { e.stopPropagation(); window.location.href = `/propiedad/${p.id}?tel=1` }} style={{ all: 'unset', border: '1px solid #006D77', color: '#006D77', padding: '7px 16px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{Tb.verTelefono}</button>
                      <button onClick={e => { e.stopPropagation(); window.location.href = `/propiedad/${p.id}` }} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '7px 18px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{Tb.contactar}</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filtradas.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa', background: '#fff' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#555', marginBottom: 6 }}>{Tb.sinResultados}</div>
                <div style={{ fontSize: 13 }}>{Tb.modificaFiltros}</div>
              </div>
            )}
          </div>

          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, padding: '24px', background: '#f4f5f6', flexWrap: 'wrap' }}>
              <button onClick={() => { setPagina(p => Math.max(1, p - 1)); window.scrollTo(0,0) }}
                disabled={pagina === 1}
                style={{ border: '1.5px solid #e0e0e0', background: '#fff', color: pagina === 1 ? '#ccc' : '#333', padding: '8px 14px', borderRadius: 4, fontSize: 13, cursor: pagina === 1 ? 'default' : 'pointer' }}>
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 2)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...')
                  acc.push(n)
                  return acc
                }, [])
                .map((n, i) => n === '...'
                  ? <span key={`dots-${i}`} style={{ padding: '0 4px', color: '#888' }}>…</span>
                  : <button key={n} onClick={() => { setPagina(n as number); window.scrollTo(0,0) }}
                      style={{ border: `1.5px solid ${pagina === n ? '#006D77' : '#e0e0e0'}`, background: pagina === n ? '#006D77' : '#fff', color: pagina === n ? '#fff' : '#333', padding: '8px 13px', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontWeight: pagina === n ? 600 : 400 }}>
                      {n}
                    </button>
                )}
              <button onClick={() => { setPagina(p => Math.min(totalPaginas, p + 1)); window.scrollTo(0,0) }}
                disabled={pagina === totalPaginas}
                style={{ border: '1.5px solid #e0e0e0', background: '#fff', color: pagina === totalPaginas ? '#ccc' : '#333', padding: '8px 14px', borderRadius: 4, fontSize: 13, cursor: pagina === totalPaginas ? 'default' : 'pointer' }}>
                Siguiente
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
          <div style={{ fontSize: 24, fontWeight: 700, color: '#006D77', marginBottom: 8 }}>habitade<span style={{ color: '#17A6B4' }}>.</span></div>
          <div style={{ fontSize: 14, color: '#888' }}>Cargando...</div>
        </div>
      </div>
    }>
      <BuscarContent />
    </Suspense>
  )
}
