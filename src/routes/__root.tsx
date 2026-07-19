import App from '@/App'
import { createRootRoute, Link } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: App,
  // Add this block to handle missing pages gracefully
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
        <p className="text-muted-foreground">The route you are looking for doesn't exist.</p>
        <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          Go to home screen
        </Link>
      </div>
    )
  }
})
