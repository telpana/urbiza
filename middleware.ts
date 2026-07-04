import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const OPEN = true
const PREVIEW_SECRET = process.env.PREVIEW_SECRET || 'habitade2025preview'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/favicon.ico') {
    return NextResponse.redirect(new URL('/icon', request.url), { status: 302 })
  }

  if (OPEN) {
    // Cuando abierto: bloquear indexación de panel/admin
    if (pathname.startsWith('/panel') || pathname.startsWith('/admin')) {
      const res = NextResponse.next()
      res.headers.set('X-Robots-Tag', 'noindex, nofollow')
      return res
    }
    return NextResponse.next()
  }

  // --- MODO CERRADO ---

  // Bypass con cookie de preview (para que tú puedas ver el sitio)
  const preview = request.cookies.get('habitade_preview')?.value
  if (preview === PREVIEW_SECRET) return NextResponse.next()

  // Activar preview visitando /preview?key=SECRET → redirige a / con cookie
  if (pathname === '/preview') {
    const key = request.nextUrl.searchParams.get('key')
    if (key === PREVIEW_SECRET) {
      const res = NextResponse.redirect(new URL('/', request.url))
      res.cookies.set('habitade_preview', PREVIEW_SECRET, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        path: '/',
      })
      return res
    }
  }

  // Siempre permitir: assets y página de protección
  if (
    pathname.startsWith('/proximamente') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Panel y admin: requieren login de Supabase, no necesitan más protección
  if (pathname.startsWith('/panel') || pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // API: solo permitir auth, webhooks y admin
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/webhook') || pathname.startsWith('/api/admin')) {
    return NextResponse.next()
  }

  // Todo lo demás (web pública, API de datos, sitemap) → protección
  const res = NextResponse.redirect(new URL('/proximamente', request.url))
  res.headers.set('X-Robots-Tag', 'noindex')
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
