import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { Empty, ErrorState, Page, Skeleton } from '../components/ui'
import { useLoad } from '../hooks/useLoad'
import { useNotices } from '../store'
const kind: Record<string, { icon: string; chip: string }> = {
  'Shipment Delayed': { icon: 'alert', chip: 'bg-rose-50 text-rose-600' }, 'Maintenance Due': { icon: 'gauge', chip: 'bg-amber-soft text-amber-700' }, 'Driver Offline': { icon: 'users', chip: 'bg-slate-100 text-slate-600' },
  'Delivery Completed': { icon: 'check', chip: 'bg-emerald-50 text-emerald-600' }, 'New Assignment': { icon: 'box', chip: 'bg-sky-50 text-sky-600' } }
export default function Notifications() {
  const { items, loading, error, load, patch } = useNotices(); useLoad(load, items.length > 0); const [f, setF] = useState<'all' | 'unread'>('all')
  const rows = items.filter((n) => f === 'all' || !n.read)
  const markAll = () => items.filter((n) => !n.read).forEach((n) => void patch(n.id, { read: true }))
  return <Page title="Notifications" action={<div className="flex flex-wrap items-center gap-2"><button onClick={markAll} className="btn btn-outline">Mark all as read</button><div className="flex gap-1 rounded-2xl border border-line bg-white p-1 shadow-card">{(['all', 'unread'] as const).map((k) => <button key={k} onClick={() => setF(k)} className={`btn h-9 rounded-xl px-4 font-medium ${f === k ? 'btn-seg-on' : 'btn-seg'}`}>{k === 'all' ? 'All' : 'Unread'}</button>)}</div></div>}>
    <div className="card divide-y divide-slate-100 overflow-hidden">{loading ? <Skeleton /> : error ? <ErrorState message={error} onRetry={() => void load()} /> : !rows.length ? <Empty title="You're all caught up" hint="New alerts will show up here." /> :
      rows.map((n, i) => { const k = kind[n.type] ?? kind['New Assignment']; return <motion.button key={n.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .25, delay: i * .05 }} onClick={() => void patch(n.id, { read: true })} className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 ${n.read ? '' : 'bg-amber-soft/40 hover:bg-amber-soft/70'}`}><span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${k.chip}`}><Icon name={k.icon} /></span>
        <span className="min-w-0 flex-1"><b className="block text-sm font-semibold">{n.type}</b><span className="text-sm text-slate-600">{n.text}</span><span className="block pt-0.5 text-xs text-slate-500">{n.time}</span></span><span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? 'bg-slate-300' : 'bg-amber'}`} /></motion.button> })}</div></Page>
}
