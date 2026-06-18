'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

const menuItems = [
  { id: 'anuncios', label: 'Mis anuncios', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'publicar', label: 'Publicar anuncio', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { id: 'mensajes', label: 'Mensajes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { id: 'estadisticas', label: 'Estadísticas', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { id: 'destacar', label: 'Destacar anuncio', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'plan', label: 'Mi plan', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'perfil', label: 'Mi perfil', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: 'cursos', label: 'Cursos AEI', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
]

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
  'Samaná': ['Las Terrenas', 'Samaná', 'El Portillo', 'Cosón', 'Las Galeras', 'Sánchez'],
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
function formatFecha(iso: string) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Ayer'
  return `Hace ${days} días`
}

export default function Panel() {
  const [seccion, setSeccion] = useState('anuncios')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null)
  const [estadosAnuncios, setEstadosAnuncios] = useState<Record<number, string>>({})
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState<number | null>(null)
  const [anuncioADestacar, setAnuncioADestacar] = useState<any>(null)
  const [mensajesLeidos, setMensajesLeidos] = useState<Record<number, boolean>>({})
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
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(null)
  const [perfilNombre, setPerfilNombre] = useState('')
  const [perfilTelefono, setPerfilTelefono] = useState('')
  const [perfilInmobiliaria, setPerfilInmobiliaria] = useState('')
  const [perfilAei, setPerfilAei] = useState('')
  const [usuario, setUsuario] = useState<any>(null)
  const [anunciosReales, setAnunciosReales] = useState<any[]>([])
  const [mensajesReales, setMensajesReales] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [respuesta, setRespuesta] = useState('')
  const [verificandoPago, setVerificandoPago] = useState(false)

  useEffect(() => {
    if ((seccion === 'anuncios' || seccion === 'estadisticas') && usuario?.id) {
      supabase.from('propiedades').select('*').eq('usuario_id', usuario.id).order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setAnunciosReales(data) })
    }
  }, [seccion])

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
                    setUsuario((prev: any) => ({ ...prev, plan: 'profesional' }))
                    setVerificandoPago(false)
                    return
                  }
                } catch {}
              }
              // Fallback polling
              let intentos = 0
              const pollPlan = async () => {
                const { data: act } = await supabase.from('usuarios').select('plan').eq('id', user.id).single()
                if (act?.plan === 'profesional') {
                  setUsuario((prev: any) => ({ ...prev, plan: 'profesional' }))
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
      if (msgs) setMensajesReales(msgs)

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
    const nuevas = Array.from(files).slice(0, 10 - pubFotos.length)
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('usuarios').update({
      nombre: perfilNombre,
      telefono: perfilTelefono,
      inmobiliaria: perfilInmobiliaria,
      numero_aei: perfilAei
    }).eq('id', user.id)
    if (!error) { setUsuario((prev: any) => ({ ...prev, nombre: perfilNombre, telefono: perfilTelefono, inmobiliaria: perfilInmobiliaria, numero_aei: perfilAei })); alert('Cambios guardados correctamente') }
    else alert('Error al guardar')
  }

  const publicarAnuncio = async () => {
    if (!pubTitulo || !pubPrecio || !pubProvincia || !pubSector) { setPubError('Título, precio, provincia y sector son obligatorios'); return }
    setPubLoading(true)
    setPubError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setPubError('Debes iniciar sesión para publicar'); setPubLoading(false); return }

    // Subir fotos a Supabase Storage
    const fotosUrls: string[] = []
    for (const foto of pubFotos) {
      const ext = foto.name.split('.').pop()
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage.from('propiedades').upload(path, foto, { upsert: true })
      if (!uploadErr && uploadData) {
        const { data: urlData } = supabase.storage.from('propiedades').getPublicUrl(uploadData.path)
        fotosUrls.push(urlData.publicUrl)
      }
    }

    const { error } = await supabase.from('propiedades').insert({
      usuario_id: user.id,
      titulo: pubTitulo,
      descripcion: pubDesc,
      precio: Number(pubPrecio.replace(/\D/g, '')),
      tipo: pubTipo,
      operacion: pubOperacion.toLowerCase(),
      zona: pubSector ? `${pubSector}, ${pubProvincia}` : pubProvincia,
      m2: pubM2 ? Number(pubM2) : null,
      habitaciones: Number(pubHab),
      banos: Number(pubBanos),
      amenidades: amenidadesSeleccionadas,
      parqueos: pubParqueos ? Number(pubParqueos) : null,
      planta: pubPlanta || null,
      anio_construccion: pubAnio ? Number(pubAnio) : null,
      fotos: fotosUrls.length > 0 ? fotosUrls : null,
      estado: 'activo',
    })
    if (error) { setPubError('Error al publicar. Inténtalo de nuevo.'); setPubLoading(false); return }
    // Recargar anuncios para que aparezcan en Mis anuncios
    const { data: anunciosActualizados } = await supabase.from('propiedades').select('*').eq('usuario_id', user.id).order('created_at', { ascending: false })
    if (anunciosActualizados) setAnunciosReales(anunciosActualizados)
    setPubExito(true)
    setPubLoading(false)
    setPubTitulo(''); setPubPrecio(''); setPubM2(''); setPubDesc('')
    setPubProvincia(''); setPubSector(''); setPubHab('1'); setPubBanos('1')
    setPubParqueos(''); setPubPlanta(''); setPubAnio('')
    setPubFotos([]); setPubFotosPrev([])
    setAmenidadesSeleccionadas([])
    // Ir a Mis anuncios automáticamente
    setTimeout(() => { setSeccion('anuncios'); setPubExito(false) }, 1200)
  }

  const anunciosAMostrar = anunciosReales.map(a => ({
    id: a.id,
    titulo: a.titulo,
    precio: a.precio,
    zona: a.zona || '',
    tipo: a.tipo || 'Apartamento',
    estado: estadosAnuncios[a.id] || a.estado || 'activo',
    impresiones: a.visitas || 0,
    clics: a.visitas || 0,
    telVistos: a.tel_vistos || 0,
    favoritos: a.favoritos || 0,
    destacado: a.destacado || false,
    vence: '30 días',
    bg: '#e0f5f7',
  }))

  const anunciosFiltrados = anunciosAMostrar.filter((a: any) => filtroTipo === 'Todos' || a.tipo === filtroTipo)
  const noLeidos = mensajesReales.filter((m: any) => !mensajesLeidos[m.id]).length
  const tipoUsuario: string = usuario?.tipo || 'particular'
  const anunciosGratis = 2
  const anunciosUsados = anunciosReales.length

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>
            urbiza<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 10 }}>MI PANEL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#004E57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#83D4DB', overflow: 'hidden' }}>
              {fotoPerfilUrl ? <img src={fotoPerfilUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (perfilNombre || usuario?.nombre || 'U').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{usuario?.nombre || 'Mi cuenta'}</span>
            <span style={{ background: tipoUsuario === 'particular' ? 'rgba(255,255,255,0.2)' : '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>
              {tipoUsuario === 'particular' ? 'PARTICULAR' : 'PROFESIONAL'}
            </span>
          </div>
          <a href="/" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none' }}>← Ver web</a>
        </div>
      </nav>

      <div style={{ display: 'flex' }}>

        {/* SIDEBAR */}
        <div style={{ width: 220, background: '#004E57', minHeight: 'calc(100vh - 54px)', padding: '20px 0', flexShrink: 0 }}>
          {menuItems.filter(item => item.id !== 'equipo' || ['agencia', 'unlimited'].includes(tipoUsuario)).map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} style={{ all: 'unset', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontSize: 13, color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.6)', background: seccion === item.id ? 'rgba(255,255,255,0.12)' : 'transparent', cursor: 'pointer', borderLeft: seccion === item.id ? '3px solid #83D4DB' : '3px solid transparent', boxSizing: 'border-box', position: 'relative' }}>
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

          {/* AVISO TELÉFONO FALTANTE */}
          {!perfilTelefono && seccion !== 'perfil' && (
            <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <span style={{ fontSize: 13, color: '#6d4c00' }}>Añade tu teléfono en el perfil para que los compradores puedan contactarte cuando publiques un anuncio.</span>
              </div>
              <button onClick={() => setSeccion('perfil')} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '7px 16px', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Ir al perfil</button>
            </div>
          )}

          {/* MIS ANUNCIOS */}
          {seccion === 'anuncios' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>Mis anuncios</h1>
                <button onClick={() => tipoUsuario === 'particular' && anunciosUsados >= anunciosGratis ? setSeccion('planes') : setSeccion('publicar')} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Publicar anuncio</button>
              </div>

              {/* Aviso límite particular */}
              {tipoUsuario === 'particular' && anunciosUsados >= anunciosGratis && (
                <div style={{ background: '#fff8e1', border: '1.5px solid #f59e0b', borderRadius: 8, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>Has alcanzado el límite gratuito</div>
                    <div style={{ fontSize: 13, color: '#78350f' }}>Has usado tus {anunciosGratis} anuncios gratuitos. ¿Quieres publicar más? Hazte PRO y publica anuncios ilimitados.</div>
                  </div>
                  <button onClick={() => setSeccion('planes')} style={{ all: 'unset', background: '#f59e0b', color: '#fff', padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Hazte PRO →
                  </button>
                </div>
              )}

              {/* KPIs reales */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'Visitas al anuncio', val: anunciosReales.reduce((s, a) => s + (a.visitas || 0), 0).toLocaleString(), sub: 'personas que lo abrieron', color: '#006D77' },
                  { label: 'Tel. visualizados', val: anunciosReales.reduce((s, a) => s + (a.tel_vistos || 0), 0).toLocaleString(), sub: 'veces que vieron tu teléfono', color: '#10b981' },
                  { label: 'Guardados', val: anunciosReales.reduce((s, a) => s + (a.favoritos || 0), 0).toLocaleString(), sub: 'personas que lo guardaron', color: '#f59e0b' },
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
                {['Todos', 'Apartamento', 'Villa', 'Oficina', 'Terreno', 'Local comercial'].map(t => (
                  <button key={t} onClick={() => setFiltroTipo(t)} style={{ all: 'unset', border: `1px solid ${filtroTipo === t ? '#006D77' : '#e0e0e0'}`, borderRadius: 20, padding: '5px 14px', fontSize: 12, color: filtroTipo === t ? '#006D77' : '#666', background: filtroTipo === t ? '#f0fafb' : '#fff', cursor: 'pointer', fontWeight: filtroTipo === t ? 600 : 400 }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Lista anuncios */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {anunciosFiltrados.length === 0 && !cargando && (
                  <div style={{ background: '#fff', borderRadius: 8, padding: '48px 24px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>¿A qué esperas para subir tu primer anuncio?</div>
                    <div style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>Miles de compradores buscan propiedades en Urbiza cada día. Publica gratis y empieza a recibir contactos hoy mismo.</div>
                    <button onClick={() => setSeccion('publicar')} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '11px 28px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      + Publicar mi primer anuncio
                    </button>
                  </div>
                )}
                {anunciosFiltrados.map(a => {
                  const estado = estadosAnuncios[a.id] || a.estado
                  return (
                    <div key={a.id} style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 90, height: 65, borderRadius: 6, background: a.bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {a.destacado && <div style={{ position: 'absolute', top: 4, left: 4, background: '#006D77', color: '#fff', fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>DEST.</div>}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 3 }}>{a.titulo}</div>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>{a.zona} · {a.tipo} · US$ {a.precio.toLocaleString('en-US')}</div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#aaa', flexWrap: 'wrap' }}>
                          <span>👁 {a.impresiones.toLocaleString()} impresiones</span>
                          <span>🖱 {a.clics} visitas</span>
                          <span>📞 {a.telVistos} tel. vistos</span>
                          <span>❤️ {a.favoritos} guardados</span>
                        </div>
                      </div>
                      <span style={{ background: estado === 'activo' ? '#e0f5f0' : '#f5f5f5', color: estado === 'activo' ? '#065f46' : '#888', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10, flexShrink: 0 }}>
                        {estado === 'activo' ? '● Activo' : '○ Pausado'}
                      </span>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => { setAnuncioADestacar(a); setSeccion('destacar') }} style={{ all: 'unset', border: '1px solid #006D77', color: '#006D77', padding: '6px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>⭐ Destacar</button>
                        <button style={{ all: 'unset', border: '1px solid #e0e0e0', color: '#555', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Editar</button>
                        <button onClick={() => toggleEstado(a.id, estado)} style={{ all: 'unset', border: '1px solid #e0e0e0', color: '#555', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>
                          {estado === 'activo' ? 'Pausar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PUBLICAR ANUNCIO */}
          {seccion === 'publicar' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>Publicar anuncio</h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>Rellena los datos de tu propiedad</p>

              {/* Si es profesional sin plan pagado, mostrar pantalla de pago o verificando */}
              {usuario?.tipo === 'profesional' && usuario?.plan !== 'profesional' ? (
                <div style={{ background: '#fff', borderRadius: 8, padding: '48px 32px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                  {verificandoPago ? (
                    <>
                      <style>{`@keyframes urbiza-spin { to { transform: rotate(360deg); } }`}</style>
                      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                        <svg style={{ animation: 'urbiza-spin 1s linear infinite' }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10"/></svg>
                      </div>
                      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8 }}>Verificando tu pago...</h2>
                      <p style={{ fontSize: 14, color: '#888' }}>Esto solo toma unos segundos</p>
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
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Tipo de operación</label>
                    <select value={pubOperacion} onChange={e => setPubOperacion(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option>Venta</option><option>Alquiler</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Tipo de inmueble</label>
                    <select value={pubTipo} onChange={e => setPubTipo(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option>Apartamento</option><option>Casa</option><option>Villa</option><option>Oficina</option><option>Terreno</option><option>Local comercial</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Título del anuncio *</label>
                    <input type="text" value={pubTitulo} onChange={e => setPubTitulo(e.target.value)} placeholder="Ej: Apartamento en Piantini con vista al mar" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Precio (US$) *</label>
                    <input type="text" value={pubPrecio} onChange={e => setPubPrecio(e.target.value)} placeholder="Ej: 250000" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Provincia *</label>
                    <select value={pubProvincia} onChange={e => { setPubProvincia(e.target.value); setPubSector('') }} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option value="">Selecciona provincia</option>
                      {Object.keys(provinciasZonas).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Sector / Zona *</label>
                    <select value={pubSector} onChange={e => setPubSector(e.target.value)} disabled={!pubProvincia} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: pubProvincia ? '#fff' : '#f9f9f9', color: pubProvincia ? '#333' : '#aaa' }}>
                      <option value="">Selecciona sector</option>
                      {pubProvincia && provinciasZonas[pubProvincia].map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Superficie (m²)</label>
                    <input type="text" value={pubM2} onChange={e => setPubM2(e.target.value)} placeholder="Ej: 150" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Habitaciones</label>
                    <select value={pubHab} onChange={e => setPubHab(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option value="0">Estudio</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Baños</label>
                    <select value={pubBanos} onChange={e => setPubBanos(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option value="1">1</option><option value="2">2</option><option value="3">3+</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Parqueos <span style={{ color: '#aaa', fontWeight: 400 }}>(opcional)</span></label>
                    <input type="number" min="0" value={pubParqueos} onChange={e => setPubParqueos(e.target.value)} placeholder="Ej: 2" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Nº de planta <span style={{ color: '#aaa', fontWeight: 400 }}>(opcional)</span></label>
                    <input type="text" value={pubPlanta} onChange={e => setPubPlanta(e.target.value)} placeholder="Ej: 4ª planta" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Año de construcción <span style={{ color: '#aaa', fontWeight: 400 }}>(opcional)</span></label>
                    <input type="number" min="1900" max="2030" value={pubAnio} onChange={e => setPubAnio(e.target.value)} placeholder="Ej: 2020" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Descripción</label>
                  <textarea rows={4} value={pubDesc} onChange={e => setPubDesc(e.target.value)} placeholder="Describe tu propiedad con detalle — ubicación, acabados, amenidades, accesos..." style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'sans-serif', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                </div>

                {/* AMENIDADES */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 10 }}>Amenidades</label>
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
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Fotos <span style={{ color: '#aaa', fontWeight: 400 }}>(hasta 10)</span></label>
                  <label style={{ display: 'block', border: '2px dashed #e0e0e0', borderRadius: 6, padding: '24px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#006D77'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#e0e0e0'}>
                    <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFotos(e.target.files)} />
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block' }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <div style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>Pulsa para seleccionar fotos</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>JPG, PNG — máximo 10 fotos, 5MB cada una</div>
                  </label>
                  {pubFotosPrev.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 12 }}>
                      {pubFotosPrev.map((src, i) => (
                        <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 6, overflow: 'hidden', background: '#e8e8e8' }}>
                          <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => quitarFoto(i)} style={{ all: 'unset', position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                          {i === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>PORTADA</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {pubError && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 14 }}>{pubError}</div>}
                {pubExito && <div style={{ background: '#e0f5f0', border: '1px solid #6ee7b7', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#065f46', marginBottom: 14 }}>✓ Anuncio publicado correctamente</div>}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={publicarAnuncio} disabled={pubLoading} style={{ all: 'unset', flex: 1, background: pubLoading ? '#aaa' : '#006D77', color: '#fff', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: pubLoading ? 'default' : 'pointer', textAlign: 'center' }}>
                    {pubLoading ? 'Publicando...' : 'Publicar anuncio'}
                  </button>
                  <button style={{ all: 'unset', border: '1.5px solid #e0e0e0', color: '#555', padding: '12px 20px', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>Guardar borrador</button>
                </div>
              </div>
              )}
            </div>
          )}

          {/* MENSAJES */}
          {seccion === 'mensajes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>Mensajes</h1>
                {noLeidos > 0 && <span style={{ background: '#006D77', color: '#fff', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 10 }}>{noLeidos} no leídos</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, height: 'calc(100vh - 180px)', minHeight: 500 }}>
                {/* Lista */}
                <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflowY: 'auto' }}>
                  {mensajesReales.length === 0 && (
                  <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>No tienes mensajes todavía</div>
                    <div style={{ fontSize: 13, color: '#aaa' }}>Cuando un comprador te escriba desde un anuncio aparecerá aquí</div>
                  </div>
                )}
                {mensajesReales.map(m => {
                    const leido = mensajesLeidos[m.id] !== undefined ? mensajesLeidos[m.id] : false
                    return (
                      <div key={m.id} onClick={() => { setMensajeSeleccionado(m.id); setMensajesLeidos(prev => ({ ...prev, [m.id]: true })) }}
                        style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', background: mensajeSeleccionado === m.id ? '#f0fafb' : '#fff', borderLeft: mensajeSeleccionado === m.id ? '3px solid #006D77' : '3px solid transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: leido ? '#f0f0f0' : '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: leido ? '#888' : '#006D77', flexShrink: 0 }}>{getAvatar(m.nombre_cliente)}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: 13, fontWeight: leido ? 500 : 700, color: '#111' }}>{m.nombre_cliente}</div>
                              <div style={{ fontSize: 11, color: '#aaa' }}>{formatFecha(m.created_at)}</div>
                            </div>
                            <div style={{ fontSize: 11, color: '#006D77', fontWeight: 500 }}>📍 {m.propiedades?.titulo}</div>
                          </div>
                          {!leido && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#006D77', flexShrink: 0 }} />}
                        </div>
                        <div style={{ fontSize: 12, color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 46 }}>{m.mensaje}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Detalle */}
                {mensajeSeleccionado && mensajesReales.length > 0 && (() => {
                  const m = mensajesReales.find((x: any) => x.id === mensajeSeleccionado)
                  if (!m) return null
                  const anuncio = anunciosAMostrar.find((a: any) => a.id === m?.propiedad_id)
                  return (
                    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                      {/* Header cliente */}
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#006D77' }}>{getAvatar(m.nombre_cliente)}</div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{m.nombre_cliente}</div>
                            {m.telefono_cliente
                              ? <a href={`tel:${m.telefono_cliente}`} style={{ fontSize: 12, color: '#006D77', textDecoration: 'none', fontWeight: 500 }}>📞 {m.telefono_cliente}</a>
                              : <div style={{ fontSize: 12, color: '#aaa' }}>No dejó teléfono</div>
                            }
                          </div>
                        </div>
                        {/* Anuncio relacionado */}
                        {anuncio && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f4f5f6', borderRadius: 6, padding: '8px 12px' }}>
                            <div style={{ width: 40, height: 30, borderRadius: 4, background: anuncio.bg, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{anuncio.titulo}</div>
                              <div style={{ fontSize: 11, color: '#888' }}>US$ {anuncio.precio.toLocaleString('en-US')} · {anuncio.zona}</div>
                            </div>
                            <a href={`/propiedad/${anuncio.id}`} style={{ marginLeft: 'auto', fontSize: 11, color: '#006D77', textDecoration: 'none', fontWeight: 500, flexShrink: 0 }}>Ver anuncio →</a>
                          </div>
                        )}
                      </div>

                      {/* Mensaje */}
                      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                        <div style={{ background: '#f4f5f6', borderRadius: 8, padding: '14px 16px', maxWidth: '80%' }}>
                          <div style={{ fontSize: 14, color: '#333', lineHeight: 1.6, marginBottom: 6 }}>{m.mensaje}</div>
                          <div style={{ fontSize: 11, color: '#aaa' }}>{formatFecha(m.created_at)}</div>
                        </div>
                      </div>

                      {/* Responder */}
                      <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
                        <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)} placeholder={`Responder a ${m.nombre_cliente}...`} rows={3}
                          style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box', marginBottom: 10 }}
                          onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={{ all: 'unset', flex: 1, background: respuesta ? '#006D77' : '#e0e0e0', color: '#fff', padding: '10px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: respuesta ? 'pointer' : 'default', textAlign: 'center' }}>Enviar respuesta</button>
                          {m.telefono_cliente && <a href={`tel:${m.telefono_cliente}`} style={{ all: 'unset', border: '1px solid #e0e0e0', color: '#555', padding: '10px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>📞 Llamar</a>}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* ESTADÍSTICAS */}
          {seccion === 'estadisticas' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 24 }}>Estadísticas</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { label: 'Visitas a tus anuncios', val: anunciosReales.reduce((s, a) => s + (a.visitas || 0), 0).toLocaleString(), sub: 'personas que lo abrieron', color: '#006D77' },
                  { label: 'Teléfonos visualizados', val: anunciosReales.reduce((s, a) => s + (a.tel_vistos || 0), 0).toLocaleString(), sub: 'interés real en contactarte', color: '#10b981' },
                  { label: 'Mensajes recibidos', val: mensajesReales.length.toString(), sub: `${noLeidos} sin leer`, color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderTop: `3px solid ${s.color}` }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#111', marginBottom: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: '#10b981' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 }}>Rendimiento por anuncio</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      {['Anuncio', 'Impresiones', 'Visitas', 'Tel. vistos', 'Guardados', 'Conversión'].map(h => (
                        <th key={h} style={{ textAlign: 'left', fontSize: 12, color: '#aaa', fontWeight: 500, padding: '0 0 10px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {anunciosAMostrar.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#aaa', fontSize: 13 }}>Publica tu primer anuncio para ver las estadísticas</td></tr> : anunciosAMostrar.map((a: any) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#333', fontWeight: 500 }}>{a.titulo}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#666' }}>{a.impresiones.toLocaleString()}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#666' }}>{a.clics}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#666' }}>{a.telVistos}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#666' }}>{a.favoritos}</td>
                        <td style={{ padding: '10px 0', fontSize: 13, color: '#10b981', fontWeight: 600 }}>{((a.clics / a.impresiones) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DESTACAR */}
          {seccion === 'destacar' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>Destacar anuncio</h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>Los anuncios destacados aparecen primero y tienen hasta 5x más visitas</p>

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
                  Ve a Mis anuncios y pulsa ⭐ Destacar en el anuncio que quieres destacar
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {planesDestacado.map(p => (
                  <div key={p.dias} onClick={() => setPlanSeleccionado(String(p.dias))} style={{ background: '#fff', borderRadius: 8, padding: '24px 20px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${planSeleccionado === String(p.dias) ? '#006D77' : '#e0e0e0'}`, position: 'relative', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    {p.popular && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#006D77', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 12px', borderRadius: 10 }}>MÁS POPULAR</div>}
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
                Pagar y destacar
              </button>
            </div>
          )}

          {/* PLANES PRO — pantalla para particulares que llegan al límite */}
          {seccion === 'planes' && (
            <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8 }}>Pásate a PRO y publica sin límites</h1>
              <p style={{ fontSize: 15, color: '#888', marginBottom: 32 }}>Has usado tus {anunciosGratis} anuncios gratuitos.</p>
              <div style={{ background: '#fff', borderRadius: 10, padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,109,119,0.12)', border: '2px solid #006D77', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#006D77', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 16px', borderRadius: 10, whiteSpace: 'nowrap' }}>PLAN PROFESIONAL</div>
                <div style={{ fontSize: 42, fontWeight: 700, color: '#006D77', marginBottom: 4 }}>US$ 9.99<span style={{ fontSize: 18, fontWeight: 400, color: '#aaa' }}>/mes</span></div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Cancela cuando quieras · Sin permanencia</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, textAlign: 'left' }}>
                  {['Anuncios ilimitados', 'Badge PROFESIONAL visible en tus anuncios', 'Estadísticas completas', 'Mensajes ilimitados de compradores', 'Soporte por email prioritario'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#444' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <a href="/pago/profesional" style={{ display: 'block', background: '#006D77', color: '#fff', padding: '14px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>
                  Activar plan PRO — US$9.99/mes
                </a>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 12 }}>Primer mes gratis con código promocional</div>
              </div>
            </div>
          )}

          {/* MI EQUIPO */}
          {seccion === 'equipo' && ['agencia', 'unlimited'].includes(tipoUsuario) && (
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
          {seccion === 'plan' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>Mi plan</h1>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>Gestiona tu suscripción</p>

              {/* Plan actual */}
              {tipoUsuario === 'particular' ? (
                <div>
                  <div style={{ background: '#fff8e1', border: '1.5px solid #f59e0b', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Plan actual</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4 }}>Particular — Gratis</div>
                    <div style={{ fontSize: 13, color: '#92400e' }}>Has usado {anunciosUsados} de {anunciosGratis} anuncios gratuitos</div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 8, padding: '28px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8 }}>Pásate a Profesional</div>
                    <div style={{ fontSize: 36, fontWeight: 700, color: '#006D77', marginBottom: 4 }}>US$ 9.99<span style={{ fontSize: 16, fontWeight: 400, color: '#aaa' }}>/mes</span></div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Primer mes gratis con código promocional</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '0 auto 24px' }}>
                      {['Anuncios ilimitados', 'Badge PROFESIONAL', 'Estadísticas completas', 'Mensajes ilimitados', 'Soporte por email'].map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#444' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          {f}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto' }}>
                      <input type="text" placeholder="Código promocional (opcional)" style={{ flex: 1, border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 14px', fontSize: 13, outline: 'none' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                      <a href="/pago/profesional" style={{ background: '#006D77', color: '#fff', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Suscribirse</a>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Suscripción activa */}
                  <div style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Plan actual</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 4 }}>Profesional — US$ 9.99/mes</div>
                        <div style={{ fontSize: 13, color: '#555' }}>Próxima facturación: <strong>16 de julio 2026</strong></div>
                        <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>Se renovará automáticamente. Cancela cuando quieras.</div>
                      </div>
                      <span style={{ background: '#e0f5f0', color: '#065f46', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 10 }}>● ACTIVO</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                      {[
                        { label: 'Miembro desde', val: '16 junio 2026' },
                        { label: 'Próximo cobro', val: 'US$ 9.99 · 16 jul' },
                        { label: 'Método de pago', val: '•••• 4242' },
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
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 14 }}>Historial de pagos</div>
                    {[
                      { fecha: '16 jun 2026', monto: 'US$ 9.99', estado: 'Pagado', factura: '#URB-001' },
                      { fecha: '16 may 2026', monto: 'US$ 0', estado: 'Gratis', factura: '#URB-000' },
                    ].map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: i === 0 ? '1px solid #f5f5f5' : 'none' }}>
                        <div style={{ flex: 1, fontSize: 13, color: '#333' }}>{p.fecha}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{p.monto}</div>
                        <span style={{ background: p.estado === 'Pagado' ? '#e0f5f0' : '#f0f0f0', color: p.estado === 'Pagado' ? '#065f46' : '#888', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>{p.estado}</span>
                        <div style={{ fontSize: 12, color: '#aaa' }}>{p.factura}</div>
                      </div>
                    ))}
                  </div>

                  {/* Dar de baja */}
                  <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderLeft: '3px solid #fee2e2' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 4 }}>Cancelar suscripción</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>Si cancelas ahora seguirás teniendo acceso hasta el <strong>16 de julio 2026</strong>. No se realizará ningún cobro más.</div>
                    <button onClick={async () => { const { data: { user } } = await supabase.auth.getUser(); if (!user) return; if (!confirm('¿Seguro que quieres cancelar tu plan? Seguirás teniendo acceso hasta el final del período pagado.')) return; const res = await fetch('/api/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) }); const data = await res.json(); if (data.ok) alert('Plan cancelado. Seguirás activo hasta el final del período.'); else alert('Error al cancelar. Escríbenos a soporte@urbiza.com') }} style={{ all: 'unset', border: '1.5px solid #e55', color: '#e55', padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                      Dar de baja mi plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MI PERFIL */}
          {seccion === 'perfil' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 24 }}>Mi perfil</h1>
              <div style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#006D77', overflow: 'hidden' }}>
                      {fotoPerfilUrl ? <img src={fotoPerfilUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (perfilNombre || usuario?.nombre || 'U').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <label style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: '#006D77', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = ev => setFotoPerfilUrl(ev.target?.result as string)
                          reader.readAsDataURL(file)
                        }
                      }} />
                    </label>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>{perfilNombre || usuario?.nombre || 'Mi perfil'}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {tipoUsuario === 'profesional' && <span style={{ background: '#17A6B4', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>PROFESIONAL</span>}
                      {perfilAei && <span style={{ background: '#1a3a5c', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>✓ AEI</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Pulsa el icono para cambiar tu foto</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Nombre completo</label>
                    <input value={perfilNombre} onChange={e => setPerfilNombre(e.target.value)} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Email</label>
                    <input value={usuario?.email || ''} disabled style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#f9f9f9', color: '#aaa' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Teléfono <span style={{ color: '#e53e3e' }}>*</span></label>
                    <input value={perfilTelefono} onChange={e => setPerfilTelefono(e.target.value)} placeholder="+1 809 000 0000" style={{ width: '100%', border: `1.5px solid ${!perfilTelefono ? '#e53e3e' : '#e0e0e0'}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor= perfilTelefono ? '#e0e0e0' : '#e53e3e'} />
                    {!perfilTelefono && <div style={{ fontSize: 11, color: '#e53e3e', marginTop: 4 }}>Necesario para que los compradores puedan contactarte</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Nombre de inmobiliaria</label>
                    <input value={perfilInmobiliaria} onChange={e => setPerfilInmobiliaria(e.target.value)} placeholder='Nombre de tu agencia (opcional)' style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Número AEI</label>
                    <input value={perfilAei} onChange={e => setPerfilAei(e.target.value)} placeholder='AEI-0000' style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                </div>
                <button onClick={guardarPerfil} style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '11px 28px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 20 }}>
                  Guardar cambios
                </button>

                {/* Cerrar sesión */}
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
                  <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }} style={{ all: 'unset', fontSize: 12, color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#e55'}
                    onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CURSOS AEI */}
          {seccion === 'cursos' && (
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
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>La AEI es la asociación oficial de agentes inmobiliarios de RD. Con tu certificación aparecerá el badge AEI verificado en todos tus anuncios de Urbiza.</div>
                </div>
                <a href="https://aei.com.do" target="_blank" rel="noopener noreferrer" style={{ all: 'unset', background: '#fff', color: '#1a3a5c', padding: '12px 24px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Visitar AEI →
                </a>
              </div>

              <div style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 20 }}>
                  Accede a toda la oferta formativa oficial de la AEI directamente en su web.<br/>
                  Al completar cualquier curso recibirás tu certificación y el badge AEI verificado aparecerá en todos tus anuncios de Urbiza.
                </div>
                <a href="https://aei.com.do" target="_blank" rel="noopener noreferrer" style={{ all: 'unset', background: '#1a3a5c', color: '#fff', padding: '13px 32px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-block' }}>
                  Ver todos los cursos en AEI →
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



