import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const OPEN = false

export function middleware(request: NextRequest) {
  if (OPEN) return NextResponse.next()
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/proximamente') || pathname.startsWith('/panel') || pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/proximamente', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
