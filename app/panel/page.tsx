'use client'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { supabase } from '../../supabase'
import { useIdioma } from '../../IdiomaContext'

const Ip = (paths: React.ReactNode) => <svg width="18" height="18" viewBox="2 2 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" style={{ overflow: 'visible', flexShrink: 0 }}>{paths}</svg>

function getMenuItems(Tpanel: any) {
  return [
    { id: 'anuncios', label: Tpanel?.menu?.anuncios ?? 'Mis anuncios', icon: Ip(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>) },
    { id: 'publicar', label: Tpanel?.menu?.publicar ?? 'Publicar anuncio', icon: Ip(<><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>) },
    { id: 'mensajes', label: Tpanel?.menu?.mensajes ?? 'Mensajes', icon: Ip(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>) },
    { id: 'estadisticas', label: Tpanel?.menu?.estadisticas ?? 'Estadísticas', icon: Ip(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>) },
    { id: 'destacar', label: Tpanel?.menu?.destacar ?? 'Destacar anuncio', icon: Ip(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>) },
    { id: 'plan', label: Tpanel?.menu?.plan ?? 'Mi plan', icon: Ip(<><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>) },
    { id: 'perfil', label: Tpanel?.menu?.perfil ?? 'Mi perfil', icon: Ip(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>) },
    { id: 'guardados', label: Tpanel?.menu?.guardados ?? 'Guardados', icon: Ip(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>) },
    { id: 'cursos', label: Tpanel?.menu?.cursos ?? 'Cursos AEI', icon: Ip(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>) },
    { id: 'ayuda', label: Tpanel?.menu?.ayuda ?? 'Ayuda', proOnly: true, icon: Ip(<><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>) },
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
  { dias: 30, precio: 15.99, label: '30 días', popular: true },
  { dias: 60, precio: 29.99, label: '60 días', popular: false },
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
  'Azua': ['Azua', 'Las Charcas', 'Estebanía'],
  'Barahona': ['Barahona', 'Enriquillo', 'Paraíso', 'Las Salinas'],
  'Bahoruco': ['Neiba', 'Tamayo', 'Los Ríos'],
  'Independencia': ['Jimaní', 'La Descubierta', 'Postrer Río'],
  'Elías Piña': ['Comendador', 'Bánica', 'Pedro Santana'],
  'San Juan': ['San Juan de la Maguana', 'Las Matas de Farfán', 'Vallejuelo', 'Bohechío'],
  'Monte Cristi': ['Monte Cristi', 'Guayubín', 'Villa Vásquez'],
  'Dajabón': ['Dajabón', 'Loma de Cabrera', 'Restauración'],
  'Santiago Rodríguez': ['Sabaneta', 'Monción', 'Villa Los Almácigos'],
  'Sánchez Ramírez': ['Cotuí', 'Cevicos'],
  'Hermanas Mirabal': ['Salcedo', 'Tenares', 'Villa Tapia'],
  'Pedernales': ['Pedernales', 'Oviedo'],
  'San José de Ocoa': ['San José de Ocoa', 'Rancho Arriba'],
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
  { id: 'zona_recreativa', label: 'Zona recreativa' },
]

function fmtStat(n: number | string | undefined): string {
  const v = Number(n ?? 0)
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(v)
}

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
              <div key={f.propiedad_id} className="guardado-card" style={{ background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8', display: 'flex', overflow: 'hidden', cursor: 'pointer' }} onClick={() => window.location.href = `/propiedad/${p.id}`}>
                <div className="guardado-foto" style={{ width: 140, minWidth: 140, height: 115, background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {foto ? <img src={foto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                </div>
                <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
                  <div className="guardado-titulo" style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.titulo}</div>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.zona}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#006D77', marginBottom: 4 }}>US$ {p.precio?.toLocaleString('en-US')}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>
                    {p.habitaciones > 0 && `${p.habitaciones} hab · `}{p.banos > 0 && `${p.banos} baños`}{p.m2 > 0 && ` · ${p.m2} m²`}
                  </div>
                </div>
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
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
  const { tr: trLang, idioma, setIdioma } = useIdioma()
  const Tpanel = trLang.panel
  const Tn = trLang.nav
  const menuItems = getMenuItems(Tpanel)
  const [seccion, setSeccion] = useState('anuncios')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [panelNavOpen, setPanelNavOpen] = useState(false)
  const [navUserMenuOpen, setNavUserMenuOpen] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroProvincia, setFiltroProvincia] = useState('')
  const [provinciaOpen, setProvinciaOpen] = useState(false)
  const [tipoOpen, setTipoOpen] = useState(false)
  const [busquedaAnuncio, setBusquedaAnuncio] = useState('')
  const [ordenAnuncio, setOrdenAnuncio] = useState('destacados')
  const [ordenOpen, setOrdenOpen] = useState(false)
  const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null)
  const [planInfo, setPlanInfo] = useState<any>(null)
  const [ayudaTipo, setAyudaTipo] = useState('pregunta')
  const [ayudaMensaje, setAyudaMensaje] = useState('')
  const [ayudaEnviando, setAyudaEnviando] = useState(false)
  const [ayudaOk, setAyudaOk] = useState(false)
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
  type FotoItem = { id: string; src: string; file?: File }
  const [fotosLista, setFotosLista] = useState<FotoItem[]>([])
  const [fotoDragOver, setFotoDragOver] = useState<number | null>(null)
  const touchDragIdx = useRef<number | null>(null)
  const [pubTitulo, setPubTitulo] = useState('')
  const [pubPrecio, setPubPrecio] = useState('')
  const [pubM2, setPubM2] = useState('')
  const [pubDesc, setPubDesc] = useState('')
  const [pubDescEn, setPubDescEn] = useState('')
  const [pubDescFr, setPubDescFr] = useState('')
  const [descLang, setDescLang] = useState<'es'|'en'|'fr'>('es')
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
  const [fotosExistentes, setFotosExistentes] = useState<string[]>([]) // legacy, unused after unification
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(null)
  const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null)
  const [perfilNombre, setPerfilNombre] = useState('')
  const [perfilTelefono, setPerfilTelefono] = useState('')
  const [perfilInmobiliaria, setPerfilInmobiliaria] = useState('')
  const [perfilAei, setPerfilAei] = useState('')
  const [perfilIdiomas, setPerfilIdiomas] = useState<string[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [anunciosReales, setAnunciosReales] = useState<any[]>([])
  const [mensajesReales, setMensajesReales] = useState<any[]>([])
  const [bloqueadosSet, setBloqueadosSet] = useState<Set<string>>(new Set())
  const [cargando, setCargando] = useState(true)
  const [respuesta, setRespuesta] = useState('')
  const [verificandoPago, setVerificandoPago] = useState(false)
  const [modalBaja, setModalBaja] = useState(false)
  const [bajando, setBajando] = useState(false)
  const [codigoPromo, setCodigoPromo] = useState('')
  const [promoExpanded, setPromoExpanded] = useState(false)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')



  useLayoutEffect(() => {
    const s = new URLSearchParams(window.location.search).get('s')
    if (s) setSeccion(s)
  }, [])

  useEffect(() => {
    history.replaceState(null, '', `?s=${seccion}`)
  }, [seccion])

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
    if (!cargando && !perfilTelefono && seccion !== 'perfil') {
      setSeccion('perfil')
    }
  }, [cargando, perfilTelefono])

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
        setPerfilIdiomas(Array.isArray(perfil.idiomas) ? perfil.idiomas : [])

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
        const stored = localStorage.getItem(`habitade_leidos_${user.id}`)
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
    const nuevas = Array.from(files).slice(0, 20 - fotosLista.length)
    nuevas.forEach(f => {
      const reader = new FileReader()
      reader.onload = e => setFotosLista(prev => [...prev, { id: `new-${Date.now()}-${Math.random()}`, src: e.target?.result as string, file: f }])
      reader.readAsDataURL(f)
    })
  }

  const quitarFoto = (idx: number) => {
    setFotosLista(prev => prev.filter((_, i) => i !== idx))
  }

  const moverFoto = (desde: number, hasta: number) => {
    setFotosLista(prev => {
      const arr = [...prev]
      const [item] = arr.splice(desde, 1)
      arr.splice(hasta, 0, item)
      return arr
    })
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
      numero_aei: perfilAei ? (perfilAei.startsWith('AEI-') ? perfilAei : `AEI-${perfilAei}`) : null,
      idiomas: perfilIdiomas,
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
    setFotosLista((Array.isArray(raw.fotos) ? raw.fotos : []).map((src: string, i: number) => ({ id: `ex-${i}`, src })))
    setPubTitulo(raw.titulo || '')
    setPubPrecio(String(raw.precio || ''))
    setPubM2(raw.m2 ? String(raw.m2) : '')
    setPubDesc(raw.descripcion || '')
    setPubDescEn(raw.descripcion_en || '')
    setPubDescFr(raw.descripcion_fr || '')
    setDescLang('es')
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
    if (!pubTitulo || !pubPrecio || !pubProvincia || !pubM2) { setPubError(Tpanel.publicar.err_campos); return }
    if (!pubDesc.trim()) { setPubError(Tpanel.publicar.err_desc); return }
    if (fotosLista.length === 0) { setPubError(Tpanel.publicar.err_fotos); return }
    setPubLoading(true)
    setPubError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setPubError('Debes iniciar sesión para publicar'); setPubLoading(false); return }

    // Subir fotos en el orden actual y conservar URLs existentes
    const todasFotos: string[] = []
    for (const item of fotosLista) {
      if (item.file) {
        const ext = item.file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data: uploadData, error: uploadErr } = await supabase.storage.from('propiedades').upload(path, item.file, { upsert: true })
        if (!uploadErr && uploadData) {
          const { data: urlData } = supabase.storage.from('propiedades').getPublicUrl(uploadData.path)
          todasFotos.push(urlData.publicUrl)
        }
      } else {
        todasFotos.push(item.src)
      }
    }

    const campos = {
      titulo: pubTitulo,
      descripcion: pubDesc,
      descripcion_en: pubDescEn.trim() || null,
      descripcion_fr: pubDescFr.trim() || null,
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
    setPubTitulo(''); setPubPrecio(''); setPubM2(''); setPubDesc(''); setPubDescEn(''); setPubDescFr(''); setDescLang('es')
    setPubProvincia(''); setPubSector(''); setPubHab('1'); setPubBanos('1')
    setPubParqueos(''); setPubPlanta(''); setPubAnio('')
    setFotosLista([]); setAnuncioEditando(null)
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
    compartidos: a.compartidos || 0,
    mensajes: mensajesReales.filter((m: any) => m.propiedad_id === a.id).length,
    destacado: a.destacado && (!a.destacado_hasta || new Date(a.destacado_hasta) > new Date()),
    destacado_hasta: a.destacado_hasta || null,
    created_at: a.created_at || '',
    vence: '30 días',
    bg: '#e0f5f7',
    fotos: a.fotos,
  }))

  const provinciasDisponibles = [...new Set(anunciosAMostrar.map((a: any) => { const p = (a.zona || '').split(','); return p[p.length - 1].trim() }).filter(Boolean))] as string[]
  const anunciosFiltrados = anunciosAMostrar
    .filter((a: any) => {
      if (filtroTipo && a.tipo !== filtroTipo) return false
      if (filtroProvincia && !(a.zona || '').endsWith(filtroProvincia)) return false
      if (busquedaAnuncio.trim() && !(a.titulo || '').toLowerCase().includes(busquedaAnuncio.trim().toLowerCase())) return false
      return true
    })
    .sort((a: any, b: any) => {
      if (ordenAnuncio === 'destacados') {
        if (a.destacado && !b.destacado) return -1
        if (!a.destacado && b.destacado) return 1
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (ordenAnuncio === 'recientes') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (ordenAnuncio === 'antiguos') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (ordenAnuncio === 'caros') return (b.precio || 0) - (a.precio || 0)
      if (ordenAnuncio === 'baratos') return (a.precio || 0) - (b.precio || 0)
      return 0
    })
  const noLeidos = mensajesReales.filter((m: any) => !mensajesLeidos[m.id]).length
  const tipoUsuario: string = usuario?.plan === 'profesional'
    ? 'profesional'
    : (usuario?.tipo && !['profesional', 'cancelando'].includes(usuario.tipo) ? usuario.tipo : 'particular')
  const anunciosGratis = 2
  const anunciosUsados = anunciosReales.length
  const suscripcionVencida = usuario?.plan === 'gratis' && usuario?.plan_activo_hasta && new Date(usuario.plan_activo_hasta) < new Date()

  const handleSuscribirse = async () => {
    setPromoError('')
    setPromoLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const body: any = { userId: user?.id, email: user?.email, tipo: 'profesional', locale: idioma }
      if (codigoPromo.trim()) body.codigoPromo = codigoPromo.trim().toUpperCase()
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setPromoError(data.error || 'Error procesando el pago')
    } catch {
      setPromoError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setPromoLoading(false)
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>

      {/* MENÚ MÓVIL NAV DROPDOWN */}
      {panelNavOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.25)' }} onClick={() => setPanelNavOpen(false)}>
          <div style={{ position: 'absolute', top: 54, left: 0, right: 0, background: '#fff', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', borderRadius: '0 0 16px 16px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '4px 0' }}>
              {menuItems.filter(item => (item.id !== 'equipo' || ['agencia', 'unlimited'].includes(tipoUsuario)) && (!('proOnly' in item) || tipoUsuario === 'profesional')).map(item => (
                <button key={item.id} onClick={() => { const dest = item.id === 'publicar' && tipoUsuario === 'particular' && anunciosUsados >= anunciosGratis ? 'planes' : item.id; setSeccion(dest); setPanelNavOpen(false) }} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', fontSize: 14, color: seccion === item.id ? '#006D77' : '#333', background: seccion === item.id ? '#f0fafa' : 'transparent', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <span style={{ color: seccion === item.id ? '#006D77' : '#888', display: 'flex' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '4px 0 0' }}>
              <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', fontSize: 14, color: '#333', textDecoration: 'none' }}>
                <span style={{ color: '#888', display: 'flex' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </span>
                {Tn.verWeb}
              </a>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 14px', borderTop: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['es', 'en', 'fr'] as const).map(l => (
                    <button key={l} onClick={() => { setIdioma(l); setPanelNavOpen(false) }}
                      style={{ all: 'unset', padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: idioma === l ? '#006D77' : '#f0f0f0', color: idioma === l ? '#fff' : '#888', transition: 'all 0.15s' }}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button onClick={async () => { const { supabase: sb } = await import('../../supabase'); await sb.auth.signOut(); window.location.href = '/' }}
                  style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, background: '#fff0f0', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e63946" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="panel-hamburger" onClick={() => setSidebarOpen(v => !v)} style={{ all: 'unset', cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 6, background: 'rgba(255,255,255,0.15)' }}>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect y="0" width="18" height="2" rx="1" fill="white"/><rect y="6" width="18" height="2" rx="1" fill="white"/><rect y="12" width="18" height="2" rx="1" fill="white"/></svg>
          </button>
          <a href="/" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>
            habitade.
          </a>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 10 }}>{Tpanel?.menu?.miPanel ?? 'Mi panel'}</span>
        </div>
        <div className="panel-nav-right" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#004E57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#83D4DB', overflow: 'hidden' }}>
              {fotoPerfilUrl ? <img src={fotoPerfilUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.25s' }} /> : (perfilNombre || usuario?.nombre || 'U').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500 }}>{usuario?.nombre || Tn.miCuenta}</span>
              <span className="panel-nav-email" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>{usuario?.email || ''}</span>
            </div>
            <span style={{ background: tipoUsuario === 'particular' ? 'rgba(255,255,255,0.2)' : '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>
              {tipoUsuario === 'particular' ? Tpanel.anuncios.roles.particular : Tpanel.anuncios.roles.profesional}
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setNavUserMenuOpen(v => !v)} style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 6, background: 'rgba(255,255,255,0.15)', cursor: 'pointer' }}>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect y="0" width="16" height="2" rx="1" fill="white"/><rect y="5" width="16" height="2" rx="1" fill="white"/><rect y="10" width="16" height="2" rx="1" fill="white"/></svg>
            </button>
            {navUserMenuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setNavUserMenuOpen(false)} />
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', minWidth: 180, zIndex: 200 }}>
                  <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 13, color: '#333', textDecoration: 'none', borderBottom: '1px solid #f5f5f5' }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#f0fafb'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    {Tn.verWeb}
                  </a>
                  <button onClick={async () => { const { supabase: sb } = await import('../../supabase'); await sb.auth.signOut(); window.location.href = '/' }}
                    style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 13, color: '#e63946', cursor: 'pointer', boxSizing: 'border-box', borderBottom: '1px solid #f5f5f5' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#fff5f5'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    {Tn.cerrarSesion}
                  </button>
                  <div style={{ padding: '10px 16px', display: 'flex', gap: 4 }}>
                    {(['es', 'en', 'fr'] as const).map(l => (
                      <button key={l} onClick={() => { setIdioma(l); setNavUserMenuOpen(false) }}
                        style={{ all: 'unset', flex: 1, textAlign: 'center', padding: '5px 0', borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: idioma === l ? '#006D77' : '#f0f0f0', color: idioma === l ? '#fff' : '#888', transition: 'all 0.15s' }}>
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <button className="panel-nav-hamburger-right" onClick={() => setPanelNavOpen(v => !v)} style={{ display: 'none', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </nav>

      <div style={{ display: 'flex' }}>

        {/* SIDEBAR OVERLAY (móvil) */}
        {sidebarOpen && <div className="panel-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* SIDEBAR */}
        <div className={`panel-sidebar${sidebarOpen ? ' open' : ''}`} style={{ width: 220, background: '#004E57', minHeight: 'calc(100vh - 54px)', padding: '20px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          {menuItems.filter(item => (item.id !== 'equipo' || ['agencia', 'unlimited'].includes(tipoUsuario)) && (!('proOnly' in item) || tipoUsuario === 'profesional')).map(item => (
            <button key={item.id} onClick={() => { if (item.id === 'publicar' && !(perfilNombre && perfilTelefono)) { setSeccion('publicar'); setSidebarOpen(false); return } if (item.id === 'publicar' && !anuncioEditando && tipoUsuario === 'particular' && anunciosUsados >= anunciosGratis) { setSeccion('planes'); setSidebarOpen(false); return } setSeccion(item.id); setSidebarOpen(false) }} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontSize: 13, color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.6)', background: seccion === item.id ? 'rgba(255,255,255,0.12)' : 'transparent', cursor: 'pointer', borderLeft: seccion === item.id ? '3px solid #83D4DB' : '3px solid transparent', boxSizing: 'border-box', position: 'relative' }}>
              {item.icon}
              {item.label}
              {item.id === 'mensajes' && noLeidos > 0 && (
                <span style={{ position: 'absolute', right: 14, background: '#17A6B4', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{noLeidos}</span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENIDO */}
        <div className="panel-main" style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {cargando && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#006D77', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* AVISO PAGO FALLIDO */}
          {!cargando && usuario?.plan === 'past_due' && (
            <div style={{ background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 8, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#a8071a' }}>Pago fallido — tu cuenta se desactivará el {usuario.plan_activo_hasta ? new Date(usuario.plan_activo_hasta).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : 'en breve'}</div>
                  <div style={{ fontSize: 12, color: '#cf1322', marginTop: 2 }}>Si no se cobra antes de esa fecha, tus anuncios serán eliminados y la cuenta volverá al plan gratuito.</div>
                </div>
              </div>
              <a href="/pago/profesional" style={{ background: '#e63946', color: '#fff', padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Actualizar pago</a>
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
                <div style={{ background: 'linear-gradient(135deg, #004E57 0%, #006D77 60%, #17A6B4 100%)', borderRadius: 12, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{Tpanel.anuncios.limiteAlcanzado}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{Tpanel.anuncios.limiteDesc.replace('{n}', String(anunciosGratis))}</div>
                  </div>
                  <button onClick={() => setSeccion('planes')} style={{ all: 'unset', background: '#fff', color: '#006D77', padding: '10px 20px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {Tpanel.anuncios.haztePro}
                  </button>
                </div>
              )}

              {/* KPIs reales */}
              <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                  { label: Tpanel.anuncios.kpi_visitas, val: fmtStat(anunciosReales.reduce((s, a) => s + (a.visitas || 0), 0)), sub: Tpanel.anuncios.kpi_visitas_sub, color: '#006D77' },
                  { label: Tpanel.anuncios.kpi_tel, val: fmtStat(anunciosReales.reduce((s, a) => s + (a.tel_vistos || 0), 0)), sub: Tpanel.anuncios.kpi_tel_sub, color: '#10b981' },
                  { label: Tpanel.anuncios.guardados, val: fmtStat(anunciosReales.reduce((s, a) => s + (a.favoritos || 0), 0)), sub: Tpanel.anuncios.kpi_guardados_sub, color: '#f59e0b' },
                  { label: Tpanel.anuncios.kpi_compartidos ?? 'Veces compartido', val: fmtStat(anunciosReales.reduce((s, a) => s + (a.compartidos || 0), 0)), sub: Tpanel.anuncios.kpi_compartidos_sub ?? 'veces que compartieron', color: '#8b5cf6' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#fff', borderRadius: 8, padding: '14px 16px', borderTop: `3px solid ${k.color}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{k.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 2 }}>{k.val}</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Filtro por tipo + provincia */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                {/* Desplegable tipo */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => { setTipoOpen(v => !v); setProvinciaOpen(false) }} style={{ all: 'unset', border: `1.5px solid ${filtroTipo ? '#006D77' : '#e0e0e0'}`, borderRadius: 8, padding: '7px 14px', fontSize: 13, color: filtroTipo ? '#006D77' : '#555', background: filtroTipo ? '#f0fafb' : '#fff', cursor: 'pointer', fontWeight: filtroTipo ? 600 : 400, display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    {filtroTipo ? (trLang.tipos as any)[{ 'Apartamento':'apartamento','Casa':'casa','Villa':'villa','Edificio':'edificio','Oficina':'oficina','Terreno':'terreno','Local comercial':'local' }[filtroTipo] || ''] || filtroTipo : Tpanel.anuncios.filtroTipo}
                    {filtroTipo && <span onClick={e => { e.stopPropagation(); setFiltroTipo('') }} style={{ display: 'flex', alignItems: 'center', marginLeft: 2, opacity: 0.5 }}>×</span>}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: tipoOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', marginLeft: 2 }}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {tipoOpen && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setTipoOpen(false)} />
                      <div style={{ position: 'absolute', left: 0, top: 'calc(100% + 6px)', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, minWidth: 200, overflow: 'hidden' }}>
                        {[{ val: '', label: Tpanel.anuncios.filtroTodostipos }, ...([['Apartamento','apartamento'],['Casa','casa'],['Villa','villa'],['Edificio','edificio'],['Oficina','oficina'],['Terreno','terreno'],['Local comercial','local']] as [string,string][]).map(([val,key]) => ({ val, label: (trLang.tipos as any)[key] || val }))].map(({ val, label }, i, arr) => (
                          <button key={val} onClick={() => { setFiltroTipo(val); setTipoOpen(false) }} style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', fontSize: 13, color: filtroTipo === val ? '#006D77' : '#333', fontWeight: filtroTipo === val ? 600 : 400, background: filtroTipo === val ? '#f0fafb' : 'transparent', cursor: 'pointer', borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none', boxSizing: 'border-box' }}>
                            {filtroTipo === val && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                            {filtroTipo !== val && <span style={{ width: 12 }} />}
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Desplegable provincia */}
                {provinciasDisponibles.length > 0 && (
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => { setProvinciaOpen(v => !v); setTipoOpen(false) }} style={{ all: 'unset', border: `1.5px solid ${filtroProvincia ? '#006D77' : '#e0e0e0'}`, borderRadius: 8, padding: '7px 14px', fontSize: 13, color: filtroProvincia ? '#006D77' : '#555', background: filtroProvincia ? '#f0fafb' : '#fff', cursor: 'pointer', fontWeight: filtroProvincia ? 600 : 400, display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                      {filtroProvincia || Tpanel.anuncios.filtroProvincia}
                      {filtroProvincia && <span onClick={e => { e.stopPropagation(); setFiltroProvincia('') }} style={{ display: 'flex', alignItems: 'center', marginLeft: 2, opacity: 0.5 }}>×</span>}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: provinciaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', marginLeft: 2 }}><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    {provinciaOpen && (
                      <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setProvinciaOpen(false)} />
                        <div style={{ position: 'absolute', left: 0, top: 'calc(100% + 6px)', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, minWidth: 200, maxHeight: 260, overflowY: 'auto', overflow: 'hidden' }}>
                          <button onClick={() => { setFiltroProvincia(''); setProvinciaOpen(false) }} style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', fontSize: 13, color: !filtroProvincia ? '#006D77' : '#333', fontWeight: !filtroProvincia ? 600 : 400, background: !filtroProvincia ? '#f0fafb' : 'transparent', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', boxSizing: 'border-box' }}>
                            {!filtroProvincia && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                            {filtroProvincia && <span style={{ width: 12 }} />}
                            {Tpanel.anuncios.filtroTodasProvincias}
                          </button>
                          {provinciasDisponibles.map(p => (
                            <button key={p} onClick={() => { setFiltroProvincia(p); setProvinciaOpen(false) }} style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', fontSize: 13, color: filtroProvincia === p ? '#006D77' : '#333', fontWeight: filtroProvincia === p ? 600 : 400, background: filtroProvincia === p ? '#f0fafb' : 'transparent', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', boxSizing: 'border-box' }}>
                              {filtroProvincia === p && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                              {filtroProvincia !== p && <span style={{ width: 12 }} />}
                              {p}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Banner pago fallido */}
              {usuario?.plan === 'past_due' && (
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '16px 20px', marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#c2410c', marginBottom: 3 }}>Tus anuncios no son visibles temporalmente</div>
                    <div style={{ fontSize: 13, color: '#7c2d12', lineHeight: 1.5 }}>
                      Hubo un problema con tu último pago. Estamos intentando cobrarlo de nuevo. En cuanto se resuelva, tus anuncios vuelven a publicarse automáticamente.<br/>
                      <span style={{ fontWeight: 600 }}>Si no se resuelve en 15 días, tus anuncios serán eliminados.</span>
                    </div>
                    <button onClick={() => setSeccion('plan')} style={{ all: 'unset', marginTop: 10, background: '#c2410c', color: '#fff', padding: '7px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-block' }}>Actualizar método de pago</button>
                  </div>
                </div>
              )}

              {/* Buscador + orden */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                {/* Buscador */}
                <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    value={busquedaAnuncio}
                    onChange={e => setBusquedaAnuncio(e.target.value)}
                    placeholder="Buscar anuncio..."
                    style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '7px 12px 7px 32px', fontSize: 13, color: '#333', background: '#fff', outline: 'none', boxSizing: 'border-box', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                  />
                  {busquedaAnuncio && (
                    <button onClick={() => setBusquedaAnuncio('')} style={{ all: 'unset', position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa', fontSize: 16, lineHeight: 1 }}>×</button>
                  )}
                </div>
                {/* Desplegable orden */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button onClick={() => { setOrdenOpen(v => !v); setTipoOpen(false); setProvinciaOpen(false) }} style={{ all: 'unset', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '7px 14px', fontSize: 13, color: '#555', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                    {{ destacados: 'Destacados primero', recientes: 'Más recientes', antiguos: 'Más antiguos', caros: 'Más caros', baratos: 'Más baratos' }[ordenAnuncio]}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: ordenOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {ordenOpen && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOrdenOpen(false)} />
                      <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, minWidth: 190, overflow: 'hidden' }}>
                        {[
                          { val: 'destacados', label: 'Destacados primero' },
                          { val: 'recientes',  label: 'Más recientes' },
                          { val: 'antiguos',   label: 'Más antiguos' },
                          { val: 'caros',      label: 'Más caros' },
                          { val: 'baratos',    label: 'Más baratos' },
                        ].map(({ val, label }, i, arr) => (
                          <button key={val} onClick={() => { setOrdenAnuncio(val); setOrdenOpen(false) }} style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', fontSize: 13, color: ordenAnuncio === val ? '#006D77' : '#333', fontWeight: ordenAnuncio === val ? 600 : 400, background: ordenAnuncio === val ? '#f0fafb' : 'transparent', cursor: 'pointer', borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none', boxSizing: 'border-box' }}>
                            {ordenAnuncio === val
                              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                              : <span style={{ width: 12 }} />}
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Lista anuncios */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {anunciosFiltrados.length === 0 && !cargando && (
                  <div style={{ background: '#fff', borderRadius: 8, padding: '48px 24px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>{Tpanel.anuncios.sinAnuncios}</div>
                    <div style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>
                      {tipoUsuario === 'profesional'
                        ? 'Miles de compradores buscan propiedades en Habitade cada día. Publica tu primer anuncio y empieza a recibir contactos.'
                        : Tpanel.anuncios.sinAnunciosDesc}
                    </div>
                    <button onClick={() => setSeccion('publicar')} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '11px 28px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      {Tpanel.anuncios.publicarPrimero}
                    </button>
                  </div>
                )}
                {anunciosFiltrados.map(a => {
                  const estado = estadosAnuncios[a.id] || a.estado
                  return (
                    <div key={a.id} className="anuncio-card" style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderLeft: a.destacado ? '4px solid #006D77' : '4px solid transparent', overflow: 'hidden' }}>
                      {/* Fila principal */}
                      <div className="anuncio-card-body" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                        <div style={{ width: 84, height: 62, borderRadius: 6, background: '#e8f4f5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                          {Array.isArray(a.fotos) && a.fotos[0]
                            ? <img src={a.fotos[0]} alt={a.titulo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2, flexWrap: 'wrap' }}>
                            <a href={`/propiedad/${a.id}`} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 700, color: '#111', textDecoration: 'none', lineHeight: 1.3 }} onMouseEnter={e => (e.currentTarget.style.color='#006D77')} onMouseLeave={e => (e.currentTarget.style.color='#111')}>{a.titulo}</a>
                            {a.destacado && <span style={{ background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 6, letterSpacing: 0.4, whiteSpace: 'nowrap', flexShrink: 0 }}>DEST.</span>}
                          </div>
                          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.zona} · {a.tipo}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#006D77', marginBottom: 5 }}>US$ {a.precio.toLocaleString('en-US')}</div>
                          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#aaa' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              {fmtStat(a.clics ?? a.visitas ?? 0)}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              {fmtStat(a.tel_vistos ?? a.telVistos ?? 0)}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="#e63946" stroke="#e63946" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                              {a.favoritos ?? 0}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                              {fmtStat(a.compartidos ?? 0)}
                            </span>
                          </div>
                        </div>
                        <div className="anuncio-card-btns" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                          <span className="anuncio-card-status" style={{ background: estado === 'activo' ? '#e0f5f0' : '#f5f5f5', color: estado === 'activo' ? '#065f46' : '#888', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 10, whiteSpace: 'nowrap' }}>
                            {estado === 'activo' ? `● ${Tpanel.anuncios.estado.activo}` : `○ ${Tpanel.anuncios.estado.pausado}`}
                          </span>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {a.destacado
                              ? <div style={{ border: '1px solid #006D77', color: '#006D77', padding: '5px 11px', borderRadius: 6, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, background: '#f0fafb', whiteSpace: 'nowrap' }} title={a.destacado_hasta ? `Vence el ${new Date(a.destacado_hasta).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}` : ''}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#006D77" stroke="#006D77" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                  {Tpanel.anuncios.dest}
                                </div>
                              : <button onClick={() => { setAnuncioADestacar(a); setSeccion('destacar') }} style={{ all: 'unset', border: '1px solid #006D77', color: '#006D77', padding: '5px 11px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#006D77" stroke="#006D77" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                  {Tpanel.anuncios.destacar}
                                </button>
                            }
                            <button onClick={() => handleEditar(a)} style={{ all: 'unset', border: '1px solid #e0e0e0', color: '#555', padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>{Tpanel.anuncios.editar}</button>
                            <button onClick={() => eliminarAnuncio(a.id)} style={{ all: 'unset', border: '1px solid #fca5a5', color: '#dc2626', padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>{Tpanel.anuncios.eliminar}</button>
                          </div>
                        </div>
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
                      <style>{`@keyframes habitade-spin { to { transform: rotate(360deg); } }`}</style>
                      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                        <svg style={{ animation: 'habitade-spin 1s linear infinite' }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10"/></svg>
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
                    Con el plan Profesional publicas anuncios ilimitados por solo US$9.99/mes.
                  </p>
                  <div style={{ maxWidth: 400, margin: '0 auto 16px' }}>
                    <a href="/pago/profesional" style={{ background: '#006D77', color: '#fff', padding: '11px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      Activar — US$9.99/mes
                    </a>
                  </div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>{Tpanel.publicar.sinPermanencia}</div>
                  </>
                  )}
                </div>
              ) : (
              <div className="pub-form-card" style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>

                <div className="pub-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.operacion}</label>
                    <div style={{ position: 'relative' }}>
                      <select value={pubOperacion} onChange={e => setPubOperacion(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 36px 10px 12px', fontSize: 13, outline: 'none', background: '#fff', appearance: 'none', cursor: 'pointer' }}>
                        <option value="Venta">{Tpanel.publicar.venta}</option><option value="Alquiler">{Tpanel.publicar.alquiler}</option>
                      </select>
                      <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.tipoInmueble}</label>
                    <div style={{ position: 'relative' }}>
                      <select value={pubTipo} onChange={e => setPubTipo(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 36px 10px 12px', fontSize: 13, outline: 'none', background: '#fff', appearance: 'none', cursor: 'pointer' }}>
                        <option value="Apartamento">{trLang.tipos.apartamento}</option><option value="Casa">{trLang.tipos.casa}</option><option value="Villa">{trLang.tipos.villa}</option><option value="Edificio">{trLang.tipos.edificio}</option><option value="Oficina">{trLang.tipos.oficina}</option><option value="Terreno">{trLang.tipos.terreno}</option><option value="Local comercial">{trLang.tipos.local}</option>
                      </select>
                      <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.titulo_anuncio}</label>
                    <input type="text" value={pubTitulo} onChange={e => setPubTitulo(e.target.value.slice(0, 50))} maxLength={50} placeholder={Tpanel.publicar.tituloPlaceholder} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.precio}</label>
                    <input type="text" value={pubPrecio} onChange={e => { const raw = e.target.value.replace(/\D/g, '').slice(0, 9); setPubPrecio(raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '') }} placeholder="Ej: 250.000" inputMode="numeric" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.provincia}</label>
                    <div style={{ position: 'relative' }}>
                      <select value={pubProvincia} onChange={e => { setPubProvincia(e.target.value); setPubSector('') }} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 36px 10px 12px', fontSize: 13, outline: 'none', background: '#fff', appearance: 'none', cursor: 'pointer' }}>
                        <option value="">{Tpanel.publicar.seleccionaProvincia}</option>
                        {Object.keys(provinciasZonas).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.sector} <span style={{ fontWeight: 400, color: '#aaa' }}>{Tpanel.publicar.sectorOpcional}</span></label>
                    <div style={{ position: 'relative' }}>
                      <select value={pubSector} onChange={e => setPubSector(e.target.value)} disabled={!pubProvincia} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 36px 10px 12px', fontSize: 13, outline: 'none', background: pubProvincia ? '#fff' : '#f9f9f9', color: pubProvincia ? '#333' : '#aaa', appearance: 'none', cursor: pubProvincia ? 'pointer' : 'default' }}>
                        <option value="">{Tpanel.publicar.seleccionaSector}</option>
                        {pubProvincia && provinciasZonas[pubProvincia].map(z => <option key={z} value={z}>{z}</option>)}
                      </select>
                      <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={pubProvincia ? '#888' : '#ccc'} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.superficie} *</label>
                    <input type="text" value={pubM2} onChange={e => { const raw = e.target.value.replace(/\D/g, '').slice(0, 8); setPubM2(raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '') }} placeholder="Ej: 150" inputMode="numeric" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  {!['Edificio', 'Terreno', 'Local comercial'].includes(pubTipo) && (
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.habitaciones}</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[['0', Tpanel.publicar.estudio], ['1','1'], ['2','2'], ['3','3'], ['4','4+']].map(([val, lbl]) => (
                          <button key={val} type="button" onClick={() => setPubHab(val)} style={{ padding: '8px 16px', borderRadius: 20, border: `1.5px solid ${pubHab === val ? '#006D77' : '#e0e0e0'}`, background: pubHab === val ? '#006D77' : '#fff', color: pubHab === val ? '#fff' : '#555', fontSize: 13, fontWeight: pubHab === val ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>{lbl}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!['Edificio', 'Terreno'].includes(pubTipo) && (
                  <div className="pub-form-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.banos}</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {([...(['Local comercial', 'Oficina'].includes(pubTipo) ? [['0','0']] : []), ['1','1'], ['2','2'], ['3','3+']]).map(([val, lbl]) => (
                          <button key={val} type="button" onClick={() => setPubBanos(val)} style={{ padding: '8px 16px', borderRadius: 20, border: `1.5px solid ${pubBanos === val ? '#006D77' : '#e0e0e0'}`, background: pubBanos === val ? '#006D77' : '#fff', color: pubBanos === val ? '#fff' : '#555', fontSize: 13, fontWeight: pubBanos === val ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>{lbl}</button>
                        ))}
                      </div>
                    </div>
                    <div className="pub-parqueos-col">
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.parqueos} <span style={{ color: '#aaa', fontWeight: 400 }}>{Tpanel.publicar.sectorOpcional}</span></label>
                      <input type="number" min="0" value={pubParqueos} onChange={e => setPubParqueos(e.target.value)} placeholder="Ej: 2" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                    </div>
                    <div className="pub-planta-col">
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.publicar.planta} <span style={{ color: '#aaa', fontWeight: 400 }}>{Tpanel.publicar.sectorOpcional}</span></label>
                      <input type="text" value={pubPlanta} onChange={e => setPubPlanta(e.target.value)} placeholder={Tpanel.publicar.plantaPlaceholder} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{Tpanel.publicar.descripcion}</label>
                    <div style={{ display: 'flex', gap: 4, background: '#f0f0f0', borderRadius: 6, padding: 3 }}>
                      {([['es','ES'], ['en','EN'], ['fr','FR']] as const).map(([l, label]) => (
                        <button key={l} type="button" onClick={() => setDescLang(l)}
                          style={{ all: 'unset', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: descLang === l ? '#006D77' : 'transparent', color: descLang === l ? '#fff' : '#888', transition: 'all 0.15s', position: 'relative' }}>
                          {label}
                          {l !== 'es' && ((l === 'en' ? pubDescEn : pubDescFr).trim()) && (
                            <span style={{ position: 'absolute', top: 1, right: 1, width: 5, height: 5, background: '#10b981', borderRadius: '50%' }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  {descLang === 'es' && (
                    <textarea rows={4} value={pubDesc} onChange={e => setPubDesc(e.target.value)} placeholder={Tpanel.publicar.descPlaceholder} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'sans-serif', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  )}
                  {descLang === 'en' && (
                    <textarea rows={4} value={pubDescEn} onChange={e => setPubDescEn(e.target.value)} placeholder="Describe the property in English (optional)" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'sans-serif', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  )}
                  {descLang === 'fr' && (
                    <textarea rows={4} value={pubDescFr} onChange={e => setPubDescFr(e.target.value)} placeholder="Décrivez la propriété en français (optionnel)" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'sans-serif', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  )}
                  {descLang !== 'es' && (
                    <div style={{ marginTop: 6, fontSize: 11, color: '#aaa' }}>
                      {descLang === 'en' ? 'Optional — shown to users browsing in English' : 'Optionnel — affiché aux utilisateurs en français'}
                    </div>
                  )}
                  <div style={{ marginTop: 8, padding: '8px 12px', background: '#f0fafb', borderLeft: '3px solid #006D77', borderRadius: '0 6px 6px 0', fontSize: 12, color: '#006D77' }}>
                    💡 {trLang.propiedad.descCta}
                  </div>
                </div>

                {/* AMENIDADES */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 10 }}>{Tpanel.publicar.amenidades}</label>
                  <div className="pub-amenidades-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {amenidades.map(a => (
                      <div key={a.id} onClick={() => toggleAmenidad(a.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: `1.5px solid ${amenidadesSeleccionadas.includes(a.id) ? '#006D77' : '#e0e0e0'}`, borderRadius: 6, cursor: 'pointer', background: amenidadesSeleccionadas.includes(a.id) ? '#f0fafb' : '#fff' }}>
                        {amenidadesSeleccionadas.includes(a.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        <span style={{ fontSize: 13, color: amenidadesSeleccionadas.includes(a.id) ? '#006D77' : '#555', fontWeight: amenidadesSeleccionadas.includes(a.id) ? 600 : 400 }}>{(trLang.amenidades as any)[a.id] || a.label}</span>
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
                    <div style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>{Tpanel.publicar.pulsaFotos}</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>{Tpanel.publicar.maxFotos}</div>
                  </label>
                  {fotosLista.length > 0 && (
                    <>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 10, marginBottom: 6 }}>{Tpanel.publicar.arrastraFotos}</div>
                      <div className="pub-fotos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }} onDragOver={e => e.preventDefault()}>
                        {fotosLista.map((item, i) => (
                          <div
                            key={item.id}
                            data-fotoidx={i}
                            draggable
                            onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)) }}
                            onDragEnter={e => { e.preventDefault(); setFotoDragOver(i) }}
                            onDragOver={e => { e.preventDefault() }}
                            onDragLeave={() => setFotoDragOver(null)}
                            onDrop={e => { e.preventDefault(); const desde = Number(e.dataTransfer.getData('text/plain')); if (!isNaN(desde) && desde !== i) moverFoto(desde, i); setFotoDragOver(null) }}
                            onDragEnd={() => setFotoDragOver(null)}
                            onTouchStart={e => { touchDragIdx.current = i }}
                            onTouchMove={e => {
                              e.preventDefault()
                              const t = e.touches[0]
                              const el = document.elementFromPoint(t.clientX, t.clientY)
                              const target = el?.closest('[data-fotoidx]')
                              if (target) setFotoDragOver(Number(target.getAttribute('data-fotoidx')))
                            }}
                            onTouchEnd={() => {
                              if (touchDragIdx.current !== null && fotoDragOver !== null && touchDragIdx.current !== fotoDragOver) moverFoto(touchDragIdx.current, fotoDragOver)
                              touchDragIdx.current = null; setFotoDragOver(null)
                            }}
                            style={{ position: 'relative', borderRadius: 6, border: fotoDragOver === i ? '2px dashed #006D77' : i === 0 ? '2px solid #006D77' : '2px solid #e0e0e0', cursor: 'grab', userSelect: 'none', touchAction: 'none' }}
                          >
                            <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                              <img src={item.src} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                              {i === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>PORTADA</div>}
                            </div>
                            <button onClick={() => quitarFoto(i)} title="Eliminar" style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', width: 20, height: 20, borderRadius: '50%', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {pubError && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 14 }}>{pubError}</div>}
                {pubExito && <div style={{ background: '#e0f5f0', border: '1px solid #6ee7b7', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#065f46', marginBottom: 14 }}>✓ {anuncioEditando ? Tpanel.publicar.okEdit : Tpanel.publicar.ok}</div>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={publicarAnuncio} disabled={pubLoading} style={{ all: 'unset', flex: 1, background: pubLoading ? '#aaa' : '#006D77', color: '#fff', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: pubLoading ? 'default' : 'pointer', textAlign: 'center' }}>
                    {pubLoading ? (anuncioEditando ? Tpanel.publicar.guardando : Tpanel.publicar.publicando) : (anuncioEditando ? Tpanel.publicar.guardar : Tpanel.publicar.publicar)}
                  </button>
                  {anuncioEditando && <button onClick={() => { setAnuncioEditando(null); setFotosLista([]); setSeccion('anuncios') }} style={{ all: 'unset', border: '1.5px solid #e0e0e0', color: '#555', padding: '12px 20px', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>{Tpanel.publicar.cancelar}</button>}
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
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #006D77 0%, #17A6B4 100%)', borderRadius: 12, padding: '20px 24px', marginBottom: 20, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{Tpanel.mensajes.titulo}</div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{conversaciones.length} conversación{conversaciones.length !== 1 ? 'es' : ''}</div>
                  </div>
                </div>
                {noLeidos > 0 && <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.3)' }}>{noLeidos} sin leer</span>}
              </div>
              <div className="chat-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 'calc(100vh - 220px)', minHeight: 520, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #e8e8e8' }}>
                {/* Lista de conversaciones */}
                <div className={`chat-list${convActiva ? ' chat-list-hidden' : ''}`} style={{ background: '#fff', borderRight: '1px solid #f0f0f0', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111', letterSpacing: -0.2 }}>{Tpanel.mensajes.titulo}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{conversaciones.length} conversación{conversaciones.length !== 1 ? 'es' : ''}{noLeidos > 0 ? ` · ${noLeidos} sin leer` : ''}</div>
                  </div>
                  {!cargando && conversaciones.length === 0 && (
                    <div style={{ padding: '48px 20px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f4f5f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#bbb' }}>{Tpanel.mensajes.sinMensajes}</div>
                    </div>
                  )}
                  {conversaciones.map((conv) => {
                    const m = conv.msg
                    const esEnviado = m._tipo === 'enviado'
                    const nombreMostrar = esEnviado ? (m._nombre || m.propiedades?.titulo || 'Propiedad') : (m.nombre_cliente || m._nombre || '?')
                    const seleccionada = mensajeSeleccionado === conv.key
                    const iniciales = nombreMostrar.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
                    const colores = ['#006D77','#0e7490','#7c3aed','#b45309','#be185d','#065f46']
                    const colorIdx = nombreMostrar.charCodeAt(0) % colores.length
                    return (
                      <div key={conv.key} onClick={async () => {
                          setMensajeSeleccionado(conv.key)
                          setConvActiva({ propiedadId: conv.propiedadId, otherUserId: conv.otherUserId, msg: m })
                          const msgsConv = mensajesReales.filter((x: any) => `${x.propiedad_id}__${x.remitente_id || 'anon'}` === conv.key)
                          if (msgsConv.length > 0) {
                            const updates: Record<string, boolean> = {}
                            msgsConv.forEach((x: any) => { updates[x.id] = true })
                            setMensajesLeidos(prev => {
                              const next = { ...prev, ...updates }
                              try { const { data: { user: u } } = { data: { user: usuario } }; if (u?.id) localStorage.setItem(`habitade_leidos_${u.id}`, JSON.stringify(next)) } catch {}
                              return next
                            })
                          }
                          const { data: { user } } = await supabase.auth.getUser()
                          if (user && conv.propiedadId && conv.otherUserId) { cargarHilo(conv.propiedadId, user.id, conv.otherUserId) } else { setHilo([m]) }
                        }}
                        style={{ padding: '12px 14px', cursor: 'pointer', background: seleccionada ? '#f0fafb' : 'transparent', borderLeft: `3px solid ${seleccionada ? '#006D77' : 'transparent'}`, transition: 'background 0.1s' }}
                        onMouseEnter={e => { if (!seleccionada) e.currentTarget.style.background = '#fafafa' }}
                        onMouseLeave={e => { if (!seleccionada) e.currentTarget.style.background = 'transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: colores[colorIdx], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden', letterSpacing: 0.5 }}>
                            {m._foto ? <img src={m._foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : iniciales}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                              <div style={{ fontSize: 13, fontWeight: conv.tieneNoLeido ? 700 : 500, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{nombreMostrar}</div>
                              <div style={{ fontSize: 10, color: conv.tieneNoLeido ? '#006D77' : '#bbb', fontWeight: conv.tieneNoLeido ? 600 : 400, flexShrink: 0, marginLeft: 6 }}>{formatFecha(m.created_at, Tpanel.mensajes.hace, Tpanel.mensajes.hoy)}</div>
                            </div>
                            <div style={{ fontSize: 11, color: '#006D77', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{m.propiedades?.titulo}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              {esEnviado && <svg width="11" height="8" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              <div style={{ fontSize: 12, color: conv.tieneNoLeido ? '#333' : '#999', fontWeight: conv.tieneNoLeido ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.mensaje}</div>
                              {conv.tieneNoLeido && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#006D77', flexShrink: 0, marginLeft: 'auto' }} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Detalle — chat */}
                {!convActiva && (
                  <div style={{ background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5" opacity="0.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#bbb', marginBottom: 4 }}>{Tpanel.mensajes.seleccionar}</div>
                      <div style={{ fontSize: 12, color: '#ccc' }}>{Tpanel.mensajes.seleccionarDesc}</div>
                    </div>
                  </div>
                )}
                {convActiva && (() => {
                  const m = convActiva.msg
                  const esEnviado = m._tipo === 'enviado'
                  const contactoNombre = esEnviado ? (m._nombre || m.propiedades?.titulo || '?') : (m.nombre_cliente || m._nombre || '?')
                  const contactoTel = esEnviado ? null : m.telefono_cliente
                  const contactoId = convActiva.otherUserId
                  const esPro = m._plan === 'profesional' || m._tipo === 'profesional'
                  const iniciales = contactoNombre.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
                  const colores = ['#006D77','#0e7490','#7c3aed','#b45309','#be185d','#065f46']
                  const colorIdx = contactoNombre.charCodeAt(0) % colores.length
                  return (
                    <div className="chat-detail-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' }}>
                      {/* Header del chat */}
                      <div style={{ padding: '12px 18px', borderBottom: '1px solid #f0f0f0', flexShrink: 0, background: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button className="chat-back-btn" onClick={() => setConvActiva(null)} style={{ display: 'none', all: 'unset', cursor: 'pointer', color: '#006D77', padding: '4px 6px 4px 0', flexShrink: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                          </button>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: colores[colorIdx], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                            {m._foto ? <img src={m._foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : iniciales}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{contactoNombre}</span>
                              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 8, background: esPro ? '#006D77' : '#f0f0f0', color: esPro ? '#fff' : '#888' }}>{esPro ? 'PRO' : 'PARTICULAR'}</span>
                              {m._numero_aei && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 8, background: m._aei_aprobado ? '#065f46' : '#f59e0b', color: '#fff' }}>{m._aei_aprobado ? 'AEI ✓' : 'AEI'}</span>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 11, color: '#006D77', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.propiedades?.titulo}</span>
                              <a href={`/propiedad/${m.propiedad_id}`} style={{ fontSize: 10, color: '#006D77', textDecoration: 'none', fontWeight: 600, flexShrink: 0, background: '#e8f5f6', padding: '2px 8px', borderRadius: 10, border: '1px solid #c0e4e7', whiteSpace: 'nowrap' }}>Ver</a>
                            </div>
                          </div>
                          <div className="chat-header-actions" style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                            {contactoTel && <a href={`tel:${contactoTel}`} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#006D77', textDecoration: 'none', fontWeight: 600, background: '#e8f5f6', padding: '5px 10px', borderRadius: 6, border: '1px solid #c0e4e7' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                              {contactoTel}
                            </a>}
                            {contactoId && <button onClick={() => toggleBloqueo(contactoId)}
                              style={{ all: 'unset', border: `1px solid ${bloqueadosSet.has(contactoId) ? '#e0e0e0' : '#fca5a5'}`, color: bloqueadosSet.has(contactoId) ? '#888' : '#dc2626', padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 500 }}>
                              {bloqueadosSet.has(contactoId) ? Tpanel.mensajes.desbloquear : Tpanel.mensajes.bloquear}
                            </button>}
                            <button onClick={() => eliminarMensaje(m.id)} style={{ all: 'unset', border: '1px solid #f0f0f0', color: '#bbb', padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>{Tpanel.mensajes.eliminar}</button>
                          </div>
                        </div>
                      </div>
                      {/* Área de mensajes */}
                      <div style={{ flex: 1, padding: '20px 20px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, background: '#f8f9fa' }}>
                        {hiloLoading ? (
                          <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ width: 24, height: 24, border: '2.5px solid #e0e0e0', borderTopColor: '#006D77', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
                          </div>
                        ) : hilo.map((msg: any, idx: number) => {
                          const esMio = msg.remitente_id === usuario?.id
                          const hora = new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                          const anteriorEsMismo = idx > 0 && (hilo[idx-1].remitente_id === usuario?.id) === esMio
                          return (
                            <div key={msg.id} style={{ display: 'flex', justifyContent: esMio ? 'flex-end' : 'flex-start', marginTop: anteriorEsMismo ? 2 : 10 }}>
                              <div style={{ maxWidth: '72%' }}>
                                <div style={{ background: esMio ? '#006D77' : '#fff', color: esMio ? '#fff' : '#222', borderRadius: esMio ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: 13, lineHeight: 1.5, boxShadow: esMio ? 'none' : '0 1px 4px rgba(0,0,0,0.08)', wordBreak: 'break-word' }}>
                                  {msg.mensaje}
                                </div>
                                <div style={{ fontSize: 10, color: '#bbb', marginTop: 3, textAlign: esMio ? 'right' : 'left', paddingInline: 4 }}>{hora}</div>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={hiloBottomRef} />
                      </div>
                      {/* Input */}
                      <div style={{ padding: '12px 16px', background: '#fff', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: '#f4f5f6', borderRadius: 24, padding: '8px 8px 8px 16px', border: '1.5px solid transparent', transition: 'border-color 0.15s' }}
                          onFocusCapture={e => e.currentTarget.style.borderColor = '#006D77'}
                          onBlurCapture={e => e.currentTarget.style.borderColor = 'transparent'}>
                          <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarRespuesta(m, respuesta) } }}
                            placeholder={Tpanel.mensajes.escribir ?? 'Escribe un mensaje...'} rows={1}
                            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: 'sans-serif', fontSize: 13, color: '#111', lineHeight: 1.5, maxHeight: 100, overflowY: 'auto', paddingTop: 2 }} />
                          <button type="button" onClick={() => enviarRespuesta(m, respuesta)} disabled={!respuesta.trim()}
                            style={{ width: 36, height: 36, borderRadius: '50%', background: respuesta.trim() ? '#006D77' : '#e0e0e0', border: 'none', cursor: respuesta.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                          </button>
                        </div>
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
              <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { label: Tpanel.estadisticas.visitas, val: fmtStat(anunciosReales.reduce((s, a) => s + (a.visitas || 0), 0)), sub: Tpanel.anuncios.kpi_visitas_sub, color: '#006D77', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
                  { label: Tpanel.estadisticas.telVistos, val: fmtStat(anunciosReales.reduce((s, a) => s + (a.tel_vistos || 0), 0)), sub: Tpanel.anuncios.kpi_tel_sub, color: '#10b981', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
                  { label: Tpanel.estadisticas.mensajes, val: fmtStat(mensajesReales.length), sub: `${noLeidos} ${Tpanel.mensajes.noLeidos}`, color: '#f59e0b', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                  { label: Tpanel.anuncios.kpi_compartidos ?? 'Compartido', val: fmtStat(anunciosReales.reduce((s, a) => s + (a.compartidos || 0), 0)), sub: Tpanel.anuncios.kpi_compartidos_sub ?? 'veces compartido', color: '#8b5cf6', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
                ].map(s => (
                  <div key={s.label} style={{ position: 'relative', background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: '0 4px 18px rgba(0,0,0,0.05)', border: '1px solid #f2f2f2', overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(0,0,0,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.05)' }}>
                    <div style={{ position: 'absolute', top: -34, right: -34, width: 100, height: 100, borderRadius: '50%', background: `${s.color}14` }} />
                    <div style={{ position: 'relative', width: 46, height: 46, borderRadius: 13, background: `linear-gradient(135deg, ${s.color}, ${s.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 14px ${s.color}3d`, marginBottom: 16 }}>
                      {s.icon}
                    </div>
                    <div style={{ position: 'relative', fontSize: 30, fontWeight: 800, color: '#111', letterSpacing: -0.8, marginBottom: 4, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ position: 'relative', fontSize: 12, color: '#555', fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
                    <div style={{ position: 'relative', fontSize: 11, color: '#aaa' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              {anunciosAMostrar.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 8, padding: '36px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                  {Tpanel.anuncios.publicarPrimero}
                </div>
              ) : (<>

                {/* DESKTOP: tabla */}
                <div className="estadisticas-tabla-desktop" style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#fafbfc', borderBottom: '1px solid #f0f0f0' }}>
                        <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 }}>Anuncio</th>
                        <th style={{ textAlign: 'center', padding: '14px 10px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 }}>{Tpanel.estadisticas.visitasCol}</th>
                        <th style={{ textAlign: 'center', padding: '14px 10px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 }}>Teléfono</th>
                        <th style={{ textAlign: 'center', padding: '14px 10px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 }}>{Tpanel.estadisticas.mensajesCol}</th>
                        <th style={{ textAlign: 'center', padding: '14px 10px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 }}>{Tpanel.estadisticas.guardadosCol}</th>
                        <th style={{ textAlign: 'center', padding: '14px 10px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4 }}>Compartido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anunciosAMostrar.map((a: any) => {
                        const foto = Array.isArray(a.fotos) && a.fotos.length > 0 ? a.fotos[0] : null
                        const Badge = ({ raw, color }: { raw: number, color: string }) => (
                          <span style={{ display: 'inline-flex', minWidth: 34, justifyContent: 'center', fontSize: 13, fontWeight: 700, color, background: `${color}14`, padding: '6px 12px', borderRadius: 20 }}>{fmtStat(raw)}</span>
                        )
                        return (
                          <tr key={a.id} style={{ borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')}
                            onMouseLeave={e => (e.currentTarget.style.background = '')}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 56, height: 42, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {foto ? <img src={foto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                                </div>
                                <div>
                                  <a href={`/propiedad/${a.id}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 600, color: '#111', textDecoration: 'none' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#006D77')} onMouseLeave={e => (e.currentTarget.style.color = '#111')}>
                                    {a.titulo}
                                  </a>
                                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{a.zona}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center', padding: '10px' }}><Badge raw={a.clics} color="#006D77" /></td>
                            <td style={{ textAlign: 'center', padding: '10px' }}><Badge raw={a.telVistos} color="#10b981" /></td>
                            <td style={{ textAlign: 'center', padding: '10px' }}><Badge raw={a.mensajes} color="#f59e0b" /></td>
                            <td style={{ textAlign: 'center', padding: '10px' }}><Badge raw={a.favoritos} color="#e63946" /></td>
                            <td style={{ textAlign: 'center', padding: '10px' }}><Badge raw={a.compartidos} color="#8b5cf6" /></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* MÓVIL: cards con foto */}
                <div className="estadisticas-cards-mobile" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
                  {anunciosAMostrar.map((a: any) => {
                    const foto = Array.isArray(a.fotos) && a.fotos.length > 0 ? a.fotos[0] : null
                    return (
                      <div key={a.id} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 14px 12px' }}>
                          <div style={{ width: 62, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#e8f8f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {foto ? <img src={foto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                          </div>
                          <a href={`/propiedad/${a.id}`} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 700, color: '#111', textDecoration: 'none', flex: 1, lineHeight: 1.3 }}>
                            {a.titulo}
                          </a>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', background: '#fafbfc', borderTop: '1px solid #f0f0f0' }}>
                          {[
                            { val: fmtStat(a.clics), label: Tpanel.estadisticas.visitasCol, color: '#006D77' },
                            { val: fmtStat(a.telVistos), label: 'Tel.', color: '#10b981' },
                            { val: fmtStat(a.mensajes), label: Tpanel.estadisticas.mensajesCol, color: '#f59e0b' },
                            { val: fmtStat(a.favoritos), label: Tpanel.estadisticas.guardadosCol, color: '#e63946' },
                            { val: fmtStat(a.compartidos), label: 'Comp.', color: '#8b5cf6' },
                          ].map((s, i) => (
                            <div key={s.label} style={{ padding: '10px 4px', textAlign: 'center', borderRight: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                              <div style={{ fontSize: 9, color: '#bbb', marginTop: 3, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 0.3 }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>)}
            </div>
          )}

          {/* DESTACAR */}
          {!cargando && seccion === 'destacar' && (
            <div>
              {/* Hero */}
              <div className="destacar-hero" style={{ background: 'linear-gradient(135deg, #004E57 0%, #006D77 60%, #17A6B4 100%)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, color: '#fff', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
                <div style={{ zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, opacity: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>{Tpanel.destacar.titulo}</div>
                  <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15 }}>{Tpanel.destacar.heroTitulo.split('\n').map((l: string, i: number) => i === 0 ? <>{l}<br/></> : l)}</h1>
                  <p style={{ fontSize: 13, opacity: 0.7, margin: 0, lineHeight: 1.5 }}>{Tpanel.destacar.heroDesc}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, zIndex: 1 }}>
                  {[{ n: '10×', label: Tpanel.destacar.statVisitas }, { n: 'TOP', label: Tpanel.destacar.statPosicion }, { n: '#1', label: Tpanel.destacar.statBusquedas }].map(s => (
                    <div key={s.n} style={{ textAlign: 'center', padding: '12px 16px', minWidth: 70 }}>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{s.n}</div>
                      <div style={{ fontSize: 9, opacity: 0.7, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paso 1: elegir plan */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{Tpanel.destacar.elegirDuracion}</span>
                </div>
                <div className="planes-destacado-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {planesDestacado.map(p => {
                    const sel = planSeleccionado === String(p.dias)
                    const tc = sel && p.popular
                    return (
                      <div key={p.dias} onClick={() => setPlanSeleccionado(String(p.dias))} style={{ borderRadius: 12, padding: '14px 16px', cursor: 'pointer', position: 'relative', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 14,
                        background: tc ? '#006D77' : p.popular ? '#f0fafb' : '#fff',
                        border: `2px solid ${sel ? '#006D77' : p.popular ? '#83D4DB' : '#e8e8e8'}`,
                        boxShadow: sel ? '0 4px 14px rgba(0,109,119,0.18)' : '0 1px 4px rgba(0,0,0,0.05)' }}>
                        {p.popular && <div style={{ position: 'absolute', top: -10, left: 16, background: sel ? '#004E57' : '#006D77', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 10px', borderRadius: 8, whiteSpace: 'nowrap', letterSpacing: 0.5 }}>{Tpanel.destacar.popular}</div>}
                        {/* Izquierda: días + features */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: tc ? 'rgba(255,255,255,0.7)' : '#888', marginBottom: 6 }}>{p.label}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {Tpanel.destacar.features.map((f: string) => (
                              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: tc ? 'rgba(255,255,255,0.85)' : '#666' }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={tc ? '#fff' : '#006D77'} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                {f}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Derecha: precio + radio */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: tc ? 'rgba(255,255,255,0.6)' : '#aaa', marginBottom: 1 }}>US$</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: tc ? '#fff' : sel ? '#006D77' : '#111', lineHeight: 1 }}>{p.precio}</div>
                          </div>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${sel ? (tc ? '#fff' : '#006D77') : '#ddd'}`, background: sel ? (tc ? '#fff' : '#006D77') : '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {sel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={tc ? '#006D77' : '#fff'} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Paso 2: seleccionar anuncio */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{Tpanel.destacar.seleccionarAnuncio}</span>
                </div>
                {anunciosReales.length === 0 ? (
                  <div style={{ background: '#f8f9fa', borderRadius: 10, padding: '24px', fontSize: 13, color: '#888', textAlign: 'center', border: '1.5px dashed #e0e0e0' }}>
                    {Tpanel.destacar.sinAnuncios}{' '}
                    <a href="#" onClick={e => { e.preventDefault(); setSeccion('publicar') }} style={{ color: '#006D77', fontWeight: 600 }}>{Tpanel.destacar.publicaUno}</a>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {anunciosReales.map((a: any) => {
                      const sel = anuncioADestacar?.id === a.id
                      return (
                        <div key={a.id} onClick={() => setAnuncioADestacar(a)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: sel ? '#f0fafb' : '#fff', border: `2px solid ${sel ? '#006D77' : '#e8e8e8'}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s' }}>
                          {a.fotos?.[0]
                            ? <img src={a.fotos[0]} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                            : <div style={{ width: 56, height: 40, background: '#e0f5f7', borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                          }
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: sel ? '#006D77' : '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.titulo}</div>
                            <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>US$ {a.precio?.toLocaleString('en-US')} · {a.zona}</div>
                          </div>
                          {a.destacado && a.destacado_hasta && (() => { const dias = Math.ceil((new Date(a.destacado_hasta).getTime() - Date.now()) / 86400000); return dias > 0 ? <span style={{ fontSize: 10, fontWeight: 700, background: dias <= 3 ? '#fee2e2' : '#e0f5f7', color: dias <= 3 ? '#991b1b' : '#006D77', padding: '2px 8px', borderRadius: 8, flexShrink: 0, whiteSpace: 'nowrap' }}>{dias}d</span> : null })()}
                          <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${sel ? '#006D77' : '#ddd'}`, background: sel ? '#006D77' : '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                            {sel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div style={{ position: 'sticky', bottom: 0, background: '#f4f5f6', padding: '12px 0 4px', marginTop: 8 }}>
                {planSeleccionado && anuncioADestacar && (
                  <div style={{ fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#006D77' }}>{anuncioADestacar.titulo}</span> · {planesDestacado.find(p => String(p.dias) === planSeleccionado)?.label} · <span style={{ fontWeight: 600, color: '#111' }}>US$ {planesDestacado.find(p => String(p.dias) === planSeleccionado)?.precio}</span>
                  </div>
                )}
                <button onClick={async () => {
                  if (!planSeleccionado || !anuncioADestacar) return
                  const { data: { user } } = await supabase.auth.getUser()
                  const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user?.id, email: user?.email, tipo: planSeleccionado, propiedadId: String(anuncioADestacar.id), locale: idioma })
                  })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                }} style={{ all: 'unset', width: '100%', background: planSeleccionado && anuncioADestacar ? 'linear-gradient(135deg, #006D77, #17A6B4)' : '#d1d5db', color: '#fff', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: planSeleccionado && anuncioADestacar ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box', boxShadow: planSeleccionado && anuncioADestacar ? '0 4px 20px rgba(0,109,119,0.35)' : 'none', transition: 'all 0.2s' }}>
                  {planSeleccionado && anuncioADestacar
                    ? Tpanel.destacar.pagar
                    : Tpanel.destacar.ctaDefault}
                </button>
              </div>
            </div>
          )}

          {/* PLANES PRO — pantalla para particulares que llegan al límite */}
          {!cargando && seccion === 'planes' && (
            <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
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
                <button onClick={handleSuscribirse} disabled={promoLoading} style={{ display: 'block', width: '100%', background: promoLoading ? '#aaa' : '#006D77', color: '#fff', padding: '14px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: promoLoading ? 'default' : 'pointer', border: 'none' }}>
                  {promoLoading ? 'Procesando...' : Tpanel.planes.suscribirse}
                </button>
                {!planInfo?.ya_suscrito && (
                  <div style={{ marginTop: 14, textAlign: 'center' }}>
                    {!promoExpanded ? (
                      <button onClick={() => setPromoExpanded(true)} style={{ all: 'unset', fontSize: 12, color: '#006D77', cursor: 'pointer', textDecoration: 'underline' }}>{Tpanel.planes.tienesCodigo}</button>
                    ) : (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                        <input value={codigoPromo} onChange={e => { setCodigoPromo(e.target.value.toUpperCase()); setPromoError('') }} placeholder={Tpanel.planes.codigoPlaceholder.toUpperCase()} maxLength={32} style={{ border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '8px 12px', fontSize: 13, width: 160, outline: 'none', textAlign: 'center', letterSpacing: 1 }} />
                      </div>
                    )}
                    {promoError && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{promoError}</div>}
                  </div>
                )}
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

          {/* BANNER SUSCRIPCIÓN VENCIDA */}
          {!cargando && suscripcionVencida && seccion !== 'plan' && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#92400e' }}>Tu suscripción ha vencido</div>
                <div style={{ fontSize: 13, color: '#78350f', marginTop: 2 }}>Reactiva tu plan para volver a publicar tus anuncios. Tus propiedades están pausadas hasta que renueves.</div>
              </div>
              <button onClick={() => setSeccion('plan')} style={{ all: 'unset', background: '#92400e', color: '#fff', padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Reactivar plan</button>
            </div>
          )}

          {/* MI PLAN */}
          {!cargando && seccion === 'plan' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>{Tpanel.plan.titulo}</h1>

              {/* Plan actual */}
              {usuario?.plan !== 'profesional' ? (
                <div className="plan-upgrade-card" style={{ background: '#fff', borderRadius: 8, padding: '36px 28px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                  <div className="plan-upgrade-hero">
                    {usuario?.tipo !== 'profesional' && (
                      <div className="plan-upgrade-badge" style={{ display: 'inline-block', background: '#f4f5f6', border: '1px solid #e0e0e0', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 16 }}>{Tpanel.plan.planGratis} · {Tpanel.plan.anunciosUsados.replace('{n}', String(anunciosUsados)).replace('{max}', String(anunciosGratis))}</div>
                    )}
                    <div className="plan-upgrade-title" style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 8 }}>{Tpanel.plan.haztePro}</div>
                    <div className="plan-upgrade-price" style={{ fontSize: 40, fontWeight: 800, color: '#006D77', marginBottom: 24, letterSpacing: -1 }}>US$ 9.99<span style={{ fontSize: 16, fontWeight: 400, color: '#aaa' }}>/mes</span></div>
                  </div>
                  <div className="plan-upgrade-features" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280, margin: '0 auto 28px', textAlign: 'left' }}>
                    {(Tpanel.planes.ventajas as string[]).map((f: string) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#444' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </div>
                    ))}
                  </div>
                  <button className="plan-upgrade-cta" onClick={handleSuscribirse} disabled={promoLoading} style={{ background: promoLoading ? '#aaa' : '#006D77', color: '#fff', padding: '12px 32px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: promoLoading ? 'default' : 'pointer', border: 'none', display: 'inline-block' }}>
                    {promoLoading ? 'Procesando...' : Tpanel.planes.suscribirse}
                  </button>
                  <div style={{ marginTop: 14 }}>
                    {!promoExpanded ? (
                      <button onClick={() => setPromoExpanded(true)} style={{ all: 'unset', fontSize: 12, color: '#006D77', cursor: 'pointer', textDecoration: 'underline' }}>{Tpanel.planes.tienesCodigo}</button>
                    ) : (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                        <input value={codigoPromo} onChange={e => { setCodigoPromo(e.target.value.toUpperCase()); setPromoError('') }} placeholder={Tpanel.planes.codigoPlaceholder.toUpperCase()} maxLength={32} style={{ border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '8px 12px', fontSize: 13, width: 160, outline: 'none', textAlign: 'center', letterSpacing: 1 }} />
                      </div>
                    )}
                    {promoError && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{promoError}</div>}
                  </div>
                </div>
              ) : (() => {
                const fmt = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
                const fmtCorto = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
                const activo = planInfo?.estado === 'active' || planInfo?.estado === 'trialing' ||
                  (!planInfo?.estado && usuario?.plan === 'profesional' && (!usuario?.plan_activo_hasta || new Date(usuario.plan_activo_hasta) > new Date()))
                const iconosBeneficios = [
                  <svg key="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
                  <svg key="s" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                  <svg key="b" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                  <svg key="p" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
                  <svg key="h" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.41 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                ]
                return (
                <div>
                  {/* Hero */}
                  <div style={{ background: 'linear-gradient(135deg, #006D77 0%, #17A6B4 100%)', borderRadius: 12, padding: '24px 28px', marginBottom: 20, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 20, fontWeight: 700 }}>{Tpanel.plan.planPro}</span>
                        <span style={{ background: activo ? 'rgba(255,255,255,0.25)' : 'rgba(255,80,80,0.3)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.3)' }}>● {activo ? Tpanel.plan.activo : Tpanel.plan.inactivo}</span>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>US$ 9.99<span style={{ fontSize: 15, fontWeight: 400, opacity: 0.8 }}>/mes</span></div>
                      {planInfo?.estado === 'trialing' && planInfo?.trial_end
                        ? <div style={{ fontSize: 12, marginTop: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '4px 10px', display: 'inline-block' }}>
                            {Tpanel.plan.periodoGratis} · {fmt(planInfo.trial_end)}
                          </div>
                        : planInfo?.proximo_cobro
                        ? <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{Tpanel.plan.proximoCobro}: {fmt(planInfo.proximo_cobro)}</div>
                        : usuario?.plan_activo_hasta
                        ? <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{Tpanel.plan.activo}: {fmt(usuario.plan_activo_hasta)}</div>
                        : null
                      }
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 14 }}>Lo que incluye tu plan</div>
                    <div className="plan-beneficios-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                      {(Tpanel.planes.ventajas as string[]).map((v: string, i: number) => (
                        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fdfd', border: '1px solid #e0f5f7', borderRadius: 8, padding: '12px 14px' }}>
                          {iconosBeneficios[i] || <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
                          <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{v}</span>
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
                      usuario?.plan_activo_hasta && planInfo?.estado === 'active' && !planInfo?.trial_end ? (
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
                  <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderTop: '2px solid #fee2e2' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 2 }}>{Tpanel.plan.cancelar}</div>
                    <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>{Tpanel.plan.cancelarDesc}</div>
                    <button onClick={() => setModalBaja(true)} style={{ all: 'unset', border: '1px solid #fca5a5', color: '#dc2626', padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                      {Tpanel.plan.cancelarBtn}
                    </button>
                  </div>

                  {/* Modal confirmación baja */}
                  {modalBaja && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
                      onClick={e => { if (e.target === e.currentTarget) setModalBaja(false) }}>
                      <div style={{ background: '#fff', borderRadius: 12, padding: '32px 28px', maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        {/* Icono advertencia */}
                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#111', textAlign: 'center', marginBottom: 6 }}>{Tpanel.plan.cancelarModalTitulo}</div>
                        <div style={{ fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 20 }}>{Tpanel.plan.cancelarModalSub}</div>
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '14px 16px', marginBottom: 20 }}>
                          {[
                            { icon: '🏠', text: Tpanel.plan.cancelarModalItem1 },
                            { icon: '💬', text: Tpanel.plan.cancelarModalItem2 },
                            { icon: '🏅', text: Tpanel.plan.cancelarModalItem3 },
                            { icon: '👤', text: Tpanel.plan.cancelarModalItem4 },
                          ].map(item => (
                            <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 13, color: '#7f1d1d' }}>
                              <span style={{ flexShrink: 0, fontSize: 15 }}>{item.icon}</span>
                              <span>{item.text}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => setModalBaja(false)} style={{ all: 'unset', flex: 1, background: '#f5f5f5', color: '#333', padding: '11px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>
                            Cancelar
                          </button>
                          <button disabled={bajando} onClick={async () => {
                            const { data: { user } } = await supabase.auth.getUser()
                            if (!user) return
                            setBajando(true)
                            const res = await fetch('/api/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) })
                            const data = await res.json()
                            setBajando(false)
                            if (data.ok) { setModalBaja(false); alert(Tpanel.plan.cancelarOk); window.location.href = '/panel' }
                            else { alert(Tpanel.plan.cancelarErr); setModalBaja(false) }
                          }} style={{ all: 'unset', flex: 1, background: bajando ? '#fca5a5' : '#dc2626', color: '#fff', padding: '11px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: bajando ? 'default' : 'pointer', textAlign: 'center' }}>
                            {bajando ? Tpanel.plan.procesando : Tpanel.plan.cancelarModalBoton}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                )
              })()}
            </div>
          )}

          {/* MI PERFIL */}
          {!cargando && seccion === 'perfil' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 24 }}>{Tpanel.perfil.titulo}</h1>
              {!perfilTelefono && (
                <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#856404" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span style={{ fontSize: 13, color: '#856404', fontWeight: 500 }}>{Tpanel.anuncios.avisoTel}</span>
                </div>
              )}
              <div style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <div className="perfil-avatar-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
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
                    <div className="perfil-badges-row" style={{ display: 'flex', gap: 8 }}>
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
                <div className="perfil-fields-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.perfil.nombre} <span style={{ color: '#e53e3e' }}>*</span></label>
                    <input value={perfilNombre} onChange={e => setPerfilNombre(e.target.value)} maxLength={25} style={{ width: '100%', border: `1.5px solid ${!perfilNombre ? '#e53e3e' : '#e0e0e0'}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor= perfilNombre ? '#e0e0e0' : '#e53e3e'} />
                    {!perfilNombre && <div style={{ fontSize: 11, color: '#e53e3e', marginTop: 4 }}>{Tpanel.perfil.err_nombre}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.perfil.email}</label>
                    <input value={usuario?.email || ''} disabled style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#f9f9f9', color: '#aaa' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{Tpanel.perfil.telefono}</label>
                    <input value={perfilTelefono} onChange={e => { let v = e.target.value.replace(/[^\d\s\-+()\+]/g, '').replace(/(?!^)\+/g, ''); if (!v.startsWith('+')) v = '+' + v.replace(/^\+*/, ''); setPerfilTelefono(v.slice(0, 17)) }} placeholder="+1 809 000 0000" maxLength={17} style={{ width: '100%', border: `1.5px solid ${!perfilTelefono ? '#e53e3e' : '#e0e0e0'}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => { if (!e.target.value) setPerfilTelefono('+'); e.target.style.borderColor='#006D77' }} onBlur={e => { if (e.target.value === '+') setPerfilTelefono(''); e.target.style.borderColor= perfilTelefono ? '#e0e0e0' : '#e53e3e' }} />
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
                      <input
                        value={perfilAei}
                        readOnly={usuario?.aei_aprobado === true}
                        onChange={e => {
                          let v = e.target.value.toUpperCase()
                          if (!v.startsWith('AEI-')) v = 'AEI-' + v.replace(/^AEI-?/i, '')
                          setPerfilAei(v)
                        }}
                        placeholder='AEI-0000'
                        style={{ width: '100%', border: `1.5px solid ${usuario?.aei_aprobado === true ? '#d1fae5' : '#e0e0e0'}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: usuario?.aei_aprobado === true ? '#f0fdf4' : '#fff', color: usuario?.aei_aprobado === true ? '#065f46' : '#111', cursor: usuario?.aei_aprobado === true ? 'not-allowed' : 'text', fontWeight: usuario?.aei_aprobado === true ? 700 : 400, textTransform: 'uppercase' }}
                        onFocus={e => { if (usuario?.aei_aprobado !== true) e.target.style.borderColor='#006D77' }}
                        onBlur={e => { if (usuario?.aei_aprobado !== true) e.target.style.borderColor='#e0e0e0' }}
                      />
                      {perfilAei && usuario?.aei_aprobado !== true && (
                        <div style={{ fontSize: 11, color: '#92400e', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Pendiente de verificación por Habitade
                        </div>
                      )}
                      {perfilAei && usuario?.aei_aprobado === true && (
                        <div style={{ fontSize: 11, color: '#065f46', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                          Verificado por Habitade
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {tipoUsuario === 'profesional' && usuario?.plan === 'profesional' && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 10 }}>{Tpanel.perfil.idiomasLabel}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {['Español','English','Français','Português','Italiano','Deutsch','中文','Русский','العربية'].map(lang => {
                        const sel = perfilIdiomas.includes(lang)
                        return (
                          <button key={lang} onClick={() => setPerfilIdiomas(prev => sel ? prev.filter(l => l !== lang) : [...prev, lang])}
                            style={{ all: 'unset', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${sel ? '#006D77' : '#e0e0e0'}`, background: sel ? '#f0fafb' : '#fff', color: sel ? '#006D77' : '#888', transition: 'all 0.15s' }}>
                            {lang}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                <button className="perfil-save-btn" onClick={guardarPerfil} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '11px 28px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 20 }}>
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
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{Tpanel.cursos.titulo}</h1>
              </div>
              <p className="cursos-desc" style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>{Tpanel.cursos.desc}</p>

              {/* Banner AEI */}
              <div className="cursos-banner" style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #004E57 100%)', borderRadius: 10, padding: '28px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>{Tpanel.cursos.bannerSub}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{Tpanel.cursos.bannerTitulo}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{Tpanel.cursos.bannerDesc}</div>
                </div>
                <a href="https://aei.com.do" target="_blank" rel="noopener noreferrer" className="cursos-banner-btn" style={{ all: 'unset', background: '#fff', color: '#1a3a5c', padding: '12px 24px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {Tpanel.cursos.visitar}
                </a>
              </div>

              <div className="cursos-info-card" style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div className="cursos-info-text" style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 20 }}>
                  {Tpanel.cursos.infoTexto.split('\n').map((line: string, i: number) => <span key={i}>{line}{i === 0 && <br/>}</span>)}
                </div>
                <a href="https://aei.com.do" target="_blank" rel="noopener noreferrer" className="cursos-cta-btn" style={{ all: 'unset', background: '#1a3a5c', color: '#fff', padding: '13px 32px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-block' }}>
                  {Tpanel.cursos.verCursos}
                </a>
                <div className="cursos-cta-note" style={{ fontSize: 12, color: '#aaa', marginTop: 14 }}>
                  {Tpanel.cursos.nota}
                </div>
              </div>
            </div>
          )}

          {!cargando && seccion === 'ayuda' && tipoUsuario === 'profesional' && (
            <div style={{ maxWidth: 640 }}>
              {/* Hero header */}
              <div style={{ background: 'linear-gradient(135deg, #004E57 0%, #006D77 60%, #17A6B4 100%)', borderRadius: 14, padding: '36px 40px', marginBottom: 24 }}>
                <a href="/" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', display: 'inline-block', marginBottom: 4 }}>
                  habitade.
                </a>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18 }}>{Tpanel.ayuda.titulo}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{Tpanel.ayuda.desc}</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0, maxWidth: 460 }}>{Tpanel.ayuda.intro}</p>
              </div>

              {/* Formulario */}
              <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '28px 32px' }}>
                {ayudaOk ? (
                  <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#166534', marginBottom: 6 }}>{Tpanel.ayuda.ok}</div>
                    <button onClick={() => setAyudaOk(false)} style={{ all: 'unset', fontSize: 13, color: '#006D77', cursor: 'pointer', textDecoration: 'underline', marginTop: 8 }}>Enviar otro mensaje</button>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 22 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#444', marginBottom: 10, letterSpacing: 0.3 }}>{Tpanel.ayuda.tipo.toUpperCase()}</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {(['mejora', 'error', 'pregunta', 'otro'] as const).map(t => {
                          const icons: Record<string, React.ReactNode> = {
                            mejora: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
                            error: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
                            pregunta: <svg width="15" height="15" viewBox="2 2 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ overflow: 'visible' }}><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
                            otro: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
                          }
                          const sel = ayudaTipo === t
                          return (
                            <button key={t} onClick={() => setAyudaTipo(t)} style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: `1.5px solid ${sel ? '#006D77' : '#e8e8e8'}`, background: sel ? '#f0fafa' : '#fafafa', color: sel ? '#006D77' : '#555', fontWeight: sel ? 600 : 400, transition: 'all 0.15s' }}>
                              <span style={{ color: sel ? '#006D77' : '#aaa' }}>{icons[t]}</span>
                              {Tpanel.ayuda.tipos[t]}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#444', marginBottom: 10, letterSpacing: 0.3 }}>{Tpanel.ayuda.mensaje.toUpperCase()}</label>
                      <textarea
                        value={ayudaMensaje}
                        onChange={e => setAyudaMensaje(e.target.value)}
                        placeholder={Tpanel.ayuda.placeholder}
                        rows={5}
                        style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: 14, color: '#333', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: 1.6, transition: 'border-color 0.15s' }}
                        onFocus={e => e.target.style.borderColor = '#006D77'}
                        onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                      />
                    </div>

                    <button
                      disabled={ayudaEnviando || !ayudaMensaje.trim()}
                      onClick={async () => {
                        if (!ayudaMensaje.trim()) return
                        setAyudaEnviando(true)
                        await fetch('/api/ayuda', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usuario_id: usuario?.id, nombre: usuario?.nombre, email: usuario?.email, tipo: ayudaTipo, mensaje: ayudaMensaje }) })
                        setAyudaEnviando(false)
                        setAyudaOk(true)
                        setAyudaMensaje('')
                      }}
                      style={{ all: 'unset', display: 'inline-flex', alignItems: 'center', gap: 8, background: ayudaEnviando || !ayudaMensaje.trim() ? '#d1d5db' : 'linear-gradient(135deg, #006D77, #17A6B4)', color: '#fff', padding: '13px 32px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: ayudaEnviando || !ayudaMensaje.trim() ? 'not-allowed' : 'pointer', boxShadow: ayudaEnviando || !ayudaMensaje.trim() ? 'none' : '0 4px 14px rgba(0,109,119,0.3)' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      {ayudaEnviando ? Tpanel.ayuda.enviando : Tpanel.ayuda.enviar}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}



