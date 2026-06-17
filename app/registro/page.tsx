'use client'
import { useState } from 'react'
import { supabase } from '../../supabase'

export default function Registro() {
  const [paso, setPaso] = useState(1)
  const [metodo, setMetodo] = useState('')
  const [tipoCuenta, setTipoCuenta] = useState('')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cedula, setCedula] = useState('')
  const [aei, setAei] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const tipos = [
    { id: 'particular', titulo: 'Particular', desc: '2 anuncios gratuitos para vender o alquilar tu propiedad', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
    { id: 'profesional', titulo: 'Profesional', desc: 'Broker o agencia con anuncios ilimitados por US$29/mes', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  ]

  const registrarConEmail = async () => {
    if (!nombre || !email || !password || !telefono) { setError('Nombre, email, contraseña y teléfono son obligatorios'); return }
    if (tipoCuenta === 'profesional' && !cedula) { setError('La cédula o RNC es obligatoria para profesionales'); return }
    setLoading(true)
    setError('')
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) { setError(signUpError.message); setLoading(false); return }
      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          nombre,
          email,
          telefono: telefono || null,
          cedula: cedula || null,
          numero_aei: aei || null,
          tipo: tipoCuenta === 'profesional' ? 'profesional' : 'particular',
          plan: 'gratis',
        })
      }
      setPaso(4)
    } catch (e) {
      setError('Ha ocurrido un error. Inténtalo de nuevo.')
    }
    setLoading(false)
  }

  const loginConGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/panel` } })
  }

  const loginConFacebook = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: `${window.location.origin}/panel` } })
  }

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>

      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>
            urbiza<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          {[{ label: 'Comprar', href: '/buscar?operacion=venta' }, { label: 'Alquilar', href: '/buscar?operacion=alquiler' }].map(item => (
            <a key={item.label} href={item.href} style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{item.label}</a>
          ))}
        </div>
        <a href="/login" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>Entrar</a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: 'calc(100vh - 54px)', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#006D77', letterSpacing: -2, marginBottom: 6 }}>
              urbiza<span style={{ color: '#17A6B4' }}>.</span>
            </div>
            <div style={{ fontSize: 14, color: '#888' }}>
              {paso === 1 && 'Crea tu cuenta gratis'}
              {paso === 2 && '¿Cómo vas a usar Urbiza?'}
              {paso === 3 && 'Tus datos'}
              {paso === 4 && '¡Bienvenido a Urbiza!'}
            </div>
          </div>

          {/* Indicador pasos */}
          {paso > 1 && paso < 4 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
              {[1, 2, 3].map((n, i) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: paso > n ? '#006D77' : paso === n ? '#006D77' : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {paso > n ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : n}
                  </div>
                  {i < 2 && <div style={{ width: 50, height: 2, background: paso > n + 1 ? '#006D77' : '#e0e0e0' }} />}
                </div>
              ))}
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: 10, padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>

            {/* PASO 1 — MÉTODO */}
            {paso === 1 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>Regístrate gratis</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 22 }}>Elige cómo quieres crear tu cuenta</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <button onClick={loginConGoogle} style={{ all: 'unset', width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 7, padding: '13px', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxSizing: 'border-box', color: '#333' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#006D77'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#e0e0e0'}>
                    <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continuar con Google
                  </button>
                  <button onClick={loginConFacebook} style={{ all: 'unset', width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 7, padding: '13px', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxSizing: 'border-box', color: '#333' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#1877F2'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#e0e0e0'}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Continuar con Facebook
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
                  <span style={{ fontSize: 12, color: '#aaa' }}>o con email</span>
                  <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
                </div>
                <button onClick={() => { setMetodo('email'); setPaso(2) }} style={{ all: 'unset', width: '100%', background: '#006D77', color: '#fff', padding: '13px', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
                  Registrarse con email
                </button>
              </div>
            )}

            {/* PASO 2 — TIPO */}
            {paso === 2 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>¿Cómo vas a usar Urbiza?</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Elige el tipo de cuenta que mejor se adapta a ti</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {tipos.map(t => (
                    <div key={t.id} onClick={() => setTipoCuenta(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', border: `2px solid ${tipoCuenta === t.id ? '#006D77' : '#e0e0e0'}`, borderRadius: 8, cursor: 'pointer', background: tipoCuenta === t.id ? '#f0fafb' : '#fff' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 8, background: tipoCuenta === t.id ? '#e0f5f7' : '#f4f5f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{t.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 3 }}>{t.titulo}</div>
                        <div style={{ fontSize: 13, color: '#777' }}>{t.desc}</div>
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${tipoCuenta === t.id ? '#006D77' : '#e0e0e0'}`, background: tipoCuenta === t.id ? '#006D77' : '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {tipoCuenta === t.id && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setPaso(1)} style={{ all: 'unset', flex: 1, border: '1.5px solid #e0e0e0', color: '#555', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>← Atrás</button>
                  <button onClick={() => tipoCuenta && setPaso(3)} style={{ all: 'unset', flex: 2, background: tipoCuenta ? '#006D77' : '#e0e0e0', color: '#fff', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: tipoCuenta ? 'pointer' : 'default', textAlign: 'center', boxSizing: 'border-box' }}>Continuar</button>
                </div>
              </div>
            )}

            {/* PASO 3 — DATOS */}
            {paso === 3 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>Tus datos</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Rellena tu información</p>
                {error && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>{error}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Nombre completo *</label>
                    <input value={nombre} onChange={e => setNombre(e.target.value)} type="text" placeholder="Tu nombre y apellidos" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Email *</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="tu@email.com" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Contraseña *</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mínimo 6 caracteres" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Teléfono *</label>
                    <input value={telefono} onChange={e => setTelefono(e.target.value)} type="tel" placeholder="+1 809 000 0000" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  {tipoCuenta === 'profesional' && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Cédula / RNC *</label>
                        <input value={cedula} onChange={e => setCedula(e.target.value)} type="text" placeholder="Cédula o RNC de la empresa" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Número AEI <span style={{ color: '#aaa', fontWeight: 400 }}>(opcional)</span></label>
                        <input value={aei} onChange={e => setAei(e.target.value)} type="text" placeholder="AEI-0000" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Si tienes número AEI lo verificamos en 24-48h y aparece el badge en tus anuncios</div>
                      </div>

                    </>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button onClick={() => setPaso(2)} style={{ all: 'unset', flex: 1, border: '1.5px solid #e0e0e0', color: '#555', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>← Atrás</button>
                  <button onClick={registrarConEmail} disabled={loading} style={{ all: 'unset', flex: 2, background: loading ? '#aaa' : '#006D77', color: '#fff', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </button>
                </div>
              </div>
            )}

            {/* PASO 4 — CONFIRMACIÓN */}
            {paso === 4 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8 }}>¡Bienvenido a Urbiza!</h2>
                <p style={{ fontSize: 14, color: '#777', marginBottom: 6, lineHeight: 1.6 }}>
                  Hemos enviado un email de verificación a <strong style={{ color: '#333' }}>{email}</strong>
                </p>
                <p style={{ fontSize: 13, color: '#aaa', marginBottom: 24 }}>Verifica tu email y luego entra a tu panel</p>
                {aei && (
                  <div style={{ background: '#e0f5f7', border: '1px solid #c5e8ea', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#004E57', marginBottom: 20 }}>
                    Tu número AEI será verificado en las próximas 24-48h
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="/panel" style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '13px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center', display: 'block' }}>
                    Ir a mi panel →
                  </a>
                  <a href="/buscar" style={{ all: 'unset', border: '1.5px solid #e0e0e0', color: '#555', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', display: 'block' }}>
                    Explorar propiedades
                  </a>
                </div>
              </div>
            )}

          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
            ¿Ya tienes cuenta?{' '}
            <a href="/login" style={{ color: '#006D77', fontWeight: 600, textDecoration: 'none' }}>Iniciar sesión</a>
          </div>

        </div>
      </div>
    </main>
  )
}
