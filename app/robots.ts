import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/', // quitar esto y poner allow cuando el sitio abra
      },
    ],
    sitemap: 'https://www.habitade.com/sitemap.xml',
  }
}
