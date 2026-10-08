import { useEffect, useState } from 'react'
import { Avatar, Page } from '../components/ui'
interface Trip { id: string; driver: string; vehicle: string; from: string; to: string; path: string; a: [number, number]; b: [number, number]; total: number; km: number; speed: number; dur: number }
const trips: Trip[] = [
  { id: 'SHP-2402', driver: 'Rahul Verma', vehicle: 'TN 39 A1074', from: 'Chennai', to: 'Bengaluru', path: 'M80,360 C200,300 220,180 360,200 S560,300 700,90', a: [80, 360], b: [700, 90], total: 320, km: 346, speed: 62, dur: 18 },
  { id: 'SHP-2405', driver: 'Priya Nair', vehicle: 'TN 39 B1037', from: 'Kochi', to: 'Madurai', path: 'M120,90 C260,120 300,260 450,280 S650,380 720,330', a: [120, 90], b: [720, 330], total: 260, km: 271, speed: 58, dur: 22 },
  { id: 'SHP-2409', driver: 'Meera Iyer', vehicle: 'TN 39 C1111', from: 'Pune', to: 'Mumbai', path: 'M60,200 C180,230 300,120 420,140 S620,170 740,230', a: [60, 200], b: [740, 230], total: 210, km: 149, speed: 66, dur: 26 }]
export default function Tracking() {
  const [sel, setSel] = useState(0); const [zoom, setZoom] = useState(1); const [eta, setEta] = useState([200, 150, 95])
  useEffect(() => { const t = setInterval(() => setEta((e) => e.map((m) => Math.max(1, m - 1))), 3000); return () => clearInterval(t) }, [])
  const t = trips[sel]; const pct = Math.round((1 - eta[sel] / t.total) * 100)
  return <Page title="Live tracking" action={<span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" /><span className="relative h-2 w-2 rounded-full bg-emerald-600" /></span>Live · simulated</span>}>
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="card relative flex flex-col overflow-hidden lg:col-span-2"><svg viewBox="0 0 800 450" className="block h-auto w-full flex-1 bg-gradient-to-br from-ink to-road" role="img" aria-label="Simulated live map of three active routes">
        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff12" /></pattern>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <rect width="800" height="450" fill="url(#grid)" />
        <g style={{ transform: `scale(${zoom})`, transformOrigin: '400px 225px', transition: 'transform .3s ease' }}>
          {trips.map((r, i) => <g key={r.id} opacity={i === sel ? 1 : .35} style={{ transition: 'opacity .3s' }}>
            <path d={r.path} fill="none" stroke="#F5A52433" strokeWidth="10" strokeLinecap="round" />
            <path d={r.path} fill="none" stroke="#F5A524" strokeWidth="3" strokeDasharray="8 10"><animate attributeName="stroke-dashoffset" from="36" to="0" dur="1.2s" repeatCount="indefinite" /></path>
            <circle cx={r.a[0]} cy={r.a[1]} r="8" fill="#0F9D8A" filter="url(#glow)" /><circle cx={r.b[0]} cy={r.b[1]} r="8" fill="#F43F5E" filter="url(#glow)" />
            <circle cx={r.b[0]} cy={r.b[1]} r="8" fill="none" stroke="#F43F5E"><animate attributeName="r" values="8;22" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values=".8;0" dur="2s" repeatCount="indefinite" /></circle>
            <text x={r.a[0] + 12} y={r.a[1] + 20} fill="#fff" fontSize="13">{r.from}</text><text x={r.b[0] - 12} y={r.b[1] - 14} fill="#fff" fontSize="13" textAnchor="end">{r.to}</text>
            <g filter="url(#glow)"><circle r="11" fill="#fff" /><circle r="5" fill="#F5A524" /><animateMotion dur={`${r.dur}s`} repeatCount="indefinite" path={r.path} /></g></g>)}</g></svg>
        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-xl bg-white shadow-pop ring-1 ring-ink/5">
          <button aria-label="Zoom in" disabled={zoom >= 1.6} onClick={() => setZoom((z) => Math.min(1.6, +(z + .3).toFixed(1)))} className="h-11 w-11 text-lg text-ink transition-colors hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent">+</button>
          <button aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom((z) => Math.max(1, +(z - .3).toFixed(1)))} className="h-11 w-11 border-t border-slate-200 text-lg text-ink transition-colors hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent">−</button></div></div>
      <aside className="space-y-4">
        <div className="card space-y-1 p-2" role="tablist" aria-label="Vehicles">{trips.map((r, i) => <button key={r.id} role="tab" aria-selected={i === sel} onClick={() => setSel(i)} className={`flex h-14 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors ${i === sel ? 'bg-amber-soft ring-1 ring-inset ring-amber/40' : 'hover:bg-slate-50'}`}><Avatar name={r.driver} /><span className="min-w-0 flex-1"><b className="block truncate">{r.vehicle}</b><span className="text-xs text-slate-500">{r.from} → {r.to}</span></span><span className="text-xs font-medium tabular-nums text-slate-600">{eta[i]}m</span></button>)}</div>
        <div className="card space-y-5 p-5"><div className="flex items-center gap-3"><Avatar name={t.driver} size="h-11 w-11" /><div><p className="font-semibold">{t.driver}</p><p className="text-sm text-slate-500">{t.vehicle} · {t.id}</p></div></div>
          <div><p className="text-sm text-slate-500">Estimated arrival</p><p className="mt-0.5 text-3xl font-semibold tabular-nums tracking-tight">{Math.floor(eta[sel] / 60)} h {eta[sel] % 60} min</p></div>
          <div><div className="mb-1 flex justify-between text-xs text-slate-500"><span>Delivery progress</span><span>{pct}%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-amber transition-all duration-500" style={{ width: `${pct}%` }} /></div></div>
          <dl className="grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm"><div><dt className="text-slate-500">Distance</dt><dd className="mt-0.5 font-semibold tabular-nums">{t.km} km</dd></div><div><dt className="text-slate-500">Speed</dt><dd className="mt-0.5 font-semibold tabular-nums">{t.speed} km/h</dd></div></dl></div></aside></div></Page>
}
