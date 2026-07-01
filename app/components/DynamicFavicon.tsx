'use client'
import { useEffect } from 'react'

export default function DynamicFavicon() {
  useEffect(() => {
    const apply = (url: string) => {
      document.querySelectorAll('link[rel~="icon"]').forEach(el => el.remove())
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = url
      document.head.appendChild(link)
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
