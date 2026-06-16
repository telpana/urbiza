'use client'
import { useState } from 'react'
import { supabase } from '../../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verPass, setVerPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loginConEmail = async () => {
    if (!email || !password) { setError('Introduce tu email y contraseña'); return }
    setLoading(true)
    setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) { setError('Email o contraseña incorrectos'); setLoading(false); return }
    window.location.href = '/panel'
  }

  const loginConGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/panel` } })
  }

  const loginConFacebook = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: `${window.location.origin}/panel` } })
  }

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>

      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>
            urbiza<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          {['Comprar', 'Alquilar', 'Obra nueva'].map(item => (
            <a key={item} href="#" style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
        <a href="/registro" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>Crear cuenta</a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 54px)', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#006D77', letterSpacing: -2, marginBottom: 6 }}>
              urbiza<span style={{ color: '#17A6B4' }}>.</span>
            </div>
            <div style={{ fontSize: 14, color: '#888' }}>Accede a tu cuenta</div>
          </div>

          <div style={{ background: '#fff', borderRadius: 10, padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>

            {error && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>{error}</div>}

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
                style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', color: '#222', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'}
                onKeyDown={e => e.key === 'Enter' && loginConEmail()} />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input type={verPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña"
                  style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 44px 11px 14px', fontSize: 14, outline: 'none', color: '#222', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'}
                  onKeyDown={e => e.key === 'Enter' && loginConEmail()} />
                <button onClick={() => setVerPass(!verPass)} style={{ all: 'unset', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa' }}>
                  {verPass
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <a href="#" style={{ fontSize: 12, color: '#006D77', textDecoration: 'none', fontWeight: 500 }}>¿Olvidaste tu contraseña?</a>
            </div>

            <button onClick={loginConEmail} disabled={loading} style={{ all: 'unset', width: '100%', background: loading ? '#aaa' : '#006D77', color: '#fff', padding: '13px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: loading ? 'default' : 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box', marginBottom: 16 }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
              <span style={{ fontSize: 12, color: '#aaa' }}>o continúa con</span>
              <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={loginConGoogle} style={{ all: 'unset', width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxSizing: 'border-box', color: '#333' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continuar con Google
              </button>
              <button onClick={loginConFacebook} style={{ all: 'unset', width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxSizing: 'border-box', color: '#333' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Continuar con Facebook
              </button>
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
            ¿No tienes cuenta?{' '}
            <a href="/registro" style={{ color: '#006D77', fontWeight: 600, textDecoration: 'none' }}>Regístrate gratis</a>
          </div>

        </div>
      </div>

    </main>
  )
}
