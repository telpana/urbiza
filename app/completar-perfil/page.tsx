'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

export default function CompletarPerfil() {
  const [loading, setLoading] = useState(true)
  const [tipo, setTipo] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cedula, setCedula] = useState('')
  const [aei, setAei] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkPerfil = async (u: any) => {
      const nombreMeta = u.user_metadata?.full_name || u.user_metadata?.name || ''
      setNombre(nombreMeta)

      const { data: perfil } = await supabase
        .from('usuarios')
        .select('tipo, telefono')
        .eq('id', u.id)
        .single()

      // Solo redirigir al panel si tiene telefono (tipo lo pone el trigger por defecto)
      if (perfil?.telefono) {
        window.location.href = '/panel'
        return
      }

      // Pre-seleccionar tipo si el trigger ya lo puso
      if (perfil?.tipo) setTipo(perfil.tipo)

      setLoading(false)
    }

    // onAuthStateChange captura el token del hash de OAuth correctamente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await checkPerfil(session.user)
        subscription.unsubscribe()
      } else if (event === 'INITIAL_SESSION') {
        if (session) {
          await checkPerfil(session.user)
          subscription.unsubscribe()
        } else {
          window.location.href = '/login'
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const guardar = async () => {
    if (!tipo) { setError('Elige el tipo de cuenta'); return }
    if (!nombre.trim()) { setError('Introduce tu nombre'); return }
    if (!telefono.trim()) { setError('Introduce tu teléfono'); return }
    setGuardando(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/completar-perfil', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ nombre, tipo, telefono, cedula, numero_aei: aei }),
    })

    const d = await res.json()
    if (!res.ok) { setError(d.error || 'Error al guardar'); setGuardando(false); return }
    window.location.href = '/panel'
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f4f5f6' }}>
        <div style={{ color: '#006D77', fontSize: 15 }}>Cargando...</div>
      </div>
    )
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f4f5f6', minHeight: '100vh' }}>
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>
          habitade<span style={{ color: '#83D4DB' }}>.</span>
        </a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 54px)', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6 }}>Completa tu perfil</div>
            <div style={{ fontSize: 14, color: '#888' }}>Necesitamos unos datos más para activar tu cuenta</div>
          </div>

          <div style={{ background: '#fff', borderRadius: 10, padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 10 }}>Tipo de cuenta</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { id: 'particular', label: 'Particular', desc: 'Vendo o alquilo mi propiedad' },
                  { id: 'profesional', label: 'Profesional', desc: 'Agente o inmobiliaria' },
                ].map(t => (
                  <button key={t.id} onClick={() => setTipo(t.id)} style={{ all: 'unset', border: `2px solid ${tipo === t.id ? '#006D77' : '#e0e0e0'}`, borderRadius: 8, padding: '14px 12px', cursor: 'pointer', background: tipo === t.id ? '#f0fafb' : '#fff', textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: tipo === t.id ? '#006D77' : '#333', marginBottom: 2 }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Nombre completo</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre"
                style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', color: '#222', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#006D77'} onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Teléfono</label>
              <input value={telefono} onChange={e => { let v = e.target.value.replace(/[^\d\s\-+()\+]/g, '').replace(/(?!^)\+/g, ''); if (!v.startsWith('+')) v = '+' + v.replace(/^\+*/, ''); setTelefono(v.slice(0, 17)) }} placeholder="+1 809 000 0000" type="tel"
                style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', color: '#222', boxSizing: 'border-box' }}
                onFocus={e => { if (!e.target.value) setTelefono('+'); e.target.style.borderColor = '#006D77' }} onBlur={e => { if (e.target.value === '+') setTelefono(''); e.target.style.borderColor = '#e0e0e0' }} />
            </div>

            <div style={{ marginBottom: tipo === 'profesional' ? 16 : 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Cédula <span style={{ fontWeight: 400, color: '#aaa' }}>(opcional)</span>
              </label>
              <input value={cedula} onChange={e => setCedula(e.target.value)} placeholder="000-0000000-0"
                style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', color: '#222', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#006D77'} onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
            </div>

            {tipo === 'profesional' && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                  Número AEI <span style={{ fontWeight: 400, color: '#aaa' }}>(opcional)</span>
                </label>
                <input value={aei} onChange={e => setAei(e.target.value)} placeholder="AEI-000000"
                  style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', color: '#222', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#006D77'} onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
              </div>
            )}

            <button onClick={guardar} disabled={guardando} style={{ all: 'unset', width: '100%', background: guardando ? '#aaa' : '#006D77', color: '#fff', padding: '13px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: guardando ? 'default' : 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
              {guardando ? 'Guardando...' : 'Entrar a mi panel'}
            </button>

          </div>
        </div>
      </div>
    </main>
  )
}
