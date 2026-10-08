import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DataTable, type Col } from '../components/DataTable'
import { Drawer } from '../components/Drawer'
import { Badge, Modal, Page } from '../components/ui'
import { useLoad } from '../hooks/useLoad'
import { useDrivers, useShipments } from '../store'
import { useToast } from '../store/ui'
import type { Shipment, ShipmentStatus } from '../types'
const cols: Col<Shipment>[] = [{ key: 'id', label: 'Shipment', render: (r) => <b>{r.id}</b>, sort: (a, b) => a.id.localeCompare(b.id) }, { key: 'c', label: 'Customer', render: (r) => r.customer },
  { key: 'r', label: 'Route', render: (r) => `${r.pickup} → ${r.delivery}` }, { key: 'd', label: 'Driver', render: (r) => r.driver }, { key: 'e', label: 'ETA', render: (r) => r.eta, sort: (a, b) => a.eta.localeCompare(b.eta) }, { key: 's', label: 'Status', render: (r) => <Badge label={r.status} /> }]
const steps: ShipmentStatus[] = ['Pending', 'Assigned', 'In Transit', 'Delivered']
function Timeline({ status }: { status: ShipmentStatus }) {
  const i = status === 'Delayed' ? 2 : steps.indexOf(status)
  return <div className="rounded-xl bg-slate-50 p-4"><div className="h-2 rounded-full bg-slate-200"><motion.div initial={{ width: 0 }} animate={{ width: `${i / 3 * 100}%` }} transition={{ duration: .6 }} className={`h-2 rounded-full ${status === 'Delayed' ? 'bg-rose-500' : 'bg-teal'}`} /></div>
    <ol className="mt-3 grid grid-cols-4 text-center text-xs">{steps.map((s, k) => <li key={s} className={k <= i ? 'font-semibold text-ink' : 'text-slate-500'}>{s}</li>)}</ol>{status === 'Delayed' && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">This shipment is running late. Contact the driver for a new ETA.</p>}</div>
}
export default function Shipments() {
  const { items, loading, error, load, add } = useShipments(); useLoad(load, items.length > 0)
  const drv = useDrivers(); useLoad(drv.load, drv.items.length > 0); const toast = useToast((t) => t.show)
  const [sp] = useSearchParams(); const [q, setQ] = useState(sp.get('q') ?? ''); const [st, setSt] = useState(''); const [open, setOpen] = useState(false); const [sel, setSel] = useState<Shipment | null>(null); const [errs, setErrs] = useState<string[]>([])
  const rows = useMemo(() => items.filter((s) => (!st || s.status === st) && `${s.id} ${s.driver} ${s.vehicle}`.toLowerCase().includes(q.toLowerCase())), [items, q, st])
  const submit = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const f = new FormData(e.currentTarget); const g = (k: string) => String(f.get(k) ?? '').trim()
    const bad: string[] = []; if (g('customer').length < 2) bad.push('Enter the customer name.'); if (!g('pickup') || !g('delivery')) bad.push('Enter pickup and delivery locations.'); else if (g('pickup').toLowerCase() === g('delivery').toLowerCase()) bad.push('Pickup and delivery must be different.'); if (!g('eta')) bad.push('Choose an ETA.')
    setErrs(bad); if (bad.length) return
    const dr = drv.items.find((x) => x.id === g('driver'))
    try { await add({ customer: g('customer'), pickup: g('pickup'), delivery: g('delivery'), driver: dr?.name ?? 'Unassigned', vehicle: dr?.vehicle ?? '-', eta: g('eta').replace('T', ' '), status: dr ? 'Assigned' : 'Pending' }); setOpen(false); toast('Shipment created') } catch { setErrs(['Could not create the shipment. Try again.']) } }
  const inp = 'field'
  return <Page title="Shipments" action={<button onClick={() => { setErrs([]); setOpen(true) }} className="btn btn-primary">Create shipment</button>}>
    <div className="flex flex-col gap-3 sm:flex-row"><input name="search" autoComplete="off" aria-label="Search shipments" placeholder="Search shipment ID, driver or vehicle" value={q} onChange={(e) => setQ(e.target.value)} className={inp} />
      <select name="status" aria-label="Filter by status" value={st} onChange={(e) => setSt(e.target.value)} className={`${inp} sm:w-48`}><option value="">All statuses</option>{[...steps, 'Delayed'].map((s) => <option key={s}>{s}</option>)}</select></div>
    <DataTable rows={rows} cols={cols} loading={loading} error={error} onRetry={() => void load()} onRowClick={setSel} />
    <Modal open={open} onClose={() => setOpen(false)} title="Create shipment"><form onSubmit={(e) => void submit(e)} noValidate className="space-y-3">
      <input name="customer" autoComplete="off" aria-label="Customer name" placeholder="Customer name" className={inp} /><input name="pickup" autoComplete="off" aria-label="Pickup location" placeholder="Pickup location" className={inp} /><input name="delivery" autoComplete="off" aria-label="Delivery location" placeholder="Delivery location" className={inp} />
      <select name="driver" aria-label="Driver" className={inp}><option value="">Assign later</option>{drv.items.filter((x) => x.available).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select><input name="eta" type="datetime-local" aria-label="ETA" className={inp} />
      {errs.length > 0 && <ul role="alert" className="space-y-1 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{errs.map((x) => <li key={x}>{x}</li>)}</ul>}<button className="btn btn-dark w-full">Create shipment</button></form></Modal>
    <Drawer open={!!sel} onClose={() => setSel(null)} title={sel?.id ?? 'Shipment'}>{sel && <div className="space-y-5 text-sm"><Timeline status={sel.status} /><div className="space-y-5 border-t border-line pt-5">
      <div><p className="text-xs font-medium text-slate-500">Route</p><p className="mt-0.5 text-[15px] font-semibold">{sel.pickup} → {sel.delivery}</p></div><div><p className="text-xs font-medium text-slate-500">Customer</p><p className="mt-0.5 text-[15px] font-semibold">{sel.customer}</p></div>
      <div><p className="text-xs font-medium text-slate-500">Driver and vehicle</p><p className="mt-0.5 text-[15px] font-semibold">{sel.driver} · {sel.vehicle}</p></div><div><p className="text-xs font-medium text-slate-500">ETA</p><p className="mt-0.5 text-[15px] font-semibold">{sel.eta}</p></div></div></div>}</Drawer></Page>
}
