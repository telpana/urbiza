import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

function makeToken() {
  return createHash('sha256')
    .update(process.env.ADMIN_PASSWORD! + 'propiteca-admin-salt')
    .digest('hex')
}

export async function POST(req: Request) {
  const { password } = await req.json()
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD no configurado en .env.local' }, { status: 500 })
  }
  if (password.trim() !== process.env.ADMIN_PASSWORD.trim()) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }
  return NextResponse.json({ token: makeToken() })
}
