import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Habitade <hola@habitade.com>'
const BASE = 'https://www.habitade.com'

function layout(content: string) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Habitade</title></head>
<body style="margin:0;padding:0;background:#f4f5f6;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f6;padding:32px 16px">
<tr><td align="center">
<table cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;overflow:hidden;width:100%;max-width:580px">
  <tr><td style="background:#006D77;padding:22px 32px">
    <span style="color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px">habitade.</span>
  </td></tr>
  <tr><td style="padding:32px 32px 24px">
    ${content}
  </td></tr>
  <tr><td style="padding:20px 32px;border-top:1px solid #ebebeb;text-align:center">
    <p style="margin:0;font-size:12px;color:#aaa">© 2026 Habitade &middot; <a href="${BASE}" style="color:#006D77;text-decoration:none">habitade.com</a> &middot; <a href="${BASE}/panel" style="color:#aaa;text-decoration:none">Dar de baja</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

function btn(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:#006D77;color:#fff;padding:13px 30px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none;margin:20px 0">${text}</a>`
}

function h1(text: string) {
  return `<h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111;line-height:1.3">${text}</h1>`
}

function p(text: string) {
  return `<p style="margin:0 0 14px;font-size:15px;color:#444;line-height:1.65">${text}</p>`
}

// ── 1. BIENVENIDA ─────────────────────────────────────────────────────────────
export async function emailBienvenida(email: string, nombre: string, tipo?: string) {
  const esProfesional = tipo && tipo !== 'particular'
  const contenido = esProfesional ? `
    ${h1(`Bienvenido a Habitade${nombre ? `, ${nombre}` : ''}`)}
    ${p('Tu cuenta profesional ya está activa. Habitade es el portal inmobiliario de referencia en República Dominicana y estamos aquí para ayudarte a vender más y mejor.')}
    <div style="background:#006D77;border-radius:8px;padding:14px 20px;margin:0 0 20px;text-align:center">
      <span style="color:rgba(255,255,255,0.8);font-size:13px">Plan Profesional · Todo incluido por solo </span>
      <span style="color:#fff;font-size:18px;font-weight:700">US$9.99/mes</span>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0">
      <tr>
        <td style="padding:0 6px 12px 0" width="50%">
          <div style="background:#f0fafb;border-radius:8px;padding:16px;border-left:3px solid #006D77">
            <div style="font-size:13px;font-weight:700;color:#006D77;margin-bottom:4px">Anuncios ilimitados</div>
            <div style="font-size:13px;color:#555;line-height:1.5">Publica todas las propiedades que necesites sin límite.</div>
          </div>
        </td>
        <td style="padding:0 0 12px 6px" width="50%">
          <div style="background:#f0fafb;border-radius:8px;padding:16px;border-left:3px solid #006D77">
            <div style="font-size:13px;font-weight:700;color:#006D77;margin-bottom:4px">Posición destacada</div>
            <div style="font-size:13px;color:#555;line-height:1.5">Tus propiedades aparecen primero en los resultados de búsqueda.</div>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 6px 12px 0" width="50%">
          <div style="background:#f0fafb;border-radius:8px;padding:16px;border-left:3px solid #006D77">
            <div style="font-size:13px;font-weight:700;color:#006D77;margin-bottom:4px">Estadísticas y KPIs</div>
            <div style="font-size:13px;color:#555;line-height:1.5">Visitas, impresiones y contactos de cada anuncio en tiempo real.</div>
          </div>
        </td>
        <td style="padding:0 0 12px 6px" width="50%">
          <div style="background:#f0fafb;border-radius:8px;padding:16px;border-left:3px solid #006D77">
            <div style="font-size:13px;font-weight:700;color:#006D77;margin-bottom:4px">Mensajes directos</div>
            <div style="font-size:13px;color:#555;line-height:1.5">Recibe consultas de compradores e interesados directamente en tu panel.</div>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 6px 0 0" width="50%">
          <div style="background:#f0fafb;border-radius:8px;padding:16px;border-left:3px solid #006D77">
            <div style="font-size:13px;font-weight:700;color:#006D77;margin-bottom:4px">Tarjeta profesional</div>
            <div style="font-size:13px;color:#555;line-height:1.5">Tu perfil verificado genera confianza en compradores e inversores.</div>
          </div>
        </td>
        <td style="padding:0 0 0 6px" width="50%">
          <div style="background:#f0fafb;border-radius:8px;padding:16px;border-left:3px solid #006D77">
            <div style="font-size:13px;font-weight:700;color:#006D77;margin-bottom:4px">Soporte prioritario</div>
            <div style="font-size:13px;color:#555;line-height:1.5">Nuestro equipo te ayuda con cualquier duda o problema que tengas.</div>
          </div>
        </td>
      </tr>
    </table>
    ${p('¿Todo listo? Entra a tu panel y publica tu primera propiedad ahora.')}
    ${btn('Ir a mi panel', `${BASE}/panel`)}
    <p style="margin:16px 0 0;font-size:13px;color:#999;text-align:center">¿Necesitas ayuda? Escríbenos a <a href="mailto:hola@habitade.com" style="color:#006D77">hola@habitade.com</a></p>
  ` : `
    ${h1(`Bienvenido a Habitade${nombre ? `, ${nombre}` : ''}`)}
    ${p('Nos alegra que estés aquí. Habitade es el portal inmobiliario de referencia en República Dominicana, y ahora formas parte de él.')}
    ${p('Con tu cuenta <strong>gratis</strong> puedes:')}
    <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;color:#444;line-height:1.8">
      <li>Publicar hasta <strong>2 propiedades gratis</strong></li>
      <li>Guardar propiedades en favoritos</li>
      <li>Contactar directamente con vendedores</li>
    </ul>
    ${p('¿Listo para publicar tu primera propiedad?')}
    ${btn('Ir a mi panel', `${BASE}/panel`)}
  `
  const html = layout(contenido)
  return resend.emails.send({ from: FROM, to: email, subject: `Bienvenido a Habitade${nombre ? `, ${nombre}` : ''}`, html })
}

// ── 3. NUEVO MENSAJE ──────────────────────────────────────────────────────────
export async function emailNuevoMensaje(opts: {
  emailVendedor: string
  nombreCliente: string
  mensaje: string
  tituloProp: string
  propiedadId: string
}) {
  const html = layout(`
    ${h1('Tienes un nuevo mensaje')}
    ${p(`<strong>${opts.nombreCliente}</strong> te ha escrito sobre tu propiedad:`)}
    <div style="background:#f4f5f6;border-left:4px solid #006D77;padding:16px 20px;border-radius:0 6px 6px 0;margin:0 0 20px">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#006D77;text-transform:uppercase;letter-spacing:0.5px">${opts.tituloProp}</p>
      <p style="margin:0;font-size:15px;color:#333;line-height:1.6;font-style:italic">"${opts.mensaje}"</p>
    </div>
    ${btn('Ver mensaje en Habitade', `${BASE}/panel?tab=mensajes`)}
    <p style="margin:12px 0 0;font-size:13px;color:#999">Responde desde tu panel para mantener el historial de conversaciones.</p>
  `)
  return resend.emails.send({ from: FROM, to: opts.emailVendedor, subject: `Tienes un nuevo mensaje de ${opts.nombreCliente}`, html })
}

// ── 4. PAGO CONFIRMADO ────────────────────────────────────────────────────────
export async function emailPagoConfirmado(email: string, nombre: string, proximaFactura?: string) {
  const html = layout(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-flex;align-items:center;justify-content:center;background:#e0f5f7;border-radius:50%;width:60px;height:60px;font-size:26px">✓</div>
    </div>
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111;text-align:center">¡Tu plan Profesional está activo!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#666;text-align:center">Gracias${nombre ? `, ${nombre}` : ''}. Tu suscripción está confirmada.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f6;border-radius:8px;margin-bottom:24px">
      <tr><td style="padding:12px 20px">
        <span style="font-size:14px;color:#666">Plan</span>
        <span style="float:right;font-size:14px;font-weight:600;color:#111">Profesional</span>
      </td></tr>
      <tr><td style="padding:12px 20px;border-top:1px solid #e0e0e0">
        <span style="font-size:14px;color:#666">Precio</span>
        <span style="float:right;font-size:14px;font-weight:600;color:#111">US$9.99/mes</span>
      </td></tr>
      ${proximaFactura ? `<tr><td style="padding:12px 20px;border-top:1px solid #e0e0e0">
        <span style="font-size:14px;color:#666">Próxima facturación</span>
        <span style="float:right;font-size:14px;font-weight:600;color:#111">${proximaFactura}</span>
      </td></tr>` : ''}
    </table>
    ${btn('Ir a mi panel', `${BASE}/panel`)}
  `)
  return resend.emails.send({ from: FROM, to: email, subject: 'Tu plan Profesional está activo — Habitade', html })
}

// ── 5. PLAN CANCELADO ─────────────────────────────────────────────────────────
export async function emailPlanCancelado(email: string, nombre: string, activoHasta?: string) {
  const html = layout(`
    ${h1('Tu plan ha sido cancelado')}
    ${p(`Hola${nombre ? ` ${nombre}` : ''}, hemos procesado la cancelación de tu suscripción Profesional.`)}
    ${activoHasta ? p(`Seguirás teniendo acceso a todas las funciones Profesionales hasta el <strong>${activoHasta}</strong>.`) : ''}
    ${p('Si en algún momento quieres volver, puedes reactivar tu plan desde tu panel.')}
    ${btn('Reactivar plan', `${BASE}/panel?tab=plan`)}
    <p style="margin:12px 0 0;font-size:13px;color:#999">Si crees que esto es un error, escríbenos a <a href="mailto:hola@habitade.com" style="color:#006D77">hola@habitade.com</a></p>
  `)
  return resend.emails.send({ from: FROM, to: email, subject: 'Tu plan ha sido cancelado — Habitade', html })
}

// ── 6. RESET DE CONTRASEÑA ───────────────────────────────────────────────────
export async function emailResetPassword(email: string, link: string) {
  const html = layout(`
    ${h1('Restablece tu contraseña')}
    ${p('Recibimos una solicitud para restablecer la contraseña de tu cuenta de Habitade.')}
    ${p('Haz clic en el botón de abajo para elegir una nueva contraseña. El enlace expira en 1 hora.')}
    ${btn('Establecer nueva contraseña', link)}
    ${p('Si no solicitaste este cambio, ignora este email. Tu contraseña actual sigue siendo la misma.')}
    <p style="margin:16px 0 0;font-size:13px;color:#999;word-break:break-all">Si el botón no funciona, copia este enlace en tu navegador:<br><a href="${link}" style="color:#006D77">${link}</a></p>
  `)
  return resend.emails.send({ from: FROM, to: email, subject: 'Restablece tu contraseña — Habitade', html })
}

// ── 7. NOVEDAD EN FAVORITO ────────────────────────────────────────────────────
export async function emailNovedadFavorito(opts: {
  email: string
  tituloProp: string
  propiedadId: string
  tipo: 'cambioPrecio' | 'nuevasFotos'
  precioAnterior?: number
  precioNuevo?: number
  fotoUrl?: string
  numFotos?: number
}) {
  const cambio = opts.tipo === 'cambioPrecio'
    ? `El precio ha cambiado: <span style="text-decoration:line-through;color:#999">US$ ${Number(opts.precioAnterior).toLocaleString('en-US')}</span> → <strong style="color:#006D77">US$ ${Number(opts.precioNuevo).toLocaleString('en-US')}</strong>`
    : `Se han añadido <strong>${opts.numFotos || 'nuevas'} fotos nuevas</strong>`

  const html = layout(`
    ${h1('Hay novedades en una propiedad que guardaste')}
    ${opts.fotoUrl ? `<img src="${opts.fotoUrl}" alt="${opts.tituloProp}" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:20px;display:block">` : ''}
    <p style="margin:0 0 6px;font-size:17px;font-weight:600;color:#111">${opts.tituloProp}</p>
    <p style="margin:0 0 20px;font-size:15px;color:#444;line-height:1.6">${cambio}</p>
    ${btn('Ver propiedad', `${BASE}/propiedad/${opts.propiedadId}`)}
  `)
  return resend.emails.send({ from: FROM, to: opts.email, subject: 'Hay novedades en una propiedad que guardaste — Habitade', html })
}
