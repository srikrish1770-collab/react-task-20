import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '@fontsource-variable/schibsted-grotesk'
import { router } from './routes'
import './index.css'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<React.StrictMode><RouterProvider router={router} future={{ v7_startTransition: true }} /></React.StrictMode>)
