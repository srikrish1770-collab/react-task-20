export type VehicleStatus = 'Active' | 'In Transit' | 'Maintenance' | 'Idle'
export type ShipmentStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Delayed'
export interface Vehicle { id: string; number: string; type: string; capacity: string; driver: string; fuel: number; maintenance: string; location: string; status: VehicleStatus }
export interface Driver { id: string; name: string; phone: string; email: string; license: string; experience: number; vehicle: string; available: boolean; deliveries: number; successRate: number; rating: number }
export interface Shipment { id: string; customer: string; pickup: string; delivery: string; driver: string; vehicle: string; eta: string; status: ShipmentStatus }
export type NoteType = 'Shipment Delayed' | 'Maintenance Due' | 'Driver Offline' | 'Delivery Completed' | 'New Assignment'
export interface Notice { id: string; type: NoteType; text: string; time: string; read: boolean }
