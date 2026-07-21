'use client'
import { useEffect, useRef } from 'react'

const ZONAS_COORDS: Record<string, [number, number]> = {
  // ── Distrito Nacional ──────────────────────────────────────────────────────
  'piantini':            [18.4748, -69.9356],
  'naco':                [18.4739, -69.9257],
  'bella vista':         [18.4553, -69.9424],
  'serrales':            [18.4630, -69.9490],
  'arroyo hondo':        [18.5044, -69.9311],
  'viejo arroyo hondo':  [18.4963, -69.9428],
  'los cacicazgos':      [18.4414, -69.9697],
  'urbanizacion real':   [18.4429, -69.9757],
  'gazcue':              [18.4684, -69.9056],
  'ciudad colonial':     [18.4715, -69.8868],
  'evaristo morales':    [18.4652, -69.9412],
  'miramar':             [18.4322, -69.9607],
  'la esperilla':        [18.4707, -69.9168],
  'cristo rey':          [18.5017, -69.9261],
  'villa consuelo':      [18.4843, -69.8999],
  'ensanche ozama':      [18.4931, -69.8690],
  'ensanche isabelita':  [18.4700, -69.9040],
  'distrito nacional':   [18.4861, -69.9312],

  // ── Santo Domingo (provincia) ─────────────────────────────────────────────
  'santo domingo':        [18.4861, -69.9312],
  'santo domingo este':   [18.4937, -69.8384],
  'santo domingo norte':  [18.6122, -69.9115],
  'santo domingo oeste':  [18.4845, -69.9984],
  'boca chica':           [18.4490, -69.6080],
  'los tres brazos':      [18.5179, -69.8828],
  'alma rosa':            [18.5020, -69.8130],
  'los mina':             [18.5031, -69.8645],
  'san isidro':           [18.4970, -69.8170],

  // ── La Altagracia ─────────────────────────────────────────────────────────
  'la altagracia':        [18.5890, -68.6200],
  'punta cana':           [18.5703, -68.3637],
  'downtown punta cana':  [18.6384, -68.3917],
  'bavaro':               [18.6940, -68.4320],
  'cap cana':             [18.5100, -68.3900],
  'los corales':          [18.6850, -68.4210],
  'cabeza de toro':       [18.6525, -68.3634],
  'uvero alto':           [18.8069, -68.5808],
  'macao':                [18.7720, -68.5450],
  'cortecito':            [18.6877, -68.4280],
  'higuey':               [18.6142, -68.7073],
  'san rafael del yuma':  [18.4313, -68.6748],
  'bayahibe':             [18.3650, -68.8393],
  'dominicus':            [18.3441, -68.8168],

  // ── Santiago ──────────────────────────────────────────────────────────────
  'santiago':                [19.4517, -70.6970],
  'los jardines':            [19.4628, -70.6928],
  'cerros de gurabo':        [19.4647, -70.6811],
  'bella vista, santiago':   [19.4427, -70.7095],
  'villa olga':              [19.4536, -70.6747],
  'pontezuela':              [19.4575, -70.6572],
  'las colinas':             [19.4786, -70.7136],

  // ── Samaná ────────────────────────────────────────────────────────────────
  'samana':          [19.2056, -69.3369],
  'las terrenas':    [19.3110, -69.5428],
  'el portillo':     [19.3236, -69.5042],
  'coson':           [19.2960, -69.5900],
  'las galeras':     [19.2900, -69.1980],
  'sanchez':         [19.2329, -69.6157],
  'el limon':        [19.2923, -69.4308],
  'rancho espanol':  [19.2600, -69.4600],

  // ── Puerto Plata ──────────────────────────────────────────────────────────
  'puerto plata':  [19.7950, -70.6910],
  'sosua':         [19.7580, -70.5210],
  'cabarete':      [19.7730, -70.4130],
  'costambar':     [19.7890, -70.7130],
  'cofresi':       [19.8090, -70.7540],
  'playa dorada':  [19.8030, -70.7060],
  'luperon':       [19.8996, -70.9548],
  'villa isabela': [19.8290, -71.0740],
  'la isabela':    [19.8570, -71.0570],

  // ── La Romana ────────────────────────────────────────────────────────────
  'la romana':     [18.4273, -68.9728],
  'casa de campo': [18.4080, -68.9130],

  // ── La Vega ───────────────────────────────────────────────────────────────
  'la vega':    [19.2211, -70.5286],
  'jarabacoa':  [19.1130, -70.6380],
  'constanza':  [18.9090, -70.7490],

  // ── San Pedro de Macorís ──────────────────────────────────────────────────
  'san pedro de macoris': [18.4530, -69.3090],
  'juan dolio':           [18.4269, -69.4162],
  'guayacanes':           [18.4214, -69.4587],

  // ── El Seibo ──────────────────────────────────────────────────────────────
  'el seibo': [18.7659, -69.0388],
  'miches':   [18.9830, -69.0410],

  // ── Hato Mayor ────────────────────────────────────────────────────────────
  'hato mayor':     [18.7649, -69.2591],
  'sabana de la mar': [19.0661, -69.3899],

  // ── María Trinidad Sánchez ────────────────────────────────────────────────
  'nagua':       [19.3730, -69.8470],
  'rio san juan': [19.6360, -70.1410],

  // ── Duarte ────────────────────────────────────────────────────────────────
  'san francisco de macoris': [19.3011, -70.2527],

  // ── Espaillat ────────────────────────────────────────────────────────────
  'espaillat': [19.3960, -70.5150],
  'moca':      [19.3960, -70.5150],

  // ── Hermanas Mirabal ─────────────────────────────────────────────────────
  'hermanas mirabal': [19.3783, -70.4168],
  'salcedo':          [19.3783, -70.4168],
  'tenares':          [19.3680, -70.3190],
  'villa tapia':      [19.2910, -70.4300],

  // ── Sánchez Ramírez ──────────────────────────────────────────────────────
  'sanchez ramirez': [18.9918, -70.1595],
  'cotui':           [18.9918, -70.1595],
  'cevicos':         [18.8780, -69.9610],

  // ── Monseñor Nouel ───────────────────────────────────────────────────────
  'monsenor nouel': [18.9415, -70.4081],
  'bonao':          [18.9415, -70.4081],

  // ── Monte Plata ──────────────────────────────────────────────────────────
  'monte plata': [18.8060, -69.7780],

  // ── San Cristóbal ────────────────────────────────────────────────────────
  'san cristobal': [18.4153, -70.1062],

  // ── Peravia ──────────────────────────────────────────────────────────────
  'peravia': [18.2777, -70.3321],
  'bani':    [18.2777, -70.3321],

  // ── Azua ─────────────────────────────────────────────────────────────────
  'azua':        [18.4533, -70.7354],
  'las charcas': [18.2890, -70.7260],
  'estebania':   [18.3970, -70.6010],

  // ── Barahona ─────────────────────────────────────────────────────────────
  'barahona':    [18.2090, -71.0990],
  'enriquillo':  [17.8990, -71.2450],
  'paraiso':     [17.9790, -71.1720],
  'las salinas': [18.2340, -71.0450],

  // ── Bahoruco ─────────────────────────────────────────────────────────────
  'bahoruco': [18.4869, -71.4180],
  'neiba':    [18.4869, -71.4180],
  'tamayo':   [18.4710, -71.2840],
  'los rios': [18.4160, -71.4920],

  // ── Independencia ────────────────────────────────────────────────────────
  'independencia':  [18.4927, -71.8513],
  'jimani':         [18.4927, -71.8513],
  'la descubierta': [18.5608, -71.7383],
  'postrer rio':    [18.5160, -71.6980],

  // ── Elías Piña ───────────────────────────────────────────────────────────
  'elias pina':    [18.8744, -71.6956],
  'comendador':    [18.8744, -71.6956],
  'banica':        [18.9700, -71.7000],
  'pedro santana': [18.8890, -71.9130],

  // ── San Juan ─────────────────────────────────────────────────────────────
  'san juan':               [18.8060, -71.2300],
  'san juan de la maguana': [18.8060, -71.2300],
  'las matas de farfan':    [18.8684, -71.5196],
  'vallejuelo':             [18.6580, -71.3410],
  'bohechio':               [18.7700, -71.0000],

  // ── Monte Cristi ─────────────────────────────────────────────────────────
  'monte cristi':  [19.8674, -71.6500],
  'guayubin':      [19.6647, -71.4210],
  'villa vasquez': [19.7520, -71.4930],

  // ── Dajabón ──────────────────────────────────────────────────────────────
  'dajabon':         [19.5492, -71.7082],
  'loma de cabrera': [19.4190, -71.5300],
  'restauracion':    [19.3190, -71.6920],

  // ── Valverde ─────────────────────────────────────────────────────────────
  'valverde': [19.5543, -71.0763],
  'mao':      [19.5543, -71.0763],

  // ── Santiago Rodríguez ───────────────────────────────────────────────────
  'santiago rodriguez': [19.5016, -71.3450],
  'sabaneta':           [19.5016, -71.3450],
  'moncion':            [19.4010, -71.2300],
  'villa los almacigos': [19.5880, -71.0990],

  // ── Duarte ───────────────────────────────────────────────────────────────
  'duarte':                   [19.3011, -70.2527],
  'san francisco de macoris': [19.3011, -70.2527],

  // ── María Trinidad Sánchez ───────────────────────────────────────────────
  'maria trinidad sanchez': [19.3730, -69.8470],
  'nagua':                  [19.3730, -69.8470],
  'rio san juan':           [19.6360, -70.1410],

  // ── Pedernales ───────────────────────────────────────────────────────────
  'pedernales': [17.8494, -71.7433],
  'oviedo':     [17.7940, -71.3880],

  // ── San José de Ocoa ─────────────────────────────────────────────────────
  'san jose de ocoa': [18.5432, -70.5047],
  'rancho arriba':    [18.5870, -70.4070],
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const ZONAS_AMPLIAS = new Set([
  'santo domingo norte', 'santo domingo este', 'santo domingo oeste',
  'punta cana', 'bavaro',
])

function getSectorZoom(zona: string): number {
  const nFull = norm(zona.trim())
  const partes = zona.split(',').map(p => norm(p.trim()))
  if (ZONAS_AMPLIAS.has(nFull) || partes.some(p => ZONAS_AMPLIAS.has(p))) return 10
  return 12
}

function getCenter(zona: string): [number, number] {
  if (!zona) return [18.4861, -69.9312]
  // Try full string first (handles compound keys like 'bella vista, santiago')
  const nFull = norm(zona.trim())
  if (ZONAS_COORDS[nFull]) return ZONAS_COORDS[nFull]
  const partes = zona.split(',').map(p => norm(p.trim()))
  for (const parte of partes) {
    if (ZONAS_COORDS[parte]) return ZONAS_COORDS[parte]
  }
  const sorted = Object.entries(ZONAS_COORDS).sort((a, b) => b[0].length - a[0].length)
  for (const parte of partes) {
    for (const [key, coords] of sorted) {
      if (parte.includes(norm(key)) || norm(key).includes(parte)) return coords
    }
  }
  return [18.4861, -69.9312]
}

interface Props {
  zona: string
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

export default function MapaPicker({ zona, lat, lng, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return

    const [cLat, cLng] = getCenter(zona)
    const initLat = lat ?? cLat
    const initLng = lng ?? cLng

    const initMap = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [initLat, initLng],
        zoom: lat != null ? 15 : zona.includes(',') ? getSectorZoom(zona) : 9,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      })
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map)

      const icono = L.divIcon({
        className: '',
        html: `<svg width="26" height="36" viewBox="0 0 26 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 0C5.82 0 0 5.82 0 13c0 9.1 13 23 13 23s13-13.9 13-23C26 5.82 20.18 0 13 0z" fill="#006D77" stroke="#fff" stroke-width="2"/>
          <circle cx="13" cy="13" r="5" fill="#fff"/>
        </svg>`,
        iconSize: [26, 36],
        iconAnchor: [13, 36],
      })

      const marker = L.marker([initLat, initLng], { icon: icono, draggable: true }).addTo(map)
      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        onChangeRef.current(pos.lat, pos.lng)
      })
      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng)
        onChangeRef.current(e.latlng.lat, e.latlng.lng)
      })

      mapInstanceRef.current = map
      markerRef.current = marker
      setTimeout(() => map.invalidateSize(), 100)
    }

    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if ((window as any).L) { initMap() }
    else {
      if (!document.querySelector('script[src*="leaflet"]')) {
        const s = document.createElement('script')
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        s.onload = initMap
        document.head.appendChild(s)
      } else {
        const check = setInterval(() => { if ((window as any).L) { clearInterval(check); initMap() } }, 100)
      }
    }

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; markerRef.current = null }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    const [cLat, cLng] = getCenter(zona)
    const zoom = zona.includes(',') ? getSectorZoom(zona) : 9
    mapInstanceRef.current.setView([cLat, cLng], zoom)
    markerRef.current?.setLatLng([cLat, cLng])
  }, [zona])

  return (
    <div>
      <div style={{ background: '#f0fafb', border: '1px solid #c7eaee', borderRadius: '8px 8px 0 0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="14" height="18" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.37 18.63 0 12 0z" fill="#006D77"/><circle cx="12" cy="12" r="4.5" fill="#fff"/></svg>
        <span style={{ fontSize: 12, color: '#004E57', fontWeight: 500 }}>
          Esta es la zona aproximada. Mueve el pin o haz clic en el mapa para indicar la ubicación exacta de tu propiedad.
        </span>
      </div>
      <div ref={mapRef} style={{ height: 260, width: '100%', borderRadius: '0 0 8px 8px', border: '1px solid #c7eaee', borderTop: 'none', cursor: 'crosshair' }} />
      {lat !== null && lng !== null && (
        <div style={{ marginTop: 6, fontSize: 11, color: '#006D77', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
          Ubicación guardada · {lat.toFixed(5)}, {lng.toFixed(5)}
        </div>
      )}
    </div>
  )
}
