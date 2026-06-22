import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyToken } from '../verify/route'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' })

export async function GET(req: Request) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const now = new Date()
  const startOfMonth = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000)
  const mesNombre = now.toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })

  // Suscripciones: facturas pagadas este mes
  const [invoiceList, sessionList] = await Promise.all([
    stripe.invoices.list({ status: 'paid', created: { gte: startOfMonth }, limit: 100 }),
    stripe.checkout.sessions.list({ created: { gte: startOfMonth }, limit: 100 }),
  ])

  const subsRevenue = invoiceList.data.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0) / 100

  // Destacados: checkout sessions pagadas con tipo 15/30/60
  const destacSessions = sessionList.data.filter(s =>
    s.payment_status === 'paid' &&
    ['15', '30', '60'].includes(s.metadata?.tipo || '')
  )
  const destacRevenue = destacSessions.reduce((sum, s) => sum + (s.amount_total || 0), 0) / 100

  const totalRevenue = subsRevenue + destacRevenue

  return NextResponse.json({ subsRevenue, destacRevenue, totalRevenue, mesNombre, subsCount: invoiceList.data.length, destacCount: destacSessions.length })
}
