'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

let cachedUrl: string | null = null

function applyFavicon(url: string) {
  let link = document.getElementById('favicon-link') as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    link.id = 'favicon-link'
    document.head.appendChild(link)
  }
  link.href = url
}

export default function DynamicFavicon() {
  const pathname = usePathname()

  useEffect(() => {
    if (cachedUrl) {
      applyFavicon(cachedUrl as string)
      return
    }
    fetch('/api/admin/config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg.favicon_url) {
          cachedUrl = cfg.favicon_url
          applyFavicon(cachedUrl)
        }
      })
      .catch(() => {})
  }, [pathname])

  return null
}
