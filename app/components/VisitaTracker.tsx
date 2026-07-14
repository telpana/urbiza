'use client'
import { useEffect } from 'react'

export default function VisitaTracker() {
  useEffect(() => {
    if (sessionStorage.getItem('hb_visited')) return
    sessionStorage.setItem('hb_visited', '1')
    fetch('/api/visita-web', { method: 'POST' })
  }, [])
  return null
}
