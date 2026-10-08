import { create } from 'zustand'
export const useToast = create<{ msg: string | null; show: (m: string) => void }>((set) => ({ msg: null, show: (m) => { set({ msg: m }); setTimeout(() => set({ msg: null }), 2500) } }))
