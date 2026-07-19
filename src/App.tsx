import { Outlet } from '@tanstack/react-router'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import './App.css'

function App() {

  return (
    <>
      {
      /* <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">

        <nav className="p-4 border-b border-border bg-card">
          <span className="font-bold">Kinetic UI</span>
        </nav>
        <div className="flex justify-center items-center py-12">
          <main className="p-6">
            <Outlet />
          </main>

          <TanStackRouterDevtools position="bottom-right" /> 
        </div>
      </div> */
    }
      <Outlet />
    </>
  )
}

export default App
