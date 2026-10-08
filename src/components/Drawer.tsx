import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'
export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-50 !m-0 bg-ink/45 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.aside role="dialog" aria-label={title} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} onClick={(e) => e.stopPropagation()}
      className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-pop sm:rounded-l-3xl"><div className="flex items-center justify-between border-b border-line px-5 py-3"><h2 className="text-lg font-semibold">{title}</h2><button aria-label="Close" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink"><Icon name="x" /></button></div><div className="flex-1 overflow-y-auto p-5">{children}</div></motion.aside></motion.div>}</AnimatePresence>
}
