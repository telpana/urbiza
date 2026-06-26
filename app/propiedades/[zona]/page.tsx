import { Metadata } from 'next'
import { notFound } from 'next/navigation'

const ZONAS: Record<string, { nombre: string, desc: string, lat: number, lng: number }> = {
  'santo-domingo':  { nombre: 'Santo Domingo', desc: 'la capital y ciudad más grande de República Dominicana', lat: 18.4861, lng: -69.9312 },
  'punta-cana':     { nombre: 'Punta Cana', desc: 'el destino turístico más exclusivo del Caribe', lat: 18.5820, lng: -68.4005 },
  'santiago':       { nombre: 'Santiago de los Caballeros', desc: 'la segunda ciudad más importante de República Dominicana', lat: 19.4517, lng: -70.6970 },
  'las-terrenas':   { nombre: 'Las Terrenas', desc: 'la joya de la Península de Samaná', lat: 19.3103, lng: -69.5388 },
  'bavaro':         { nombre: 'Bávaro', desc: 'una de las playas más hermosas del mundo', lat: 18.6835, lng: -68.4070 },
  'cap-cana':       { nombre: 'Cap Cana', desc: 'la comunidad residencial más exclusiva del Caribe', lat: 18.5200, lng: -68.3700 },
  'la-romana':      { nombre: 'La Romana', desc: 'ciudad costera con Golf y Casa de Campo', lat: 18.4274, lng: -68.9728 },
  'sosua':          { nombre: 'Sosúa', desc: 'la costa norte de República Dominicana', lat: 19.7620, lng: -70.5167 },
  'cabarete':       { nombre: 'Cabarete', desc: 'capital mundial del kitesurf y destino bohemio', lat: 19.7478, lng: -70.4095 },
  'naco':           { nombre: 'Naco', desc: 'uno de los sectores más exclusivos del Distrito Nacional', lat: 18.4950, lng: -69.9450 },
  'piantini':       { nombre: 'Piantini', desc: 'el sector más premium de Santo Domingo', lat: 18.4890, lng: -69.9370 },
  'bella-vista':    { nombre: 'Bella Vista', desc: 'barrio residencial en el corazón de Santo Domingo', lat: 18.4760, lng: -69.9450 },
  'arroyo-hondo':   { nombre: 'Arroyo Hondo', desc: 'zona residencial tranquila en Santo Domingo', lat: 18.5050, lng: -69.9650 },
}

export async function generateStaticParams() {
  return Object.keys(ZONAS).map(zona => ({ zona }))
}

export async function generateMetadata({ params }: { params: { zona: string } }): Promise<Metadata> {
  const z = ZONAS[params.zona]
  if (!z) return {}
  return {
    title: `Propiedades en ${z.nombre} | Apartamentos, Casas y Villas`,
    description: `Encuentra apartamentos, casas, villas y terrenos en ${z.nombre}, ${z.desc}. Las mejores propiedades en venta y alquiler en ${z.nombre}, República Dominicana.`,
    keywords: [
      `propiedades en ${z.nombre.toLowerCase()}`,
      `casas en venta ${z.nombre.toLowerCase()}`,
      `apartamentos en ${z.nombre.toLowerCase()}`,
      `villas en ${z.nombre.toLowerCase()}`,
      `alquiler ${z.nombre.toLowerCase()}`,
      `inmobiliaria ${z.nombre.toLowerCase()}`,
      `bienes raices ${z.nombre.toLowerCase()}`,
      `real estate ${z.nombre.toLowerCase()}`,
    ],
    openGraph: {
      title: `Propiedades en ${z.nombre} | Habitade`,
      description: `Las mejores propiedades en venta y alquiler en ${z.nombre}, República Dominicana.`,
      url: `https://www.habitade.com/propiedades/${params.zona}`,
    },
    alternates: { canonical: `https://www.habitade.com/propiedades/${params.zona}` },
  }
}

export default function ZonaPage({ params }: { params: { zona: string } }) {
  const z = ZONAS[params.zona]
  if (!z) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Habitade',
    url: 'https://www.habitade.com',
    description: `Portal inmobiliario en ${z.nombre}, República Dominicana`,
    areaServed: {
      '@type': 'City',
      name: z.nombre,
      containedInPlace: { '@type': 'Country', name: 'República Dominicana' },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ fontFamily: 'sans-serif' }}>
        <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>
            habitade<span style={{ color: '#83D4DB' }}>.</span>
          </a>
        </nav>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 8 }}>
            Propiedades en {z.nombre}
          </h1>
          <p style={{ fontSize: 16, color: '#555', marginBottom: 32, maxWidth: 680 }}>
            Encuentra apartamentos, casas, villas y terrenos en {z.nombre}, {z.desc}. Las mejores oportunidades inmobiliarias en venta y alquiler.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 40 }}>
            {[
              { tipo: 'Apartamentos', href: `/buscar?zona=${z.nombre}&tipo=Apartamento&operacion=venta`, icon: '🏢' },
              { tipo: 'Casas', href: `/buscar?zona=${z.nombre}&tipo=Casa&operacion=venta`, icon: '🏠' },
              { tipo: 'Villas', href: `/buscar?zona=${z.nombre}&tipo=Villa&operacion=venta`, icon: '🏡' },
              { tipo: 'Terrenos', href: `/buscar?zona=${z.nombre}&tipo=Terreno&operacion=venta`, icon: '🌿' },
              { tipo: 'En alquiler', href: `/buscar?zona=${z.nombre}&operacion=alquiler`, icon: '🔑' },
            ].map(c => (
              <a key={c.tipo} href={c.href} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 28 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{c.tipo} en {z.nombre}</div>
                  <div style={{ fontSize: 12, color: '#006D77', marginTop: 2 }}>Ver propiedades →</div>
                </div>
              </a>
            ))}
          </div>
          <div style={{ background: '#006D77', borderRadius: 12, padding: '28px 32px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>¿Tienes una propiedad en {z.nombre}?</div>
              <div style={{ fontSize: 14, opacity: 0.85 }}>Publica gratis y llega a miles de compradores e inquilinos.</div>
            </div>
            <a href="/registro" style={{ background: '#fff', color: '#006D77', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Publicar anuncio</a>
          </div>
        </div>
        <footer style={{ borderTop: '1px solid #e8e8e8', padding: '20px', textAlign: 'center', fontSize: 12, color: '#aaa' }}>
          © 2025 habitade.com · Portal Inmobiliario República Dominicana
        </footer>
      </main>
    </>
  )
}
