import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const base = 'https://www.habitade.com'

const zonas = [
  'santo-domingo', 'punta-cana', 'santiago', 'las-terrenas',
  'bavaro', 'cap-cana', 'la-romana', 'sosua', 'cabarete',
  'naco', 'piantini', 'bella-vista', 'arroyo-hondo',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Propiedades activas
  const { data: propiedades } = await supabase
    .from('propiedades')
    .select('id, updated_at')
    .eq('activo', true)
    .limit(1000)

  const propUrls: MetadataRoute.Sitemap = (propiedades || []).map((p: any) => ({
    url: `${base}/propiedad/${p.id}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Páginas estáticas principales
  const staticUrls: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/buscar?operacion=venta`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/buscar?operacion=alquiler`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/registro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    // Páginas de zona
    ...zonas.map(zona => ({
      url: `${base}/propiedades/${zona}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    })),
    // Búsquedas por tipo
    ...['apartamento', 'casa', 'villa', 'terreno', 'local'].map(tipo => ({
      url: `${base}/buscar?tipo=${tipo}&operacion=venta`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ]

  return [...staticUrls, ...propUrls]
}
