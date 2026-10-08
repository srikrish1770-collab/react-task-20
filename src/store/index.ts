import { create } from 'zustand'
import type { Service } from '../services/mockService'
import { driverService, noticeService, shipmentService, vehicleService } from '../services'
interface ListState<T> { items: T[]; loading: boolean; error: string | null; load: () => Promise<void>; add: (i: Omit<T, 'id'>) => Promise<void>; patch: (id: string, p: Partial<T>) => Promise<void>; remove: (id: string) => Promise<void> }
function makeStore<T extends { id: string }>(svc: Service<T>) {
  return create<ListState<T>>((set) => ({
    items: [], loading: false, error: null,
    load: async () => { set({ loading: true, error: null }); try { set({ items: await svc.list(), loading: false }) } catch { set({ error: 'Could not load data. Check your connection and retry.', loading: false }) } },
    add: async (i) => { const row = await svc.create(i); set((s) => ({ items: [row, ...s.items] })) },
    patch: async (id, p) => { const row = await svc.update(id, p); set((s) => ({ items: s.items.map((r) => (r.id === id ? row : r)) })) },
    remove: async (id) => { await svc.remove(id); set((s) => ({ items: s.items.filter((r) => r.id !== id) })) }
  }))
}
export const useVehicles = makeStore(vehicleService)
export const useDrivers = makeStore(driverService)
export const useShipments = makeStore(shipmentService)
export const useNotices = makeStore(noticeService)
