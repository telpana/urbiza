import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const OPEN = true

export function middleware(request: NextRequest) {
  if (OPEN) return NextResponse.next()
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/proximamente') || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/proximamente', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
