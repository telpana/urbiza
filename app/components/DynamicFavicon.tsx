'use client'
import { useEffect } from 'react'

export default function DynamicFavicon() {
  useEffect(() => {
    fetch('/api/admin/config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg.favicon_url) {
          let link = document.getElementById('favicon-link') as HTMLLinkElement | null
          if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            link.id = 'favicon-link'
            document.head.appendChild(link)
          }
          link.href = cfg.favicon_url + '?t=' + Date.now()
        }
      })
      .catch(() => {})
  }, [])
  return null
}
