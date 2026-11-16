import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PRECIOS: Record<string, string> = {
  // Planes nuevos
  'plata_mensual': process.env.STRIPE_PRICE_PLATA_MENSUAL!,
  'plata_anual': process.env.STRIPE_PRICE_PLATA_ANUAL!,
  'oro_mensual': process.env.STRIPE_PRICE_ORO_MENSUAL!,
  'oro_anual': process.env.STRIPE_PRICE_ORO_ANUAL!,
  // Plan legado (mantener compatibilidad con usuarios fundador)
  'fundador': 'price_1TyDBVFCPtfA6ME6yIOiNbaE',
  'profesional': 'price_1TyDBVFCPtfA6ME6yIOiNbaE',
  // Destacados (pago único)
  '15': 'price_1TyDBWFCPtfA6ME6t2uzizW2',
  '30': 'price_1TyDBZFCPtfA6ME69xpOdAgK',
  '60': 'price_1TyDBZFCPtfA6ME6xL1TWFSR',
}

// Extrae el nombre del plan y el intervalo desde el tipo
function parseTipo(tipo: string): { planNombre: string; intervalo: string } {
  if (tipo === 'plata_mensual') return { planNombre: 'plata', intervalo: 'mensual' }
  if (tipo === 'plata_anual') return { planNombre: 'plata', intervalo: 'anual' }
  if (tipo === 'oro_mensual') return { planNombre: 'oro', intervalo: 'mensual' }
  if (tipo === 'oro_anual') return { planNombre: 'oro', intervalo: 'anual' }
  return { planNombre: 'fundador', intervalo: 'mensual' }
}

async function validarCodigoPromo(codigo: string): Promise<{ ok: boolean; diasTrial?: number; error?: string }> {
  const { data, error } = await supabase
    .from('codigos_promo')
    .select('id, activo, usos_actuales, usos_maximos, dias_trial')
    .eq('codigo', codigo)
    .single()

  if (error || !data) return { ok: false, error: 'Código promocional no válido' }
  if (!data.activo) return { ok: false, error: 'Este código ya no está activo' }
  if (data.usos_maximos && data.usos_actuales >= data.usos_maximos) return { ok: false, error: 'Este código ha alcanzado el límite de usos' }

  // No incrementamos aquí — se hace en el webhook cuando Stripe confirma
  return { ok: true, diasTrial: data.dias_trial ?? 30 }
}

export async function POST(req: Request) {
  try {
    // Verificar identidad del usuario desde el token
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !authUser) return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })

    const contentType = req.headers.get('content-type') || ''
    let email: string, tipo: string, codigoPromo: string | undefined, propiedadId: string | undefined, locale: string | undefined

    if (contentType.includes('application/json')) {
      const body = await req.json();
      ;({ email, tipo, codigoPromo, propiedadId, locale } = body)
    } else {
      const form = await req.formData()
      email = form.get('email') as string
      tipo = form.get('tipo') as string
      codigoPromo = form.get('codigoPromo') as string || undefined
      propiedadId = form.get('propiedadId') as string || undefined
    }

    // Siempre usar el userId del token, nunca del body
    const userId = authUser.id

    const tipoNorm = tipo || 'profesional'
    const priceId = PRECIOS[tipoNorm]
    if (!priceId) return NextResponse.json({ error: 'Plan no válido' }, { status: 400 })
    const esDestacado = ['15', '30', '60'].includes(tipoNorm)
    const { planNombre, intervalo } = parseTipo(tipoNorm)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    console.log('[checkout] NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL, '| baseUrl:', baseUrl, '| tipo:', tipoNorm, '| propiedadId:', propiedadId)

    // Validar código promo antes de crear sesión
    let diasTrial = 30
    if (codigoPromo && !esDestacado) {
      const { data: usuarioActual } = await supabase.from('usuarios').select('plan, plan_activo_hasta, telefono').eq('id', userId).single()
      const planesActivos = ['profesional', 'fundador', 'plata', 'oro', 'platino']
      const tieneProActivo = planesActivos.includes(usuarioActual?.plan) && (!usuarioActual?.plan_activo_hasta || new Date(usuarioActual.plan_activo_hasta) > new Date())
      if (tieneProActivo) {
        return NextResponse.json({ error: 'Este código es solo para nuevos usuarios' }, { status: 400 })
      }
      // Comprobar si el mismo teléfono ya usó un código en otra cuenta
      if (usuarioActual?.telefono) {
        const tel = usuarioActual.telefono.replace(/\s/g, '')
        const { data: telefonoUsado } = await supabase.from('usuarios').select('id').neq('id', userId).not('codigo_promo_usado', 'is', null).ilike('telefono', `%${tel.slice(-8)}%`).limit(1)
        if (telefonoUsado && telefonoUsado.length > 0) {
          return NextResponse.json({ error: 'Este código ya fue usado' }, { status: 400 })
        }
      }
      const validacion = await validarCodigoPromo(codigoPromo)
      if (!validacion.ok) {
        return NextResponse.json({ error: validacion.error }, { status: 400 })
      }
      diasTrial = validacion.diasTrial ?? 30
    }

    const stripeLocale = locale === 'fr' ? 'fr' : locale === 'en' ? 'en' : 'es'
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: esDestacado ? 'payment' : 'subscription',
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      locale: stripeLocale as Stripe.Checkout.SessionCreateParams['locale'],
      success_url: `${baseUrl}/panel?pago=ok&session_id={CHECKOUT_SESSION_ID}&tipo=${tipoNorm}`,
      cancel_url: `${baseUrl}/panel?pago=cancelado`,
      metadata: { userId, tipo: tipoNorm, planNombre, intervalo, ...(propiedadId ? { propiedadId } : {}), ...(codigoPromo ? { codigoPromo: codigoPromo.toUpperCase() } : {}) },
    }

    if (codigoPromo && !esDestacado) {
      sessionParams.subscription_data = { trial_period_days: diasTrial }
      sessionParams.custom_text = {
        submit: { message: `No se realizará ningún cargo durante los ${diasTrial} días de prueba. Cancela cuando quieras, sin compromiso.` }
      }
    }

    console.log('[checkout] success_url:', sessionParams.success_url)
    console.log('[checkout] metadata:', JSON.stringify(sessionParams.metadata))
    const session = await stripe.checkout.sessions.create(sessionParams)
    console.log('[checkout] session created:', session.id, 'url:', session.url?.substring(0, 60))

    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(session.url!, 303)
    }
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
