import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Empty, ErrorState, Skeleton } from './ui'
export interface Col<T> { key: string; label: string; render: (r: T) => ReactNode; sort?: (a: T, b: T) => number }
interface Props<T extends { id: string }> { rows: T[]; cols: Col<T>[]; loading: boolean; error: string | null; onRetry: () => void; onRowClick?: (r: T) => void; pageSize?: number }
export function DataTable<T extends { id: string }>({ rows, cols, loading, error, onRetry, onRowClick, pageSize = 7 }: Props<T>) {
  const [page, setPage] = useState(0); const [sort, setSort] = useState<{ k: string; dir: 1 | -1 } | null>(null)
  useEffect(() => setPage(0), [rows.length])
  if (loading) return <div className="card"><Skeleton /></div>
  if (error) return <div className="card"><ErrorState message={error} onRetry={onRetry} /></div>
  if (!rows.length) return <div className="card"><Empty title="Nothing matches" hint="Clear the search or filters to see all records." /></div>
  const c = cols.find((x) => x.key === sort?.k)
  const cmp = c?.sort
  const sorted = cmp && sort ? [...rows].sort((a, b) => cmp(a, b) * sort.dir) : rows
  const pages = Math.ceil(sorted.length / pageSize), view = sorted.slice(page * pageSize, page * pageSize + pageSize)
  return <div className="card overflow-hidden"><div className="scroll-shadow overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
    <thead className="border-b border-line bg-slate-50/80 text-[13px] text-slate-500"><tr>{cols.map((x) => <th key={x.key} className="whitespace-nowrap px-5 py-3 font-medium">
      {x.sort ? <button onClick={() => setSort({ k: x.key, dir: sort?.k === x.key && sort.dir === 1 ? -1 : 1 })} className={`-mx-1.5 rounded-md px-1.5 py-0.5 transition-colors hover:bg-slate-200/70 hover:text-ink ${sort?.k === x.key ? 'text-ink' : ''}`}>{x.label} {sort?.k === x.key ? (sort.dir === 1 ? '↑' : '↓') : ''}</button> : x.label}</th>)}</tr></thead>
    <tbody className="divide-y divide-slate-100">{view.map((r, i) => <motion.tr key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25, delay: i * .03 }} onClick={() => onRowClick?.(r)} className="cursor-pointer text-slate-700 transition-colors hover:bg-slate-50">{cols.map((x) => <td key={x.key} className="whitespace-nowrap px-5 py-3.5 first:text-ink">{x.render(r)}</td>)}</motion.tr>)}</tbody></table></div>
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-slate-50/50 px-5 py-3 text-[13px] text-slate-500"><span>{sorted.length} records</span>
      <div className="flex items-center gap-3"><button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn btn-outline btn-sm">Prev</button><span className="tabular-nums">{page + 1}/{pages}</span><button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)} className="btn btn-outline btn-sm">Next</button></div></div></div>
}
