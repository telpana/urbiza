'use client'
import { useState, useEffect, use } from 'react'
import { supabase } from '../../../supabase'
import NavUserMenu from '../../../components/NavUserMenu'
import { useIdioma } from '../../../IdiomaContext'

function formatPrecio(precio: number) {
  if (precio >= 1000000) return `US$ ${(precio / 1000000).toFixed(precio % 1000000 === 0 ? 0 : 1)}M`
  if (precio >= 1000) return `US$ ${(precio / 1000).toFixed(0)}K`
  return `US$ ${precio.toLocaleString()}`
}

export default function AgenteProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { tr } = useIdioma()
  const [agente, setAgente] = useState<any>(null)
  const [propiedades, setPropiedades] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [noEncontrado, setNoEncontrado] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      const { data: ag } = await supabase
        .from('usuarios')
        .select('id, nombre, foto_url, inmobiliaria, plan, tipo, numero_aei, aei_aprobado, idiomas, telefono')
        .eq('id', id)
        .eq('tipo', 'profesional')
        .single()

      if (!ag) { setNoEncontrado(true); setCargando(false); return }
      setAgente(ag)

      const { data: props } = await supabase
        .from('propiedades')
        .select('id, titulo, precio, zona, habitaciones, banos, m2, tipo, operacion, fotos, destacado, destacado_hasta')
        .eq('usuario_id', id)
        .eq('estado', 'activo')
        .order('destacado', { ascending: false })
        .order('created_at', { ascending: false })

      setPropiedades(props || [])
      setCargando(false)
    }
    cargar()
  }, [id])

  const iniciales = agente?.nombre ? agente.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '?'
  const ahora = new Date().toISOString()

  if (cargando) return (
    <main style={{ minHeight: '100vh', background: '#f4f5f6', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>habitade.</a>
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 54px)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e0e0e0', borderTopColor: '#006D77', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </main>
  )

  if (noEncontrado) return (
    <main style={{ minHeight: '100vh', background: '#f4f5f6', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>habitade.</a>
      </nav>
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 8 }}>Agente no encontrado</div>
        <div style={{ fontSize: 14, marginBottom: 24 }}>Este perfil no está disponible o no corresponde a un agente profesional.</div>
        <a href="/" style={{ color: '#006D77', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>← Volver al inicio</a>
      </div>
    </main>
  )

  const propDestacadas = propiedades.filter(p => p.destacado && p.destacado_hasta > ahora)
  const propNormales = propiedades.filter(p => !p.destacado || p.destacado_hasta <= ahora)

  return (
    <main style={{ minHeight: '100vh', background: '#f4f5f6', fontFamily: 'sans-serif' }}>
      {/* Nav */}
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>habitade.</a>
        <NavUserMenu />
      </nav>

      {/* Hero del agente */}
      <div style={{ background: 'linear-gradient(135deg, #004E57 0%, #006D77 100%)', padding: '48px 20px 64px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          {/* Foto */}
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700, color: '#fff' }}>
            {agente.foto_url
              ? <img src={agente.foto_url} alt={agente.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : iniciales}
          </div>
          {/* Info */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20, letterSpacing: 0.8 }}>PROFESIONAL</span>
              {agente.aei_aprobado && agente.numero_aei && (
                <span style={{ background: '#1a3a5c', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20, letterSpacing: 0.8 }}>✓ AEI</span>
              )}
            </div>
            <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>{agente.nombre}</h1>
            {agente.inmobiliaria && (
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginBottom: 10 }}>{agente.inmobiliaria}</div>
            )}
            {Array.isArray(agente.idiomas) && agente.idiomas.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                {agente.idiomas.map((lang: string) => (
                  <span key={lang} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.25)' }}>{lang}</span>
                ))}
              </div>
            )}
          </div>
          {/* Contacto */}
          {agente.telefono && (
            <a href={`https://wa.me/${agente.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              style={{ flexShrink: 0, background: '#25D366', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: 860, margin: '-24px auto 0', padding: '0 20px 60px', position: 'relative' }}>

        {/* Stats rápidas */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '20px 28px', marginBottom: 32, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#006D77' }}>{propiedades.length}</div>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>Propiedades activas</div>
          </div>
          {propDestacadas.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#006D77' }}>{propDestacadas.length}</div>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>Destacadas</div>
            </div>
          )}
          {agente.aei_aprobado && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 40, height: 40, background: '#f0f9ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3a5c' }}>Agente AEI Certificado</div>
                <div style={{ fontSize: 11, color: '#888' }}>Nº {agente.numero_aei}</div>
              </div>
            </div>
          )}
        </div>

        {/* Propiedades destacadas */}
        {propDestacadas.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111' }}>Propiedades destacadas</h2>
              <span style={{ background: '#006D77', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>DESTACADO</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16, marginBottom: 40 }}>
              {propDestacadas.map(p => <PropCard key={p.id} p={p} destacada />)}
            </div>
          </>
        )}

        {/* Resto de propiedades */}
        {propNormales.length > 0 && (
          <>
            <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700, color: '#111' }}>
              {propDestacadas.length > 0 ? 'Más propiedades' : 'Propiedades'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {propNormales.map(p => <PropCard key={p.id} p={p} />)}
            </div>
          </>
        )}

        {propiedades.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏠</div>
            <div style={{ fontSize: 15, color: '#666' }}>Este agente no tiene propiedades activas actualmente.</div>
          </div>
        )}
      </div>
    </main>
  )
}

function PropCard({ p, destacada }: { p: any; destacada?: boolean }) {
  const foto = Array.isArray(p.fotos) && p.fotos.length > 0 ? p.fotos[0] : null
  const operacionLabel = p.operacion === 'venta' ? 'Venta' : p.operacion === 'alquiler' ? 'Alquiler' : p.operacion
  return (
    <a href={`/propiedad/${p.id}`} style={{ textDecoration: 'none', display: 'block', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: destacada ? '0 4px 20px rgba(0,109,119,0.15)' : '0 1px 8px rgba(0,0,0,0.07)', border: destacada ? '1.5px solid #c7eaee' : '1px solid #f0f0f0', transition: 'transform 0.15s, box-shadow 0.15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = destacada ? '0 4px 20px rgba(0,109,119,0.15)' : '0 1px 8px rgba(0,0,0,0.07)' }}>
      {/* Imagen */}
      <div style={{ position: 'relative', height: 160, background: '#e8f4f5', overflow: 'hidden' }}>
        {foto
          ? <img src={foto} alt={p.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
        }
        {destacada && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#006D77', color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 7px', borderRadius: 8, letterSpacing: 0.5 }}>DESTACADO</div>
        )}
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 8 }}>{operacionLabel}</div>
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#006D77', marginBottom: 4 }}>{formatPrecio(p.precio)}</div>
        <div style={{ fontSize: 13, color: '#333', fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.titulo}</div>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>{p.zona}</div>
        <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#666' }}>
          {p.habitaciones > 0 && <span>{p.habitaciones} hab</span>}
          {p.banos > 0 && <span>{p.banos} baños</span>}
          {p.m2 > 0 && <span>{p.m2} m²</span>}
        </div>
      </div>
    </a>
  )
}
