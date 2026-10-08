import type { Driver, Notice, Shipment, Vehicle, VehicleStatus, ShipmentStatus } from '../types'
const cities = ['Chennai', 'Bengaluru', 'Coimbatore', 'Hyderabad', 'Mumbai', 'Pune', 'Kochi', 'Madurai']
const names = ['Arun Kumar', 'Priya Nair', 'Rahul Verma', 'Sana Sheikh', 'Vikram Rao', 'Meera Iyer', 'Dev Patel', 'Isha Menon']
const vs: VehicleStatus[] = ['Active', 'In Transit', 'Maintenance', 'Idle']
const ss: ShipmentStatus[] = ['Pending', 'Assigned', 'In Transit', 'Delivered', 'Delayed']
export const vehicles: Vehicle[] = Array.from({ length: 16 }, (_, i) => ({
  id: `v${i}`, number: `TN 39 ${String.fromCharCode(65 + (i % 6))}${1000 + i * 37}`, type: ['Truck', 'Van', 'Trailer', 'Mini Truck'][i % 4],
  capacity: `${(i % 5) * 2 + 3} t`, driver: names[i % 8], fuel: 25 + ((i * 17) % 75), maintenance: `2026-${String(10 + (i % 3)).padStart(2, '0')}-${String(5 + i).padStart(2, '0')}`,
  location: cities[i % 8], status: vs[i % 4]
}))
export const drivers: Driver[] = names.map((n, i) => ({
  id: `d${i}`, name: n, phone: `+91 98${40000000 + i * 91357}`, email: `${n.split(' ')[0].toLowerCase()}@fleetpulse.io`, license: `DL-${7000 + i * 113}`,
  experience: 2 + i, vehicle: vehicles[i].number, available: i % 3 !== 0, deliveries: 120 + i * 43, successRate: 90 + (i % 9), rating: 4 + (i % 10) / 10
}))
export const shipments: Shipment[] = Array.from({ length: 18 }, (_, i) => ({
  id: `SHP-${2400 + i}`, customer: ['Acme Retail', 'Nova Foods', 'BlueKart', 'Orbit Pharma', 'Urban Mart'][i % 5], pickup: cities[i % 8], delivery: cities[(i + 3) % 8],
  driver: names[i % 8], vehicle: vehicles[i % 16].number, eta: `2026-10-${String(7 + (i % 12)).padStart(2, '0')} ${10 + (i % 8)}:30`, status: ss[i % 5]
}))
export const notices: Notice[] = [
  { id: 'n1', type: 'Shipment Delayed', text: 'SHP-2404 is 2h behind schedule near Salem.', time: '5 min ago', read: false },
  { id: 'n2', type: 'Maintenance Due', text: 'TN 39 B1037 service is due in 3 days.', time: '32 min ago', read: false },
  { id: 'n3', type: 'Driver Offline', text: 'Rahul Verma has been offline for 40 minutes.', time: '1 h ago', read: false },
  { id: 'n4', type: 'Delivery Completed', text: 'SHP-2398 delivered to Urban Mart, Pune.', time: '2 h ago', read: true },
  { id: 'n5', type: 'New Assignment', text: 'SHP-2411 assigned to Meera Iyer.', time: '3 h ago', read: true }
]
