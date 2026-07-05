'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabase'

export default function ResetPassword() {
  const [listo, setListo] = useState(false)      // sesión detectada, mostrar formulario
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const doneRef = useRef(false)

  useEffect(() => {
    // Puede que el cliente ya haya procesado el token del fragmento antes de montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setListo(true)
    })

    // O llega via evento SIGNED_IN cuando el cliente procesa el fragmento
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') setListo(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Si el usuario sale sin terminar, cerrar sesión
  useEffect(() => {
    if (!listo) return
    const handler = () => {
      if (doneRef.current) return
      try {
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('sb-') && k.includes('-auth-token')) localStorage.removeItem(k)
        })
      } catch {}
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [listo])

  const guardar = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    if (err) {
      setError('Error al guardar la contraseña. Inténtalo de nuevo.')
      setLoading(false)
      return
    }
    doneRef.current = true
    setDone(true)
    setTimeout(() => { window.location.href = '/panel' }, 1800)
  }

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>
      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>habitade.</a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 54px)', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#006D77', letterSpacing: -2, marginBottom: 6 }}>habitade.</div>
            <div style={{ fontSize: 14, color: '#888' }}>
              {listo ? 'Elige tu nueva contraseña' : 'Verificando enlace…'}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 10, padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
            {!listo && (
              <div style={{ textAlign: 'center', color: '#aaa', fontSize: 14, padding: '16px 0' }}>
                <div style={{ width: 28, height: 28, border: '3px solid #e0e0e0', borderTopColor: '#006D77', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
                Cargando…
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            )}

            {listo && done && (
              <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 600, fontSize: 15 }}>
                ✓ Contraseña guardada. Redirigiendo a tu panel…
              </div>
            )}

            {listo && !done && (
              <>
                {error && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>
                    {error}
                  </div>
                )}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoFocus
                    style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', color: '#222', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#006D77'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    onKeyDown={e => e.key === 'Enter' && guardar()}
                  />
                </div>
                <button
                  onClick={guardar}
                  disabled={loading}
                  style={{ all: 'unset', width: '100%', background: loading ? '#aaa' : '#006D77', color: '#fff', padding: '13px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: loading ? 'default' : 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                  {loading ? 'Guardando…' : 'Guardar contraseña'}
                </button>
                <p style={{ margin: '16px 0 0', fontSize: 12, color: '#aaa', textAlign: 'center' }}>
                  A partir de ahora podrás entrar con Google o con tu contraseña.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
