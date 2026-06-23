'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabase'
import { useIdioma } from '../../IdiomaContext'

function getMenuItems(Tpanel: any) {
  return [
    { id: 'anuncios', label: Tpanel?.menu?.anuncios ?? 'Mis anuncios', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id: 'publicar', label: Tpanel?.menu?.publicar ?? 'Publicar anuncio', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
    { id: 'mensajes', label: Tpanel?.menu?.mensajes ?? 'Mensajes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id: 'estadisticas', label: Tpanel?.menu?.estadisticas ?? 'Estadísticas', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id: 'destacar', label: Tpanel?.menu?.destacar ?? 'Destacar anuncio', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'plan', label: Tpanel?.menu?.plan ?? 'Mi plan', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id: 'perfil', label: Tpanel?.menu?.perfil ?? 'Mi perfil', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: 'guardados', label: Tpanel?.menu?.guardados ?? 'Guardados', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
    { id: 'cursos', label: Tpanel?.menu?.cursos ?? 'Cursos AEI', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  ]
}

const anunciosEjemplo = [
  { id: 1, titulo: 'Apartamento en Piantini', precio: 285000, zona: 'Piantini, D.N.', tipo: 'Apartamento', estado: 'activo', impresiones: 1240, clics: 342, telVistos: 28, favoritos: 15, destacado: true, vence: '15 días', bg: '#e0f5f7' },
  { id: 2, titulo: 'Villa en Arroyo Hondo', precio: 520000, zona: 'Arroyo Hondo, D.N.', tipo: 'Villa', estado: 'activo', impresiones: 890, clics: 198, telVistos: 12, favoritos: 8, destacado: false, vence: '22 días', bg: '#ddf0e8' },
  { id: 3, titulo: 'Oficina en Naco', precio: 180000, zona: 'Naco, D.N.', tipo: 'Oficina', estado: 'pausado', impresiones: 320, clics: 89, telVistos: 5, favoritos: 3, destacado: false, vence: '8 días', bg: '#e8eaf0' },
]

const mensajesEjemplo = [
  { id: 1, nombre: 'María Rodríguez', telefono: '+1 809 555 1234', propiedad: 'Apartamento en Piantini', propiedadId: 1, mensaje: 'Buenos días, me interesa el apartamento. ¿Está disponible para visita este fin de semana? Soy compradora seria y tengo financiamiento aprobado.', fecha: 'Hace 20 min', leido: false, avatar: 'MR' },
  { id: 2, nombre: 'Carlos Peña', telefono: '+1 809 555 5678', propiedad: 'Villa en Arroyo Hondo', propiedadId: 2, mensaje: '¿Cuál es el precio final? ¿Acepta negociación? Estoy interesado en comprar antes de fin de mes.', fecha: 'Hace 2h', leido: false, avatar: 'CP' },
  { id: 3, nombre: 'Ana Jiménez', telefono: null, propiedad: 'Apartamento en Piantini', propiedadId: 1, mensaje: 'Hola, me gustaría saber si el precio incluye los muebles y si tiene generador propio. Gracias.', fecha: 'Ayer', leido: true, avatar: 'AJ' },
  { id: 4, nombre: 'Roberto Santos', telefono: '+1 809 555 9012', propiedad: 'Oficina en Naco', propiedadId: 3, mensaje: 'Somos una empresa buscando oficina para 15 personas. ¿Está disponible para alquiler?', fecha: 'Hace 2 días', leido: true, avatar: 'RS' },
  { id: 5, nombre: 'Laura Martínez', telefono: null, propiedad: 'Villa en Arroyo Hondo', propiedadId: 2, mensaje: 'Me encanta la propiedad. ¿Tiene fotos adicionales del jardín y la piscina? ¿Cuándo podríamos hacer una visita?', fecha: 'Hace 3 días', leido: true, avatar: 'LM' },
]

const planesDestacado = [
  { dias: 15, precio: 9.99, label: '15 días', popular: false },
  { dias: 30, precio: 19.99, label: '30 días', popular: true },
  { dias: 60, precio: 34.99, label: '60 días', popular: false },
]


const provinciasZonas: Record<string, string[]> = {
  'Distrito Nacional': ['Piantini', 'Naco', 'Serrallés', 'Bella Vista', 'Arroyo Hondo', 'Los Cacicazgos', 'Gazcue', 'Ciudad Colonial', 'Evaristo Morales', 'Miramar', 'La Esperilla', 'Viejo Arroyo Hondo', 'Urbanización Real', 'Cristo Rey', 'Villa Consuelo', 'Ensanche Ozama'],
  'Santo Domingo': ['Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste', 'Boca Chica', 'Los Tres Brazos', 'Alma Rosa', 'Los Mina', 'San Isidro', 'Ensanche Isabelita'],
  'La Altagracia': ['Bávaro', 'Punta Cana', 'Downtown Punta Cana', 'Cap Cana', 'Cabeza de Toro', 'Los Corales', 'Uvero Alto', 'Macao', 'Cortecito', 'Higüey', 'San Rafael del Yuma'],
  'Santiago': ['Los Jardines', 'Cerros de Gurabo', 'Reparto Conuco', 'Bella Vista', 'Villa Olga', 'Pontezuela', 'Las Colinas', 'El Dorado', 'Urbanización Tropical'],
  'Samaná': ['Las Terrenas', 'Samaná', 'El Portillo', 'Cosón', 'Las Galeras', 'Sánchez', 'El Limón', 'Rancho Español'],
  'Puerto Plata': ['Puerto Plata', 'Sosúa', 'Cabarete', 'Costámbar', 'Cofresí', 'Playa Dorada', 'Luperón', 'Villa Isabela', 'La Isabela'],
  'La Romana': ['La Romana', 'Casa de Campo', 'Bayahibe', 'Dominicus'],
  'La Vega': ['Jarabacoa', 'Constanza', 'La Vega'],
  'San Pedro de Macorís': ['San Pedro de Macorís', 'Juan Dolio', 'Guayacanes'],
  'San Cristóbal': ['San Cristóbal'],
  'Peravia': ['Baní'],
  'Espaillat': ['Moca'],
  'Duarte': ['San Francisco de Macorís'],
  'María Trinidad Sánchez': ['Nagua', 'Río San Juan'],
  'El Seibo': ['El Seibo', 'Miches'],
  'Hato Mayor': ['Hato Mayor', 'Sabana de la Mar'],
  'Monseñor Nouel': ['Bonao'],
  'Valverde': ['Mao'],
  'Monte Plata': ['Monte Plata'],
  'Azua': ['Azua'],
  'Barahona': ['Barahona', 'Bahoruco'],
  'Monte Cristi': ['Monte Cristi'],
  'Dajabón': ['Dajabón'],
  'Pedernales': ['Pedernales'],
}

const amenidades = [
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
]

function getAvatar(nombre: string) {
  return (nombre || '?').split(' ').map((n: string) => n[0] || '').join('').slice(0, 2).toUpperCase()
}
function formatFecha(iso: string, hace = 'Hace', ayer = 'Ayer') {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${hace} ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hace} ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return ayer
  return `${hace} ${days}d`
}

function formatHoraChat(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const hoy = new Date()
  const esHoy = d.toDateString() === hoy.toDateString()
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  if (esHoy) return `${hh}:${mm}`
  return `${d.getDate()} ${d.toLocaleString('es', { month: 'short' })}, ${hh}:${mm}`
}

function GuardadosSeccion() {
  const { tr } = useIdioma()
  const Tg = tr.panel.guardados
  const [guardados, setGuardados] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setCargando(false); return }
      const { data } = await supabase
        .from('favoritos')
        .select('propiedad_id, propiedades(id, titulo, zona, precio, tipo, operacion, habitaciones, banos, m2, fotos)')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false })
      setGuardados(data || [])
      setCargando(false)
    }
    cargar()
  }, [])

  const quitar = async (propiedadId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('favoritos').delete().eq('usuario_id', user.id).eq('propiedad_id', propiedadId)
    setGuardados(prev => prev.filter(f => f.propiedad_id !== propiedadId))
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 24 }}>{Tg.titulo}</h1>
      {cargando ? (
        <div style={{ color: '#aaa', fontSize: 14 }}>{tr.propiedad.cargando}</div>
      ) : guardados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>♡</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{Tg.sinGuardados}</div>
          <a href="/buscar" style={{ display: 'inline-block', marginTop: 16, background: '#006D77', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>{Tg.explorar}</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {guardados.map(f => {
            const p = f.propiedades
            if (!p) return null
            const foto = Array.isArray(p.fotos) && p.fotos[0]
            return (
              <div key={f.propiedad_id} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8', display: 'flex', overflow: 'hidden', cursor: 'pointer' }} onClick={() => window.location.href = `/propiedad/${p.id}`}>
                <div style={{ width: 140, minWidth: 140, background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {foto ? <img src={foto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                </div>
                <div style={{ flex: 1, padding: '14px 18px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 4 }}>{p.titulo}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{p.zona}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#006D77', marginBottom: 6 }}>US$ {p.precio?.toLocaleString('en-US')}</div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>
                    {p.habitaciones > 0 && `${p.habitaciones} hab · `}{p.banos > 0 && `${p.banos} baños`}{p.m2 > 0 && ` · ${p.m2} m²`}
                  </div>
                </div>
                <div style={{ padding: '14px', display: 'flex', alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); quitar(f.propiedad_id) }} style={{ all: 'unset', color: '#006D77', fontSize: 20, cursor: 'pointer', lineHeight: 1 }} title="Quitar de guardados">♥</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Panel() {
  const { tr: trLang } = useIdioma()
  const Tpanel = trLang.panel
  const Tn = trLang.nav
  const menuItems = getMenuItems(Tpanel)
  const [seccion, setSeccion] = useState('anuncios')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null)
  const [planInfo, setPlanInfo] = useState<any>(null)
  const [estadosAnuncios, setEstadosAnuncios] = useState<Record<number, string>>({})
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState<string | null>(null)
  const [convActiva, setConvActiva] = useState<{ propiedadId: string, otherUserId: string | null, msg: any } | null>(null)
  const [anuncioADestacar, setAnuncioADestacar] = useState<any>(null)
  const [mensajesLeidos, setMensajesLeidos] = useState<Record<string, boolean>>({})
  const [mensajesEnviados, setMensajesEnviados] = useState<any[]>([])
  const [vistaMsg, setVistaMsg] = useState<'recibidos' | 'enviados'>('recibidos')
  const [hilo, setHilo] = useState<any[]>([])
  const [hiloLoading, setHiloLoading] = useState(false)
  const hiloBottomRef = useRef<HTMLDivElement>(null)
  const [amenidadesSeleccionadas, setAmenidadesSeleccionadas] = useState<string[]>([])
  const [pubFotos, setPubFotos] = useState<File[]>([])
  const [pubFotosPrev, setPubFotosPrev] = useState<string[]>([])
  const [pubTitulo, setPubTitulo] = useState('')
  const [pubPrecio, setPubPrecio] = useState('')
  const [pubM2, setPubM2] = useState('')
  const [pubDesc, setPubDesc] = useState('')
  const [pubTipo, setPubTipo] = useState('Apartamento')
  const [pubOperacion, setPubOperacion] = useState('Venta')
  const [pubHab, setPubHab] = useState('1')
  const [pubBanos, setPubBanos] = useState('1')
  const [pubParqueos, setPubParqueos] = useState('')
  const [pubPlanta, setPubPlanta] = useState('')
  const [pubAnio, setPubAnio] = useState('')
  const [pubProvincia, setPubProvincia] = useState('')
  const [pubSector, setPubSector] = useState('')
  const [pubLoading, setPubLoading] = useState(false)
  const [pubError, setPubError] = useState('')
  const [pubExito, setPubExito] = useState(false)
  const [anuncioEditando, setAnuncioEditando] = useState<any>(null)
  const [fotosExistentes, setFotosExistentes] = useState<string[]>([])
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(null)
  const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null)
  const [perfilNombre, setPerfilNombre] = useState('')
  const [perfilTelefono, setPerfilTelefono] = useState('')
  const [perfilInmobiliaria, setPerfilInmobiliaria] = useState('')
  const [perfilAei, setPerfilAei] = useState('')
  const [usuario, setUsuario] = useState<any>(null)
  const [anunciosReales, setAnunciosReales] = useState<any[]>([])
  const [mensajesReales, setMensajesReales] = useState<any[]>([])
  const [bloqueadosSet, setBloqueadosSet] = useState<Set<string>>(new Set())
  const [cargando, setCargando] = useState(true)
  const [respuesta, setRespuesta] = useState('')
  const [verificandoPago, setVerificandoPago] = useState(false)

  // Leer sección desde URL (?s=mensajes, ?s=anuncios, etc.)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('s')
    if (s) setSeccion(s)
  }, [])

  useEffect(() => {
    if ((seccion === 'anuncios' || seccion === 'estadisticas') && usuario?.id) {
      supabase.from('propiedades').select('*').eq('usuario_id', usuario.id).order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setAnunciosReales(data) })
    }
    if (seccion === 'plan' && usuario?.id && !planInfo) {
      fetch('/api/plan-info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: usuario.id }) })
        .then(r => r.json()).then(d => setPlanInfo(d ?? { error: true })).catch(() => setPlanInfo({ error: true }))
    }
  }, [seccion, usuario])

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      // Cargar perfil usuario
      const { data: perfil } = await supabase.from('usuarios').select('*').eq('id', user.id).single()
      if (perfil) {
        setUsuario(perfil)
        if (perfil.foto_url) setFotoPerfilUrl(perfil.foto_url)
        setPerfilNombre(perfil.nombre || '')
        setPerfilTelefono(perfil.telefono || '')
        setPerfilInmobiliaria(perfil.inmobiliaria || '')
        setPerfilAei(perfil.numero_aei || '')

        const params = new URLSearchParams(window.location.search)
        if (params.get('pago') === 'ok') {
          const sessionId = params.get('session_id')
          const tipoParam = params.get('tipo') || 'profesional'
          const esDestacado = ['15', '30', '60'].includes(tipoParam)

          if (esDestacado) {
            // Pago de destacar — verificar y recargar anuncios
            setSeccion('anuncios')
            if (sessionId) {
              try {
                await fetch('/api/verificar-pago', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sessionId }),
                })
              } catch {}
            }
            // Recargar anuncios para mostrar el badge destacado
            const { data: anunciosAct } = await supabase.from('propiedades').select('*').eq('usuario_id', user.id).order('created_at', { ascending: false })
            if (anunciosAct) setAnunciosReales(anunciosAct)
          } else {
            // Pago de plan profesional
            setSeccion('publicar')
            if (perfil.plan === 'profesional') {
              // Ya activo
            } else {
              setVerificandoPago(true)
              if (sessionId) {
                try {
                  const res = await fetch('/api/verificar-pago', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId }),
                  })
                  const data = await res.json()
                  if (data.ok) {
                    setUsuario((prev: any) => ({ ...prev, plan: 'profesional', tipo: 'profesional' }))
                    setVerificandoPago(false)
                    return
                  }
                } catch {}
              }
              // Fallback polling
              let intentos = 0
              const pollPlan = async () => {
                const { data: act } = await supabase.from('usuarios').select('plan,tipo').eq('id', user.id).single()
                if (act?.plan === 'profesional') {
                  setUsuario((prev: any) => ({ ...prev, plan: 'profesional', tipo: 'profesional' }))
                  setVerificandoPago(false)
                } else if (intentos < 10) {
                  intentos++
                  setTimeout(pollPlan, 2000)
                } else {
                  setVerificandoPago(false)
                }
              }
              setTimeout(pollPlan, 1500)
            }
          }
        }
      }

      // Cargar anuncios del usuario
      const { data: anuncios } = await supabase.from('propiedades').select('*').eq('usuario_id', user.id).order('created_at', { ascending: false })
      if (anuncios) setAnunciosReales(anuncios)

      // Cargar mensajes del usuario
      const { data: msgs } = await supabase.from('mensajes').select('*, propiedades(titulo)').eq('vendedor_id', user.id).order('created_at', { ascending: false })
      const resEnv = await fetch('/api/mensajes-enviados', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
      const { data: enviados } = await resEnv.json()

      // Enriquecer con fotos de perfil via service role
      const idsRemitentes = (msgs || []).filter((m: any) => m.remitente_id).map((m: any) => m.remitente_id)
      const idsVendedores = (enviados || []).filter((m: any) => m.vendedor_id).map((m: any) => m.vendedor_id)
      const todosIds = [...new Set([...idsRemitentes, ...idsVendedores])]
      let userMap: Record<string, { foto_url: string | null, nombre: string | null, tipo: string | null, plan: string | null, numero_aei: string | null, aei_aprobado: boolean | null }> = {}
      if (todosIds.length > 0) {
        const resFotos = await fetch('/api/user-fotos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: todosIds }) })
        const { data: ufotos } = await resFotos.json()
        if (ufotos) ufotos.forEach((u: any) => { userMap[u.id] = { foto_url: u.foto_url || null, nombre: u.nombre || null, tipo: u.tipo || null, plan: u.plan || null, numero_aei: u.numero_aei || null, aei_aprobado: u.aei_aprobado ?? null } })
      }
      const enrich = (m: any, uid: string) => ({ ...m, _foto: userMap[uid]?.foto_url || null, _nombre: userMap[uid]?.nombre || null, _plan: userMap[uid]?.plan || null, _tipo: userMap[uid]?.tipo || null, _numero_aei: userMap[uid]?.numero_aei || null, _aei_aprobado: userMap[uid]?.aei_aprobado ?? null })
      if (msgs) setMensajesReales(msgs.map((m: any) => enrich(m, m.remitente_id)))
      if (enviados) setMensajesEnviados(enviados.map((m: any) => enrich(m, m.vendedor_id)))
      // Restaurar mensajes leídos desde localStorage
      try {
        const stored = localStorage.getItem(`propiteca_leidos_${user.id}`)
        if (stored) setMensajesLeidos(JSON.parse(stored))
      } catch {}
      const { data: bqs } = await supabase.from('bloqueados').select('bloqueado_id').eq('bloqueador_id', user.id)
      if (bqs) setBloqueadosSet(new Set(bqs.map((b: any) => b.bloqueado_id)))

      setCargando(false)
    }
    cargarDatos()
  }, [])

  const toggleEstado = (id: number, estadoActual: string) => {
    setEstadosAnuncios(prev => ({ ...prev, [id]: estadoActual === 'activo' ? 'pausado' : 'activo' }))
  }

  const toggleAmenidad = (id: string) => {
    setAmenidadesSeleccionadas(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const handleFotos = (files: FileList | null) => {
    if (!files) return
    const nuevas = Array.from(files).slice(0, 20 - pubFotos.length)
    setPubFotos(prev => [...prev, ...nuevas])
    nuevas.forEach(f => {
      const reader = new FileReader()
      reader.onload = e => setPubFotosPrev(prev => [...prev, e.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  const quitarFoto = (idx: number) => {
    setPubFotos(prev => prev.filter((_, i) => i !== idx))
    setPubFotosPrev(prev => prev.filter((_, i) => i !== idx))
  }

  const guardarPerfil = async () => {
    if (!perfilNombre) { alert(Tpanel.perfil.err_nombre); return }
    if (!perfilTelefono) { alert(Tpanel.perfil.err_telefono); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let nuevaFotoUrl: string | null = null
    if (fotoPerfilFile) {
      const ext = fotoPerfilFile.name.split('.').pop()
      const path = `avatares/${user.id}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('propiedades')
        .upload(path, fotoPerfilFile, { upsert: true })
      if (!uploadErr && uploadData) {
        const { data: urlData } = supabase.storage.from('propiedades').getPublicUrl(uploadData.path)
        nuevaFotoUrl = urlData.publicUrl
        setFotoPerfilUrl(nuevaFotoUrl)
        setFotoPerfilFile(null)
      }
    }

    const updates: any = {
      nombre: perfilNombre,
      telefono: perfilTelefono,
      inmobiliaria: perfilInmobiliaria,
      numero_aei: perfilAei || null,
    }
    if (perfilAei) updates.tipo = 'profesional'
    if (nuevaFotoUrl) updates.foto_url = nuevaFotoUrl

    const { error } = await supabase.from('usuarios').update(updates).eq('id', user.id)
    if (error?.code === '23505') { alert('Este número de teléfono ya está asociado a otra cuenta.'); return }
    if (!error) { setUsuario((prev: any) => ({ ...prev, nombre: perfilNombre, telefono: perfilTelefono, inmobiliaria: perfilInmobiliaria, numero_aei: perfilAei, ...(nuevaFotoUrl ? { foto_url: nuevaFotoUrl } : {}) })); alert(Tpanel.perfil.ok) }
    else alert(Tpanel.perfil.err)
  }

  const eliminarMensaje = async (id: string) => {
    if (!confirm(Tpanel.mensajes.confirmarEliminar)) return
    await supabase.from('mensajes').delete().eq('id', id)
    setMensajesReales(prev => prev.filter(m => m.id !== id))
    if (mensajeSeleccionado === id) setMensajeSeleccionado(null)
  }

  const cargarHilo = async (propiedadId: string, userId1: string, userId2: string) => {
    setHiloLoading(true)
    const res = await fetch('/api/mensajes-hilo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propiedadId, userId1, userId2 }) })
    const { data } = await res.json()
    setHilo(data || [])
    setHiloLoading(false)
    setTimeout(() => hiloBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const enviarRespuesta = async (m: any, textoActual: string) => {
    if (!textoActual.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Debes estar autenticado'); return }
    const otroUserId = m.remitente_id && m.remitente_id !== user.id ? m.remitente_id : m.vendedor_id
    if (!otroUserId) { alert('No se puede responder: no hay destinatario'); return }
    if (!m.propiedad_id) { alert('No se puede responder: falta propiedad'); return }
    const res = await fetch('/api/mensajes-enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propiedadId: m.propiedad_id,
        vendedorId: otroUserId,
        remitenteId: user.id,
        nombreCliente: usuario?.nombre || '',
        telefonoCliente: usuario?.telefono || null,
        mensaje: textoActual.trim(),
      })
    })
    const json = await res.json()
    if (res.ok) {
      setRespuesta('')
      await cargarHilo(m.propiedad_id, user.id, otroUserId)
    } else {
      alert('Error al enviar: ' + (json?.error || res.status))
    }
  }

  const toggleBloqueo = async (remitenteId: string) => {
    if (!remitenteId) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (bloqueadosSet.has(remitenteId)) {
      await supabase.from('bloqueados').delete().eq('bloqueador_id', user.id).eq('bloqueado_id', remitenteId)
      setBloqueadosSet(prev => { const s = new Set(prev); s.delete(remitenteId); return s })
    } else {
      if (!confirm(Tpanel.mensajes.bloquear + '?')) return
      await supabase.from('bloqueados').insert({ bloqueador_id: user.id, bloqueado_id: remitenteId })
      setBloqueadosSet(prev => new Set([...prev, remitenteId]))
    }
  }

  const handleEditar = (a: any) => {
    const raw = anunciosReales.find(r => r.id === a.id)
    if (!raw) return
    const zona = raw.zona || ''
    const partes = zona.split(',').map((p: string) => p.trim())
    const sector = partes[0] || ''
    const provincia = partes.slice(1).join(', ') || ''
    setAnuncioEditando(raw)
    setFotosExistentes(Array.isArray(raw.fotos) ? raw.fotos : [])
    setPubFotos([]); setPubFotosPrev([])
    setPubTitulo(raw.titulo || '')
    setPubPrecio(String(raw.precio || ''))
    setPubM2(raw.m2 ? String(raw.m2) : '')
    setPubDesc(raw.descripcion || '')
    setPubTipo(raw.tipo || 'Apartamento')
    setPubOperacion(raw.operacion ? (raw.operacion.charAt(0).toUpperCase() + raw.operacion.slice(1)) : 'Venta')
    setPubHab(raw.habitaciones ? String(raw.habitaciones) : '1')
    setPubBanos(raw.banos ? String(raw.banos) : '1')
    setPubParqueos(raw.parqueos ? String(raw.parqueos) : '')
    setPubPlanta(raw.planta || '')
    setPubProvincia(provincia)
    setPubSector(sector)
    setAmenidadesSeleccionadas(Array.isArray(raw.amenidades) ? raw.amenidades : [])
    setPubError(''); setPubExito(false)
    setSeccion('publicar')
  }

  const eliminarAnuncio = async (id: string) => {
    if (!confirm(Tpanel.anuncios.confirmarEliminar)) return
    await supabase.from('propiedades').delete().eq('id', id)
    setAnunciosReales(prev => prev.filter(a => a.id !== id))
  }

  const publicarAnuncio = async () => {
    if (!anuncioEditando && tipoUsuario === 'particular' && anunciosUsados >= anunciosGratis) { setSeccion('planes'); return }
    if (!pubTitulo || !pubPrecio || !pubProvincia) { setPubError(Tpanel.publicar.err_campos); return }
    if (pubFotos.length === 0 && fotosExistentes.length === 0) { setPubError(Tpanel.publicar.err_fotos); return }
    setPubLoading(true)
    setPubError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setPubError('Debes iniciar sesión para publicar'); setPubLoading(false); return }

    // Subir fotos nuevas a Supabase Storage
    const fotosNuevas: string[] = []
    for (const foto of pubFotos) {
      const ext = foto.name.split('.').pop()
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage.from('propiedades').upload(path, foto, { upsert: true })
      if (!uploadErr && uploadData) {
        const { data: urlData } = supabase.storage.from('propiedades').getPublicUrl(uploadData.path)
        fotosNuevas.push(urlData.publicUrl)
      }
    }
    const todasFotos = [...fotosExistentes, ...fotosNuevas]

    const campos = {
      titulo: pubTitulo,
      descripcion: pubDesc,
      precio: Number(pubPrecio.replace(/\D/g, '')),
      tipo: pubTipo,
      operacion: pubOperacion.toLowerCase(),
      zona: pubSector ? `${pubSector}, ${pubProvincia}` : pubProvincia,
      m2: pubM2 ? Number(pubM2.replace(/\D/g, '')) : null,
      habitaciones: ['Edificio', 'Terreno'].includes(pubTipo) ? null : Number(pubHab),
      banos: ['Edificio', 'Terreno'].includes(pubTipo) ? null : Number(pubBanos),
      amenidades: amenidadesSeleccionadas,
      parqueos: ['Edificio', 'Terreno'].includes(pubTipo) ? null : (pubParqueos ? Number(pubParqueos) : null),
      planta: ['Edificio', 'Terreno'].includes(pubTipo) ? null : (pubPlanta || null),
      fotos: todasFotos.length > 0 ? todasFotos : null,
    }

    let error: any
    if (anuncioEditando) {
      const { error: e } = await supabase.from('propiedades').update(campos).eq('id', anuncioEditando.id)
      error = e
    } else {
      const { error: e } = await supabase.from('propiedades').insert({ ...campos, usuario_id: user.id, estado: 'activo' })
      error = e
    }
    if (error) { setPubError(Tpanel.perfil.err); setPubLoading(false); return }

    const { data: anunciosActualizados } = await supabase.from('propiedades').select('*').eq('usuario_id', user.id).order('created_at', { ascending: false })
    if (anunciosActualizados) setAnunciosReales(anunciosActualizados)
    setPubExito(true)
    setPubLoading(false)
    setPubTitulo(''); setPubPrecio(''); setPubM2(''); setPubDesc('')
    setPubProvincia(''); setPubSector(''); setPubHab('1'); setPubBanos('1')
    setPubParqueos(''); setPubPlanta(''); setPubAnio('')
    setPubFotos([]); setPubFotosPrev([])
    setFotosExistentes([]); setAnuncioEditando(null)
    setAmenidadesSeleccionadas([])
    setTimeout(() => { setSeccion('anuncios'); setPubExito(false) }, 1200)
  }

  const anunciosAMostrar = anunciosReales.map(a => ({
    id: a.id,
    titulo: a.titulo,
    precio: a.precio,
    zona: a.zona || '',
    tipo: a.tipo || 'Apartamento',
    estado: estadosAnuncios[a.id] || a.estado || 'activo',
    clics: a.visitas || 0,
    telVistos: a.tel_vistos || 0,
    favoritos: a.favoritos || 0,
    mensajes: mensajesReales.filter((m: any) => m.propiedad_id === a.id).length,
    destacado: a.destacado && (!a.destacado_hasta || new Date(a.destacado_hasta) > new Date()),
    vence: '30 días',
    bg: '#e0f5f7',
    fotos: a.fotos,
  }))

  const anunciosFiltrados = anunciosAMostrar.filter((a: any) => !filtroTipo || a.tipo === filtroTipo)
  const noLeidos = mensajesReales.filter((m: any) => !mensajesLeidos[m.id]).length
  const tipoUsuario: string = usuario?.plan === 'profesional' ? 'profesional' : (usuario?.tipo || 'particular')
  const anunciosGratis = 2
  const anunciosUsados = anunciosReales.length

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>
            propiteca<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 10 }}>MI PANEL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#004E57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#83D4DB', overflow: 'hidden' }}>
              {fotoPerfilUrl ? <img src={fotoPerfilUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.25s' }} /> : (perfilNombre || usuario?.nombre || 'U').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500 }}>{usuario?.nombre || Tn.miCuenta}</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>{usuario?.email || ''}</span>
            </div>
            <span style={{ background: tipoUsuario === 'particular' ? 'rgba(255,255,255,0.2)' : '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>
              {tipoUsuario === 'particular' ? Tpanel.anuncios.roles.particular : Tpanel.anuncios.roles.profesional}
            </span>
          </div>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', padding: '5px 14px', borderRadius: 6, textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.35)'}>
            {Tn.verWeb}
          </a>
        </div>
      </nav>

      <div style={{ display: 'flex' }}>

        {/* SIDEBAR */}
        <div style={{ width: 220, background: '#004E57', minHeight: 'calc(100vh - 54px)', padding: '20px 0', flexShrink: 0 }}>
          {menuItems.filter(item => item.id !== 'equipo' || ['agencia', 'unlimited'].includes(tipoUsuario)).map(item => (
            <button key={item.id} onClick={() => { if (item.id === 'publicar' && !(perfilNombre && perfilTelefono)) { setSeccion('publicar'); return } if (item.id === 'publicar' && !anuncioEditando && tipoUsuario === 'particular' && anunciosUsados >= anunciosGratis) { setSeccion('planes'); return } setSeccion(item.id) }} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontSize: 13, color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.6)', background: seccion === item.id ? 'rgba(255,255,255,0.12)' : 'transparent', cursor: 'pointer', borderLeft: seccion === item.id ? '3px solid #83D4DB' : '3px solid transparent', boxSizing: 'border-box', position: 'relative' }}>
              {item.icon}
              {item.label}
              {item.id === 'mensajes' && noLeidos > 0 && (
                <span style={{ position: 'absolute', right: 14, background: '#17A6B4', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{noLeidos}</span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENIDO */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {cargando && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#006D77', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* AVISO TELÉFONO FALTANTE */}
          {!cargando && !perfilTelefono && seccion !== 'perfil' && (
            <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <span style={{ fontSize: 13, color: '#6d4c00' }}>{Tpanel.anuncios.avisoTel}</span>
              </div>
              <button onClick={() => setSeccion('perfil')} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '7px 16px', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{Tpanel.anuncios.irPerfil}</button>
            </div>
          )}

          {/* MIS ANUNCIOS */}
          {!cargando && seccion === 'anuncios' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{Tpanel.anuncios.titulo}</h1>
                <button onClick={() => tipoUsuario === 'particular' && anunciosUsados >= anunciosGratis ? setSeccion('planes') : setSeccion('publicar')} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{Tpanel.anuncios.publicar}</button>
              </div>

              {/* Aviso límite particular */}
              {tipoUsuario === 'particular' && anunciosUsados >= anunciosGratis && (
                <div style={{ background: '#fff8e1', border: '1.5px solid #f59e0b', borderRadius: 8, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>{Tpanel.anuncios.limiteAlcanzado}</div>
                    <div style={{ fontSize: 13, color: '#78350f' }}>{Tpanel.anuncios.limiteDesc.replace('{n}', String(anunciosGratis))}</div>
                  </div>
                  <button onClick={() => setSeccion('planes')} style={{ all: 'unset', background: '#f59e0b', color: '#fff', padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {Tpanel.anuncios.haztePro}
                  </button>
                </div>
              )}

              {/* KPIs reales */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                  { label: Tpanel.anuncios.kpi_visitas, val: anunciosReales.reduce((s, a) => s + (a.visitas || 0), 0).toLocaleString(), sub: Tpanel.anuncios.kpi_visitas_sub, color: '#006D77' },
                  { label: Tpanel.anuncios.kpi_tel, val: anunciosReales.reduce((s, a) => s + (a.tel_vistos || 0), 0).toLocaleString(), sub: Tpanel.anuncios.kpi_tel_sub, color: '#10b981' },
                  { label: Tpanel.anuncios.guardados, val: anunciosReales.reduce((s, a) => s + (a.favoritos || 0), 0).toLocaleString(), sub: Tpanel.anuncios.kpi_guardados_sub, color: '#f59e0b' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#fff', borderRadius: 8, padding: '14px 16px', borderTop: `3px solid ${k.color}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{k.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 2 }}>{k.val}</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Filtro por tipo */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {[{ val: '', label: Tpanel.anuncios.filtroTodos }, ...['Apartamento', 'Casa', 'Villa', 'Edificio', 'Oficina', 'Terreno', 'Local comercial'].map(t => ({ val: t, label: t }))].map(({ val, label }) => (
                  <button key={val} onClick={() => setFiltroTipo(val)} style={{ all: 'unset', border: `1px solid ${filtroTipo === val ? '#006D77' : '#e0e0e0'}`, borderRadius: 20, padding: '5px 14px', fontSize: 12, color: filtroTipo === val ? '#006D77' : '#666', background: filtroTipo === val ? '#f0fafb' : '#fff', cursor: 'pointer', fontWeight: filtroTipo === val ? 600 : 400 }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Lista anuncios */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {anunciosFiltrados.length === 0 && !cargando && (
                  <div style={{ background: '#fff', borderRadius: 8, padding: '48px 24px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>{Tpanel.anuncios.sinAnuncios}</div>
                    <div style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>{Tpanel.anuncios.sinAnunciosDesc}</div>
                    <button onClick={() => setSeccion('publicar')} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '11px 28px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      {Tpanel.anuncios.publicarPrimero}
                    </button>
                  </div>
                )}
                {anunciosFiltrados.map(a => {
                  const estado = estadosAnuncios[a.id] || a.estado
                  return (
                    <div key={a.id} style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 90, height: 65, borderRadius: 6, background: a.bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {Array.isArray(a.fotos) && a.fotos[0]
                          ? <img src={a.fotos[0]} alt={a.titulo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        }
                        {a.destacado && <div style={{ position: 'absolute', top: 4, left: 4, background: '#006D77', color: '#fff', fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3, zIndex: 1 }}>{Tpanel.anuncios.dest}</div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <a href={`/propiedad/${a.id}`} target="_blank" rel="noreferrer" style={{ fontSize: 15, fontWeight: 600, color: '#006D77', marginBottom: 3, display: 'block', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.textDecoration='underline')} onMouseLeave={e => (e.currentTarget.style.textDecoration='none')}>{a.titulo}</a>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>{a.zona} · {a.tipo} · US$ {a.precio.toLocaleString('en-US')}</div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#aaa', flexWrap: 'wrap' }}>
                          <span>👁 {a.clics} {Tpanel.anuncios.visitas}</span>
                          <span>📞 {a.telVistos} {Tpanel.estadisticas.telVistosCol.toLowerCase()}</span>
                          <span>❤️ {a.favoritos} {Tpanel.anuncios.guardados}</span>
                        </div>
                      </div>
                      <span style={{ background: estado === 'activo' ? '#e0f5f0' : '#f5f5f5', color: estado === 'activo' ? '#065f46' : '#888', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10, flexShrink: 0 }}>
                        {estado === 'activo' ? `● ${Tpanel.anuncios.estado.activo}` : `○ ${Tpanel.anuncios.estado.pausado}`}
                      </span>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => { setAnuncioADestacar(a); setSeccion('destacar') }} style={{ all: 'unset', border: '1px solid #006D77', color: '#006D77', padding: '6px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{Tpanel.anuncios.destacar}</button>
                        <button onClick={() => handleEditar(a)} style={{ all: 'unset', border: '1px solid #e0e0e0', color: '#555', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>{Tpanel.anuncios.editar}</button>
                        <button onClick={() => eliminarAnuncio(a.id)} style={{ all: 'unset', border: '1px solid #fca5a5', color: '#dc2626', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>{Tpanel.anuncios.eliminar}</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PUBLICAR ANUNCIO */}
          {!cargando && seccion === 'publicar' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>{anuncioEditando ? Tpanel.publicar.tituloEditar : Tpanel.publicar.titulo}</h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>{anuncioEditando ? Tpanel.publicar.descEdit : Tpanel.publicar.desc}</p>

              {/* Bocadillo perfil incompleto */}
              {!(perfilNombre && perfilTelefono) && (
                <div style={{ background: '#fff', border: '2px solid #006D77', borderRadius: 10, padding: '28px 32px', marginBottom: 28, textAlign: 'center', position: 'relative' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 8 }}>Completa tu perfil antes de publicar</div>
                  <div style={{ fontSize: 14, color: '#555', marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>
                    Necesitas añadir tu nombre y número de teléfono para poder subir anuncios. Solo te lleva un minuto.
                  </div>
                  <button onClick={() => setSeccion('perfil')} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '11px 28px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Rellenar mi perfil →
                  </button>
                </div>
              )}

              {/* Si es profesional sin plan pagado, mostrar pantalla de pago o verificando */}
              {(perfilNombre && perfilTelefono) && (usuario?.tipo === 'profesional' && usuario?.plan !== 'profesional' ? (
                <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                  {verificandoPago ? (
                    <>
                      <style>{`@keyframes propiteca-spin { to { transform: rotate(360deg); } }`}</style>
                      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                        <svg style={{ animation: 'propiteca-spin 1s linear infinite' }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10"/></svg>
                      </div>
                      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8 }}>{Tpanel.publicar.verificandoPago}</h2>
                      <p style={{ fontSize: 14, color: '#888' }}>{Tpanel.publicar.verificandoSecs}</p>
                    </>
                  ) : (
                  <>
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8 }}>Activa tu suscripción para publicar</h2>
                  <p style={{ fontSize: 14, color: '#888', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                    Con el plan Profesional publicas anuncios ilimitados por solo US$9.99/mes. El primer mes es gratis si tienes código promocional.
                  </p>
                  <div style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto 16px' }}>
                    <input type="text" placeholder="Código promocional (opcional)" style={{ flex: 1, border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 13, outline: 'none' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                    <a href="/pago/profesional" style={{ background: '#006D77', color: '#fff', padding: '11px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      Activar — US$9.99/mes
                    </a>
                  </div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>Cancela cuando quieras. Sin permanencia.</div>
                  </>
                  )}
                </div>
              ) : (
              <div style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.operacion}</label>
                    <select value={pubOperacion} onChange={e => setPubOperacion(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option>Venta</option><option>Alquiler</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.tipoInmueble}</label>
                    <select value={pubTipo} onChange={e => setPubTipo(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option>Apartamento</option><option>Casa</option><option>Villa</option><option>Edificio</option><option>Oficina</option><option>Terreno</option><option>Local comercial</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.titulo_anuncio}</label>
                    <input type="text" value={pubTitulo} onChange={e => setPubTitulo(e.target.value.slice(0, 50))} maxLength={50} placeholder="Ej: Apartamento en Piantini con vista al mar" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.precio}</label>
                    <input type="text" value={pubPrecio} onChange={e => { const raw = e.target.value.replace(/\D/g, '').slice(0, 9); setPubPrecio(raw ? Number(raw).toLocaleString('es-ES') : '') }} placeholder="Ej: 250.000" inputMode="numeric" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.provincia}</label>
                    <select value={pubProvincia} onChange={e => { setPubProvincia(e.target.value); setPubSector('') }} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option value="">Selecciona provincia</option>
                      {Object.keys(provinciasZonas).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.sector} <span style={{ fontWeight: 400, color: '#aaa' }}>{Tpanel.publicar.sectorOpcional}</span></label>
                    <select value={pubSector} onChange={e => setPubSector(e.target.value)} disabled={!pubProvincia} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: pubProvincia ? '#fff' : '#f9f9f9', color: pubProvincia ? '#333' : '#aaa' }}>
                      <option value="">Selecciona sector</option>
                      {pubProvincia && provinciasZonas[pubProvincia].map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.superficie}</label>
                    <input type="text" value={pubM2} onChange={e => { const raw = e.target.value.replace(/\D/g, '').slice(0, 8); setPubM2(raw ? Number(raw).toLocaleString('es-ES') : '') }} placeholder="Ej: 150" inputMode="numeric" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  {!['Edificio', 'Terreno'].includes(pubTipo) && (
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.habitaciones}</label>
                      <select value={pubHab} onChange={e => setPubHab(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                        <option value="0">{Tpanel.publicar.estudio}</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option>
                      </select>
                    </div>
                  )}
                </div>

                {!['Edificio', 'Terreno'].includes(pubTipo) && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.banos}</label>
                      <select value={pubBanos} onChange={e => setPubBanos(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                        <option value="1">1</option><option value="2">2</option><option value="3">3+</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Parqueos <span style={{ color: '#aaa', fontWeight: 400 }}>{Tpanel.publicar.sectorOpcional}</span></label>
                      <input type="number" min="0" value={pubParqueos} onChange={e => setPubParqueos(e.target.value)} placeholder="Ej: 2" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.planta} <span style={{ color: '#aaa', fontWeight: 400 }}>{Tpanel.publicar.sectorOpcional}</span></label>
                      <input type="text" value={pubPlanta} onChange={e => setPubPlanta(e.target.value)} placeholder="Ej: 4ª planta" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.descripcion}</label>
                  <textarea rows={4} value={pubDesc} onChange={e => setPubDesc(e.target.value)} placeholder="Describe tu propiedad con detalle — ubicación, acabados, amenidades, accesos..." style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'sans-serif', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                </div>

                {/* AMENIDADES */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 10 }}>{Tpanel.publicar.amenidades}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {amenidades.map(a => (
                      <div key={a.id} onClick={() => toggleAmenidad(a.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: `1.5px solid ${amenidadesSeleccionadas.includes(a.id) ? '#006D77' : '#e0e0e0'}`, borderRadius: 6, cursor: 'pointer', background: amenidadesSeleccionadas.includes(a.id) ? '#f0fafb' : '#fff' }}>
                        {amenidadesSeleccionadas.includes(a.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        <span style={{ fontSize: 13, color: amenidadesSeleccionadas.includes(a.id) ? '#006D77' : '#555', fontWeight: amenidadesSeleccionadas.includes(a.id) ? 600 : 400 }}>{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOTOS */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.fotos}</label>
                  <label style={{ display: 'block', border: '2px dashed #e0e0e0', borderRadius: 6, padding: '24px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#006D77'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#e0e0e0'}>
                    <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFotos(e.target.files)} />
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block' }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <div style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>Pulsa para seleccionar fotos</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>JPG, PNG — máximo 20 fotos, 5MB cada una</div>
                  </label>
                  {(fotosExistentes.length > 0 || pubFotosPrev.length > 0) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 12 }}>
                      {fotosExistentes.map((src, i) => (
                        <div key={`ex-${i}`} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 6, overflow: 'hidden', background: '#e8e8e8' }}>
                          <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => setFotosExistentes(prev => prev.filter((_, j) => j !== i))} style={{ all: 'unset', position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                          {i === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>PORTADA</div>}
                        </div>
                      ))}
                      {pubFotosPrev.map((src, i) => (
                        <div key={`new-${i}`} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 6, overflow: 'hidden', background: '#e8e8e8' }}>
                          <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => quitarFoto(i)} style={{ all: 'unset', position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                          {fotosExistentes.length === 0 && i === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>PORTADA</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {pubError && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 14 }}>{pubError}</div>}
                {pubExito && <div style={{ background: '#e0f5f0', border: '1px solid #6ee7b7', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#065f46', marginBottom: 14 }}>✓ {anuncioEditando ? Tpanel.publicar.okEdit : Tpanel.publicar.ok}</div>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={publicarAnuncio} disabled={pubLoading} style={{ all: 'unset', flex: 1, background: pubLoading ? '#aaa' : '#006D77', color: '#fff', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: pubLoading ? 'default' : 'pointer', textAlign: 'center' }}>
                    {pubLoading ? (anuncioEditando ? Tpanel.publicar.guardando : Tpanel.publicar.publicando) : (anuncioEditando ? Tpanel.publicar.guardar : Tpanel.publicar.publicar)}
                  </button>
                  {anuncioEditando && <button onClick={() => { setAnuncioEditando(null); setFotosExistentes([]); setSeccion('anuncios') }} style={{ all: 'unset', border: '1.5px solid #e0e0e0', color: '#555', padding: '12px 20px', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>{Tpanel.publicar.cancelar}</button>}
                </div>
              </div>
              ))}
            </div>
          )}

          {/* MENSAJES */}
          {!cargando && seccion === 'mensajes' && (() => {
            // Agrupar por conversación: una entrada por (propiedad + contacto)
            const convMap = new Map<string, { key: string, propiedadId: string, otherUserId: string | null, msg: any, tieneNoLeido: boolean }>()
            const agregarMsg = (m: any, esEnviado: boolean) => {
              const otherId = esEnviado ? m.vendedor_id : (m.remitente_id || null)
              const key = `${m.propiedad_id}__${otherId || 'anon'}`
              const noLeido = !esEnviado && !(mensajesLeidos[m.id] ?? false)
              const existing = convMap.get(key)
              if (!existing || new Date(m.created_at) > new Date(existing.msg.created_at)) {
                convMap.set(key, { key, propiedadId: m.propiedad_id, otherUserId: otherId, msg: { ...m, _tipo: esEnviado ? 'enviado' : 'recibido' }, tieneNoLeido: noLeido || (existing?.tieneNoLeido ?? false) })
              } else if (noLeido) {
                convMap.set(key, { ...existing, tieneNoLeido: true })
              }
            }
            mensajesReales.forEach((m: any) => agregarMsg(m, false))
            mensajesEnviados.forEach((m: any) => agregarMsg(m, true))
            const conversaciones = Array.from(convMap.values()).sort((a, b) => {
              if (a.tieneNoLeido && !b.tieneNoLeido) return -1
              if (!a.tieneNoLeido && b.tieneNoLeido) return 1
              return new Date(b.msg.created_at).getTime() - new Date(a.msg.created_at).getTime()
            })
            return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{Tpanel.mensajes.titulo}</h1>
                {noLeidos > 0 && <span style={{ background: '#006D77', color: '#fff', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 10 }}>{noLeidos} {Tpanel.mensajes.noLeidos}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, height: 'calc(100vh - 180px)', minHeight: 500 }}>
                {/* Lista de conversaciones */}
                <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflowY: 'auto' }}>
                  {cargando && (
                    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                      <div style={{ width: 28, height: 28, border: '3px solid #e0e0e0', borderTopColor: '#006D77', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                  )}
                  {!cargando && conversaciones.length === 0 && (
                    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>{Tpanel.mensajes.sinMensajes}</div>
                    </div>
                  )}
                  {conversaciones.map((conv) => {
                    const m = conv.msg
                    const esEnviado = m._tipo === 'enviado'
                    const nombreMostrar = esEnviado ? (m._nombre || m.propiedades?.titulo || 'Propiedad') : (m.nombre_cliente || m._nombre || '?')
                    const seleccionada = mensajeSeleccionado === conv.key
                    return (
                      <div key={conv.key} onClick={async () => {
                          setMensajeSeleccionado(conv.key)
                          setConvActiva({ propiedadId: conv.propiedadId, otherUserId: conv.otherUserId, msg: m })
                          // marcar todos los recibidos de esta conversacion como leidos
                          const msgsConv = mensajesReales.filter((x: any) => `${x.propiedad_id}__${x.remitente_id || 'anon'}` === conv.key)
                          if (msgsConv.length > 0) {
                            const updates: Record<string, boolean> = {}
                            msgsConv.forEach((x: any) => { updates[x.id] = true })
                            setMensajesLeidos(prev => {
                              const next = { ...prev, ...updates }
                              try {
                                const { data: { user: u } } = { data: { user: usuario } }
                                if (u?.id) localStorage.setItem(`propiteca_leidos_${u.id}`, JSON.stringify(next))
                              } catch {}
                              return next
                            })
                          }
                          const { data: { user } } = await supabase.auth.getUser()
                          if (user && conv.propiedadId && conv.otherUserId) {
                            cargarHilo(conv.propiedadId, user.id, conv.otherUserId)
                          } else {
                            setHilo([m])
                          }
                        }}
                        style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', background: seleccionada ? '#f0fafb' : '#fff', borderLeft: seleccionada ? '3px solid #006D77' : '3px solid transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: conv.tieneNoLeido ? '#e0f5f7' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: conv.tieneNoLeido ? '#006D77' : '#888', flexShrink: 0, overflow: 'hidden' }}>
                            {m._foto ? <img src={m._foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getAvatar(nombreMostrar)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: 13, fontWeight: conv.tieneNoLeido ? 700 : 500, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{nombreMostrar}</div>
                              <div style={{ fontSize: 11, color: '#aaa' }}>{formatFecha(m.created_at, Tpanel.mensajes.hace, Tpanel.mensajes.hoy)}</div>
                            </div>
                            <div style={{ fontSize: 11, color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <svg width="9" height="11" viewBox="0 0 9 11" fill="none" style={{ flexShrink: 0 }}><path d="M4.5 0C2.015 0 0 2.015 0 4.5c0 3.375 4.5 6.5 4.5 6.5S9 7.875 9 4.5C9 2.015 6.985 0 4.5 0zm0 6.125A1.625 1.625 0 1 1 4.5 2.875a1.625 1.625 0 0 1 0 3.25z" fill="#17A6B4"/></svg>
                              {m.propiedades?.titulo}
                            </div>
                          </div>
                          {conv.tieneNoLeido && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#006D77', flexShrink: 0 }} />}
                        </div>
                        <div style={{ fontSize: 12, color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 46 }}>
                          {esEnviado ? '↗ ' : ''}{m.mensaje}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Detalle — chat */}
                {convActiva && (() => {
                  const m = convActiva.msg
                  const esEnviado = m._tipo === 'enviado'
                  const contactoNombre = esEnviado ? (m._nombre || m.propiedades?.titulo || '?') : (m.nombre_cliente || m._nombre || '?')
                  const contactoTel = esEnviado ? null : m.telefono_cliente
                  const contactoId = convActiva.otherUserId
                  return (
                    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      {/* Header */}
                      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#006D77', flexShrink: 0, overflow: 'hidden' }}>
                            {m._foto ? <img src={m._foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getAvatar(contactoNombre)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{contactoNombre}</span>
                              {(() => {
                                const esPro = m._plan === 'profesional' || m._tipo === 'profesional'
                                return (
                                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: esPro ? '#17A6B4' : 'rgba(0,109,119,0.12)', color: esPro ? '#fff' : '#006D77' }}>
                                    {esPro ? 'PROFESIONAL' : 'PARTICULAR'}
                                  </span>
                                )
                              })()}
                              {m._numero_aei && (
                                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: m._aei_aprobado ? '#006D77' : '#f59e0b', color: '#fff' }}>
                                  {m._aei_aprobado ? 'AEI' : 'AEI ⏳'}
                                </span>
                              )}
                            </div>
                            {contactoTel && <a href={`tel:${contactoTel}`} style={{ fontSize: 12, color: '#006D77', textDecoration: 'none' }}>📞 {contactoTel}</a>}
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            {contactoId && <button onClick={() => toggleBloqueo(contactoId)}
                              style={{ all: 'unset', border: `1px solid ${bloqueadosSet.has(contactoId) ? '#e0e0e0' : '#fca5a5'}`, color: bloqueadosSet.has(contactoId) ? '#555' : '#dc2626', padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontWeight: 500 }}>
                              {bloqueadosSet.has(contactoId) ? Tpanel.mensajes.desbloquear : Tpanel.mensajes.bloquear}
                            </button>}
                            <button onClick={() => eliminarMensaje(m.id)} style={{ all: 'unset', border: '1px solid #e0e0e0', color: '#888', padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>{Tpanel.mensajes.eliminar}</button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f4f5f6', borderRadius: 6, padding: '7px 10px' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#333', flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="10" height="13" viewBox="0 0 9 11" fill="none" style={{ flexShrink: 0 }}><path d="M4.5 0C2.015 0 0 2.015 0 4.5c0 3.375 4.5 6.5 4.5 6.5S9 7.875 9 4.5C9 2.015 6.985 0 4.5 0zm0 6.125A1.625 1.625 0 1 1 4.5 2.875a1.625 1.625 0 0 1 0 3.25z" fill="#006D77"/></svg>
                            {m.propiedades?.titulo}
                          </div>
                          <a href={`/propiedad/${m.propiedad_id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#006D77', textDecoration: 'none', fontWeight: 600, flexShrink: 0, background: '#e8f5f6', padding: '4px 10px', borderRadius: 20, border: '1px solid #c0e4e7' }}>
                            Ver anuncio
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </a>
                        </div>
                      </div>
                      {/* Mensajes del hilo */}
                      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {hiloLoading ? (
                          <div style={{ textAlign: 'center', color: '#aaa', fontSize: 13, padding: '20px 0' }}>Cargando...</div>
                        ) : hilo.map((msg: any) => {
                          const esMio = msg.remitente_id === usuario?.id
                          return (
                            <div key={msg.id} style={{ display: 'flex', justifyContent: esMio ? 'flex-end' : 'flex-start' }}>
                              <div style={{ background: esMio ? '#006D77' : '#f4f5f6', color: esMio ? '#fff' : '#333', borderRadius: esMio ? '12px 12px 2px 12px' : '12px 12px 12px 2px', padding: '10px 14px', maxWidth: '75%' }}>
                                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.mensaje}</div>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={hiloBottomRef} />
                      </div>
                      {/* Caja de respuesta */}
                      <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                          <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarRespuesta(m, respuesta) } }}
                            placeholder="Escribe un mensaje..." rows={2}
                            style={{ flex: 1, border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box', color: '#111' }}
                            onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                          <button type="button" onClick={() => enviarRespuesta(m, respuesta)}
                            style={{ background: respuesta.trim() ? '#006D77' : '#ccc', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}>
                            Enviar
                          </button>
                        </div>
                        {contactoTel && <a href={`tel:${contactoTel}`} style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: '#006D77', textDecoration: 'none' }}>📞 Llamar a {contactoNombre}</a>}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )
          })()}

          {/* ESTADÍSTICAS */}
          {!cargando && seccion === 'estadisticas' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 24 }}>{Tpanel.estadisticas.titulo}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { label: Tpanel.estadisticas.visitas, val: anunciosReales.reduce((s, a) => s + (a.visitas || 0), 0).toLocaleString(), sub: Tpanel.anuncios.kpi_visitas_sub, color: '#006D77' },
                  { label: Tpanel.estadisticas.telVistos, val: anunciosReales.reduce((s, a) => s + (a.tel_vistos || 0), 0).toLocaleString(), sub: Tpanel.anuncios.kpi_tel_sub, color: '#10b981' },
                  { label: Tpanel.estadisticas.mensajes, val: mensajesReales.length.toString(), sub: `${noLeidos} ${Tpanel.mensajes.noLeidos}`, color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderTop: `3px solid ${s.color}` }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#111', marginBottom: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 }}>{Tpanel.estadisticas.anuncio}</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      {[Tpanel.estadisticas.anuncio, Tpanel.estadisticas.visitasCol, Tpanel.estadisticas.telVistosCol, Tpanel.estadisticas.mensajesCol, Tpanel.estadisticas.guardadosCol].map(h => (
                        <th key={h} style={{ textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, padding: '0 0 10px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {anunciosAMostrar.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#aaa', fontSize: 13 }}>{Tpanel.anuncios.publicarPrimero}</td></tr>
                    ) : anunciosAMostrar.map((a: any) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#333', fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.titulo}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#006D77', fontWeight: 500 }}>{a.clics.toLocaleString()}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#666' }}>{a.telVistos}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#666' }}>{a.mensajes}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#666' }}>{a.favoritos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DESTACAR */}
          {!cargando && seccion === 'destacar' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>{Tpanel.destacar.titulo}</h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>{Tpanel.destacar.desc}</p>

              {/* Anuncio seleccionado */}
              {anuncioADestacar ? (
                <div style={{ background: '#e0f5f7', border: '1.5px solid #c5e8ea', borderRadius: 8, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 36, borderRadius: 6, background: '#006D77', opacity: 0.3, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{anuncioADestacar.titulo}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>US$ {anuncioADestacar.precio?.toLocaleString('en-US')} · {anuncioADestacar.zona}</div>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fff8e1', border: '1px solid #f59e0b', borderRadius: 6, padding: '10px 16px', fontSize: 13, color: '#92400e', marginBottom: 20 }}>
                  {Tpanel.destacar.sinAnuncio}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {planesDestacado.map(p => (
                  <div key={p.dias} onClick={() => setPlanSeleccionado(String(p.dias))} style={{ background: '#fff', borderRadius: 8, padding: '24px 20px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${planSeleccionado === String(p.dias) ? '#006D77' : '#e0e0e0'}`, position: 'relative', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    {p.popular && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#006D77', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 12px', borderRadius: 10 }}>{Tpanel.destacar.popular}</div>}
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 4 }}>US$ {p.precio}</div>
                    <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: '#006D77' }}>✓ Posición prioritaria<br/>✓ Badge Destacado<br/>✓ Más visibilidad</div>
                  </div>
                ))}
              </div>
              <button onClick={async () => {
                if (!planSeleccionado || !anuncioADestacar) return
                const { data: { user } } = await supabase.auth.getUser()
                const res = await fetch('/api/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: user?.id, email: user?.email, tipo: planSeleccionado, propiedadId: String(anuncioADestacar.id) })
                })
                const data = await res.json()
                if (data.url) window.location.href = data.url
              }} style={{ all: 'unset', background: planSeleccionado && anuncioADestacar ? '#006D77' : '#e0e0e0', color: '#fff', padding: '13px 32px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: planSeleccionado && anuncioADestacar ? 'pointer' : 'default' }}>
                {Tpanel.destacar.pagar}
              </button>
            </div>
          )}

          {/* PLANES PRO — pantalla para particulares que llegan al límite */}
          {!cargando && seccion === 'planes' && (
            <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8 }}>{Tpanel.planes.titulo}</h1>
              <p style={{ fontSize: 15, color: '#888', marginBottom: 32 }}>{Tpanel.planes.desc.replace('{n}', String(anunciosGratis))}</p>
              <div style={{ background: '#fff', borderRadius: 10, padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,109,119,0.12)', border: '2px solid #006D77', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#006D77', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 16px', borderRadius: 10, whiteSpace: 'nowrap' }}>{Tpanel.plan.planPro.toUpperCase()}</div>
                <div style={{ fontSize: 42, fontWeight: 700, color: '#006D77', marginBottom: 4 }}>US$ 9.99<span style={{ fontSize: 18, fontWeight: 400, color: '#aaa' }}>/mes</span></div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Cancela cuando quieras · Sin permanencia</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, textAlign: 'left' }}>
                  {(Tpanel.planes.ventajas as string[]).map((f: string) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#444' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <a href="/pago/profesional" style={{ display: 'block', background: '#006D77', color: '#fff', padding: '14px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>
                  {Tpanel.planes.suscribirse}
                </a>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 12 }}>{Tpanel.planes.primer_mes}</div>
              </div>
            </div>
          )}

          {/* MI EQUIPO */}
          {!cargando && seccion === 'equipo' && ['agencia', 'unlimited'].includes(tipoUsuario) && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 4 }}>Mi equipo</h1>
                  <p style={{ fontSize: 14, color: '#888' }}>Gestiona los brokers de tu agencia</p>
                </div>
                <button style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Añadir broker</button>
              </div>

              {/* Stats equipo */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { label: 'Brokers activos', val: '4', color: '#006D77' },
                  { label: 'Anuncios del equipo', val: '23', color: '#17A6B4' },
                  { label: 'Contactos este mes', val: '87', color: '#10b981' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', borderTop: `3px solid ${k.color}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{k.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>{k.val}</div>
                  </div>
                ))}
              </div>

              {/* Lista brokers */}
              <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                {[
                  { nombre: 'Carlos Méndez', email: 'carlos@remax.com', anuncios: 8, contactos: 32, estado: 'activo', avatar: 'CM', aei: true },
                  { nombre: 'Ana Reyes', email: 'ana@remax.com', anuncios: 6, contactos: 24, estado: 'activo', avatar: 'AR', aei: true },
                  { nombre: 'Luis García', email: 'luis@remax.com', anuncios: 5, contactos: 18, estado: 'activo', avatar: 'LG', aei: false },
                  { nombre: 'María Torres', email: 'maria@remax.com', anuncios: 4, contactos: 13, estado: 'inactivo', avatar: 'MT', aei: false },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none' }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#006D77', flexShrink: 0 }}>{b.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{b.nombre}</span>
                        {b.aei && <span style={{ background: '#1a3a5c', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 3 }}>AEI</span>}
                      </div>
                      <div style={{ fontSize: 12, color: '#888' }}>{b.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#666' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#111' }}>{b.anuncios}</div>
                        <div style={{ fontSize: 11, color: '#aaa' }}>anuncios</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#111' }}>{b.contactos}</div>
                        <div style={{ fontSize: 11, color: '#aaa' }}>contactos</div>
                      </div>
                    </div>
                    <span style={{ background: b.estado === 'activo' ? '#e0f5f0' : '#f5f5f5', color: b.estado === 'activo' ? '#065f46' : '#888', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10 }}>
                      {b.estado === 'activo' ? '● Activo' : '○ Inactivo'}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ all: 'unset', border: '1px solid #e0e0e0', color: '#555', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Ver anuncios</button>
                      <button style={{ all: 'unset', border: '1px solid #e55', color: '#e55', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MI PLAN */}
          {!cargando && seccion === 'plan' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>{Tpanel.plan.titulo}</h1>

              {/* Plan actual */}
              {usuario?.plan !== 'profesional' ? (
                <div>
                  <div style={{ background: '#fff8e1', border: '1.5px solid #f59e0b', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{Tpanel.plan.planGratis}</div>
                    <div style={{ fontSize: 13, color: '#92400e' }}>{Tpanel.plan.anunciosUsados.replace('{n}', String(anunciosUsados)).replace('{max}', String(anunciosGratis))}</div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 8, padding: '28px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8 }}>{Tpanel.plan.haztePro}</div>
                    <div style={{ fontSize: 36, fontWeight: 700, color: '#006D77', marginBottom: 4 }}>US$ 9.99<span style={{ fontSize: 16, fontWeight: 400, color: '#aaa' }}>/mes</span></div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>{Tpanel.planes.primer_mes}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '0 auto 24px' }}>
                      {(Tpanel.planes.ventajas as string[]).map((f: string) => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#444' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          {f}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto' }}>
                      <a href="/pago/profesional" style={{ background: '#006D77', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{Tpanel.planes.suscribirse}</a>
                    </div>
                  </div>
                </div>
              ) : (() => {
                const fmt = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                const fmtCorto = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
                const activo = planInfo?.estado === 'active' || planInfo?.estado === 'trialing' ||
                  (!planInfo?.estado && usuario?.plan === 'profesional' && (!usuario?.plan_activo_hasta || new Date(usuario.plan_activo_hasta) > new Date()))
                return (
                <div>
                  {/* Suscripción activa */}
                  <div style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{Tpanel.plan.planPro}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 4 }}>US$ 9.99/mes</div>
                        {planInfo?.proximo_cobro
                          ? <div style={{ fontSize: 13, color: '#555' }}>{Tpanel.plan.proximoCobro}: <strong>{fmt(planInfo.proximo_cobro)}</strong></div>
                          : usuario?.plan_activo_hasta
                          ? <div style={{ fontSize: 13, color: '#555' }}>{Tpanel.plan.activo}: <strong>{fmt(usuario.plan_activo_hasta)}</strong></div>
                          : null
                        }
                      </div>
                      <span style={{ background: activo ? '#e0f5f0' : '#fee2e2', color: activo ? '#065f46' : '#dc2626', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 10 }}>● {activo ? Tpanel.plan.activo : Tpanel.plan.inactivo}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                      {[
                        { label: Tpanel.plan.inicio, val: planInfo?.inicio ? fmt(planInfo.inicio) : usuario?.created_at ? fmt(usuario.created_at) : '—' },
                        { label: Tpanel.plan.proximoCobro, val: planInfo?.proximo_cobro ? `US$ 9.99 · ${fmtCorto(planInfo.proximo_cobro)}` : usuario?.plan_activo_hasta ? fmtCorto(usuario.plan_activo_hasta) : '—' },
                        { label: Tpanel.plan.tarjeta, val: planInfo?.last4 ? `•••• ${planInfo.last4}` : '—' },
                      ].map(d => (
                        <div key={d.label}>
                          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 3 }}>{d.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{d.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Historial de pagos */}
                  <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 14 }}>{Tpanel.plan.historial}</div>
                    {!planInfo ? (
                      <div style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '16px 0' }}>{Tpanel.plan.cargando}</div>
                    ) : planInfo.sin_sub || planInfo.error || !planInfo.pagos?.length ? (
                      usuario?.plan_activo_hasta ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0' }}>
                          <div style={{ flex: 1, fontSize: 13, color: '#333' }}>{fmtCorto(usuario.created_at)}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>US$ 9.99</div>
                          <span style={{ background: '#e0f5f0', color: '#065f46', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>Pagado</span>
                        </div>
                      ) : (
                      <div style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '16px 0' }}>{Tpanel.plan.sinHistorial}</div>
                      )
                    ) : planInfo.pagos?.map((p: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: i < planInfo.pagos.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                        <div style={{ flex: 1, fontSize: 13, color: '#333' }}>{fmtCorto(p.fecha)}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{p.moneda} {p.monto}</div>
                        <span style={{ background: p.estado === 'paid' ? '#e0f5f0' : '#fff8e1', color: p.estado === 'paid' ? '#065f46' : '#92400e', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>{p.estado === 'paid' ? Tpanel.publicar.pagado : p.estado}</span>
                        {p.numero && <div style={{ fontSize: 12, color: '#aaa', minWidth: 80 }}>{p.numero}</div>}
                        {p.pdf && <a href={p.pdf} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#006D77', textDecoration: 'none', fontWeight: 500 }}>PDF</a>}
                      </div>
                    ))}
                  </div>

                  {/* Dar de baja */}
                  <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderLeft: '3px solid #fee2e2' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 4 }}>{Tpanel.plan.cancelar}</div>
                    <button onClick={async () => { const { data: { user } } = await supabase.auth.getUser(); if (!user) return; if (!confirm(Tpanel.plan.cancelarConfirm)) return; const res = await fetch('/api/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) }); const data = await res.json(); if (data.ok) alert(Tpanel.plan.cancelarOk); else alert(Tpanel.plan.cancelarErr) }} style={{ all: 'unset', border: '1.5px solid #e55', color: '#e55', padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                      {Tpanel.plan.cancelarBtn}
                    </button>
                  </div>
                </div>
                )
              })()}
            </div>
          )}

          {/* MI PERFIL */}
          {!cargando && seccion === 'perfil' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 24 }}>{Tpanel.perfil.titulo}</h1>
              <div style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#006D77', overflow: 'hidden' }}>
                      {fotoPerfilUrl ? <img src={fotoPerfilUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.25s' }} /> : (perfilNombre || usuario?.nombre || 'U').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <label style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: '#006D77', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setFotoPerfilFile(file)
                          const reader = new FileReader()
                          reader.onload = ev => setFotoPerfilUrl(ev.target?.result as string)
                          reader.readAsDataURL(file)
                        }
                      }} />
                    </label>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>{perfilNombre || usuario?.nombre || Tpanel.perfil.titulo}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {tipoUsuario === 'profesional' && <span style={{ background: '#17A6B4', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{Tpanel.anuncios.roles.profesional}</span>}
                      {perfilAei && usuario?.aei_aprobado === true && <span style={{ background: '#1a3a5c', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>✓ AEI</span>}
                      {perfilAei && usuario?.aei_aprobado !== true && <span style={{ background: '#f59e0b', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>⏳ AEI pendiente</span>}
                    </div>
                    {tipoUsuario === 'profesional' && usuario?.plan !== 'profesional' && (
                      <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 10px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span style={{ fontSize: 11, color: '#6b7280' }}>Plan profesional pendiente ·{' '}</span>
                        <button onClick={() => setSeccion('publicar')} style={{ all: 'unset', fontSize: 11, color: '#006D77', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>activar</button>
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Pulsa el icono para cambiar tu foto</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.perfil.nombre} <span style={{ color: '#e53e3e' }}>*</span></label>
                    <input value={perfilNombre} onChange={e => setPerfilNombre(e.target.value)} maxLength={22} style={{ width: '100%', border: `1.5px solid ${!perfilNombre ? '#e53e3e' : '#e0e0e0'}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor= perfilNombre ? '#e0e0e0' : '#e53e3e'} />
                    {!perfilNombre && <div style={{ fontSize: 11, color: '#e53e3e', marginTop: 4 }}>{Tpanel.perfil.err_nombre}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.perfil.email}</label>
                    <input value={usuario?.email || ''} disabled style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#f9f9f9', color: '#aaa' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.perfil.telefono}</label>
                    <input value={perfilTelefono} onChange={e => setPerfilTelefono(e.target.value.slice(0, 16))} placeholder="+1 809 000 0000" maxLength={16} style={{ width: '100%', border: `1.5px solid ${!perfilTelefono ? '#e53e3e' : '#e0e0e0'}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor= perfilTelefono ? '#e0e0e0' : '#e53e3e'} />
                    {!perfilTelefono && <div style={{ fontSize: 11, color: '#e53e3e', marginTop: 4 }}>{Tpanel.perfil.err_telefono}</div>}
                  </div>
                  {tipoUsuario === 'profesional' && usuario?.plan === 'profesional' && (
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.perfil.inmobiliaria}</label>
                      <input value={perfilInmobiliaria} onChange={e => setPerfilInmobiliaria(e.target.value)} placeholder='Nombre de tu agencia (opcional)' style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                    </div>
                  )}
                  {tipoUsuario === 'profesional' && usuario?.plan === 'profesional' && (
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.perfil.aei}</label>
                      <input value={perfilAei} onChange={e => setPerfilAei(e.target.value)} placeholder='AEI-0000' style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                      {perfilAei && usuario?.aei_aprobado !== true && (
                        <div style={{ fontSize: 11, color: '#92400e', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Pendiente de verificación por Propiteca
                        </div>
                      )}
                      {perfilAei && usuario?.aei_aprobado === true && (
                        <div style={{ fontSize: 11, color: '#065f46', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                          Verificado por Propiteca
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={guardarPerfil} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '11px 28px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 20 }}>
                  {Tpanel.perfil.guardar}
                </button>

                {/* Cerrar sesión */}
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
                  <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }} style={{ all: 'unset', fontSize: 12, color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#e55'}
                    onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    {Tn.cerrarSesion}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GUARDADOS */}
          {!cargando && seccion === 'guardados' && (
            <GuardadosSeccion />
          )}

          {/* CURSOS AEI */}
          {!cargando && seccion === 'cursos' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>Cursos AEI</h1>
                <span style={{ background: '#1a3a5c', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>En colaboración con AEI</span>
              </div>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>Formación oficial de la Asociación de Agentes y Empresas Inmobiliarias de República Dominicana</p>

              {/* Banner AEI */}
              <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #004E57 100%)', borderRadius: 10, padding: '28px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>ASOCIACIÓN OFICIAL</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Certifícate como agente inmobiliario profesional</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>La AEI es la asociación oficial de agentes inmobiliarios de RD. Con tu certificación aparecerá el badge AEI verificado en todos tus anuncios de Propiteca.</div>
                </div>
                <a href="https://aei.com.do" target="_blank" rel="noopener noreferrer" style={{ all: 'unset', background: '#fff', color: '#1a3a5c', padding: '12px 24px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Visitar AEI
                </a>
              </div>

              <div style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 20 }}>
                  Accede a toda la oferta formativa oficial de la AEI directamente en su web.<br/>
                  Al completar cualquier curso recibirás tu certificación y el badge AEI verificado aparecerá en todos tus anuncios de Propiteca.
                </div>
                <a href="https://aei.com.do" target="_blank" rel="noopener noreferrer" style={{ all: 'unset', background: '#1a3a5c', color: '#fff', padding: '13px 32px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-block' }}>
                  Ver todos los cursos en AEI
                </a>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 14 }}>
                  Serás redirigido a la web oficial de la Asociación de Agentes y Empresas Inmobiliarias de República Dominicana.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}



