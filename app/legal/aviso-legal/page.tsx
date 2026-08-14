'use client'
export default function AvisoLegal() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px', color: '#222', lineHeight: 1.7 }}>
      <a href="/" style={{ color: '#006D77', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>← Volver al inicio</a>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Aviso Legal</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 32 }}>Última actualización: agosto 2026</p>

      {/* Identificación del prestador */}
      <div style={{ background: '#f0fafb', border: '1.5px solid #c7eaee', borderRadius: 10, padding: '24px 28px', marginBottom: 40 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#004E57', marginTop: 0, marginBottom: 16 }}>Identificación del prestador de servicios</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <tbody>
            {[
              ['Razón social', 'Habitade LLC'],
              ['Tipo de sociedad', 'Limited Liability Company (LLC)'],
              ['Jurisdicción de constitución', 'Wyoming, Estados Unidos'],
              ['EIN (Employer Identification Number)', '32-0863095'],
              ['Domicilio social registrado', '30 N Gould St Ste N, Sheridan, WY 82801, USA'],
              ['Dominio web', 'habitade.com'],
              ['Email de contacto', 'hola@habitade.com'],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: '1px solid #daeef0' }}>
                <td style={{ padding: '9px 12px 9px 0', fontWeight: 600, color: '#555', whiteSpace: 'nowrap', verticalAlign: 'top', width: 1 }}>{label}</td>
                <td style={{ padding: '9px 0 9px 16px', color: '#111' }}>{label === 'Email de contacto' ? <a href="mailto:hola@habitade.com" style={{ color: '#006D77' }}>{value}</a> : value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>1. Titular de la plataforma</h2>
      <p>Habitade es un servicio digital operado por <strong>Habitade LLC</strong>, sociedad de responsabilidad limitada constituida en el estado de Wyoming (Estados Unidos). Habitade opera como plataforma en línea de intermediación inmobiliaria y presta sus servicios a usuarios de todo el mundo a través del dominio <strong>habitade.com</strong>.</p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>2. Naturaleza del servicio</h2>
      <p>Habitade es exclusivamente una <strong>pasarela digital de intermediación</strong>. La plataforma permite a particulares, agentes e inmobiliarias publicar anuncios de compra, venta y alquiler de propiedades inmuebles. Habitade <strong>no actúa como agente inmobiliario, comprador, vendedor ni arrendador</strong> en ninguna de las operaciones que se generen a través de la plataforma, ni interviene en la negociación, formalización ni ejecución de los contratos entre las partes.</p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>3. Exención de responsabilidad sobre los anuncios</h2>
      <p>Los anuncios publicados en Habitade son <strong>responsabilidad exclusiva de sus autores</strong>. Habitade no verifica, valida ni garantiza la veracidad, exactitud, legalidad ni disponibilidad de las propiedades anunciadas. Habitade no se hace responsable de:</p>
      <ul style={{ paddingLeft: 20 }}>
        <li>Anuncios fraudulentos, engañosos o con información incorrecta.</li>
        <li>Prácticas indebidas, estafas o cualquier conducta ilícita por parte de los usuarios.</li>
        <li>Daños o perjuicios derivados de transacciones realizadas entre usuarios.</li>
        <li>La disponibilidad real, estado o titularidad de los inmuebles anunciados.</li>
      </ul>
      <p>Habitade actúa como mero intermediario técnico conforme a los principios de <em>safe harbour</em> aplicables a las plataformas de alojamiento de contenidos de terceros.</p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>4. Reporte de anuncios irregulares</h2>
      <p>Si eres testigo de un anuncio fraudulento, una práctica abusiva o cualquier contenido que infrinja nuestras normas de uso, puedes notificarlo a través de nuestros canales oficiales de comunicación, incluyendo nuestra cuenta de Instagram verificada y el correo de contacto indicado en la plataforma. Habitade revisará los reportes recibidos y, si se confirma la infracción, procederá a la <strong>eliminación del anuncio y, en su caso, del usuario responsable</strong>, en el menor tiempo posible. La recepción de un reporte no implica responsabilidad alguna de Habitade por los hechos denunciados.</p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>5. Propiedad intelectual</h2>
      <p>El diseño, código, logotipos, marca y contenidos propios de Habitade son propiedad de la sociedad titular y están protegidos por la legislación de propiedad intelectual aplicable. Queda prohibida su reproducción total o parcial sin autorización expresa. Las imágenes y textos de los anuncios son responsabilidad de sus autores.</p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>6. Modificaciones</h2>
      <p>Habitade se reserva el derecho de modificar el presente aviso legal en cualquier momento. Los cambios serán efectivos desde su publicación en esta página. El uso continuado de la plataforma tras la publicación de cambios implica la aceptación de los mismos.</p>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>7. Legislación aplicable</h2>
      <p>El presente aviso legal y las relaciones derivadas del uso de la plataforma se regirán por las leyes de la jurisdicción de constitución de la sociedad titular, sin perjuicio de las normas de protección al consumidor imperativas aplicables en cada territorio.</p>
    </main>
  )
}
