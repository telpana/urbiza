'use client'
import { useEffect, useRef } from 'react'
import { ZONAS_COORDS, norm, getZonaCenter } from '../lib/zonasCoords'

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

const getCenter = getZonaCenter

interface Props {
  zona: string
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
  hint?: string
}

export default function MapaPicker({ zona, lat, lng, onChange, hint }: Props) {
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
      L.tileLayer(`https://api.maptiler.com/maps/voyager/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`).addTo(map)

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
          {hint || 'Esta es la zona aproximada. Mueve el pin o haz clic en el mapa para indicar la ubicación exacta de tu propiedad.'}
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
