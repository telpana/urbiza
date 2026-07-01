'use client'
import { useEffect } from 'react'

export default function DynamicFavicon() {
  useEffect(() => {
    const apply = (url: string) => {
      let link = document.getElementById('favicon-link') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        link.id = 'favicon-link'
        document.head.appendChild(link)
      }
      link.href = url
    }

    try {
      const cached = sessionStorage.getItem('habitade_favicon')
      if (cached) { apply(cached); return }
    } catch {}

    fetch('/api/admin/config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg.favicon_url) {
          try { sessionStorage.setItem('habitade_favicon', cfg.favicon_url) } catch {}
          apply(cfg.favicon_url)
        }
      })
      .catch(() => {})
  }, [])

  return null
}
