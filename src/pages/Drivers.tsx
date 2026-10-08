import { useState } from 'react'
import { DataTable, type Col } from '../components/DataTable'
import { Avatar, Badge, Modal, Page, Stars } from '../components/ui'
import { useLoad } from '../hooks/useLoad'
import { useDrivers } from '../store'
import type { Driver } from '../types'
const cols: Col<Driver>[] = [{ key: 'name', label: 'Driver', render: (r) => <span className="flex items-center gap-3"><Avatar name={r.name} /><b>{r.name}</b></span>, sort: (a, b) => a.name.localeCompare(b.name) }, { key: 'vehicle', label: 'Vehicle', render: (r) => r.vehicle },
  { key: 'rating', label: 'Rating', render: (r) => <Stars value={r.rating} />, sort: (a, b) => a.rating - b.rating }, { key: 'av', label: 'Availability', render: (r) => <Badge label={r.available ? 'Active' : 'Idle'} /> }]
export default function Drivers() {
  const { items, loading, error, load } = useDrivers(); useLoad(load, items.length > 0); const [sel, setSel] = useState<Driver | null>(null)
  return <Page title="Drivers"><DataTable rows={items} cols={cols} loading={loading} error={error} onRetry={() => void load()} onRowClick={setSel} />
    <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.name ?? ''}>{sel && <div className="space-y-1.5 text-sm text-slate-600"><p>{sel.phone} · {sel.email}</p><p>License {sel.license} · {sel.experience} yrs experience</p><p>{sel.deliveries} deliveries · {sel.successRate}% success · rating {sel.rating.toFixed(1)}</p></div>}</Modal></Page>
}
