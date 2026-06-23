'use client'
import { useState } from 'react'
import { supabase } from '../../supabase'
import { useIdioma } from '../../IdiomaContext'

export default function Registro() {
  const { tr } = useIdioma()
  const T = tr.registro
  const Tn = tr.nav

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
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const tipos = [
    { id: 'particular', titulo: T.particular, desc: T.particularDesc, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
    { id: 'profesional', titulo: T.profesional, desc: T.profesionalDesc, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  ]

  const registrarConEmail = async () => {
    if (!nombre || !email || !password || !telefono) { setError(T.err_campos); return }
    if (tipoCuenta === 'profesional' && !cedula) { setError(T.err_cedula); return }
    setLoading(true)
    setError('')
    try {
      const tipo = tipoCuenta === 'profesional' ? 'profesional' : 'particular'

      // Crear cuenta y guardar perfil en el servidor (sin enviar email de confirmación)
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nombre, tipo, telefono, cedula, numero_aei: aei }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error || T.err_generico); setLoading(false); return }

      // Login automático
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
      if (loginErr) { setError(loginErr.message); setLoading(false); return }

      window.location.href = '/panel'
    } catch (e) {
      setError(T.err_generico)
    }
    setLoading(false)
  }

  const loginConGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/completar-perfil` } })
  }

  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh' }}>

      <nav style={{ background: '#006D77', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none', marginRight: 28 }}>
            propiteca<span style={{ color: '#83D4DB' }}>.</span>
          </a>
          {[{ label: Tn.comprar, href: '/buscar?operacion=venta' }, { label: Tn.alquilar, href: '/buscar?operacion=alquiler' }].map(item => (
            <a key={item.label} href={item.href} style={{ padding: '0 12px', height: 54, display: 'flex', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{item.label}</a>
          ))}
        </div>
        <a href="/login" style={{ fontSize: 12, color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', fontWeight: 500 }}>{Tn.entrar}</a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: 'calc(100vh - 54px)', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#006D77', letterSpacing: -2, marginBottom: 6 }}>
              propiteca<span style={{ color: '#17A6B4' }}>.</span>
            </div>
            <div style={{ fontSize: 14, color: '#888' }}>
              {paso === 1 && T.titulo1}
              {paso === 2 && T.titulo2}
              {paso === 3 && T.titulo3}
              {paso === 4 && T.titulo4}
            </div>
          </div>

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

            {paso === 1 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>{T.titulo1}</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 22 }}>{T.subtitulo1}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <button onClick={loginConGoogle} style={{ all: 'unset', width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 7, padding: '13px', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxSizing: 'border-box', color: '#333' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#006D77'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#e0e0e0'}>
                    <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    {T.google}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
                  <span style={{ fontSize: 12, color: '#aaa' }}>{T.oEmail}</span>
                  <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <a href="/" style={{ all: 'unset', flex: 1, border: '1.5px solid #e0e0e0', color: '#555', padding: '13px', borderRadius: 7, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>{T.back}</a>
                  <button onClick={() => { setMetodo('email'); setPaso(2) }} style={{ all: 'unset', flex: 2, background: '#006D77', color: '#fff', padding: '13px', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>
                    {T.registrarse}
                  </button>
                </div>
              </div>
            )}

            {paso === 2 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>{T.titulo2}</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>{T.subtitulo2}</p>
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
                  <button onClick={() => setPaso(1)} style={{ all: 'unset', flex: 1, border: '1.5px solid #e0e0e0', color: '#555', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>{T.back}</button>
                  <button onClick={() => tipoCuenta && setPaso(3)} style={{ all: 'unset', flex: 2, background: tipoCuenta ? '#006D77' : '#e0e0e0', color: '#fff', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: tipoCuenta ? 'pointer' : 'default', textAlign: 'center', boxSizing: 'border-box' }}>{T.continuar}</button>
                </div>
              </div>
            )}

            {paso === 3 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>{T.titulo3}</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>{T.subtitulo3}</p>
                {error && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>{error}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{T.nombre} *</label>
                    <input value={nombre} onChange={e => setNombre(e.target.value)} type="text" placeholder={T.placeholder_nombre} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{T.email} *</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="tu@email.com" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{T.contrasena} *</label>
                    <div style={{ position: 'relative' }}>
                      <input value={password} onChange={e => setPassword(e.target.value)} type={mostrarPassword ? 'text' : 'password'} placeholder={T.placeholder_pass} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 44px 11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                      <button type="button" onClick={() => setMostrarPassword(v => !v)} style={{ all: 'unset', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa', display: 'flex', alignItems: 'center' }}>
                        {mostrarPassword
                          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{T.telefono} *</label>
                    <input value={telefono} onChange={e => setTelefono(e.target.value)} type="tel" placeholder="+1 809 000 0000" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                  </div>
                  {tipoCuenta === 'profesional' && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{T.cedula} *</label>
                        <input value={cedula} onChange={e => setCedula(e.target.value)} type="text" placeholder={T.cedula} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{T.aei} <span style={{ color: '#aaa', fontWeight: 400 }}>{T.aeiOpcional}</span></label>
                        <input value={aei} onChange={e => setAei(e.target.value)} type="text" placeholder="AEI-0000" style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#006D77'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{T.aeiDesc}</div>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button onClick={() => setPaso(2)} style={{ all: 'unset', flex: 1, border: '1.5px solid #e0e0e0', color: '#555', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>{T.back}</button>
                  <button onClick={registrarConEmail} disabled={loading} style={{ all: 'unset', flex: 2, background: loading ? '#aaa' : '#006D77', color: '#fff', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>
                    {loading ? T.creando : T.crearCuenta}
                  </button>
                </div>
              </div>
            )}

            {paso === 4 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#006D77" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8 }}>{T.bienvenido}</h2>
                <p style={{ fontSize: 14, color: '#777', marginBottom: 6, lineHeight: 1.6 }}>
                  {T.verificacion} <strong style={{ color: '#333' }}>{email}</strong>
                </p>
                <p style={{ fontSize: 13, color: '#aaa', marginBottom: 24 }}>{T.verificaEmail}</p>
                {aei && (
                  <div style={{ background: '#e0f5f7', border: '1px solid #c5e8ea', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#004E57', marginBottom: 20 }}>
                    {T.aeiVerificacion}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="/panel" style={{ all: 'unset', background: '#006D77', color: '#fff', padding: '13px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center', display: 'block' }}>
                    {T.irPanel}
                  </a>
                  <a href="/buscar" style={{ all: 'unset', border: '1.5px solid #e0e0e0', color: '#555', padding: '12px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center', display: 'block' }}>
                    {T.explorar}
                  </a>
                </div>
              </div>
            )}

          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
            {T.yaTienes}{' '}
            <a href="/login" style={{ color: '#006D77', fontWeight: 600, textDecoration: 'none' }}>{T.iniciarSesion}</a>
          </div>

        </div>
      </div>
    </main>
  )
}
