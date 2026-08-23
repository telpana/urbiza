'use client'
import { useState, useEffect, useRef, use } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../supabase'
import { useIdioma } from '../../../IdiomaContext'
import NavUserMenu from '../../../components/NavUserMenu'

import { getDopRate, formatDOP } from '../../../lib/dopRate'
import { getZonaCenter } from '../../lib/zonasCoords'

const getLatLng = getZonaCenter

function MapaUbicacion({ zona, propLat, propLng }: { zona: string, propLat?: number | null, propLng?: number | null }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const hasExact = propLat != null && propLng != null
  const [lat, lng] = hasExact ? [propLat!, propLng!] : getLatLng(zona)

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
      const map = L.map(mapRef.current, { center: [lat, lng], zoom: hasExact ? 15 : 13, zoomControl: true, attributionControl: false, scrollWheelZoom: false })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map)
      const icono = L.divIcon({
        className: '',
        html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 19 11 19s11-11.333 11-19C22 4.925 17.075 0 11 0z" fill="#006D77" stroke="#fff" stroke-width="1.5"/><circle cx="11" cy="11" r="4.5" fill="#fff"/></svg>`,
        iconSize: [22, 30], iconAnchor: [11, 38],
      })
      L.marker([lat, lng], { icon: icono }).addTo(map)
      mapInstanceRef.current = map
      setTimeout(() => map.invalidateSize(), 100)
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

function sbImg(url: string, w: number, q = 75) {
  if (!url) return url
  try {
    const u = new URL(url)
    if (!u.hostname.includes('supabase.co')) return url
    const path = u.pathname.replace('/storage/v1/object/public/', '')
    return `${u.origin}/storage/v1/render/image/public/${path}?width=${w}&quality=${q}&resize=contain`
  } catch { return url }
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
      <div className="propiedad-galeria-main" style={{ height: 420, position: 'relative', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'pan-y' }}
        onTouchStart={e => { (e.currentTarget as any)._tx = e.touches[0].clientX }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - ((e.currentTarget as any)._tx || 0)
          if (dx < -50) setActiva(a => Math.min(a + 1, fotos.length - 1))
          else if (dx > 50) setActiva(a => Math.max(a - 1, 0))
        }}
      >
        {destacado && <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>DESTACADO</div>}
        {fotos.map((foto, i) => (
          <img key={i} src={sbImg(foto, 1200)} fetchPriority={i === 0 ? 'high' : 'low'} decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: i === activa ? 1 : 0, transition: 'opacity 0.2s', zIndex: 1 }} />
        ))}
        <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 20, zIndex: 4 }}>{activa + 1} / {fotos.length}</div>
        {activa > 0 && <button onClick={() => setActiva(a => a - 1)} style={{ all: 'unset', position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20, color: '#333', zIndex: 4 }}>‹</button>}
        {activa < fotos.length - 1 && <button onClick={() => setActiva(a => a + 1)} style={{ all: 'unset', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20, color: '#333', zIndex: 4 }}>›</button>}
      </div>
      {fotos.length > 1 && (
        <div className="galeria-thumbs" style={{ display: 'flex', gap: 6, padding: '10px 12px', background: '#f9f9f9', overflowX: 'auto' }}>
          {fotos.map((src, i) => (
            <img key={i} src={sbImg(src, 150, 60)} onClick={() => setActiva(i)} loading="lazy" decoding="async" style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 4, flexShrink: 0, cursor: 'pointer', border: activa === i ? '2px solid #006D77' : '2px solid transparent' }} />
          ))}
        </div>
      )}
    </div>
  )
}

function DescripcionMultiIdioma({ propiedad, idioma, setIdioma, Tp }: { propiedad: any, idioma: string, setIdioma: (i: any) => void, Tp: any }) {
  const disponibles: {code: string, label: string}[] = [{ code: 'es', label: 'ES' }]
  if (propiedad.descripcion_en?.trim()) disponibles.push({ code: 'en', label: 'EN' })
  if (propiedad.descripcion_fr?.trim()) disponibles.push({ code: 'fr', label: 'FR' })

  const lang = disponibles.find(d => d.code === idioma)?.code ?? 'es'
  const texto = lang === 'en' ? propiedad.descripcion_en : lang === 'fr' ? propiedad.descripcion_fr : propiedad.descripcion

  const [expandida, setExpandida] = useState(false)
  const parrafos = (texto || '').split('\n\n')
  const necesitaColapsar = (texto || '').length > 400

  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>{Tp.descripcion}</h2>
        {disponibles.length > 1 && (
          <div style={{ display: 'flex', gap: 4, background: '#f0f0f0', borderRadius: 6, padding: 3 }}>
            {disponibles.map(d => (
              <button key={d.code} onClick={() => setIdioma(d.code)}
                style={{ border: 'none', outline: 'none', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: lang === d.code ? '#006D77' : 'transparent', color: lang === d.code ? '#fff' : '#888', transition: 'background 0.15s, color 0.15s', touchAction: 'manipulation', userSelect: 'none' }}>
                {d.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ overflow: 'hidden', maxHeight: expandida || !necesitaColapsar ? 'none' : 200 }}>
          {parrafos.map((p: string, i: number) => (
            <p key={i} style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 12, overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{p}</p>
          ))}
        </div>
        {!expandida && necesitaColapsar && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)', pointerEvents: 'none' }} />
        )}
      </div>
      {necesitaColapsar && (
        <button onClick={() => setExpandida(e => !e)} style={{ all: 'unset', marginTop: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#006D77' }}>
          {expandida ? Tp.verMenos : Tp.verDescCompleta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2.5" style={{ transform: expandida ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      )}
    </div>
  )
}

const MOTIVOS = [
  'Información incorrecta',
  'Fotos engañosas o de otro inmueble',
  'Precio incorrecto o engañoso',
  'Anuncio duplicado',
  'Propiedad ya vendida / alquilada',
  'Contenido inapropiado',
  'Otro',
]

function ReportarAnuncio({ propiedadId }: { propiedadId: number | string }) {
  const { tr } = useIdioma()
  const Tp = tr.propiedad
  const [abierto, setAbierto] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const enviar = async () => {
    if (!motivo) return
    setEnviando(true)
    await fetch('/api/reportar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propiedad_id: propiedadId, motivo, comentario }),
    })
    setEnviando(false)
    setEnviado(true)
    setTimeout(() => { setAbierto(false); setEnviado(false); setMotivo(''); setComentario('') }, 2000)
  }

  return (
    <div style={{ textAlign: 'center', padding: '14px 16px 20px' }}>
      {!abierto ? (
        <button onClick={() => setAbierto(true)} style={{ all: 'unset', fontSize: 12, color: '#006D77', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, opacity: 0.7 }}>
          {Tp.reportarBtn}
        </button>
      ) : (
        <div style={{ display: 'inline-block', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: '18px 20px', textAlign: 'left', width: '100%', maxWidth: 480, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {enviado ? (
            <div style={{ textAlign: 'center', padding: '8px 0', color: '#006D77', fontWeight: 600, fontSize: 14 }}>
              {Tp.reportarOk}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{Tp.reportarTitulo}</span>
                <button onClick={() => setAbierto(false)} style={{ all: 'unset', cursor: 'pointer', color: '#aaa', fontSize: 18, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MOTIVOS.map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#444' }}>
                    <input type="radio" name="motivo" value={m} checked={motivo === m} onChange={() => setMotivo(m)} style={{ accentColor: '#006D77' }} />
                    {m}
                  </label>
                ))}
              </div>
              <textarea value={comentario} onChange={e => setComentario(e.target.value)} placeholder={Tp.reportarComentario} rows={2}
                style={{ width: '100%', marginTop: 12, border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '8px 10px', fontSize: 12, resize: 'none', outline: 'none', color: '#444', boxSizing: 'border-box' }} />
              <button onClick={enviar} disabled={!motivo || enviando}
                style={{ all: 'unset', marginTop: 10, background: !motivo || enviando ? '#ccc' : '#e63946', color: '#fff', padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: !motivo || enviando ? 'default' : 'pointer', display: 'block', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
                {enviando ? Tp.reportarEnviando : Tp.reportarEnviar}
              </button>
            </>
          )}
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
  const [dopRate, setDopRate] = useState(59.5)
  const [mensaje, setMensaje] = useState('')
  const [nombreContacto, setNombreContacto] = useState('')
  const [telefonoContacto, setTelefonoContacto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errorContacto, setErrorContacto] = useState('')
  const [telVisible, setTelVisible] = useState(searchParams.get('tel') === '1')
  const [verConversion, setVerConversion] = useState(false)
  const [sesionActiva, setSesionActiva] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return !!localStorage.getItem('hb_perfil_uid') } catch { return false }
  })
  const [authReady, setAuthReady] = useState(false)
  const [planUsuario, setPlanUsuario] = useState<string>('gratis')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [noLeidosNav, setNoLeidosNav] = useState(0)
  const [fotoUrlNav, setFotoUrlNav] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    try { return localStorage.getItem('hb_perfil_foto') || '' } catch { return '' }
  })
  const [iniCacheNav, setIniCacheNav] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    try { return localStorage.getItem('hb_perfil_inicial') || '' } catch { return '' }
  })
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
      if (usr?.nombre) {
        setNombreUsuario(usr.nombre); setNombreContacto(usr.nombre)
        const partes = usr.nombre.trim().split(/\s+/).filter(Boolean)
        const ini = partes.length >= 2 ? (partes[0][0] + partes[1][0]).toUpperCase() : partes[0]?.[0]?.toUpperCase() || ''
        setIniCacheNav(ini)
      }
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

  useEffect(() => { getDopRate().then(setDopRate) }, [])

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .single()
      if (error) console.error('[propiedad]', error)
      if (data) {
        const res = await fetch(`/api/vendedor?id=${data.usuario_id}`)
        const vendedor = res.ok ? await res.json() : {}
        setPropiedad({ ...data, usuarios: vendedor })
      }
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

  const handleWhatsApp = () => {
    fetch('/api/tel-visto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propiedadId: id }) })
  }

  const enviarMensaje = async () => {
    if (!sesionActiva) { window.location.href = `/login?next=/propiedad/${id}`; return }
    if (userId === propiedad?.usuario_id) { setErrorContacto(Tp.err_propio); return }
    if (!nombreContacto || !mensaje) { setErrorContacto(Tp.err_campos); return }
    const { data: bloq } = await supabase.from('bloqueados').select('id').eq('bloqueador_id', propiedad?.usuario_id).eq('bloqueado_id', userId).maybeSingle()
    if (bloq) { setErrorContacto(Tp.err_bloqueado); setEnviando(false); return }
    setEnviando(true)
    setErrorContacto('')
    const { data: { session: msgSess } } = await supabase.auth.getSession()
    const msgTok = msgSess?.access_token
    const res = await fetch('/api/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(msgTok ? { Authorization: `Bearer ${msgTok}` } : {}) },
      body: JSON.stringify({ propiedad_id: id, vendedor_id: propiedad?.usuario_id, nombre_cliente: nombreContacto, telefono_cliente: telefonoContacto || null, mensaje }),
    })
    if (!res.ok) { setErrorContacto(Tp.err_envio); setEnviando(false); return }
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
  const tituloMostrar = (idioma === 'en' && propiedad.titulo_en) ? propiedad.titulo_en : (idioma === 'fr' && propiedad.titulo_fr) ? propiedad.titulo_fr : propiedad.titulo
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
    !tipoSinHab && propiedad.planta && { label: Tp.piso, val: propiedad.planta, icon: 'floor' },
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.25)' }} onClick={() => setMobileMenuOpen(false)}>
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
                  <button key={l} onClick={() => { setIdioma(l); setMobileMenuOpen(false) }} style={{ border: 'none', outline: 'none', padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: idioma === l ? '#fff' : 'transparent', color: idioma === l ? '#006D77' : '#999', boxShadow: idioma === l ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'background 0.15s, color 0.15s, box-shadow 0.15s', touchAction: 'manipulation', userSelect: 'none' }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 1100 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>
            habitade.
          </a>
          <div className="prop-nav-links" style={{ display: 'flex' }}>
            {[{ label: Tn.comprar, href: '/buscar?operacion=venta' }, { label: Tn.alquilar, href: '/buscar?operacion=alquiler' }].map(item => (
              <a key={item.label} href={item.href} style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{item.label}</a>
            ))}
          </div>
        </div>
        <div className="prop-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 8, visibility: authReady ? 'visible' : 'hidden', justifyContent: 'flex-end', flexShrink: 0 }}>
          {sesionActiva && <NavUserMenu dark={true} />}
          {authReady && !sesionActiva && <>
            <a href="/login" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>{Tn.entrar}</a>
            <a href="/registro" style={{ fontSize: 12, color: '#006D77', background: '#fff', padding: '6px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>{Tn.publicar}</a>
          </>}
        </div>
        <button className="prop-nav-hamburger" onClick={() => setMobileMenuOpen(v => !v)} style={{ display: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', touchAction: 'manipulation' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 20, padding: '4px 10px 4px 4px', background: 'rgba(255,255,255,0.12)' }}>
            {sesionActiva ? (
              fotoUrlNav
                ? <img src={fotoUrlNav} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} referrerPolicy="no-referrer" />
                : <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#83D4DB', color: '#004E57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: iniCacheNav.length > 1 ? 10 : 12, fontWeight: 700, letterSpacing: -0.5, flexShrink: 0 }}>{iniCacheNav || 'U'}</div>
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
            )}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M0 1h16M0 6h16M0 11h16" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
        </button>
      </nav>

      {/* BREADCRUMB — desktop */}
      <div className="prop-breadcrumb" style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '8px 20px', fontSize: 12, color: '#aaa', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <a href="/" style={{ color: '#006D77', textDecoration: 'none' }}>Habitade</a>
        <span>›</span>
        <a href="/buscar" style={{ color: '#006D77', textDecoration: 'none' }}>República Dominicana</a>
        <span>›</span>
        <a href={`/buscar?operacion=${propiedad.operacion}`} style={{ color: '#006D77', textDecoration: 'none' }}>{propiedad.tipo}</a>
        <span>›</span>
        <span style={{ color: '#444' }}>{tituloMostrar}</span>
      </div>

      <div className="propiedad-outer" style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 20px 40px' }}>
        <div className="propiedad-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* COLUMNA IZQUIERDA */}
          <div style={{ minWidth: 0 }}>

            {/* GALERÍA */}
            <GaleriaFotos fotos={fotos} destacado={propiedad.destacado} />
            {/* TÍTULO MÓVIL — debajo de la foto, con corazón de favorito */}
            <div className="galeria-titulo-bajo" style={{ display: 'none', padding: '14px 16px 12px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0, lineHeight: 1.3, flex: 1, overflowWrap: 'break-word', wordBreak: 'break-word' }}>{tituloMostrar}</h1>
                <button onClick={toggleGuardado} style={{ all: 'unset', cursor: 'pointer', padding: '2px 0 0 4px', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={guardado ? '#e63946' : 'none'} stroke={guardado ? '#e63946' : '#bbb'} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#888', marginTop: 5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                {propiedad.zona}
              </div>
            </div>

            {/* TÍTULO Y PRECIO */}
            <div className="propiedad-precio-bloque" style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div className="prop-titulo-desktop">
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6, overflowWrap: 'break-word', wordBreak: 'break-word' }}>{tituloMostrar}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    {propiedad.zona}
                  </div>
                </div>
                <div className="propiedad-precio-wrap" style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#006D77' }}>US$ {precio.toLocaleString('en-US')}</div>
                  <div style={{ fontSize: 13, color: '#aaa' }}>{formatDOP(precio, dopRate)}</div>
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
                      <div key={c.label} className="caract-area-item" style={{ display: 'flex', flexDirection: 'column', padding: '10px 14px', background: '#f8f8f8', borderRadius: 6, cursor: 'pointer', userSelect: 'none' }} onClick={() => setVerConversion(v => !v)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, background: '#e0f5f7', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{iconosCar[c.icon]}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>{c.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{c.val}</div>
                          </div>
                          <svg className="caract-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2.5" style={{ flexShrink: 0, transform: verConversion ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        {verConversion && (
                          <div className="caract-conversion" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {esTerreno && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                <span style={{ color: '#888' }}>{Tp.tareas}</span>
                                <span style={{ fontWeight: 600, color: '#111' }}>{tareasStr}</span>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                              <span style={{ color: '#888' }}>{Tp.piesC}</span>
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
              <DescripcionMultiIdioma propiedad={propiedad} idioma={idioma} setIdioma={setIdioma} Tp={Tp} />
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
                      {(tr.amenidades as any)[a] || a}
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
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    {v.nombre || 'Propietario'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                    {esProfesional
                      ? <span style={{ background: '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{Tp.profesional}</span>
                      : <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>{Tp.particular}</span>
                    }
                    {v.numero_aei && v.aei_aprobado && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: '#1a3a5c', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#83D4DB" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        AEI
                      </span>
                    )}
                  </div>
                  {v.inmobiliaria && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{v.inmobiliaria}</div>}
                </div>
              </div>

              <div style={{ padding: '16px 18px' }}>
                {/* TELÉFONO + WHATSAPP */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {!telVisible ? (
                      <button onClick={handleVerTelefono} style={{ all: 'unset', width: '100%', background: '#006D77', color: '#fff', padding: '11px', borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                        {Tp.verTelefono}
                      </button>
                    ) : (
                      <div style={{ background: '#e0f5f7', border: '1px solid #b2dde2', borderRadius: 5, padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#555', marginBottom: 2 }}>{Tp.telContacto}</div>
                        {telVendedor
                          ? <a href={`tel:${telVendedor}`} style={{ fontSize: 18, fontWeight: 700, color: '#006D77', textDecoration: 'none' }}>{telVendedor}</a>
                          : <span style={{ fontSize: 13, color: '#888' }}>{Tp.sinTelefono}</span>
                        }
                      </div>
                    )}
                  </div>
                  {telVendedor && (
                    <a
                      href={`https://wa.me/${telVendedor.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWhatsApp}
                      aria-label="WhatsApp"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#006D77', borderRadius: 5, width: 46, flexShrink: 0, textDecoration: 'none' }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  )}
                </div>

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
                      <button onClick={enviarMensaje} disabled={enviando} style={{ all: 'unset', width: '100%', background: enviando ? '#aaa' : '#006D77', color: '#fff', padding: '11px', borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: enviando ? 'default' : 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                        {enviando ? Tp.enviando : Tp.enviarMensaje}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 0, marginTop: 12, borderTop: '1px solid #f0f0f0' }}>
              <button onClick={toggleGuardado} style={{ all: 'unset', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '14px 8px', fontSize: 11, fontWeight: 600, color: guardado ? '#006D77' : '#888', cursor: 'pointer', boxSizing: 'border-box', borderRight: '1px solid #f0f0f0' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={guardado ? '#006D77' : 'none'} stroke={guardado ? '#006D77' : '#aaa'} strokeWidth="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {guardado ? Tp.guardado : Tp.guardar}
              </button>
              <button onClick={async () => {
                const url = window.location.href.split('?')[0]
                fetch('/api/compartir', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propiedadId: id }) })
                if (navigator.share) { navigator.share({ title: propiedad?.titulo || 'Propiedad en Habitade', url }) }
                else { await navigator.clipboard.writeText(url); alert(Tp.enlaceCopiad) }
              }} style={{ all: 'unset', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '14px 8px', fontSize: 11, fontWeight: 600, color: '#888', cursor: 'pointer', boxSizing: 'border-box' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.6"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                {Tp.compartir}
              </button>
            </div>
          </div>

          {/* MAPA — tercer elemento del grid para poder reordenarlo en móvil */}
          <div className="propiedad-mapa-col" style={{ background: '#fff', borderRadius: 8, padding: '20px 24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 14 }}>{Tp.ubicacion}</h2>
            <div style={{ height: 300, borderRadius: 6, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
              <MapaUbicacion zona={propiedad.zona || ''} propLat={propiedad.lat} propLng={propiedad.lng} />
            </div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              {propiedad.zona}
            </div>

            {/* TARJETA BROKER — solo profesionales */}
            {propiedad.usuarios?.tipo === 'profesional' && (
              <div style={{ marginTop: 20 }}>
                <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #e8f4f5', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg, #004E57 0%, #006D77 100%)', height: 6 }} />
                  <div className="broker-card-inner" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '24px 28px', position: 'relative' }}>
                    {/* MOBILE ONLY: iconos arriba-derecha (order:-1 los pone antes de la foto en column) */}
                    {(propiedad.usuarios?.web_url || propiedad.usuarios?.instagram_url) && (
                      <div className="broker-icons-toprow">
                        {propiedad.usuarios?.web_url && (
                          <a href={/^https?:\/\//i.test(propiedad.usuarios.web_url) ? propiedad.usuarios.web_url : `https://${propiedad.usuarios.web_url}`} target="_blank" rel="noopener noreferrer" title="Web" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: '#f0fafb', border: '1.5px solid #c7eaee', color: '#006D77', textDecoration: 'none' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          </a>
                        )}
                        {propiedad.usuarios?.instagram_url && (
                          <a href={/^https?:\/\//i.test(propiedad.usuarios.instagram_url) ? propiedad.usuarios.instagram_url : `https://${propiedad.usuarios.instagram_url}`} target="_blank" rel="noopener noreferrer" title="Instagram" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: '#f0fafb', border: '1.5px solid #c7eaee', color: '#006D77', textDecoration: 'none' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                          </a>
                        )}
                      </div>
                    )}
                    {/* Foto */}
                    <div style={{ flexShrink: 0 }}>
                      <div className="broker-foto" style={{ width: 80, height: 80, borderRadius: '50%', background: '#e0f5f7', overflow: 'hidden', border: '3px solid #006D77', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#006D77' }}>
                        {propiedad.usuarios?.foto_url
                          ? <img src={propiedad.usuarios.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : (propiedad.usuarios?.nombre || 'P').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                        }
                      </div>
                    </div>
                    {/* Texto */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: 6 }}>
                        {/* Nombre: bloque puro, nada puede fluir a su lado */}
                        <div style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 6, lineHeight: 1.3 }} className="broker-name-row">
                          {propiedad.usuarios?.nombre}
                          {/* iconos junto al nombre (solo móvil via CSS) */}
                          {(propiedad.usuarios?.web_url || propiedad.usuarios?.instagram_url) && (
                            <span className="broker-icons-namerow" style={{ alignItems: 'center', gap: 6, marginLeft: 8, verticalAlign: 'middle' }}>
                              {propiedad.usuarios?.web_url && (
                                <a href={/^https?:\/\//i.test(propiedad.usuarios.web_url) ? propiedad.usuarios.web_url : `https://${propiedad.usuarios.web_url}`} target="_blank" rel="noopener noreferrer" title="Web" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: '#f0fafb', border: '1.5px solid #c7eaee', color: '#006D77', textDecoration: 'none' }}>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                </a>
                              )}
                              {propiedad.usuarios?.instagram_url && (
                                <a href={/^https?:\/\//i.test(propiedad.usuarios.instagram_url) ? propiedad.usuarios.instagram_url : `https://${propiedad.usuarios.instagram_url}`} target="_blank" rel="noopener noreferrer" title="Instagram" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: '#f0fafb', border: '1.5px solid #c7eaee', color: '#006D77', textDecoration: 'none' }}>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                                </a>
                              )}
                            </span>
                          )}
                        </div>
                        {/* Badges: siempre en su propia línea debajo del nombre */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{Tp.profesional}</span>
                          {propiedad.usuarios?.aei_aprobado && (
                            <span style={{ background: '#1a3a5c', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap' }}>✓ AEI</span>
                          )}
                        </div>
                      </div>
                      {propiedad.usuarios?.inmobiliaria && (
                        <div style={{ fontSize: 13, color: '#006D77', fontWeight: 500, marginBottom: 8 }}>{propiedad.usuarios.inmobiliaria}</div>
                      )}
                      {Array.isArray(propiedad.usuarios?.idiomas) && propiedad.usuarios.idiomas.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          {propiedad.usuarios.idiomas.map((lang: string) => (
                            <span key={lang} style={{ background: '#f0fafb', border: '1px solid #c7eaee', color: '#006D77', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>{lang}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* REPORTAR ANUNCIO */}
      <ReportarAnuncio propiedadId={propiedad.id} />

      <footer style={{ background: '#004E57', color: 'rgba(255,255,255,0.5)', padding: '20px', fontSize: 12, textAlign: 'center' }}>
        <strong style={{ color: 'rgba(255,255,255,0.8)' }}>habitade.com</strong> · © 2026 · {tr.footer.derechos.split('·').pop()?.trim()}
      </footer>
    </main>
  )
}
