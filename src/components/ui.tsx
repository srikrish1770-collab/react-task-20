import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'
const tone: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20', 'In Transit': 'bg-sky-50 text-sky-800 ring-sky-600/20', Maintenance: 'bg-amber-soft text-amber-900 ring-amber-600/25', Idle: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  Pending: 'bg-slate-100 text-slate-700 ring-slate-500/20', Assigned: 'bg-indigo-50 text-indigo-800 ring-indigo-600/20', Delivered: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20', Delayed: 'bg-rose-50 text-rose-800 ring-rose-600/20' }
const dot: Record<string, string> = {
  Active: 'bg-emerald-500', 'In Transit': 'bg-sky-500', Maintenance: 'bg-amber', Idle: 'bg-slate-400',
  Pending: 'bg-slate-400', Assigned: 'bg-indigo-500', Delivered: 'bg-emerald-500', Delayed: 'bg-rose-500' }
export const Badge = ({ label }: { label: string }) => <motion.span initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .25 }} className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tone[label] ?? 'bg-slate-100 text-slate-700 ring-slate-500/20'}`}><span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dot[label] ?? 'bg-slate-400'}`} />{label}</motion.span>
export function Stat({ label, value, suffix = '', accent = false }: { label: string; value: number; suffix?: string; accent?: boolean }) {
  const n = useCountUp(value)
  return <div className={`card p-5 ${accent ? 'ring-2 ring-amber' : ''}`}><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">{n}{suffix}</p></div>
}
export const Skeleton = ({ rows = 5 }: { rows?: number }) => <div className="space-y-3 p-5" aria-busy>{Array.from({ length: rows }, (_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />)}</div>
export const Empty = ({ title, hint }: { title: string; hint: string }) => <div className="px-6 py-14 text-center"><p className="font-semibold">{title}</p><p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">{hint}</p></div>
export const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => <div className="px-6 py-14 text-center"><p className="font-semibold text-rose-700">Something went wrong</p><p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{message}</p><button onClick={onRetry} className="btn btn-dark btn-sm mt-5">Retry</button></div>
export const Page = ({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) => <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-[26px] font-semibold leading-tight md:text-[28px]">{title}</h1>{action}</div>{children}</div>
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 !m-0 grid place-items-center bg-ink/45 p-4 backdrop-blur-[2px]" onClick={onClose}>
    <motion.div initial={{ scale: .97, y: 12 }} animate={{ scale: 1, y: 0 }} role="dialog" aria-label={title} className="card max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>{children}</motion.div></motion.div>
}
export function Kpi({ label, value, suffix = '', icon, trend }: { label: string; value: number; suffix?: string; icon: ReactNode; trend: number }) {
  const n = useCountUp(value); const up = trend >= 0
  return <div className="card p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-soft text-amber-800">{icon}</span>
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{up ? '▲' : '▼'} {Math.abs(trend)}%</span></div><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-0.5 text-3xl font-semibold tabular-nums tracking-tight">{n}{suffix}</p></div>
}
const hues = ['bg-indigo-500', 'bg-teal', 'bg-rose-500', 'bg-sky-500', 'bg-amber', 'bg-violet-500']
export const Avatar = ({ name, size = 'h-9 w-9' }: { name: string; size?: string }) => { const h = hues[name.length % hues.length]; return <span aria-hidden className={`grid ${size} shrink-0 place-items-center rounded-full text-xs font-semibold ring-2 ring-white ${h} ${h === 'bg-amber' ? 'text-ink' : 'text-white'}`}>{name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span> }
export const Stars = ({ value }: { value: number }) => <span className="whitespace-nowrap" aria-label={`Rating ${value.toFixed(1)} out of 5`}><span className="text-amber">{'★'.repeat(Math.round(value))}</span><span className="text-slate-300">{'★'.repeat(5 - Math.round(value))}</span> <span className="text-xs text-slate-500">{value.toFixed(1)}</span></span>
