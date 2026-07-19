import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

// Mock authentication check function
const isAuthenticated = () => {
  return !!localStorage.getItem('token') // Replace with your real auth logic
}

export const Route = createFileRoute('/protected/_auth')({
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
        search: {
          // Redirect back to where they were trying to go after they log in
          redirect: location.href,
        },
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm">
        {/* All nested protected routes render right here */}
        <Outlet />
      </div>
    </div>
  )
}