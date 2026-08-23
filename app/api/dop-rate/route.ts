import { NextResponse } from 'next/server'

let cached: { rate: number; ts: number } | null = null
const TTL = 12 * 60 * 60 * 1000 // 12h

async function fetchRate(): Promise<number | null> {
  // Fuente 1: fawazahmed0 CDN (sin límite, gratis)
  try {
    const r = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      { next: { revalidate: 43200 }, signal: AbortSignal.timeout(5000) }
    )
    const d = await r.json()
    const rate = d?.usd?.dop
    if (rate && typeof rate === 'number' && rate > 40 && rate < 200) return rate
  } catch {}

  // Fuente 2: open.er-api (respaldo)
  try {
    const r = await fetch(
      'https://open.er-api.com/v6/latest/USD',
      { next: { revalidate: 43200 }, signal: AbortSignal.timeout(5000) }
    )
    const d = await r.json()
    const rate = d?.rates?.DOP
    if (rate && typeof rate === 'number' && rate > 40 && rate < 200) return rate
  } catch {}

  return null
}

export async function GET() {
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json({ rate: cached.rate }, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  }

  const rate = await fetchRate()
  if (rate) {
    cached = { rate, ts: Date.now() }
    return NextResponse.json({ rate }, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  }

  const fallback = cached?.rate ?? 62.5
  return NextResponse.json({ rate: fallback }, { headers: { 'Cache-Control': 'public, max-age=600' } })
}
