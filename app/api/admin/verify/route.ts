import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

export function makeAdminToken() {
  return createHash('sha256')
    .update(process.env.ADMIN_PASSWORD! + 'propiteca-admin-salt')
    .digest('hex')
}

export function verifyToken(req: Request): boolean {
  const auth = req.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '')
  return !!process.env.ADMIN_PASSWORD && token === makeAdminToken()
}

export async function POST(req: Request) {
  if (!verifyToken(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
