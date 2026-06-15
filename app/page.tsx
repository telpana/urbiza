'use client'
import { useState } from 'react'

const USD_TO_DOP = 59.5

function formatDOP(usd: number) {
  const dop = usd * USD_TO_DOP
  return 'RD$ ' + dop.toLocaleString('es-DO', { maximumFractionDigits: 0 })
}

const propiedadesDestacadas = [
  { price: 620000, title: 'Villa en Bávaro', loc: 'La Altagracia', feats: '4 hab · 500 m²', tipo: 'pagado', bg: '#ddf0e8' },
  { price: 285000, title: 'Apartamento en Piantini', loc: 'Distrito Nacional', feats: '3 hab · 150 m²', tipo: 'pagado', bg: '#e0f5f7' },
  { price: 410000, title: 'Penthouse en Naco', loc: 'Distrito Nacional', feats: '3 hab · 200 m²', tipo: 'pagado', bg: '#e8eaf0' },
  { price: 165000, title: 'Apartamento en Bella Vista', loc: 'Distrito Nacional', feats: '2 hab · 95 m²', tipo: 'visitas', bg: '#f0ebe0' },
  { price: 310000, title: 'Villa en Arroyo Hondo', loc: 'Distrito Nacional', feats: '4 hab · 380 m²', tipo: 'visitas', bg: '#e8f0e0' },
  { price: 98000, title: 'Apartamento en Santiago', loc: 'Santiago', feats: '2 hab · 90 m²', tipo: 'visitas', bg: '#f0e8f0' },
]

const propiedadesSantoDomingo = [
  { price: 285000, title: 'Apartamento en Piantini', feats: 'Apartamento · 3 hab · 150 m²', bg: '#e0f5f7' },
  { price: 195000, title: 'Apartamento en Naco', feats: 'Apartamento · 2 hab · 110 m²', bg: '#ddf0e8' },
  { price: 410000, title: 'Oficina en Serrallés', feats: 'Oficina · 180 m² · Piso 5', bg: '#e8eaf0' },
  { price: 165000, title: 'Apartamento en Bella Vista', feats: 'Apartamento · 2 hab · 95 m²', bg: '#f0ebe0' },
]

const propiedadesPuntaCana = [
  { price: 620000, title: 'Villa en Bávaro', feats: 'Villa · 4 hab · 500 m²', bg: '#ddf0e8' },
  { price: 280000, title: 'Apartamento en Cap Cana', feats: 'Apartamento · 3 hab · 140 m²', bg: '#e0f5f7' },
  { price: 450000, title: 'Villa en Punta Cana Village', feats: 'Villa · 3 hab · 320 m²', bg: '#e8eaf0' },
  { price: 185000, title: 'Apartamento en Bávaro', feats: 'Apartamento · 2 hab · 105 m²', bg: '#f0ebe0' },
]

const propiedadesSantiago = [
  { price: 145000, title: 'Apartamento en Los Jardines', feats: 'Apartamento · 3 hab · 120 m²', bg: '#f0ebe0' },
  { price: 220000, title: 'Casa en Cerros de Gurabo', feats: 'Casa · 4 hab · 280 m²', bg: '#e0f5f7' },
  { price: 98000, title: 'Apartamento en Reparto Conuco', feats: 'Apartamento · 2 hab · 90 m²', bg: '#ddf0e8' },
  { price: 310000, title: 'Villa en Arroyo Hondo', feats: 'Villa · 4 hab · 380 m²', bg: '#e8eaf0' },
]

const zonas = [
  { nombre: 'Santo Domingo', tipo: 'Apartamentos en venta' },
  { nombre: 'Punta Cana', tipo: 'Villas en venta' },
  { nombre: 'Santiago', tipo: 'Casas en venta' },
  { nombre: 'La Romana', tipo: 'Propiedades en venta' },
  { nombre: 'Puerto Plata', tipo: 'Apartamentos en venta' },
  { nombre: 'Las Terrenas', tipo: 'Villas en alquiler' },
  { nombre: 'Samaná', tipo: 'Casas en venta' },
  { nombre: 'Bávaro', tipo: 'Apartamentos en venta' },
  { nombre: 'Cap Cana', tipo: 'Villas en venta' },
  { nombre: 'Jarabacoa', tipo: 'Casas en venta' },
  { nombre: 'San Pedro de Macorís', tipo: 'Apartamentos en venta' },
  { nombre: 'La Vega', tipo: 'Casas en venta' },
]

function SeccionNovedad({ titulo, subtitulo, props }: { titulo: string, subtitulo: string, props: { price: number, title: string, feats: string, bg: string }[] }) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4 }}>{titulo}</h2>
          <a href="/buscar" style={{ fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>{subtitulo} →</a>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ all: 'unset', width: 32, height: 32, border: '1px solid #e0e0e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff', fontSize: 18, color: '#555' }}>‹</button>
          <button style={{ all: 'unset', width: 32, height: 32, border: '1px solid #e0e0e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff', fontSize: 18, color: '#555' }}>›</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, paddingBottom: 32 }}>
        {props.map((p) => (
          <div key={p.title} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px solid #ebebeb' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,119,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            <div style={{ height: 160, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.25">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <div style={{ position: 'absolute', top: 8, right: 8, background: '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>NUEVO</div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 1 }}>US$ {p.price.toLocaleString('en-US')}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{formatDOP(p.price)}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 2 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{p.feats}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [tipo, setTipo] = useState('Comprar')

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6' }}>

      {/* NAV — BLANCO, menu junto al logo a la izquierda */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#006D77', letterSpacing: -2, marginRight: 32 }}>
            urbiza<span style={{ color: '#17A6B4' }}>.</span>
          </div>
          {['Comprar', 'Alquilar', 'Obra nueva'].map((item) => (
            <a key={item} href="#" style={{ padding: '0 14px', height: 60, display: 'flex', alignItems: 'center', fontSize: 14, color: '#555', textDecoration: 'none', borderBottom: '2.5px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#006D77'; e.currentTarget.style.borderBottomColor = '#006D77' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderBottomColor = 'transparent' }}>
              {item}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/login" style={{ fontSize: 13, color: '#006D77', border: '1.5px solid #006D77', padding: '7px 18px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>Entrar</a>
          <a href="/registro" style={{ fontSize: 13, color: '#fff', background: '#006D77', padding: '8px 18px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>+ Publicar gratis</a>
        </div>
      </nav>

      {/* BANNER CELESTE — imagen configurable desde panel de administración */}
      <div style={{ background: 'linear-gradient(135deg, #004E57 0%, #006D77 50%, #17A6B4 100%)', padding: '40px 20px 36px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 600, marginBottom: 6, textAlign: 'center', letterSpacing: -0.5 }}>
            Encuentra tu próxima propiedad en República Dominicana
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 22, textAlign: 'center' }}>
            El portal inmobiliario líder del Caribe
          </p>
          <div style={{ background: '#fff', borderRadius: 8, padding: '18px 18px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', gap: 0, marginBottom: 14 }}>
              {['Comprar', 'Alquilar'].map((t) => (
                <button key={t} onClick={() => setTipo(t)} style={{ flex: 1, padding: '9px', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', borderBottom: tipo === t ? '2.5px solid #006D77' : '2.5px solid #e0e0e0', background: 'transparent', color: tipo === t ? '#006D77' : '#888' }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', border: '1.5px solid #006D77', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: '#f9f9f9', borderRight: '1px solid #e0e0e0' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <input type="text" placeholder="Municipio, sector, barrio..." style={{ flex: 1, padding: '12px 14px', fontSize: 14, border: 'none', outline: 'none', color: '#222', background: '#fff' }} />
              <select style={{ padding: '0 12px', fontSize: 13, border: 'none', borderLeft: '1px solid #e0e0e0', outline: 'none', color: '#555', background: '#f9f9f9', cursor: 'pointer' }}>
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Villa</option>
                <option>Oficina</option>
                <option>Terreno</option>
                <option>Local comercial</option>
              </select>
              <button style={{ background: '#006D77', color: '#fff', border: 'none', padding: '0 26px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Buscar</button>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIONES ACCIÓN */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <a href="/mapa" style={{ display: 'flex', gap: 20, padding: '28px 32px', textDecoration: 'none', borderRight: '1px solid #e8e8e8', alignItems: 'center' }}>
            <div style={{ width: 140, height: 100, borderRadius: 8, flexShrink: 0, background: '#f0fafb', border: '2px solid #c5e8ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" width="120" height="88">
                {/* Mapa doblado — panel izquierdo */}
                <path d="M8,10 L8,68 L38,64 L38,6 Z" fill="#e0f5f7" stroke="#006D77" strokeWidth="1.8" strokeLinejoin="round"/>
                {/* Mapa doblado — panel central */}
                <path d="M38,6 L38,64 L62,68 L62,10 Z" fill="#c5e8ea" stroke="#006D77" strokeWidth="1.8" strokeLinejoin="round"/>
                {/* Mapa doblado — panel derecho */}
                <path d="M62,10 L62,68 L92,64 L92,8 Z" fill="#e0f5f7" stroke="#006D77" strokeWidth="1.8" strokeLinejoin="round"/>
                {/* Líneas de pliegue verticales */}
                <line x1="38" y1="6" x2="38" y2="64" stroke="#006D77" strokeWidth="1.5"/>
                <line x1="62" y1="10" x2="62" y2="68" stroke="#006D77" strokeWidth="1.5"/>
                {/* Curvas tipo topografía panel izquierdo */}
                <path d="M12,28 Q22,24 34,30" stroke="#17A6B4" strokeWidth="1.2" fill="none"/>
                <path d="M10,42 Q18,38 34,44" stroke="#17A6B4" strokeWidth="1" fill="none"/>
                <path d="M12,54 Q20,50 34,56" stroke="#17A6B4" strokeWidth="0.8" fill="none"/>
                {/* Curvas panel central */}
                <path d="M40,22 Q50,18 60,24" stroke="#006D77" strokeWidth="1.2" fill="none"/>
                <path d="M40,38 Q50,34 60,40" stroke="#006D77" strokeWidth="1" fill="none"/>
                <path d="M40,52 Q50,48 60,54" stroke="#006D77" strokeWidth="0.8" fill="none"/>
                {/* Punteado camino panel derecho */}
                <path d="M66,20 Q78,28 88,22" stroke="#17A6B4" strokeWidth="1" fill="none" strokeDasharray="2,2"/>
                <path d="M66,40 Q78,48 88,42" stroke="#17A6B4" strokeWidth="1" fill="none" strokeDasharray="2,2"/>
                {/* Gotas de lluvia / puntos decorativos */}
                <circle cx="18" cy="35" r="1.2" fill="#006D77" opacity="0.5"/>
                <circle cx="24" cy="48" r="1" fill="#006D77" opacity="0.4"/>
                <circle cx="72" cy="30" r="1.2" fill="#17A6B4" opacity="0.5"/>
                <circle cx="80" cy="52" r="1" fill="#17A6B4" opacity="0.4"/>
                {/* Lengüetas laterales */}
                <path d="M8,28 L4,30 L8,32" fill="#c5e8ea" stroke="#006D77" strokeWidth="1"/>
                <path d="M92,28 L96,30 L92,32" fill="#c5e8ea" stroke="#006D77" strokeWidth="1"/>
                {/* CHINCHETA */}
                {/* Cabeza de la chincheta */}
                <circle cx="50" cy="16" r="7" fill="#006D77" stroke="#fff" strokeWidth="1.5"/>
                <circle cx="50" cy="16" r="3.5" fill="#fff" opacity="0.9"/>
                {/* Punta de la chincheta */}
                <path d="M50,23 L50,33" stroke="#006D77" strokeWidth="2" strokeLinecap="round"/>
                <polygon points="50,33 47,28 53,28" fill="#006D77"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#111', marginBottom: 6 }}>Seleccionar zonas en el mapa</div>
              <div style={{ fontSize: 13, color: '#777', lineHeight: 1.6, marginBottom: 8 }}>Puedes buscar en varias zonas seleccionándolas directamente en el mapa de República Dominicana.</div>
              <div style={{ fontSize: 13, color: '#006D77', fontWeight: 500 }}>Empezar a seleccionar zonas →</div>
            </div>
          </a>
          <a href="/registro" style={{ display: 'flex', gap: 20, padding: '28px 32px', textDecoration: 'none', alignItems: 'center' }}>
            <div style={{ width: 140, height: 100, borderRadius: 8, flexShrink: 0, background: '#006D77', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #c5e8ea', position: 'relative' }}>
              <svg width="44" height="72" viewBox="0 0 44 72" fill="none">
                <rect x="2" y="2" width="40" height="68" rx="6" fill="#fff" opacity="0.15"/>
                <rect x="4" y="4" width="36" height="64" rx="5" fill="#fff"/>
                <rect x="8" y="12" width="28" height="40" rx="2" fill="#e0f5f7"/>
                <rect x="16" y="60" width="12" height="3" rx="1.5" fill="#006D77" opacity="0.4"/>
                <rect x="10" y="20" width="24" height="2" rx="1" fill="#006D77" opacity="0.5"/>
                <rect x="10" y="26" width="16" height="2" rx="1" fill="#006D77" opacity="0.3"/>
                <rect x="10" y="32" width="20" height="2" rx="1" fill="#006D77" opacity="0.3"/>
                <circle cx="22" cy="42" r="7" fill="#006D77" opacity="0.15"/>
                <path d="M19 42 L21 44 L26 39" stroke="#006D77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ position: 'absolute', top: 6, right: 6, background: '#17A6B4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>GRATIS</div>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#111', marginBottom: 6 }}>Publicar tu anuncio</div>
              <div style={{ fontSize: 13, color: '#777', lineHeight: 1.6, marginBottom: 8 }}>Tus 2 primeros anuncios son completamente gratis. Apartamentos, casas, villas, terrenos... ¡Todo cabe!</div>
              <div style={{ fontSize: 13, color: '#006D77', fontWeight: 500 }}>Poner tu anuncio →</div>
            </div>
          </a>
        </div>
      </div>

      {/* PROPIEDADES DESTACADAS */}
      <div style={{ background: '#f4f5f6' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4 }}>Propiedades destacadas</h2>
              <a href="/buscar" style={{ fontSize: 13, color: '#006D77', fontWeight: 500, textDecoration: 'none' }}>Ver todas las propiedades →</a>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {propiedadesDestacadas.map((p) => (
              <div key={p.title} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: p.tipo === 'pagado' ? '2px solid #006D77' : '1px solid #ebebeb' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,109,119,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                <div style={{ height: 180, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {p.tipo === 'pagado' && (
                    <div style={{ position: 'absolute', top: 8, left: 8, background: '#006D77', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 3 }}>Destacado</div>
                  )}
                  {p.tipo === 'visitas' && (
                    <div style={{ position: 'absolute', top: 8, left: 8, background: '#17A6B4', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 3 }}>Más visto</div>
                  )}
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1" opacity="0.25">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.92)', padding: '3px 9px', borderRadius: 20, fontSize: 11, color: '#006D77', border: '1px solid #c5e8ea' }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="#006D77"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    {p.loc}
                  </div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 19, fontWeight: 700, color: '#111', marginBottom: 1 }}>US$ {p.price.toLocaleString('en-US')}</div>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 7 }}>{formatDOP(p.price)}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#333', marginBottom: 3 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{p.feats}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NOVEDADES POR ZONA */}
        <SeccionNovedad titulo="Novedades en Santo Domingo" subtitulo="Ver todas las propiedades en venta" props={propiedadesSantoDomingo} />
        <SeccionNovedad titulo="Novedades en Punta Cana" subtitulo="Ver todas las propiedades en venta" props={propiedadesPuntaCana} />
        <SeccionNovedad titulo="Novedades en Santiago" subtitulo="Ver todas las propiedades en venta" props={propiedadesSantiago} />
      </div>

      {/* ZONAS MÁS BUSCADAS */}
      <div style={{ background: '#fff', borderTop: '1px solid #e8e8e8', padding: '36px 20px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 24 }}>Dónde busca todo el mundo en República Dominicana ahora mismo</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {zonas.map((z) => (
              <div key={z.nombre + z.tipo} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <a href="/buscar" style={{ display: 'block', fontSize: 14, color: '#006D77', fontWeight: 500, textDecoration: 'none', marginBottom: 3 }}>{z.nombre}</a>
                <div style={{ fontSize: 12, color: '#888' }}>{z.tipo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#004E57', color: 'rgba(255,255,255,0.5)', padding: '28px 20px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Logo y redes */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: -1.5 }}>
              urbiza<span style={{ color: '#83D4DB' }}>.</span>
            </div>
            {/* Iconos redes sociales — enlaces se añaden desde el panel de admin */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" aria-label="Facebook" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" aria-label="TikTok" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" aria-label="WhatsApp" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
          {/* Links */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {['Aviso legal', 'Privacidad', 'Cookies', 'Ayuda', 'Publicar anuncio', 'Planes'].map((l) => (
                <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 12 }}>{l}</a>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              © 2025 urbiza.com · República Dominicana
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
