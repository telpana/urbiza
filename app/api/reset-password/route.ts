import { createClient } from '@supabase/supabase-js'
import { emailResetPassword } from '../../../lib/emails'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return Response.json({ ok: false, error: 'Email requerido' }, { status: 400 })
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.habitade.com'
    const redirectTo = `${origin}/reset-password`

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase().trim(),
      options: { redirectTo }
    })

    if (error || !data?.properties?.action_link) {
      console.error('[reset-password] generateLink error:', error)
      return Response.json({ ok: false, error: error?.message ?? 'No se pudo generar el link' }, { status: 500 })
    }

    await emailResetPassword(email, data.properties.action_link)

    return Response.json({ ok: true })
  } catch (e: any) {
    console.error('[reset-password] unexpected error:', e)
    return Response.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
