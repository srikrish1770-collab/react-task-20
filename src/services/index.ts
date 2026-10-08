import { createService } from './mockService'
import { drivers, notices, shipments, vehicles } from '../data/mock'
export const vehicleService = createService(vehicles)
export const driverService = createService(drivers)
export const shipmentService = createService(shipments)
export const noticeService = createService(notices)
