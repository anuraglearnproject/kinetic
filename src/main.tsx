import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { registerSW } from "virtual:pwa-register"

// Import the auto-generated route tree from your compiler plugin
import { routeTree } from './routeTree.gen'
import './index.css'

// 1. Initialize QueryClient and Router instances
const queryClient = new QueryClient()
const router = createRouter({ routeTree })

// 2. Register TanStack Router types for strict global autocomplete safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// 3. Fire up the PWA service worker
registerSW({ immediate: true })

// 4. Mount the DOM root
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)