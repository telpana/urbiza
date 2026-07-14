export default function Proximamente() {
  return (
    <main style={{
      margin: 0, padding: 0, minHeight: '100vh',
      background: '#004E57',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .hb-a { animation: fadeUp 0.7s ease both }
        .hb-b { animation: fadeUp 0.7s 0.15s ease both }
        .hb-c { animation: fadeUp 0.7s 0.3s ease both }
        .hb-d { animation: fadeUp 0.7s 0.45s ease both }
        .hb-dot { animation: pulse 1.6s infinite }
        .hb-dot:nth-child(2) { animation-delay:0.3s }
        .hb-dot:nth-child(3) { animation-delay:0.6s }
        @media (max-width:480px) {
          .hb-logo  { font-size:38px !important }
          .hb-title { font-size:30px !important }
          .hb-sub   { font-size:14px !important; padding:0 28px !important }
        }
      `}</style>

      <div className="hb-a hb-logo" style={{ fontSize: 50, fontWeight: 700, color: '#fff', letterSpacing: -3, marginBottom: 10 }}>
        habitade.
      </div>

      <div style={{ width: 36, height: 2, background: '#83D4DB', borderRadius: 2, marginBottom: 44 }} className="hb-a" />

      <div className="hb-b hb-title" style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: -1, marginBottom: 16, textAlign: 'center' }}>
        Próximamente
      </div>

      <div className="hb-c hb-sub" style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 1.8, maxWidth: 360 }}>
        Estamos trabajando en algo increíble.<br />
        El portal inmobiliario de República Dominicana.
      </div>

      <div className="hb-d" style={{ display: 'flex', gap: 8, marginTop: 52 }}>
        {[0,1,2].map(i => (
          <div key={i} className="hb-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#83D4DB' }} />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 28, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
        © 2026 habitade.com
      </div>
    </main>
  )
}
