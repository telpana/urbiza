'use client'
export default function Cookies() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px', color: '#222', lineHeight: 1.7 }}>
      <a href="/" style={{ color: '#006D77', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>← Volver al inicio</a>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Política de Cookies</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 40 }}>Última actualización: junio 2025</p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>¿Qué son las cookies?</h2>
      <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que la plataforma recuerde tus preferencias y mejore tu experiencia de navegación.</p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Cookies que utilizamos</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 }}>
        <thead>
          <tr style={{ background: '#f4f5f6' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Tipo</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Finalidad</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}><strong>Sesión</strong></td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>Mantener tu sesión iniciada mientras navegas</td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>Sesión</td>
          </tr>
          <tr>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}><strong>Autenticación</strong></td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>Recordar que has iniciado sesión entre visitas (Supabase Auth)</td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>7 días</td>
          </tr>
          <tr>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}><strong>Preferencias</strong></td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>Guardar tu idioma seleccionado y otras preferencias</td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>1 año</td>
          </tr>
          <tr>
            <td style={{ padding: '10px 12px' }}><strong>Analítica</strong></td>
            <td style={{ padding: '10px 12px' }}>Entender cómo se usa la plataforma de forma agregada y anónima</td>
            <td style={{ padding: '10px 12px' }}>90 días</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Cookies de terceros</h2>
      <p>Utilizamos servicios de terceros que pueden instalar sus propias cookies:</p>
      <ul style={{ paddingLeft: 20 }}>
        <li><strong>Stripe</strong> — procesamiento seguro de pagos.</li>
        <li><strong>Supabase</strong> — autenticación y gestión de sesión.</li>
      </ul>
      <p>Estos proveedores tienen sus propias políticas de privacidad y cookies, sobre las que Habitade no tiene control.</p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Control de cookies</h2>
      <p>Puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento. Ten en cuenta que deshabilitar las cookies esenciales puede impedir el correcto funcionamiento de la plataforma, incluyendo el inicio de sesión.</p>
      <p>La mayoría de navegadores ofrecen esta opción en su configuración de privacidad: Chrome, Firefox, Safari, Edge.</p>
    </main>
  )
}
