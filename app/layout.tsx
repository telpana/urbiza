import type { Metadata } from "next";
import { headers } from 'next/headers';
import "./globals.css";
import "./responsive.css";
import { IdiomaProvider } from "../IdiomaContext";
import CookieBanner from "./components/CookieBanner";
import VisitaTracker from "./components/VisitaTracker";

const DESCRIPTIONS: Record<string, string> = {
  es: 'Encuentra tu próxima propiedad en República Dominicana. Miles de propiedades. Una sola búsqueda. Compra, vende o alquila apartamentos, casas, villas y terrenos en Santo Domingo, Punta Cana, Santiago y más.',
  en: 'Find your next property in the Dominican Republic. Thousands of properties. One search. Buy, sell or rent apartments, houses, villas and land in Santo Domingo, Punta Cana, Santiago and more.',
  fr: 'Trouvez votre prochaine propriété en République Dominicaine. Des milliers de biens. Une seule recherche. Achetez, vendez ou louez des appartements, maisons, villas et terrains en République Dominicaine.',
}

function getLang(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'es'
  const lang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()
  return lang in DESCRIPTIONS ? lang : 'es'
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers()
  const description = DESCRIPTIONS[getLang(h.get('accept-language'))]

  return {
  metadataBase: new URL('https://www.habitade.com'),
  title: {
    default: 'Habitade | Portal Inmobiliario República Dominicana',
    template: '%s | Habitade'
  },
  description,
  keywords: [
    'casas en venta republica dominicana',
    'apartamentos en venta santo domingo',
    'propiedades en punta cana',
    'bienes raices republica dominicana',
    'alquiler apartamentos santo domingo',
    'villas en venta punta cana',
    'terrenos en venta republica dominicana',
    'inmobiliaria republica dominicana',
    'casas en las terrenas',
    'propiedades en santiago de los caballeros',
    'apartamentos en naco',
    'villas en cap cana',
    'real estate dominican republic',
    'portal inmobiliario caribe',
  ],
  authors: [{ name: 'Habitade', url: 'https://www.habitade.com' }],
  creator: 'Habitade',
  publisher: 'Habitade',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    url: 'https://www.habitade.com',
    siteName: 'Habitade',
    title: 'Habitade | Portal Inmobiliario República Dominicana',
    description: 'Compra, vende o alquila propiedades en República Dominicana. Apartamentos, casas, villas y terrenos en Santo Domingo, Punta Cana, Santiago y más.',
    images: [{ url: 'https://uvbaneclqphnreaiooov.supabase.co/storage/v1/object/public/propiedades/habitade%20rd.png', width: 1200, height: 630, alt: 'Habitade | Portal Inmobiliario República Dominicana' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habitade | Portal Inmobiliario República Dominicana',
    description: 'Compra, vende o alquila propiedades en República Dominicana.',
    images: ['https://uvbaneclqphnreaiooov.supabase.co/storage/v1/object/public/propiedades/habitade%20rd.png'],
  },
  alternates: {
    canonical: 'https://www.habitade.com',
    languages: {
      'es': 'https://www.habitade.com',
      'en': 'https://www.habitade.com',
    }
  },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#006D77" />
        <meta name="geo.region" content="DO" />
        <meta name="geo.country" content="DO" />
        <meta name="geo.placename" content="República Dominicana" />
        <meta name="language" content="Spanish" />
        <meta name="revisit-after" content="7 days" />
        <link rel="icon" href="/icon" type="image/png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Habitade",
          "alternateName": "Habitade - Portal Inmobiliario República Dominicana",
          "url": "https://www.habitade.com",
          "description": "Encuentra tu próxima propiedad en República Dominicana. Miles de propiedades. Una sola búsqueda.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": { "@type": "EntryPoint", "urlTemplate": "https://www.habitade.com/buscar?q={search_term_string}" },
            "query-input": "required name=search_term_string"
          }
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Habitade",
          "url": "https://www.habitade.com",
          "logo": { "@type": "ImageObject", "url": "https://www.habitade.com/icon", "width": 512, "height": 512 },
          "areaServed": { "@type": "Country", "name": "Dominican Republic", "alternateName": "República Dominicana" },
          "sameAs": ["https://www.habitade.com"]
        }) }} />
        <style dangerouslySetInnerHTML={{__html:`
          .sc-wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
          @media(max-width:768px){
            .sc-wrap{display:flex!important;flex-direction:column!important;gap:12px!important}
            .sc-wrap>a{width:100%!important;max-width:100%!important}
          }
        `}} />
      </head>
      <body>
        <IdiomaProvider>
          {children}
          <CookieBanner />
          <VisitaTracker />
        </IdiomaProvider>
      </body>
    </html>
  );
}
