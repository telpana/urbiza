'use client'
import { useState, useEffect, useRef, use } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../supabase'
import { useIdioma } from '../../../IdiomaContext'

const USD_TO_DOP = 59.5
function formatDOP(usd: number) {
  return 'RD$ ' + (usd * USD_TO_DOP).toLocaleString('es-DO', { maximumFractionDigits: 0 })
}

const AMENIDADES_LABELS: Record<string, string> = {
  piscina: 'Piscina', parqueo: 'Parqueo', vista_mar: 'Vista al mar',
  amueblado: 'Amueblado', jardin: 'Jardín', terraza: 'Terraza',
  jacuzzi: 'Jacuzzi', barbacoa: 'Barbacoa', gimnasio: 'Gimnasio',
  seguridad: 'Seguridad 24h', ascensor: 'Ascensor',
}

const ZONAS_COORDS: Record<string, [number, number]> = {
  'piantini': [18.4890, -69.9370], 'naco': [18.4950, -69.9450], 'bella vista': [18.4760, -69.9450],
  'arroyo hondo': [18.5050, -69.9650], 'gazcue': [18.4720, -69.9300], 'miramar': [18.4800, -69.9200],
  'evaristo morales': [18.4870, -69.9420], 'la esperilla': [18.4780, -69.9330],
  'ciudad colonial': [18.4740, -69.8880], 'distrito nacional': [18.4861, -69.9312],
  'santo domingo': [18.4861, -69.9312], 'santo domingo este': [18.4900, -69.8600],
  'santo domingo norte': [18.5500, -69.9500], 'santo domingo oeste': [18.4800, -70.0200],
  'boca chica': [18.4490, -69.6080],
  'punta cana': [18.5674, -68.3634], 'downtown punta cana': [18.638436, -68.391718],
  'bavaro': [18.6835, -68.4100], 'cap cana': [18.5100, -68.4400],
  'los corales': [18.6600, -68.4500], 'cabeza de toro': [18.7100, -68.4600], 'uvero alto': [18.7800, -68.3800],
  'macao': [18.7536, -68.5625], 'cortecito': [18.7080, -68.4220], 'el cortecito': [18.7080, -68.4220],
  'higuey': [18.6142, -68.7073], 'san rafael del yuma': [18.3570, -68.5720], 'boca de yuma': [18.3230, -68.6210],
  'la altagracia': [18.5654, -68.4500],
  'santiago': [19.4517, -70.6970], 'los jardines': [19.4600, -70.7100], 'cerros de gurabo': [19.4700, -70.6500],
  'las terrenas': [19.3100, -69.5200], 'samana': [19.2060, -69.3360], 'las galeras': [19.2320, -69.2200],
  'el portillo': [19.3300, -69.4800], 'sanchez': [19.2317, -69.6088],
  'el limon': [19.2760, -69.5050], 'rancho espanol': [19.2514, -69.4548],
  'puerto plata': [19.7950, -70.6910], 'sosua': [19.7600, -70.5200], 'cabarete': [19.7700, -70.4100],
  'costambar': [19.7900, -70.7200], 'luperon': [19.8977, -70.9480], 'villa isabela': [19.8400, -71.0700], 'la isabela': [19.8400, -71.0700],
  'la romana': [18.4273, -68.9728], 'casa de campo': [18.4080, -68.9130],
  'bayahibe': [18.3650, -68.8280], 'dominicus': [18.3600, -68.8600],
  'jarabacoa': [19.1130, -70.6380], 'constanza': [18.9090, -70.7490], 'la vega': [19.2211, -70.5286],
  'san pedro de macoris': [18.4530, -69.3090], 'juan dolio': [18.4400, -69.5300], 'guayacanes': [18.4350, -69.5700],
  'nagua': [19.3730, -69.8470], 'rio san juan': [19.6310, -70.0760],
  'miches': [18.9803, -69.0424], 'el seibo': [18.7656, -69.0367],
  'hato mayor': [18.7600, -69.2545], 'sabana de la mar': [19.0563, -69.3870],
  'bani': [18.2790, -70.3310], 'azua': [18.4530, -70.7350], 'moca': [19.3960, -70.5150],
  'san cristobal': [18.4153, -70.1062], 'san francisco de macoris': [19.3011, -70.2527],
  'monte cristi': [19.8674, -71.6500], 'barahona': [18.2090, -71.0990], 'pedernales': [18.0380, -71.7430],
  'bonao': [18.9415, -70.4081], 'mao': [19.5543, -71.0763], 'dajabon': [19.5492, -71.7082],
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}
function getLatLng(zona: string): [number, number] {
  if (!zona) return [18.4861, -69.9312]
  const partes = zona.split(',').map(p => normalize(p.trim()))
  for (const parte of partes) {
    const exact = ZONAS_COORDS[parte as keyof typeof ZONAS_COORDS]
    if (exact) return exact
  }
  const sorted = Object.entries(ZONAS_COORDS).sort((a, b) => b[0].length - a[0].length)
  if (partes[0]) {
    for (const [key, coords] of sorted) {
      if (partes[0].includes(normalize(key))) return coords
    }
  }
  const z = normalize(zona)
  for (const [key, coords] of sorted) {
    if (z.includes(normalize(key))) return coords
  }
  return [18.4861, -69.9312]
}

function MapaUbicacion({ zona }: { zona: string }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [lat, lng] = getLatLng(zona)

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
      const map = L.map(mapRef.current, { center: [lat, lng], zoom: 11, zoomControl: true, attributionControl: false })
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

function GaleriaFotos({ fotos, destacado }: { fotos: string[], destacado: boolean }) {
  const [activa, setActiva] = useState(0)
  if (fotos.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ height: 380, background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {destacado && <div style={{ position: 'absolute', top: 8, right: 8, background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>DESTACADO</div>}
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="0.8" opacity="0.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
      </div>
    )
  }
  return (
    <div className="propiedad-galeria-wrap" style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
      <div className="propiedad-galeria-main" style={{ height: 420, position: 'relative', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {destacado && <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>DESTACADO</div>}
        <img src={fotos[activa]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>{activa + 1} / {fotos.length}</div>
        {activa > 0 && <button onClick={() => setActiva(a => a - 1)} style={{ all: 'unset', position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20, color: '#333' }}>‹</button>}
        {activa < fotos.length - 1 && <button onClick={() => setActiva(a => a + 1)} style={{ all: 'unset', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20, color: '#333' }}>›</button>}
      </div>
      {fotos.length > 1 && (
        <div style={{ display: 'flex', gap: 6, padding: '10px 12px', background: '#f9f9f9', overflowX: 'auto' }}>
          {fotos.map((src, i) => (
            <img key={i} src={src} onClick={() => setActiva(i)} style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 4, flexShrink: 0, cursor: 'pointer', border: activa === i ? '2px solid #006D77' : '2px solid transparent' }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Propiedad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { tr, idioma, setIdioma } = useIdioma()
  const Tp = tr.propiedad
  const Tn = tr.nav
  const searchParams = useSearchParams()
  const [propiedad, setPropiedad] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [nombreContacto, setNombreContacto] = useState('')
  const [telefonoContacto, setTelefonoContacto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errorContacto, setErrorContacto] = useState('')
  const [telVisible, setTelVisible] = useState(searchParams.get('tel') === '1')
  const [verConversion, setVerConversion] = useState(false)
  const [sesionActiva, setSesionActiva] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [planUsuario, setPlanUsuario] = useState<string>('gratis')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [noLeidosNav, setNoLeidosNav] = useState(0)
  const [fotoUrlNav, setFotoUrlNav] = useState<string>('')
  const [guardado, setGuardado] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [telefonoUsuario, setTelefonoUsuario] = useState('')

  useEffect(() => {
    fetch('/api/visita', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propiedadId: id }) })
  }, [id])

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setAuthReady(true)
      if (!data.user) return
      setSesionActiva(true)
      setUserId(data.user.id)
      const { data: usr } = await supabase.from('usuarios').select('plan, nombre, telefono, foto_url').eq('id', data.user.id).single()
      if (usr?.plan) setPlanUsuario(usr.plan)
      if (usr?.nombre) { setNombreUsuario(usr.nombre); setNombreContacto(usr.nombre) }
      if (usr?.telefono) { setTelefonoUsuario(usr.telefono); setTelefonoContacto(usr.telefono) }
      const foto = usr?.foto_url || data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || ''
      if (foto) setFotoUrlNav(foto)
      const { data: fav } = await supabase.from('favoritos').select('id').eq('usuario_id', data.user.id).eq('propiedad_id', id).maybeSingle()
      if (fav) setGuardado(true)
      const { data: msgs } = await supabase.from('mensajes').select('id').eq('vendedor_id', data.user.id)
      if (msgs) {
        const leidos: Record<string, boolean> = JSON.parse(localStorage.getItem(`habitade_leidos_${data.user.id}`) || '{}')
        setNoLeidosNav(msgs.filter((m: any) => !leidos[m.id]).length)
      }
    })
  }, [id])

  const toggleGuardado = async () => {
    if (!userId) { window.location.href = '/login'; return }
    if (guardado) {
      setGuardado(false)
      const { error } = await supabase.from('favoritos').delete().eq('usuario_id', userId).eq('propiedad_id', id)
      if (error) { console.error('favoritos delete:', error); setGuardado(true) }
    } else {
      setGuardado(true)
      const { error } = await supabase.from('favoritos').insert({ usuario_id: userId, propiedad_id: id })
      if (error) { console.error('favoritos insert:', error); setGuardado(false) }
    }
  }

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*, usuarios(*)')
        .eq('id', id)
        .single()
      if (error) console.error('[propiedad]', error)
      if (data) setPropiedad(data)
      setCargando(false)
    }
    cargar()
  }, [id])

  const handleVerTelefono = () => {
    if (!telVisible) {
      fetch('/api/tel-visto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propiedadId: id }) })
    }
    setTelVisible(v => !v)
  }

  const enviarMensaje = async () => {
    if (!sesionActiva) { window.location.href = `/login?next=/propiedad/${id}`; return }
    if (userId === propiedad?.usuario_id) { setErrorContacto(Tp.err_propio); return }
    if (!nombreContacto || !mensaje) { setErrorContacto(Tp.err_campos); return }
    const { data: bloq } = await supabase.from('bloqueados').select('id').eq('bloqueador_id', propiedad?.usuario_id).eq('bloqueado_id', userId).maybeSingle()
    if (bloq) { setErrorContacto(Tp.err_bloqueado); setEnviando(false); return }
    setEnviando(true)
    setErrorContacto('')
    const { error } = await supabase.from('mensajes').insert({
      propiedad_id: id,
      vendedor_id: propiedad?.usuario_id,
      remitente_id: userId,
      nombre_cliente: nombreContacto,
      telefono_cliente: telefonoContacto || null,
      mensaje,
    })
    if (error) { setErrorContacto(Tp.err_envio); setEnviando(false); return }
    setEnviado(true)
    setEnviando(false)
    setMensaje('')
  }

  if (cargando) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ color: '#006D77', fontSize: 15 }}>{Tp.cargando}</div>
    </div>
  )

  if (!propiedad) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, color: '#333', marginBottom: 12 }}>{Tp.noEncontrada}</div>
        <a href="/buscar" style={{ color: '#006D77' }}>{Tp.volver}</a>
      </div>
    </div>
  )

  const v = propiedad.usuarios || {}
  const amenidadesArray: string[] = Array.isArray(propiedad.amenidades) ? propiedad.amenidades : []
  const fotos: string[] = Array.isArray(propiedad.fotos) ? propiedad.fotos : []
  const esProfesional = v.plan === 'profesional'
  const tituloVendedor = v.inmobiliaria || v.nombre || 'Propietario'
  const telVendedor = v.telefono || ''
  const precio = propiedad.precio || 0
  const m2 = propiedad.m2 || 0

  const tipoSinHab = ['Edificio', 'Terreno'].includes(propiedad.tipo)
  const esTerreno = propiedad.tipo === 'Terreno'
  const sqft = m2 > 0 ? Math.round(m2 * 10.7639) : 0
  const tareas = m2 > 0 ? (m2 / 628.86) : 0
  const tareasStr = tareas < 1 ? tareas.toFixed(2) : Number.isInteger(tareas) ? String(tareas) : tareas.toFixed(2)
  const caracteristicas = [
    m2 > 0 && { label: Tp.superficie, val: m2.toLocaleString('en-US') + ' m²', icon: 'area' },
    !tipoSinHab && propiedad.habitaciones > 0 && { label: Tp.habitaciones, val: propiedad.habitaciones, icon: 'bed' },
    !tipoSinHab && propiedad.banos > 0 && { label: Tp.banos, val: propiedad.banos, icon: 'bath' },
    !tipoSinHab && propiedad.parqueos > 0 && { label: Tp.parqueos, val: propiedad.parqueos, icon: 'park' },
    !tipoSinHab && propiedad.planta && { label: Tp.planta, val: propiedad.planta, icon: 'floor' },
  ].filter(Boolean) as { label: string, val: any, icon: string }[]

  const iconosCar: Record<string, JSX.Element> = {
    bed: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><path d="M3 7h18M3 7v13h18V7M3 7l2-4h14l2 4"/><line x1="9" y1="11" x2="15" y2="11"/></svg>,
    bath: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z"/><path d="M4 12V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/></svg>,
    area: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>,
    park: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    floor: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 9v12"/></svg>,
    year: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  }

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6' }}>

      {/* MENÚ MÓVIL DROPDOWN */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.25)' }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 54, left: 0, right: 0, background: '#fff', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', borderRadius: '0 0 16px 16px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {authReady && sesionActiva ? (<>
              <div style={{ padding: '4px 0' }}>
                <div style={{ padding: '10px 20px 4px', fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1 }}>Mi cuenta</div>
                {[
                  { label: 'Mi panel',     href: '/panel',             icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
                  { label: 'Mis anuncios', href: '/panel?s=anuncios',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                  { label: 'Mensajes',     href: '/panel?s=mensajes',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, badge: noLeidosNav },
                  { label: 'Guardados',    href: '/panel?s=guardados', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
                  { label: 'Mi perfil',    href: '/panel?s=perfil',    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
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
                <button onClick={async () => { const { supabase: sb } = await import('../../../supabase'); await sb.auth.signOut(); window.location.href = '/' }} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', fontSize: 14, color: '#e63946', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Cerrar sesión
                </button>
              </div>
            </>) : authReady ? (
              <div style={{ padding: '14px 16px', display: 'flex', gap: 10 }}>
                <a href="/login" style={{ flex: 1, display: 'block', textAlign: 'center', padding: '11px', fontSize: 14, fontWeight: 600, color: '#006D77', border: '1.5px solid #006D77', borderRadius: 8, textDecoration: 'none' }}>Entrar</a>
                <a href="/registro" style={{ flex: 1, display: 'block', textAlign: 'center', padding: '11px', fontSize: 14, fontWeight: 600, color: '#fff', background: '#006D77', borderRadius: 8, textDecoration: 'none' }}>Publicar gratis</a>
              </div>
            ) : null}
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 20px 16px', background: '#fafafa' }}>
              <div style={{ display: 'flex', background: '#efefef', borderRadius: 8, overflow: 'hidden', padding: 3, gap: 2 }}>
                {(['es', 'en', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => { setIdioma(l); setMobileMenuOpen(false) }} style={{ all: 'unset', padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: idioma === l ? '#fff' : 'transparent', color: idioma === l ? '#006D77' : '#999', boxShadow: idioma === l ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>
            habitade<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          <div className="prop-nav-links">
            {[{ label: Tn.comprar, href: '/buscar?operacion=venta' }, { label: Tn.alquilar, href: '/buscar?operacion=alquiler' }].map(item => (
              <a key={item.label} href={item.href} style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{item.label}</a>
            ))}
          </div>
        </div>
        <div className="prop-nav-desktop" style={{ display: 'flex', gap: 8, visibility: authReady ? 'visible' : 'hidden', minWidth: 180, justifyContent: 'flex-end', flexShrink: 0 }}>
          {sesionActiva
            ? <a href="/panel" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {fotoUrlNav
                  ? <img src={fotoUrlNav} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.5)' }} />
                  : <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#83D4DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#004E57' }}>👤</div>
                }
                {Tn.miCuenta}
              </a>
            : <a href="/login" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>{Tn.entrar}</a>
          }
          {!sesionActiva && <a href="/registro" style={{ fontSize: 12, color: '#006D77', background: '#fff', padding: '6px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>{Tn.publicar}</a>}
        </div>
        <button className="prop-nav-hamburger" onClick={() => setMobileMenuOpen(v => !v)} style={{ display: 'none', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '8px 20px', fontSize: 12, color: '#aaa', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <a href="/" style={{ color: '#006D77', textDecoration: 'none' }}>Habitade</a>
        <span>›</span>
        <a href="/buscar" style={{ color: '#006D77', textDecoration: 'none' }}>República Dominicana</a>
        <span>›</span>
        <a href={`/buscar?operacion=${propiedad.operacion}`} style={{ color: '#006D77', textDecoration: 'none' }}>{propiedad.tipo}</a>
        <span>›</span>
        <span style={{ color: '#444' }}>{propiedad.titulo}</span>
      </div>

      <div className="propiedad-outer" style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 20px 40px' }}>
        <div className="propiedad-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* COLUMNA IZQUIERDA */}
          <div>

            {/* GALERÍA */}
            <GaleriaFotos fotos={fotos} destacado={propiedad.destacado} />

            {/* TÍTULO Y PRECIO */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>{propiedad.titulo}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    {propiedad.zona}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#006D77' }}>US$ {precio.toLocaleString('en-US')}</div>
                  <div style={{ fontSize: 13, color: '#aaa' }}>{formatDOP(precio)}</div>
                  {m2 > 0 && <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>US$ {Math.round(precio / m2).toLocaleString('en-US')}/m²</div>}
                </div>
              </div>
            </div>

            {/* CARACTERÍSTICAS */}
            {caracteristicas.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 16 }}>{Tp.caracteristicas}</h2>
                <div className="propiedad-caract-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {caracteristicas.map(c => (
                    c.icon === 'area' ? (
                      <div key={c.label} style={{ display: 'flex', flexDirection: 'column', padding: '10px 14px', background: '#f8f8f8', borderRadius: 6, cursor: 'pointer', userSelect: 'none' }} onClick={() => setVerConversion(v => !v)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, background: '#e0f5f7', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{iconosCar[c.icon]}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>{c.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{c.val}</div>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2.5" style={{ flexShrink: 0, transform: verConversion ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        {verConversion && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {esTerreno && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                <span style={{ color: '#888' }}>Tareas</span>
                                <span style={{ fontWeight: 600, color: '#111' }}>{tareasStr} tareas</span>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                              <span style={{ color: '#888' }}>Pies cuadrados</span>
                              <span style={{ fontWeight: 600, color: '#111' }}>{sqft.toLocaleString('en-US')} sq ft</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8f8f8', borderRadius: 6 }}>
                      <div style={{ width: 36, height: 36, background: '#e0f5f7', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{iconosCar[c.icon]}</div>
                      <div>
                        <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{c.val}</div>
                      </div>
                    </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPCIÓN */}
            {propiedad.descripcion && (
              <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 }}>{Tp.descripcion}</h2>
                {(propiedad.descripcion as string).split('\n\n').map((p: string, i: number) => (
                  <p key={i} style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 12 }}>{p}</p>
                ))}
              </div>
            )}

            {/* AMENIDADES */}
            {amenidadesArray.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 }}>{Tp.amenidades}</h2>
                <div className="propiedad-amenidades-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {amenidadesArray.map((a: string) => (
                    <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      {AMENIDADES_LABELS[a] || a}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* SIDEBAR VENDEDOR */}
          <div className="propiedad-sidebar" style={{ position: 'sticky', top: 70 }}>
            <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <div style={{ background: '#006D77', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#004E57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#83D4DB', flexShrink: 0, overflow: 'hidden' }}>
                  {v.foto_url
                    ? <img src={v.foto_url} alt={v.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (v.nombre || 'U').split(' ').map((n: string) => n[0] || '').join('').slice(0, 2).toUpperCase()
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    {v.nombre || 'Propietario'}
                    {esProfesional
                      ? <span style={{ background: '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>PROFESIONAL</span>
                      : <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>PARTICULAR</span>
                    }
                  </div>
                  {v.inmobiliaria && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{v.inmobiliaria}</div>}
                  {v.numero_aei && v.aei_aprobado && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: '#1a3a5c', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, marginTop: 4 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#83D4DB" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      AEI
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: '16px 18px' }}>
                {/* TELÉFONO */}
                {!telVisible && (
                  <button onClick={handleVerTelefono} style={{ all: 'unset', width: '100%', background: '#006D77', color: '#fff', padding: '11px', borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center', display: 'block', marginBottom: 14, boxSizing: 'border-box' }}>
                    {Tp.verTelefono}
                  </button>
                )}
                {telVisible && (
                  <div style={{ background: '#e0f5f7', border: '1px solid #b2dde2', borderRadius: 5, padding: '12px 14px', marginBottom: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{Tp.telContacto}</div>
                    {telVendedor
                      ? <a href={`tel:${telVendedor}`} style={{ fontSize: 20, fontWeight: 700, color: '#006D77', textDecoration: 'none', display: 'block' }}>{telVendedor}</a>
                      : <span style={{ fontSize: 13, color: '#888' }}>{Tp.sinTelefono}</span>
                    }
                  </div>
                )}

                {/* FORMULARIO DE CONTACTO */}
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{Tp.enviarMensaje}</div>
                  {!sesionActiva ? (
                    <div style={{ background: '#f9f9f9', border: '1px solid #e8e8e8', borderRadius: 6, padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>{Tp.sinSesion}</div>
                      <a href={`/login?next=/propiedad/${id}`} style={{ display: 'inline-block', background: '#17A6B4', color: '#fff', padding: '9px 22px', borderRadius: 5, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>{Tp.iniciarSesion}</a>
                      <div style={{ marginTop: 10, fontSize: 12, color: '#aaa' }}>{Tp.sinCuenta} <a href="/registro" style={{ color: '#006D77', textDecoration: 'none', fontWeight: 500 }}>{Tp.registrate}</a></div>
                    </div>
                  ) : userId === propiedad?.usuario_id ? (
                    <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 6, padding: '12px', textAlign: 'center', fontSize: 13, color: '#7a6000' }}>
                      {Tp.tuAnuncio}
                    </div>
                  ) : enviado ? (
                    <div style={{ background: '#e0f5f7', border: '1px solid #c5e8ea', borderRadius: 6, padding: '14px', textAlign: 'center', fontSize: 13, color: '#004E57', fontWeight: 500 }}>
                      {Tp.mensajeEnviado}
                    </div>
                  ) : (
                    <>
                      <input value={nombreContacto} onChange={e => setNombreContacto(e.target.value)} placeholder={Tp.tuNombre} style={{ width: '100%', border: '1px solid #ddd', borderRadius: 5, padding: '9px 10px', fontSize: 13, color: '#333', outline: 'none', boxSizing: 'border-box', marginBottom: 8, fontFamily: 'sans-serif' }} />
                      <input value={telefonoContacto} onChange={e => setTelefonoContacto(e.target.value)} placeholder={Tp.tuTelefono} style={{ width: '100%', border: '1px solid #ddd', borderRadius: 5, padding: '9px 10px', fontSize: 13, color: '#333', outline: 'none', boxSizing: 'border-box', marginBottom: 8, fontFamily: 'sans-serif' }} />
                      <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} rows={3} placeholder={Tp.placeholder_msg} style={{ width: '100%', border: '1px solid #ddd', borderRadius: 5, padding: '10px', fontSize: 13, color: '#333', resize: 'none', fontFamily: 'sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
                      {errorContacto && <div style={{ fontSize: 12, color: '#e53e3e', marginBottom: 8 }}>{errorContacto}</div>}
                      <button onClick={enviarMensaje} disabled={enviando} style={{ all: 'unset', width: '100%', background: enviando ? '#aaa' : '#17A6B4', color: '#fff', padding: '11px', borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: enviando ? 'default' : 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                        {enviando ? Tp.enviando : Tp.enviarMensaje}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
              <button onClick={toggleGuardado} style={{ all: 'unset', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: `1.5px solid ${guardado ? '#006D77' : '#e0e0e0'}`, borderRadius: 8, padding: '11px', fontSize: 13, color: guardado ? '#006D77' : '#555', cursor: 'pointer', background: guardado ? '#e0f5f7' : '#fff', fontWeight: guardado ? 600 : 400, boxSizing: 'border-box' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill={guardado ? '#006D77' : 'none'} stroke={guardado ? '#006D77' : 'currentColor'} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {guardado ? Tp.guardado : Tp.guardar}
              </button>
              <button onClick={async () => {
                const url = window.location.href.split('?')[0]
                if (navigator.share) { navigator.share({ title: propiedad?.titulo || 'Propiedad en Habitade', url }) }
                else { await navigator.clipboard.writeText(url); alert(Tp.enlaceCopiad) }
              }} style={{ all: 'unset', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '11px', fontSize: 13, color: '#555', cursor: 'pointer', background: '#fff', boxSizing: 'border-box' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                {Tp.compartir}
              </button>
            </div>
          </div>

          {/* MAPA — tercer elemento del grid para poder reordenarlo en móvil */}
          <div className="propiedad-mapa-col" style={{ background: '#fff', borderRadius: 8, padding: '20px 24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 }}>{Tp.ubicacion}</h2>
            <div style={{ height: 300, borderRadius: 6, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
              <MapaUbicacion zona={propiedad.zona || ''} />
            </div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              {propiedad.zona}
            </div>
          </div>

        </div>
      </div>

      <footer style={{ background: '#004E57', color: 'rgba(255,255,255,0.5)', padding: '20px', fontSize: 12, textAlign: 'center' }}>
        <strong style={{ color: 'rgba(255,255,255,0.8)' }}>habitade.com</strong> · © 2025 · República Dominicana
      </footer>
    </main>
  )
}
