import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buscar Propiedades en República Dominicana',
  description: 'Busca apartamentos, casas, villas y terrenos en venta o alquiler en República Dominicana. Filtra por zona, precio y tipo en Santo Domingo, Punta Cana, Santiago y más.',
  alternates: { canonical: 'https://www.habitade.com/buscar' },
  openGraph: {
    title: 'Buscar Propiedades en República Dominicana | Habitade',
    description: 'Encuentra tu propiedad ideal en RD. Apartamentos, casas, villas y terrenos en venta o alquiler.',
    url: 'https://www.habitade.com/buscar',
    type: 'website',
    locale: 'es_DO',
    siteName: 'Habitade',
  },
}

export default function BuscarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
