import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/panel', '/admin', '/api/'],
      },
      { userAgent: 'GPTBot',          allow: '/' },
      { userAgent: 'ClaudeBot',       allow: '/' },
      { userAgent: 'PerplexityBot',   allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Googlebot-News',  allow: '/' },
      { userAgent: 'OAI-SearchBot',   allow: '/' },
      { userAgent: 'Applebot',        allow: '/' },
      { userAgent: 'YouBot',          allow: '/' },
    ],
    sitemap: 'https://www.habitade.com/sitemap.xml',
  }
}
