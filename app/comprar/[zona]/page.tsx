import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { zonasMeta, slugToZona, slugs, zonaGrupos } from '../../lib/zonas'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateStaticParams() {
  return slugs.map(zona => ({ zona }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ zona: string }> }
): Promise<Metadata> {
  const { zona } = await params
  const meta = zonasMeta[zona]
  if (!meta) return { title: 'Propiedades en venta | Habitade' }

  const title = `Propiedades en venta en ${meta.nombre}, República Dominicana`
  const description = `Compra apartamentos, casas, villas y terrenos en ${meta.nombre}. Encuentra las mejores propiedades en venta en ${meta.nombre}, República Dominicana en Habitade.`
  const url = `https://www.habitade.com/comprar/${zona}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'es_DO', siteName: 'Habitade' },
  }
}

function fmtPrecio(n: number) {
  if (!n) return ''
  return `US$ ${n.toLocaleString('en-US')}`
}

function fmtPrecioM2(precio: number, m2: number) {
  if (!precio || !m2) return ''
  return `US$ ${Math.round(precio / m2).toLocaleString('en-US')}/m²`
}

export default async function ComprarZonaPage({ params }: { params: Promise<{ zona: string }> }) {
  const { zona } = await params
  const meta = zonasMeta[zona]
  if (!meta) notFound()

  const nombreZona = slugToZona[zona] || meta.nombre

  const subZonas = zonaGrupos[zona] || [nombreZona]
  const { data: propiedades } = await sb
    .from('propiedades')
    .select('id, titulo, precio, tipo, habitaciones, banos, m2, fotos, zona, destacado')
    .eq('estado', 'activo')
    .eq('operacion', 'venta')
    .or(subZonas.map(s => `zona.ilike.%${s}%`).join(','))
    .order('destacado', { ascending: false })
    .limit(24)

  const lista = propiedades || []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Propiedades en venta en ${meta.nombre}`,
    numberOfItems: lista.length,
    itemListElement: lista.map((p: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.habitade.com/propiedad/${p.id}`,
      name: p.titulo || p.tipo,
    })),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Habitade', item: 'https://www.habitade.com' },
      { '@type': 'ListItem', position: 2, name: 'Comprar', item: 'https://www.habitade.com/buscar?operacion=venta' },
      { '@type': 'ListItem', position: 3, name: meta.nombre, item: `https://www.habitade.com/comprar/${zona}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* HEADER */}
      <header style={{ background: '#006D77', padding: '0 20px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: -0.5, textDecoration: 'none' }}>habitade.</a>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href={`/buscar?zona=${encodeURIComponent(nombreZona)}&operacion=venta`} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>Ver en buscador</a>
          <a href="/buscar" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>Buscar</a>
        </div>
      </header>

      <div style={{ background: '#f4f5f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 48px' }}>

          {/* BREADCRUMB */}
          <nav style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
            <a href="/" style={{ color: '#006D77', textDecoration: 'none' }}>Habitade</a>
            {' › '}
            <a href="/buscar?operacion=venta" style={{ color: '#006D77', textDecoration: 'none' }}>Comprar</a>
            {' › '}
            <span>{meta.nombre}</span>
          </nav>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>
            Propiedades en venta en {meta.nombre}
          </h1>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20, maxWidth: 720, lineHeight: 1.6 }}>
            {meta.texto}
          </p>

          {lista.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
              <p style={{ fontSize: 16 }}>No hay propiedades disponibles en este momento.</p>
              <a href="/buscar?operacion=venta" style={{ color: '#006D77', fontSize: 14 }}>Ver todas las propiedades en venta →</a>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{lista.length} propiedades encontradas</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {lista.map((p: any) => {
                  const foto = Array.isArray(p.fotos) && p.fotos.length > 0 ? p.fotos[0] : null
                  const zonaLabel = (p.zona || '').toUpperCase()
                  const feats = [
                    p.habitaciones > 0 ? `${p.habitaciones} hab` : null,
                    p.m2 ? `${p.m2} m²` : null,
                    p.banos > 0 ? `${p.banos} ${p.banos === 1 ? 'baño' : 'baños'}` : null,
                  ].filter(Boolean).join(' · ')
                  return (
                    <a key={p.id} href={`/propiedad/${p.id}`} style={{ textDecoration: 'none', borderRadius: 10, overflow: 'hidden', border: '1px solid #e8e8e8', display: 'block', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                      <div style={{ aspectRatio: '16/10', background: '#eee', position: 'relative', overflow: 'hidden' }}>
                        {foto
                          ? <img src={foto} alt={p.titulo || p.tipo} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            </div>
                        }
                        {p.destacado && (
                          <div style={{ position: 'absolute', top: 10, left: 10, background: '#17A6B4', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: 0.5 }}>DESTACADO</div>
                        )}
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{zonaLabel}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 6, lineHeight: 1.35 }}>{p.titulo || `${p.tipo} en ${meta.nombre}`}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>{fmtPrecio(p.precio)}</span>
                          {p.precio && p.m2 && <span style={{ fontSize: 12, color: '#aaa' }}>{fmtPrecioM2(p.precio, p.m2)}</span>}
                        </div>
                        {feats && <div style={{ fontSize: 12, color: '#888' }}>{feats}</div>}
                      </div>
                    </a>
                  )
                })}
              </div>
              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <a href={`/buscar?operacion=venta&zona=${encodeURIComponent(nombreZona)}`} style={{ display: 'inline-block', background: '#006D77', color: '#fff', padding: '12px 32px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Ver más propiedades en {meta.nombre}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
