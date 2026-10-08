import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTable, type Col } from '../components/DataTable'
import { Badge, Modal, Page } from '../components/ui'
import { useLoad } from '../hooks/useLoad'
import { useVehicles } from '../store'
import type { Vehicle, VehicleStatus } from '../types'
const cols: Col<Vehicle>[] = [
  { key: 'number', label: 'Vehicle', render: (r) => <b>{r.number}</b>, sort: (a, b) => a.number.localeCompare(b.number) },
  { key: 'type', label: 'Type', render: (r) => r.type }, { key: 'driver', label: 'Driver', render: (r) => r.driver },
  { key: 'fuel', label: 'Fuel', render: (r) => `${r.fuel}%`, sort: (a, b) => a.fuel - b.fuel }, { key: 'location', label: 'Location', render: (r) => r.location },
  { key: 'status', label: 'Status', render: (r) => <Badge label={r.status} /> }]
export default function Vehicles() {
  const { items, loading, error, load, add, remove } = useVehicles(); useLoad(load, items.length > 0)
  const [sp] = useSearchParams(); const [q, setQ] = useState(sp.get('q') ?? ''); const [st, setSt] = useState(''); const [open, setOpen] = useState(false); const [sel, setSel] = useState<Vehicle | null>(null); const [err, setErr] = useState('')
  const rows = useMemo(() => items.filter((v) => (!st || v.status === st) && `${v.number} ${v.driver}`.toLowerCase().includes(q.toLowerCase())), [items, q, st])
  const submit = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const f = new FormData(e.currentTarget); const number = String(f.get('number')).trim()
    if (number.length < 4) { setErr('Enter a vehicle number with at least 4 characters.'); return }
    await add({ number, type: String(f.get('type')), capacity: '5 t', driver: 'Unassigned', fuel: 100, maintenance: '2026-12-01', location: 'Depot', status: 'Idle' as VehicleStatus }); setErr(''); setOpen(false) }
  const inp = 'field'
  return <Page title="Vehicles" action={<button onClick={() => setOpen(true)} className="btn btn-primary">Add vehicle</button>}>
    <div className="flex flex-col gap-3 sm:flex-row"><input name="search" autoComplete="off" aria-label="Search vehicles" placeholder="Search by number or driver" value={q} onChange={(e) => setQ(e.target.value)} className={inp} />
      <select name="status" aria-label="Filter by status" value={st} onChange={(e) => setSt(e.target.value)} className={`${inp} sm:w-48`}><option value="">All statuses</option>{['Active', 'In Transit', 'Maintenance', 'Idle'].map((s) => <option key={s}>{s}</option>)}</select></div>
    <DataTable rows={rows} cols={cols} loading={loading} error={error} onRetry={() => void load()} onRowClick={setSel} />
    <Modal open={open} onClose={() => setOpen(false)} title="Add vehicle"><form onSubmit={(e) => void submit(e)} className="space-y-3" noValidate>
      <input name="number" aria-label="Vehicle number" placeholder="e.g. TN 39 AB 1234" className={inp} /><select name="type" aria-label="Vehicle type" className={inp}><option>Truck</option><option>Van</option><option>Trailer</option></select>
      {err && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</p>}<button className="btn btn-dark w-full">Save vehicle</button></form></Modal>
    <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.number ?? ''}>{sel && <div className="space-y-1.5 text-sm text-slate-600"><p>Type: {sel.type} · Capacity: {sel.capacity}</p><p>Driver: {sel.driver}</p><p>Fuel: {sel.fuel}% · Next service: {sel.maintenance}</p><p>Location: {sel.location}</p>
      <button onClick={() => { void remove(sel.id); setSel(null) }} className="btn btn-danger mt-4 w-full">Delete vehicle</button></div>}</Modal></Page>
}
