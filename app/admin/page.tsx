'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

const ADMIN_EMAIL = 'hellotelpana@gmail.com'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [acceso, setAcceso] = useState(false)
  const [reportes, setReportes] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        window.location.href = '/'
        return
      }
      setAcceso(true)
      const { data } = await supabase
        .from('reportes')
        .select('*, propiedades(titulo)')
        .order('created_at', { ascending: false })
      if (data) setReportes(data)
      setLoading(false)
    }
    init()
  }, [])

  const marcarLeido = async (id: number) => {
    await supabase.from('reportes').update({ leido: true }).eq('id', id)
    setReportes(prev => prev.map((r: any) => r.id === id ? { ...r, leido: true } : r))
  }

  const eliminar = async (id: number) => {
    await supabase.from('reportes').delete().eq('id', id)
    setReportes(prev => prev.filter((r: any) => r.id !== id))
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f4f5f6' }}>
      <div style={{ color: '#006D77' }}>Cargando...</div>
    </div>
  )

  if (!acceso) return null

  const noLeidos = reportes.filter((r: any) => !r.leido).length

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f4f5f6', minHeight: '100vh' }}>
      <nav style={{ background: '#004E57', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -1.5, textDecoration: 'none' }}>
          habitade<span style={{ color: '#83D4DB' }}>.</span>
          <span style={{ fontSize: 11, fontWeight: 600, background: '#e63946', color: '#fff', padding: '2px 8px', borderRadius: 8, marginLeft: 10, letterSpacing: 0.5 }}>ADMIN</span>
        </a>
        <a href="/panel" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>← Volver al panel</a>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>Reportes de anuncios</h1>
          {noLeidos > 0 && (
            <span style={{ background: '#e63946', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 10 }}>{noLeidos} nuevos</span>
          )}
        </div>

        {reportes.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 8, padding: '48px', textAlign: 'center', color: '#aaa', fontSize: 14 }}>
            No hay reportes todavía
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reportes.map((r: any) => (
              <div key={r.id} style={{ background: '#fff', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderLeft: `4px solid ${r.leido ? '#e0e0e0' : '#e63946'}`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    {!r.leido && <span style={{ background: '#e63946', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 8 }}>NUEVO</span>}
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>{r.motivo}</span>
                  </div>
                  {r.comentario && <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>{r.comentario}</div>}
                  <div style={{ display: 'flex', gap: 14, fontSize: 11, color: '#aaa', flexWrap: 'wrap', alignItems: 'center' }}>
                    {r.propiedades?.titulo && (
                      <a href={`/propiedad/${r.propiedad_id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#006D77', textDecoration: 'none', fontWeight: 500 }}>
                        {r.propiedades.titulo} →
                      </a>
                    )}
                    <span>{new Date(r.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {!r.leido && (
                    <button onClick={() => marcarLeido(r.id)} style={{ all: 'unset', fontSize: 11, color: '#006D77', cursor: 'pointer', fontWeight: 600, padding: '5px 12px', border: '1px solid #006D77', borderRadius: 5 }}>
                      Leído
                    </button>
                  )}
                  <button onClick={() => eliminar(r.id)} style={{ all: 'unset', fontSize: 11, color: '#e63946', cursor: 'pointer', fontWeight: 600, padding: '5px 12px', border: '1px solid #e63946', borderRadius: 5 }}>
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
