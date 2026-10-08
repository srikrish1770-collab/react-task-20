import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNotices } from '../store'
import { useToast } from '../store/ui'
import { Icon } from '../components/Icon'
import CommandPalette from '../components/CommandPalette'
const nav = [['/', 'Dashboard', 'grid'], ['/vehicles', 'Vehicles', 'truck'], ['/drivers', 'Drivers', 'users'], ['/shipments', 'Shipments', 'box'], ['/tracking', 'Live tracking', 'pin'], ['/notifications', 'Notifications', 'bell']]
export default function AppLayout() {
  const [open, setOpen] = useState(false); const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1280); const [cmd, setCmd] = useState(false)
  const loc = useLocation(); const toast = useToast((s) => s.msg)
  const { items, load } = useNotices(); const unread = items.filter((n) => !n.read).length
  useEffect(() => { void load() }, [load]); useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => { const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd((c) => !c) } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [])
  const lbl = collapsed ? 'lg:hidden' : ''
  return <div className="min-h-screen lg:flex">
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-ink px-4 py-3 text-white lg:hidden"><button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 transition-colors hover:bg-white/15"><Icon name="menu" size={20} /></button>
      <span className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-amber text-ink"><Icon name="truck" size={16} /></span><b className="text-[15px] tracking-tight">FleetPulse</b></span>
      <button aria-label="Search" onClick={() => setCmd(true)} className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 transition-colors hover:bg-white/15"><Icon name="search" /></button></header>
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-ink p-4 text-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 lg:shadow-none ${collapsed ? 'lg:w-[76px]' : 'lg:w-64'} ${open ? 'translate-x-0 shadow-pop' : '-translate-x-full'}`}>
      <div className="mb-8 flex items-center gap-3 px-2 pt-1"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber text-ink shadow-[inset_0_-2px_0_rgba(14,27,44,.15)]"><Icon name="truck" /></span><div className={lbl}><p className="text-[17px] font-bold leading-none tracking-tight">FleetPulse</p><p className="mt-1 text-xs text-slate-400">Fleet operations</p></div></div>
      <nav className="space-y-1">{nav.map(([to, label, ic]) => <NavLink key={to} to={to} end={to === '/'} className="group relative block rounded-xl">{({ isActive }) => <>
        {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-inset ring-white/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }}><span className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-amber" /></motion.span>}
        <span className={`relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors ${isActive ? 'font-semibold text-white' : 'text-slate-400 group-hover:bg-white/5 group-hover:text-white'}`}><span className={isActive ? 'text-amber' : ''}><Icon name={ic} /></span><span className={`flex-1 ${lbl}`}>{label}</span>
          {label === 'Notifications' && unread > 0 && <span className={`rounded-full bg-rose-500 px-2 text-xs font-semibold leading-5 text-white ${collapsed ? 'lg:absolute lg:right-1.5 lg:top-1.5 lg:h-4 lg:min-w-4 lg:px-1 lg:text-[10px] lg:leading-4' : ''}`}>{unread}</span>}</span>
        {collapsed && <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-road px-2.5 py-1.5 text-xs font-medium text-white shadow-lg ring-1 ring-white/10 lg:group-hover:block">{label}</span>}</>}</NavLink>)}</nav>
      <button onClick={() => setCollapsed(!collapsed)} className="mt-auto hidden h-11 items-center gap-3 rounded-xl px-3 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:flex" aria-label="Collapse sidebar"><Icon name={collapsed ? 'chevrons-right' : 'chevrons-left'} /><span className={lbl}>Collapse</span></button></aside>
    {open && <div className="fixed inset-0 z-30 bg-ink/50 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} />}
    <main className="min-w-0 flex-1 px-4 py-5 md:px-8 md:py-8"><div className="mx-auto w-full max-w-[1320px]"><button onClick={() => setCmd(true)} className="mb-6 hidden h-11 w-full max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-500 shadow-card transition-colors hover:border-slate-300 lg:flex"><Icon name="search" />Search vehicles, drivers, shipments<kbd className="ml-auto rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-sans text-xs text-slate-500">Ctrl K</kbd></button>
      <AnimatePresence mode="wait"><motion.div key={loc.pathname + loc.search} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}><Outlet /></motion.div></AnimatePresence></div></main>
    <CommandPalette open={cmd} onClose={() => setCmd(false)} />
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4"><AnimatePresence>{toast && <motion.div role="status" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="flex items-center gap-2.5 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white shadow-pop"><span className="text-amber"><Icon name="check" size={16} /></span>{toast}</motion.div>}</AnimatePresence></div></div>
}
