import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Dashboard from '../pages/Dashboard'
import Vehicles from '../pages/Vehicles'
import Drivers from '../pages/Drivers'
import Shipments from '../pages/Shipments'
import Tracking from '../pages/Tracking'
import Notifications from '../pages/Notifications'
export const router = createBrowserRouter([{ path: '/', element: <AppLayout />, children: [
  { index: true, element: <Dashboard /> }, { path: 'vehicles', element: <Vehicles /> }, { path: 'drivers', element: <Drivers /> },
  { path: 'shipments', element: <Shipments /> }, { path: 'tracking', element: <Tracking /> }, { path: 'notifications', element: <Notifications /> }] }],
  { future: { v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_normalizeFormMethod: true, v7_partialHydration: true, v7_skipActionErrorRevalidation: true } })
