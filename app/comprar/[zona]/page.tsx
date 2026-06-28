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
  if (n >= 1_000_000) return `US$ ${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `US$ ${Math.round(n / 1_000)}K`
  return `US$ ${n}`
}

export default async function ComprarZonaPage({ params }: { params: Promise<{ zona: string }> }) {
  const { zona } = await params
  const meta = zonasMeta[zona]
  if (!meta) notFound()

  const nombreZona = slugToZona[zona] || meta.nombre

  const subZonas = zonaGrupos[zona] || [nombreZona]
  const { data: propiedades } = await sb
    .from('propiedades')
    .select('id, titulo, precio, tipo, habitaciones, m2, fotos, zona')
    .eq('estado', 'activo')
    .eq('operacion', 'Venta')
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', fontFamily: 'sans-serif' }}>
        <nav style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
          <a href="/" style={{ color: '#006D77', textDecoration: 'none' }}>Habitade</a>
          {' › '}
          <a href="/buscar?operacion=Venta" style={{ color: '#006D77', textDecoration: 'none' }}>Comprar</a>
          {' › '}
          <span>{meta.nombre}</span>
        </nav>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', marginBottom: 8 }}>
          Propiedades en venta en {meta.nombre}
        </h1>
        <p style={{ fontSize: 15, color: '#555', marginBottom: 28, maxWidth: 720, lineHeight: 1.6 }}>
          {meta.texto}
        </p>

        {lista.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
            <p style={{ fontSize: 16 }}>No hay propiedades disponibles en este momento.</p>
            <a href="/buscar?operacion=Venta" style={{ color: '#006D77', fontSize: 14 }}>Ver todas las propiedades en venta →</a>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>{lista.length} propiedades encontradas</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {lista.map((p: any) => {
                const foto = Array.isArray(p.fotos) && p.fotos.length > 0 ? p.fotos[0] : null
                return (
                  <a key={p.id} href={`/propiedad/${p.id}`} style={{ textDecoration: 'none', borderRadius: 10, overflow: 'hidden', border: '1px solid #eee', display: 'block', transition: 'box-shadow 0.15s' }}>
                    <div style={{ height: 180, background: '#f4f5f6', position: 'relative', overflow: 'hidden' }}>
                      {foto
                        ? <img src={foto} alt={p.titulo || p.tipo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 32 }}>🏠</div>
                      }
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 11, color: '#006D77', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{p.tipo}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 6, lineHeight: 1.3 }}>{p.titulo || `${p.tipo} en ${meta.nombre}`}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#006D77', marginBottom: 6 }}>{fmtPrecio(p.precio)}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>
                        {p.habitaciones > 0 && `${p.habitaciones} hab · `}{p.m2 && `${p.m2} m²`}
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <a href={`/buscar?operacion=Venta&zona=${encodeURIComponent(nombreZona)}`} style={{ display: 'inline-block', background: '#006D77', color: '#fff', padding: '12px 32px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Ver más propiedades en {meta.nombre}
              </a>
            </div>
          </>
        )}
      </div>
    </>
  )
}
