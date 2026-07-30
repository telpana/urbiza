import { NextResponse } from 'next/server'

let cached: { rate: number; ts: number } | null = null
const TTL = 24 * 60 * 60 * 1000

export async function GET() {
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json({ rate: cached.rate }, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  }

  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 86400 } })
    const d = await r.json()
    const rate = d?.rates?.DOP
    if (rate && typeof rate === 'number') {
      cached = { rate, ts: Date.now() }
      return NextResponse.json({ rate }, { headers: { 'Cache-Control': 'public, max-age=3600' } })
    }
  } catch {}

  const fallback = cached?.rate ?? 62.5
  return NextResponse.json({ rate: fallback }, { headers: { 'Cache-Control': 'public, max-age=600' } })
}
