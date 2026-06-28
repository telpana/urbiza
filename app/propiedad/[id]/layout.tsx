import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function fmtPrecio(n: number) {
  return n ? `US$ ${n.toLocaleString('es-DO')}` : ''
}

async function getProp(id: string) {
  const { data } = await sb
    .from('propiedades')
    .select('titulo, zona, precio, tipo, operacion, descripcion, fotos, m2, habitaciones, banos')
    .eq('id', id)
    .single()
  return data
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const p = await getProp(id)
  if (!p) return { title: 'Propiedad | Habitade' }

  const zona = p.zona?.split(',')[0]?.trim() || 'República Dominicana'
  const precio = fmtPrecio(p.precio)
  const title = `${p.titulo || p.tipo} en ${zona}${precio ? ` — ${precio}` : ''}`
  const description = p.descripcion
    ? p.descripcion.slice(0, 155)
    : `${p.tipo} en ${p.operacion?.toLowerCase()} en ${zona}, República Dominicana.${precio ? ` Precio: ${precio}.` : ''} Contacta al propietario en Habitade.`
  const imagen = Array.isArray(p.fotos) && p.fotos.length > 0 ? p.fotos[0] : undefined
  const url = `https://www.habitade.com/propiedad/${id}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'es_DO',
      siteName: 'Habitade',
      ...(imagen ? { images: [{ url: imagen, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: imagen ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imagen ? { images: [imagen] } : {}),
    },
  }
}

export default async function PropiedadLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const p = await getProp(id)

  const jsonLd = p ? {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: p.titulo || p.tipo,
    description: p.descripcion?.slice(0, 500) || undefined,
    url: `https://www.habitade.com/propiedad/${id}`,
    image: Array.isArray(p.fotos) ? p.fotos.slice(0, 3) : undefined,
    offers: {
      '@type': 'Offer',
      price: p.precio,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: p.zona?.split(',')[0]?.trim(),
      addressCountry: 'DO',
    },
    ...(p.m2 ? { floorSize: { '@type': 'QuantitativeValue', value: p.m2, unitCode: 'MTK' } } : {}),
    ...(p.habitaciones ? { numberOfRooms: p.habitaciones } : {}),
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  )
}
