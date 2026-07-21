'use client'
import { useEffect, useRef } from 'react'

const ZONAS_COORDS: Record<string, [number, number]> = {
  // Distrito Nacional
  'piantini': [18.4890, -69.9370], 'naco': [18.4950, -69.9450], 'bella vista': [18.4760, -69.9450],
  'arroyo hondo': [18.5050, -69.9650], 'gazcue': [18.4720, -69.9300], 'miramar': [18.4800, -69.9200],
  'evaristo morales': [18.4870, -69.9420], 'la esperilla': [18.4780, -69.9330],
  'ciudad colonial': [18.4740, -69.8880], 'serrales': [18.4720, -69.9500],
  'los cacicazgos': [18.4990, -69.9490], 'viejo arroyo hondo': [18.5100, -69.9700],
  'urbanizacion real': [18.4920, -69.9550], 'cristo rey': [18.4800, -69.9480],
  'villa consuelo': [18.4790, -69.8930], 'ensanche ozama': [18.4850, -69.8900],
  'ensanche isabelita': [18.4700, -69.9000],
  'distrito nacional': [18.4861, -69.9312], 'santo domingo': [18.4861, -69.9312],
  // Santo Domingo
  'santo domingo este': [18.4900, -69.8600], 'santo domingo norte': [18.5500, -69.9500],
  'santo domingo oeste': [18.4800, -70.0200], 'boca chica': [18.4490, -69.6080],
  'los tres brazos': [18.5000, -69.8300], 'alma rosa': [18.5000, -69.8200],
  'los mina': [18.5100, -69.8700], 'san isidro': [18.4900, -69.8150],
  // La Altagracia
  'la altagracia': [18.5674, -68.4500],
  'punta cana': [18.5674, -68.3634], 'downtown punta cana': [18.6384, -68.3917],
  'bavaro': [18.6835, -68.4100], 'cap cana': [18.5100, -68.4400],
  'los corales': [18.6600, -68.4500], 'cabeza de toro': [18.7100, -68.4600],
  'uvero alto': [18.7800, -68.3800], 'macao': [18.7536, -68.5625],
  'cortecito': [18.7080, -68.4220], 'higuey': [18.6142, -68.7073],
  'san rafael del yuma': [18.2888, -68.9757], 'bayahibe': [18.3583, -68.8393],
  'dominicus': [18.3580, -68.8440],
  // Santiago
  'santiago': [19.4517, -70.6970], 'los jardines': [19.4600, -70.7100],
  'cerros de gurabo': [19.4800, -70.6600], 'reparto conuco': [19.4600, -70.7000],
  'villa olga': [19.4400, -70.7200], 'pontezuela': [19.4700, -70.6800],
  'las colinas': [19.4650, -70.6900], 'el dorado': [19.4700, -70.7100],
  'urbanizacion tropical': [19.4500, -70.7000],
  // Samaná
  'samana': [19.2060, -69.3360], 'las terrenas': [19.3100, -69.5200],
  'las galeras': [19.2320, -69.2200], 'el portillo': [19.2780, -69.4580],
  'coson': [19.3380, -69.5680], 'sanchez': [19.2329, -69.6157],
  'el limon': [19.2700, -69.4700], 'rancho espanol': [19.2500, -69.3700],
  // Puerto Plata
  'puerto plata': [19.7950, -70.6910], 'sosua': [19.7600, -70.5200], 'cabarete': [19.7700, -70.4100],
  'costambar': [19.7900, -70.7100], 'cofresi': [19.8100, -70.7500],
  'playa dorada': [19.8050, -70.7080], 'luperon': [19.8996, -70.9548],
  'villa isabela': [19.8300, -71.0800], 'la isabela': [19.8600, -71.0700],
  // La Romana / La Vega / San Pedro
  'la romana': [18.4273, -68.9728], 'casa de campo': [18.4080, -68.9130],
  'la vega': [19.2211, -70.5286], 'jarabacoa': [19.1130, -70.6380], 'constanza': [18.9090, -70.7490],
  'san pedro de macoris': [18.4530, -69.3090], 'juan dolio': [18.4400, -69.5300],
  'guayacanes': [18.4300, -69.5700],
  // El Seibo
  'el seibo': [18.7659, -69.0388], 'miches': [18.9850, -69.0500],
  // Hato Mayor
  'hato mayor': [18.7649, -69.2591], 'sabana de la mar': [19.0661, -69.3899],
  // Resto de provincias
  'nagua': [19.3730, -69.8470], 'rio san juan': [19.6340, -70.1400],
  'san francisco de macoris': [19.3011, -70.2527],
  'san cristobal': [18.4153, -70.1062], 'bani': [18.2790, -70.3310],
  'barahona': [18.2090, -71.0990], 'enriquillo': [17.9000, -71.2400],
  'paraiso': [17.9800, -71.1700], 'las salinas': [18.2167, -71.0333],
  'neiba': [18.4869, -71.4180], 'tamayo': [18.4700, -71.3000], 'los rios': [18.4500, -71.4500],
  'jimani': [18.4927, -71.8513], 'la descubierta': [18.5608, -71.7383],
  'postrer rio': [18.5200, -71.7000],
  'comendador': [18.8744, -71.6956], 'banica': [18.9700, -71.7000],
  'pedro santana': [18.8900, -71.9100],
  'san juan de la maguana': [18.8060, -71.2300], 'las matas de farfan': [18.8684, -71.5196],
  'vallejuelo': [18.6600, -71.3400], 'bohechio': [18.7700, -71.0000],
  'bonao': [18.9415, -70.4081], 'monte plata': [18.8060, -69.7780],
  'azua': [18.4533, -70.7354], 'las charcas': [18.2900, -70.7600],
  'estebania': [18.4000, -70.5700],
  'monte cristi': [19.8674, -71.6500], 'guayubin': [19.6647, -71.4210],
  'villa vasquez': [19.7600, -71.5000],
  'dajabon': [19.5492, -71.7082], 'loma de cabrera': [19.4200, -71.5300],
  'restauracion': [19.3200, -71.6900],
  'sabaneta': [19.5016, -71.3450], 'moncion': [19.4000, -71.2300],
  'villa los almacigos': [19.5900, -71.1000],
  'cotui': [18.9918, -70.1595], 'cevicos': [18.9700, -69.9700],
  'salcedo': [19.3783, -70.4168], 'tenares': [19.3700, -70.3200],
  'villa tapia': [19.2900, -70.4300],
  'mao': [19.5543, -71.0763], 'moca': [19.3960, -70.5150],
  'pedernales': [17.8494, -71.7433], 'oviedo': [17.8000, -71.3900],
  'san jose de ocoa': [18.5432, -70.5047], 'rancho arriba': [18.5900, -70.4000],
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function getCenter(zona: string): [number, number] {
  if (!zona) return [18.4861, -69.9312]
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
        zoom: lat != null ? 15 : zona.includes(',') ? 13 : 10,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false,
      })
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
    const zoom = zona.includes(',') ? 13 : 10
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
