'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

interface Props {
  dark?: boolean // true = navbar teal, false = navbar blanco
}

export default function NavUserMenu({ dark = false }: Props) {
  const [sesion, setSesion] = useState(false)
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [inicial, setInicial] = useState('U')
  const [noLeidos, setNoLeidos] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setSesion(true)

      const { data: perfil } = await supabase
        .from('usuarios')
        .select('foto_url, nombre')
        .eq('id', user.id)
        .single()
      if (perfil?.foto_url) setFotoUrl(perfil.foto_url)
      if (perfil?.nombre) setInicial(perfil.nombre[0].toUpperCase())

      // Contar mensajes no leídos
      const { data: msgs } = await supabase
        .from('mensajes')
        .select('id')
        .eq('vendedor_id', user.id)
      if (msgs) {
        try {
          const leidos: Record<string, boolean> = JSON.parse(localStorage.getItem(`urbiza_leidos_${user.id}`) || '{}')
          setNoLeidos(msgs.filter(m => !leidos[m.id]).length)
        } catch {
          setNoLeidos(msgs.length)
        }
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => init())
    return () => subscription.unsubscribe()
  }, [])

  // Cerrar menú al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const iconColor = dark ? 'rgba(255,255,255,0.85)' : '#555'
  const iconHoverColor = dark ? '#fff' : '#006D77'

  const IconBtn = ({ href, children, badge }: { href: string, children: React.ReactNode, badge?: number }) => (
    <a href={href} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none', color: iconColor, padding: '0 8px', cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = iconHoverColor}
      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = iconColor}>
      {children}
      {!!badge && (
        <span style={{ position: 'absolute', top: -4, right: 2, background: '#e63946', color: '#fff', fontSize: 9, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </a>
  )

  if (!sesion) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {/* Favoritos */}
      <IconBtn href="/panel?s=guardados">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <span style={{ fontSize: 10, fontWeight: 500, lineHeight: 1 }}>Favoritos</span>
      </IconBtn>

      {/* Chat */}
      <IconBtn href="/panel?s=mensajes" badge={noLeidos}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span style={{ fontSize: 10, fontWeight: 500, lineHeight: 1 }}>Chat</span>
      </IconBtn>

      {/* Avatar + hamburger */}
      <div ref={menuRef} style={{ position: 'relative', marginLeft: 4 }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: dark ? '1.5px solid rgba(255,255,255,0.4)' : '1.5px solid #e0e0e0', borderRadius: 20, padding: '4px 10px 4px 4px', background: dark ? 'rgba(255,255,255,0.08)' : '#fafafa' }}>
          {fotoUrl
            ? <img src={fotoUrl} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} referrerPolicy="no-referrer" />
            : <div style={{ width: 28, height: 28, borderRadius: '50%', background: dark ? '#83D4DB' : '#006D77', color: dark ? '#004E57' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{inicial}</div>
          }
          {/* Hamburger */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" style={{ flexShrink: 0 }}>
            <path d="M0 1h16M0 6h16M0 11h16" stroke={dark ? 'rgba(255,255,255,0.85)' : '#555'} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {menuOpen && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', minWidth: 180, zIndex: 300 }}>
            {[
              { label: 'Mi panel', href: '/panel', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
              { label: 'Mis anuncios', href: '/panel?s=anuncios', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
              { label: 'Chat', href: '/panel?s=mensajes', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
              { label: 'Guardados', href: '/panel?s=guardados', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
            ].map(item => (
              <a key={item.href} href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 13, color: '#222', textDecoration: 'none', borderBottom: '1px solid #f5f5f5' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#f0fafb'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}>
                {item.icon}
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
