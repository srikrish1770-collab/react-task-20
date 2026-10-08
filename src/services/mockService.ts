import { respond } from '../api/client'
export interface Service<T extends { id: string }> {
  list: () => Promise<T[]>; create: (i: Omit<T, 'id'>) => Promise<T>
  update: (id: string, patch: Partial<T>) => Promise<T>; remove: (id: string) => Promise<string>
}
export function createService<T extends { id: string }>(seed: T[]): Service<T> {
  let db = [...seed]
  return {
    list: () => respond(db),
    create: async (i) => { const row = { ...i, id: crypto.randomUUID() } as T; db = [row, ...db]; return respond(row, 400) },
    update: async (id, patch) => { db = db.map((r) => (r.id === id ? { ...r, ...patch } : r)); return respond(db.find((r) => r.id === id) as T, 300) },
    remove: async (id) => { db = db.filter((r) => r.id !== id); return respond(id, 300) }
  }
}
