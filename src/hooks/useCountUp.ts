import { useEffect, useState } from 'react'
export function useCountUp(target: number, ms = 1200) {
  const [v, setV] = useState(0)
  useEffect(() => { let raf = 0; const t0 = performance.now()
    const tick = (t: number) => { const p = Math.min((t - t0) / ms, 1); setV(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf) }, [target, ms])
  return v
}
