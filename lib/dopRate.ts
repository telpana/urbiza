const FALLBACK = 62.5
const CACHE_KEY = 'hb_dop_rate_v2'
const CACHE_TS_KEY = 'hb_dop_rate_ts_v2'
const TTL = 24 * 60 * 60 * 1000

let _rate = FALLBACK

export async function getDopRate(): Promise<number> {
  if (typeof window === 'undefined') return FALLBACK

  const cached = localStorage.getItem(CACHE_KEY)
  const ts = Number(localStorage.getItem(CACHE_TS_KEY) || 0)

  if (cached && Date.now() - ts < TTL) {
    _rate = Number(cached)
    return _rate
  }

  try {
    const r = await fetch('/api/dop-rate')
    const d = await r.json()
    const rate = d?.rate
    if (rate && typeof rate === 'number') {
      _rate = rate
      localStorage.setItem(CACHE_KEY, String(rate))
      localStorage.setItem(CACHE_TS_KEY, String(Date.now()))
      return rate
    }
  } catch {}

  if (cached) { _rate = Number(cached); return _rate }
  return FALLBACK
}

export function formatDOP(usd: number, rate?: number): string {
  return '≈ RD$ ' + Math.round(usd * (rate ?? _rate)).toLocaleString('es-DO')
}
