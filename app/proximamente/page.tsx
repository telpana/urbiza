export default function Proximamente() {
  return (
    <main style={{ fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#f4f5f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 520 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#006D77', letterSpacing: -2, marginBottom: 4 }}>
          habitade<span style={{ color: '#17A6B4' }}>.</span>
        </div>
        <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, #006D77, #17A6B4)', borderRadius: 2, margin: '16px auto 28px' }} />
        <div style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12 }}>Estamos preparando algo grande</div>
        <div style={{ fontSize: 15, color: '#777', lineHeight: 1.7, marginBottom: 32 }}>
          Algo muy especial está en camino.
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,109,119,0.08)', border: '1px solid #e0f5f7', display: 'inline-block' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>¿Quieres ser el primero en saber cuándo abrimos?</div>
          <a href="mailto:hola@habitade.com" style={{ fontSize: 14, fontWeight: 600, color: '#006D77', textDecoration: 'none' }}>hola@habitade.com</a>
        </div>
        <div style={{ marginTop: 40, fontSize: 12, color: '#bbb' }}>© 2025 habitade.com · República Dominicana</div>
      </div>
    </main>
  )
}
