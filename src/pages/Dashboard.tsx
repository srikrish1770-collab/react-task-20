import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Icon } from '../components/Icon'
import { Kpi, Page, Skeleton } from '../components/ui'
import { useLoad } from '../hooks/useLoad'
import { useDrivers, useNotices, useShipments, useVehicles } from '../store'
const weekly = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ d, created: [38, 52, 47, 63, 58, 74, 69][i], delivered: [30, 44, 45, 55, 52, 66, 61][i] }))
const tip = { contentStyle: { borderRadius: 12, border: '1px solid #E3E8F0', boxShadow: '0 12px 28px -12px rgba(14,27,44,.25)', fontSize: 12, padding: '8px 12px' }, itemStyle: { padding: 0 }, labelStyle: { fontWeight: 600, marginBottom: 2 } } as const
const colors: Record<string, string> = { Pending: '#94A3B8', Assigned: '#6366F1', 'In Transit': '#0EA5E9', Delivered: '#0F9D8A', Delayed: '#F43F5E' }
export default function Dashboard() {
  const v = useVehicles(), d = useDrivers(), s = useShipments(), n = useNotices()
  useLoad(v.load, v.items.length > 0); useLoad(d.load, d.items.length > 0); useLoad(s.load, s.items.length > 0)
  if (v.loading || s.loading || d.loading || !v.items.length || !s.items.length || !d.items.length) return <Page title="Operations overview"><Skeleton rows={6} /></Page>
  const c = (st: string) => s.items.filter((x) => x.status === st).length
  const busy = v.items.filter((x) => x.status === 'In Transit' || x.status === 'Active').length
  const healthy = v.items.filter((x) => x.status !== 'Maintenance').length
  const split = Object.keys(colors).map((k) => ({ name: k, value: c(k) }))
  const perf = d.items.map((x) => ({ name: x.name.split(' ')[0], rate: x.successRate }))
  return <Page title="Operations overview"><div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-6">
    <Kpi label="Total vehicles" value={v.items.length} icon={<Icon name="truck" />} trend={4} /><Kpi label="Total drivers" value={d.items.length} icon={<Icon name="users" />} trend={2} />
    <Kpi label="Active shipments" value={c('In Transit') + c('Assigned')} icon={<Icon name="box" />} trend={9} /><Kpi label="Delivered" value={c('Delivered')} icon={<Icon name="check" />} trend={12} />
    <Kpi label="Delayed" value={c('Delayed')} icon={<Icon name="alert" />} trend={-6} /><Kpi label="Fleet utilization" value={Math.round(busy / v.items.length * 100)} suffix="%" icon={<Icon name="gauge" />} trend={3} /></div>
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="card min-w-0 p-5 lg:col-span-2"><h2 className="card-title">Shipment trends</h2><div className="mt-4 h-60"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}><defs><linearGradient id="fpCreated" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F5A524" stopOpacity={.2} /><stop offset="100%" stopColor="#F5A524" stopOpacity={0} /></linearGradient><linearGradient id="fpDelivered" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0F9D8A" stopOpacity={.14} /><stop offset="100%" stopColor="#0F9D8A" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#EDF0F5" /><XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={12} tick={{ fill: '#64748B' }} tickMargin={8} /><YAxis tickLine={false} axisLine={false} fontSize={12} width={30} tick={{ fill: '#64748B' }} /><Tooltip {...tip} />
        <Area type="monotone" dataKey="created" stroke="#F5A524" strokeWidth={2.5} fill="url(#fpCreated)" activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} animationDuration={900} /><Area type="monotone" dataKey="delivered" stroke="#0F9D8A" strokeWidth={2.5} fill="url(#fpDelivered)" activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} animationDuration={900} /></AreaChart></ResponsiveContainer></div></section>
      <section className="card min-w-0 p-5"><h2 className="card-title">Delivery status</h2><div className="mt-2 h-44"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={split} dataKey="value" innerRadius={46} outerRadius={72} paddingAngle={3} cornerRadius={4} stroke="none">{split.map((x) => <Cell key={x.name} fill={colors[x.name]} />)}</Pie><Tooltip {...tip} /></PieChart></ResponsiveContainer></div>
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px] text-slate-600">{split.map((x) => <li key={x.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[x.name] }} />{x.name} {x.value}</li>)}</ul></section></div>
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="card min-w-0 p-5"><h2 className="card-title">Driver success rate (%)</h2><div className="mt-4 h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={perf}><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} interval={0} tick={{ fill: '#64748B' }} tickMargin={8} /><YAxis domain={[80, 100]} hide /><Tooltip {...tip} cursor={{ fill: '#F1F5F9' }} /><Bar dataKey="rate" fill="#16283F" radius={[6, 6, 0, 0]} maxBarSize={30} animationDuration={900} /></BarChart></ResponsiveContainer></div></section>
      <section className="card p-5"><h2 className="card-title">Fleet health</h2><p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">{Math.round(healthy / v.items.length * 100)}%</p><p className="text-sm text-slate-500">{healthy} of {v.items.length} vehicles are road-ready</p>
        <div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-teal transition-all duration-700" style={{ width: `${healthy / v.items.length * 100}%` }} /></div>
        <h3 className="mt-6 text-sm font-semibold">Critical alerts</h3><ul className="mt-2 space-y-2 text-sm">{s.items.filter((x) => x.status === 'Delayed').slice(0, 2).map((x) => <li key={x.id} className="rounded-lg border-l-[3px] border-rose-400 bg-rose-50 px-3 py-2 text-rose-900"><b>{x.id}</b> to {x.delivery} is delayed.</li>)}</ul></section>
      <section className="card p-5"><h2 className="card-title">Recent activity</h2><ol className="mt-4 space-y-4 border-l border-slate-200 pl-5">{n.items.slice(0, 5).map((x) => <li key={x.id} className="relative text-sm"><span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber ring-4 ring-white" />{x.text}<span className="block text-xs text-slate-500">{x.time}</span></li>)}</ol></section></div></Page>
}
