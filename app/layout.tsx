import type { Metadata } from "next";
import "./globals.css";
import "./responsive.css";
import { IdiomaProvider } from "../IdiomaContext";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.habitade.com'),
  title: {
    default: 'Habitade | Portal Inmobiliario República Dominicana',
    template: '%s | Habitade'
  },
  description: 'El portal inmobiliario líder del Caribe. Compra, vende o alquila apartamentos, casas, villas y terrenos en República Dominicana. Miles de propiedades en Santo Domingo, Punta Cana, Santiago y Las Terrenas.',
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
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Habitade - Portal Inmobiliario República Dominicana' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habitade | Portal Inmobiliario República Dominicana',
    description: 'Compra, vende o alquila propiedades en República Dominicana.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.habitade.com',
    languages: {
      'es': 'https://www.habitade.com',
      'en': 'https://www.habitade.com',
    }
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#006D77" />
        <link rel="canonical" href="https://www.habitade.com" />
        <meta name="geo.region" content="DO" />
        <meta name="geo.country" content="DO" />
        <meta name="geo.placename" content="República Dominicana" />
        <meta name="language" content="Spanish" />
        <meta name="revisit-after" content="7 days" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Habitade",
          "alternateName": "Habitade - Portal Inmobiliario República Dominicana",
          "url": "https://www.habitade.com",
          "description": "El portal inmobiliario líder del Caribe. Compra, vende o alquila apartamentos, casas, villas y terrenos en República Dominicana.",
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
        </IdiomaProvider>
      </body>
    </html>
  );
}
