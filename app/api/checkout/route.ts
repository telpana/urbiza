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
  'profesional': 'price_1TjQ7N2W2OvWvCK3IFRRmZBY',
  '15': 'price_1TjIsm2W2OvWvCK3yycPzPR6',
  '30': 'price_1TneNr2W2OvWvCK3ugqrKOOy',
  '60': 'price_1TnePQ2W2OvWvCK350Z9Z8MQ',
}

async function validarCodigoPromo(codigo: string): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase
    .from('codigos_promo')
    .select('id, activo, usos_actuales, usos_maximos')
    .eq('codigo', codigo)
    .single()

  if (error || !data) return { ok: false, error: 'Código promocional no válido' }
  if (!data.activo) return { ok: false, error: 'Este código ya no está activo' }
  if (data.usos_maximos && data.usos_actuales >= data.usos_maximos) return { ok: false, error: 'Este código ha alcanzado el límite de usos' }

  await supabase.from('codigos_promo').update({ usos_actuales: data.usos_actuales + 1 }).eq('id', data.id)
  return { ok: true }
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

    const priceId = PRECIOS[tipo || 'profesional']
    const esDestacado = ['15', '30', '60'].includes(tipo)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Validar código promo antes de crear sesión
    if (codigoPromo && !esDestacado) {
      const validacion = await validarCodigoPromo(codigoPromo)
      if (!validacion.ok) {
        return NextResponse.json({ error: validacion.error }, { status: 400 })
      }
    }

    const stripeLocale = locale === 'fr' ? 'fr' : locale === 'en' ? 'en' : 'es'
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: esDestacado ? 'payment' : 'subscription',
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      locale: stripeLocale as Stripe.Checkout.SessionCreateParams['locale'],
      success_url: `${baseUrl}/panel?pago=ok&session_id={CHECKOUT_SESSION_ID}&tipo=${tipo || 'profesional'}`,
      cancel_url: `${baseUrl}/panel?pago=cancelado`,
      metadata: { userId, tipo, ...(propiedadId ? { propiedadId } : {}) },
    }

    if (codigoPromo && !esDestacado) {
      sessionParams.subscription_data = { trial_period_days: 30 }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(session.url!, 303)
    }
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
